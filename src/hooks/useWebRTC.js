import { useEffect, useRef, useState, useCallback } from 'react';

const iceServers = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  {
    urls: 'turn:openrelay.metered.ca:80',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443?transport=tcp',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
];

export const useWebRTC = ({ sendSignal, selfId }) => {
  const peerRef = useRef({});
  const localStreamRef = useRef(null);
  const remoteStreamsMapRef = useRef({});
  const pendingCandidatesRef = useRef({});
  const roomIdRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});

  const ensureLocalStream = useCallback(async () => {
    if (localStreamRef.current) {
      return localStreamRef.current;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;
    setLocalStream(stream);
    return stream;
  }, []);

  const flushPendingCandidates = useCallback(async (remoteId) => {
    const pc = peerRef.current[remoteId];
    const pending = pendingCandidatesRef.current[remoteId] || [];
    if (!pc || !pc.remoteDescription) return;
    pendingCandidatesRef.current[remoteId] = [];
    for (const candidate of pending) {
      try {
        await pc.addIceCandidate(candidate);
      } catch (err) {
        // Ignore a candidate that can no longer be applied
      }
    }
  }, []);

  const createPeer = useCallback(
    async (remoteId, isInitiator = false, room = roomIdRef.current) => {
      if (peerRef.current[remoteId]) {
        return peerRef.current[remoteId];
      }
      const pc = new RTCPeerConnection({ iceServers });
      peerRef.current[remoteId] = pc;
      pendingCandidatesRef.current[remoteId] = [];

      const stream = await ensureLocalStream();
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      pc.ontrack = (event) => {
        let remoteStream = remoteStreamsMapRef.current[remoteId];
        if (event.streams && event.streams.length > 0) {
          remoteStream = event.streams[0];
        } else if (event.track) {
          if (!remoteStream) {
            remoteStream = new MediaStream();
          }
          if (!remoteStream.getTracks().some((t) => t.id === event.track.id)) {
            remoteStream.addTrack(event.track);
          }
        }
        if (remoteStream) {
          remoteStreamsMapRef.current[remoteId] = remoteStream;
          setRemoteStreams((prev) => ({ ...prev, [remoteId]: remoteStream }));
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignal({
            type: 'candidate',
            to: remoteId,
            from: selfId,
            roomId: room,
            candidate: event.candidate,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
          const current = remoteStreamsMapRef.current[remoteId];
          if (current) {
            current.getTracks().forEach((track) => track.stop());
            delete remoteStreamsMapRef.current[remoteId];
            setRemoteStreams((prev) => {
              const next = { ...prev };
              delete next[remoteId];
              return next;
            });
          }
        }
      };

      if (isInitiator) {
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(offer);
        sendSignal({ type: 'offer', to: remoteId, from: selfId, roomId: room, sdp: offer });
      }

      return pc;
    },
    [ensureLocalStream, selfId, sendSignal]
  );

  const handleSignal = useCallback(
    async (message) => {
      const { type, from, sdp, candidate, roomId: messageRoomId } = message;
      if (!from) return;

      if (messageRoomId) {
        roomIdRef.current = messageRoomId;
      }

      let pc = peerRef.current[from];

      if (type === 'offer' && !pc) {
        pc = await createPeer(from, false, messageRoomId || roomIdRef.current);
      }

      if (!pc && (type === 'answer' || type === 'candidate')) {
        for (let i = 0; i < 20; i += 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          pc = peerRef.current[from];
          if (pc) break;
        }
        if (!pc) return;
      }

      if (!pc) return;

      switch (type) {
        case 'offer': {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          await flushPendingCandidates(from);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          sendSignal({
            type: 'answer',
            to: from,
            from: selfId,
            roomId: messageRoomId || roomIdRef.current,
            sdp: answer,
          });
          break;
        }
        case 'answer': {
          if (pc.signalingState === 'have-local-offer') {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            await flushPendingCandidates(from);
          }
          break;
        }
        case 'candidate': {
          if (!candidate) break;
          if (!pc.remoteDescription) {
            pendingCandidatesRef.current[from] = pendingCandidatesRef.current[from] || [];
            pendingCandidatesRef.current[from].push(new RTCIceCandidate(candidate));
            break;
          }
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            // Ignore candidates arriving after the connection closed
          }
          break;
        }
        default:
          break;
      }
    },
    [createPeer, flushPendingCandidates, selfId, sendSignal]
  );

  const startWithTargets = useCallback(
    async (targetIds = [], room = roomIdRef.current) => {
      roomIdRef.current = room;
      await ensureLocalStream();
      await Promise.all(targetIds.map((id) => createPeer(id, true, room)));
    },
    [createPeer, ensureLocalStream]
  );

  const leave = useCallback(() => {
    Object.values(peerRef.current).forEach((pc) => {
      try {
        pc.close();
      } catch (e) {
        // Ignore
      }
    });
    peerRef.current = {};
    remoteStreamsMapRef.current = {};
    pendingCandidatesRef.current = {};
    roomIdRef.current = null;
    setRemoteStreams({});
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }
  }, []);

  useEffect(() => () => leave(), [leave]);

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
