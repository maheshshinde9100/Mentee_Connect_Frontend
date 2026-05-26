import { useEffect, useRef, useState, useCallback } from 'react';

const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];

export const useWebRTC = ({ sendSignal, roomId, selfId }) => {
  const peerRef = useRef({});
  const localStreamRef = useRef(null);
  const remoteStreamsMapRef = useRef({}); // Map to collect tracks by peer ID
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  
  // Debug: Log remote streams changes
  useEffect(() => {
    //console.log('Remote streams updated:', Object.keys(remoteStreams).length, 'streams');
    Object.entries(remoteStreams).forEach(([id, stream]) => {
      //console.log(`  - ${id}: ${stream.getTracks().length} tracks`);
    });
  }, [remoteStreams]);

  const ensureLocalStream = useCallback(async () => {
    if (localStreamRef.current) {
      //console.log('Reusing existing local stream');
      return localStreamRef.current;
    }
    try {
      //console.log('Requesting user media...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      //console.log('Got local stream:', stream.id, stream.getTracks().length, 'tracks');
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error getting user media:', error);
      throw error;
    }
  }, []);

  const createPeer = useCallback(
    async (remoteId, isInitiator = false) => {
      if (peerRef.current[remoteId]) {
        //console.log(`Peer connection with ${remoteId} already exists`);
        return peerRef.current[remoteId];
      }

      //console.log(`Creating peer connection with ${remoteId} as ${isInitiator ? 'initiator' : 'receiver'}`);
      const pc = new RTCPeerConnection({ iceServers });
      peerRef.current[remoteId] = pc;

      // Ensure local stream is ready before adding tracks
      const stream = await ensureLocalStream();
      //console.log(`Adding ${stream.getTracks().length} tracks to peer connection with ${remoteId}`);
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
        //console.log(`Added track: ${track.kind} (enabled: ${track.enabled})`);
      });

      // Handle incoming remote tracks
      pc.ontrack = (event) => {
        console.log(`[ontrack] Received remote track from ${remoteId}:`, {
          streams: event.streams?.length,
          trackKind: event.track?.kind,
          trackId: event.track?.id,
          streamId: event.streams?.[0]?.id,
          trackReadyState: event.track?.readyState
        });
        
        let remoteStream = null;
        
        if (event.streams && event.streams.length > 0) {
          // Use the stream from the event (preferred method)
          remoteStream = event.streams[0];
          //console.log(`[ontrack] Using stream from event for ${remoteId}`);
        } else if (event.track) {
          // Fallback: create or get existing stream for this peer
          if (!remoteStreamsMapRef.current[remoteId]) {
            remoteStream = new MediaStream();
            remoteStreamsMapRef.current[remoteId] = remoteStream;
            //console.log(`[ontrack] Created new stream for ${remoteId}`);
          } else {
            remoteStream = remoteStreamsMapRef.current[remoteId];
            //console.log(`[ontrack] Using existing stream for ${remoteId}`);
          }
          // Add the track to the stream if not already added
          if (!remoteStream.getTracks().some(t => t.id === event.track.id)) {
            remoteStream.addTrack(event.track);
            //console.log(`[ontrack] Added ${event.track.kind} track to stream for ${remoteId}`);
          }
        }
        
        if (remoteStream) {
          const trackCount = remoteStream.getTracks().length;
          const trackInfo = remoteStream.getTracks().map(t => `${t.kind}(${t.id},${t.readyState})`).join(', ');
          //console.log(`[ontrack] Setting remote stream for ${remoteId} with ${trackCount} tracks:`, trackInfo);
          
          // Update state with the stream
          setRemoteStreams((prev) => {
            const updated = { ...prev, [remoteId]: remoteStream };
            //console.log(`[ontrack] Remote streams state updated. Total:`, Object.keys(updated).length);
            return updated;
          });
        } else {
          console.warn(`[ontrack] No remote stream created for ${remoteId}`);
        }
      };
      
      pc.onconnectionstatechange = () => {
        //console.log(`Peer connection state with ${remoteId}: ${pc.connectionState}`);
        if (pc.connectionState === 'failed') {
          console.error(`Peer connection with ${remoteId} failed`);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          //console.log(`Sending ICE candidate to ${remoteId}`);
            sendSignal({
            type: 'candidate',
            to: remoteId,
            from: selfId,
            roomId: roomId, // Use roomId from props for outgoing signals
            candidate: event.candidate,
          });
        } else {
          //console.log(`ICE gathering complete for ${remoteId}`);
        }
      };

      pc.oniceconnectionstatechange = () => {
        //console.log(`ICE connection state with ${remoteId}: ${pc.iceConnectionState}`);
        if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          //console.log(`ICE connection established with ${remoteId}`);
          // Fallback: Check for remote tracks manually if ontrack didn't fire
          setTimeout(() => {
            const receivers = pc.getReceivers();
            //console.log(`[fallback] Checking receivers for ${remoteId}:`, receivers.length);
            const tracks = receivers.map(r => r.track).filter(t => t && t.readyState === 'live');
            //console.log(`[fallback] Found ${tracks.length} live remote tracks for ${remoteId}`);
            
            if (tracks.length > 0) {
              // Check if we already have a stream for this peer
              setRemoteStreams((prev) => {
                const existingStream = prev[remoteId];
                const existingTrackCount = existingStream ? existingStream.getTracks().length : 0;
                
                if (!existingStream || existingTrackCount < tracks.length) {
                  //console.log(`[fallback] Creating/updating remote stream for ${remoteId} with ${tracks.length} tracks`);
                  const remoteStream = new MediaStream(tracks);
                  return { ...prev, [remoteId]: remoteStream };
                } else {
                  //console.log(`[fallback] Already have stream for ${remoteId} with ${existingTrackCount} tracks`);
                  return prev;
                }
              });
            } else {
              console.warn(`[fallback] No live tracks found for ${remoteId}`);
            }
          }, 1000);
        }
      };

      if (isInitiator) {
        //console.log(`Creating offer for ${remoteId}`);
        try {
          const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
          await pc.setLocalDescription(offer);
          //console.log(`Sending offer to ${remoteId}`);
          sendSignal({ type: 'offer', to: remoteId, from: selfId, roomId: roomId, sdp: offer });
        } catch (error) {
          console.error(`Error creating offer for ${remoteId}:`, error);
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
      
      // If peer connection doesn't exist yet for answer/candidate, wait a bit
      if (!pc && (type === 'answer' || type === 'candidate')) {
        //console.log(`Waiting for peer connection with ${from}...`);
        // Wait up to 2 seconds for peer connection to be created
        for (let i = 0; i < 20; i++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          pc = peerRef.current[from];
          if (pc) break;
        }
        if (!pc) {
          console.error(`Peer connection with ${from} not found for ${type}`);
          return;
        }
      }

      if (!pc) {
        console.error(`No peer connection available for ${from}`);
        return;
      }

      switch (type) {
        case 'offer': {
          //console.log(`Received offer from ${from}`);
          // Set remote description first
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          // Create and send answer
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          //console.log(`Sending answer to ${from}`);
          sendSignal({ type: 'answer', to: from, from: selfId, roomId: effectiveRoomId, sdp: answer });
          break;
        }
        case 'answer': {
          //console.log(`Received answer from ${from}`);
          const currentState = pc.signalingState;
          // Only set remote description if we haven't already
          if (currentState === 'have-local-offer' || currentState === 'stable') {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(sdp));
              //console.log(`Set remote description from ${from}`);
            } catch (err) {
              console.error(`Error setting remote description from ${from}:`, err);
            }
          } else {
            //console.log(`Skipping remote description - current state: ${currentState}`);
          }
          break;
        }
        case 'candidate': {
          if (candidate) {
            try {
              // Add ICE candidate - it's safe to add even before remote description is set
              // The browser will queue it automatically
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
              //console.log(`Added ICE candidate from ${from}`);
            } catch (err) {
              // If adding fails (e.g., remote description not set yet), try again after a delay
              if (err.name === 'InvalidStateError' || err.name === 'OperationError') {
                //console.log(`Deferring ICE candidate from ${from} - will retry`);
                setTimeout(async () => {
                  try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    //console.log(`Added deferred ICE candidate from ${from}`);
                  } catch (retryErr) {
                    console.error(`Error adding deferred ICE candidate from ${from}:`, retryErr);
                  }
                }, 500);
              } else {
                console.error(`Error adding ICE candidate from ${from}:`, err);
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

