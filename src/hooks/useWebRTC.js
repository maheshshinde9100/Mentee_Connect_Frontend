import { useEffect, useRef, useState, useCallback } from 'react';

const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];

export const useWebRTC = ({ sendSignal, roomId, selfId }) => {
  const peerRef = useRef({});
  const localStreamRef = useRef(null);
  const remoteStreamsMapRef = useRef({}); // Map to collect tracks by peer ID
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  

  const ensureLocalStream = useCallback(async () => {
    if (localStreamRef.current) {
      return localStreamRef.current;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (error) {
      throw error;
    }
  }, []);

  const createPeer = useCallback(
    async (remoteId, isInitiator = false) => {
      if (peerRef.current[remoteId]) {
        return peerRef.current[remoteId];
      }
      const pc = new RTCPeerConnection({ iceServers });
      peerRef.current[remoteId] = pc;

      const stream = await ensureLocalStream();
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      pc.ontrack = (event) => {
        
        let remoteStream = null;
        
        if (event.streams && event.streams.length > 0) {
          remoteStream = event.streams[0];
        } else if (event.track) {
          // Fallback: create or get existing stream for this peer
          if (!remoteStreamsMapRef.current[remoteId]) {
            remoteStream = new MediaStream();
            remoteStreamsMapRef.current[remoteId] = remoteStream;
          } else {
            remoteStream = remoteStreamsMapRef.current[remoteId];
          }
          if (!remoteStream.getTracks().some(t => t.id === event.track.id)) {
            remoteStream.addTrack(event.track);
          }
        }
        
        if (remoteStream) {
          setRemoteStreams((prev) => {
            return { ...prev, [remoteId]: remoteStream };
          });
        }
      };
      
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed') {
          // Connection failed - handle cleanup
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
            sendSignal({
            type: 'candidate',
            to: remoteId,
            from: selfId,
            roomId: roomId,
            candidate: event.candidate,
          });
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          setTimeout(() => {
            const receivers = pc.getReceivers();
            const tracks = receivers.map(r => r.track).filter(t => t && t.readyState === 'live');
            
            if (tracks.length > 0) {
              setRemoteStreams((prev) => {
                const existingStream = prev[remoteId];
                const existingTrackCount = existingStream ? existingStream.getTracks().length : 0;
                
                if (!existingStream || existingTrackCount < tracks.length) {
                  const remoteStream = new MediaStream(tracks);
                  return { ...prev, [remoteId]: remoteStream };
                } else {
                  return prev;
                }
              });
            }
          }, 1000);
        }
      };

      if (isInitiator) {
        try {
          const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
          await pc.setLocalDescription(offer);
          sendSignal({ type: 'offer', to: remoteId, from: selfId, roomId: roomId, sdp: offer });
        } catch (error) {
          // Handle offer creation error
        }
      }

      return pc;
    },
    [ensureLocalStream, roomId, selfId, sendSignal]
  );

  const handleSignal = useCallback(
    async (message) => {
      const { type, from, sdp, candidate, roomId: messageRoomId } = message;
      if (!from) return;
      
      // Use roomId from message if available, otherwise fall back to roomId from props
      const effectiveRoomId = messageRoomId || roomId;

      let pc = peerRef.current[from];
      
      // For offer, create peer connection if it doesn't exist (as non-initiator)
      if (type === 'offer' && !pc) {
        pc = await createPeer(from, false);
      }
      
      if (!pc && (type === 'answer' || type === 'candidate')) {
        for (let i = 0; i < 20; i++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          pc = peerRef.current[from];
          if (pc) break;
        }
        if (!pc) {
          return;
        }
      }

      if (!pc) {
        return;
      }

      switch (type) {
        case 'offer': {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          sendSignal({ type: 'answer', to: from, from: selfId, roomId: effectiveRoomId, sdp: answer });
          break;
        }
        case 'answer': {
          const currentState = pc.signalingState;
          if (currentState === 'have-local-offer' || currentState === 'stable') {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            } catch (err) {
              // Handle error silently
            }
          }
          break;
        }
        case 'candidate': {
          if (candidate) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
              if (err.name === 'InvalidStateError' || err.name === 'OperationError') {
                setTimeout(async () => {
                  try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                  } catch (retryErr) {
                    // Handle retry error silently
                  }
                }, 500);
              }
            }
          }
          break;
        }
        default:
          break;
      }
    },
    [createPeer, roomId, selfId, sendSignal]
  );

  const startWithTargets = useCallback(
    async (targetIds = []) => {
      await ensureLocalStream();
      await Promise.all(targetIds.map((id) => createPeer(id, true)));
    },
    [createPeer, ensureLocalStream]
  );

  const leave = useCallback(() => {
    Object.values(peerRef.current).forEach((pc) => pc.close());
    peerRef.current = {};
    remoteStreamsMapRef.current = {}; // Clear the streams map
    // Use functional update to avoid dependency on remoteStreams
    setRemoteStreams((prev) => {
      Object.values(prev).forEach((stream) =>
        stream.getTracks().forEach((t) => t.stop())
      );
      return {};
    });
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }
  }, []);

  useEffect(() => {
    return () => leave();
  }, [leave]);

  return {
    localStream,
    remoteStreams,
    startWithTargets,
    handleSignal,
    ensureLocalStream,
    leave,
  };
};

export default useWebRTC;

