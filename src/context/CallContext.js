import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { createSignalingClient } from '../services/signalingClient';
import { useWebRTC } from '../hooks/useWebRTC';
import api from '../services/api';

const makeRoomId = () => `room-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const CallContext = createContext(null);

export const CallProvider = ({ user, children }) => {
  const [incoming, setIncoming] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [currentCallId, setCurrentCallId] = useState(null);
  const [callStartedAt, setCallStartedAt] = useState(null);

  const wsRef = useRef(null);
  const targetsRef = useRef([]);
  const incomingRef = useRef(null);
  const activeRoomRef = useRef(null);
  const callIdRef = useRef(null);
  const startWithTargetsRef = useRef(null);
  const handleSignalRef = useRef(null);
  const leaveRef = useRef(null);

  const sendSignal = useCallback((payload) => {
    const client = wsRef.current;
    if (client && client.ws && client.ws.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }, []);

  const { localStream, remoteStreams, startWithTargets, handleSignal, leave, ensureLocalStream } =
    useWebRTC({ sendSignal, selfId: user?.id });

  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  useEffect(() => {
    incomingRef.current = incoming;
  }, [incoming]);

  useEffect(() => {
    callIdRef.current = currentCallId;
  }, [currentCallId]);

  useEffect(() => {
    startWithTargetsRef.current = startWithTargets;
  }, [startWithTargets]);

  useEffect(() => {
    handleSignalRef.current = handleSignal;
  }, [handleSignal]);

  useEffect(() => {
    leaveRef.current = leave;
  }, [leave]);

  const endCallRecord = useCallback(() => {
    const callId = callIdRef.current;
    if (!callId) return;
    api.post(`/video-calls/${callId}/end`).catch(() => {});
  }, []);

  const resetCallState = useCallback(() => {
    if (leaveRef.current) {
      leaveRef.current();
    }
    setActiveRoom(null);
    activeRoomRef.current = null;
    setMinimized(false);
    setIncoming(null);
    incomingRef.current = null;
    targetsRef.current = [];
    setCurrentCallId(null);
    callIdRef.current = null;
    setCallStartedAt(null);
  }, []);

  // WebSocket lifecycle
  useEffect(() => {
    if (!user?.id) return undefined;

    let client = null;
    let reconnectTimeout = null;
    let isMounted = true;
    let isConnecting = false;

    const scheduleReconnect = () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(() => {
        if (isMounted && !isConnecting) connect();
      }, 3000);
    };

    const connect = () => {
      if (!isMounted || isConnecting) return;
      if (client?.ws && client.ws.readyState === WebSocket.OPEN) return;

      isConnecting = true;

      try {
        client = createSignalingClient(
          user.id,
          (msg) => {
            if (!isMounted || !msg || !msg.type) return;
            const currentRoom = activeRoomRef.current;

            if (msg.type === 'call-invite') {
              if (!msg.roomId) return;
              if (currentRoom || incomingRef.current) {
                sendSignal({ type: 'busy', to: msg.from, roomId: msg.roomId });
                return;
              }
              setIncoming({
                roomId: msg.roomId,
                from: msg.from,
                title: msg.title || 'Video Call',
                callId: msg.callId || null,
              });
              return;
            }

            if (msg.type === 'ready') {
              if (currentRoom && msg.roomId === currentRoom && msg.from) {
                if (!targetsRef.current.includes(msg.from)) {
                  targetsRef.current = [...targetsRef.current, msg.from];
                }
                if (startWithTargetsRef.current) {
                  startWithTargetsRef.current([msg.from], currentRoom).catch(() => {});
                }
              }
              return;
            }

            if (msg.type === 'reject-call' || msg.type === 'busy') {
              if (currentRoom && msg.roomId === currentRoom) {
                if (msg.type === 'busy') {
                  window.alert('The person you are calling is in another call right now.');
                }
                endCallRecord();
                resetCallState();
              }
              return;
            }

            if (msg.type === 'end-call') {
              if (currentRoom && msg.roomId === currentRoom) {
                endCallRecord();
                resetCallState();
              }
              return;
            }

            if (currentRoom && msg.roomId === currentRoom && handleSignalRef.current) {
              handleSignalRef.current(msg);
            }
          },
          () => {
            if (!isMounted) return;
            isConnecting = false;
            wsRef.current = client;
          },
          () => {
            if (!isMounted) return;
            isConnecting = false;
            wsRef.current = null;
            scheduleReconnect();
          }
        );
        wsRef.current = client;
      } catch (error) {
        isConnecting = false;
        scheduleReconnect();
      }
    };

    connect();

    return () => {
      isMounted = false;
      isConnecting = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (client?.ws) {
        try {
          client.ws.close();
        } catch (e) {
          // Ignore
        }
      }
      wsRef.current = null;
    };
  }, [user?.id, resetCallState, endCallRecord, sendSignal]);

  const startCall = async (targetIds, title = 'Video Call') => {
    if (!targetIds || targetIds.length === 0) {
      window.alert('Select at least one person to call.');
      return;
    }

    const client = wsRef.current;
    if (!client || !client.ws || client.ws.readyState !== WebSocket.OPEN) {
      window.alert('Calling service is still connecting. Please try again in a moment.');
      return;
    }

    const roomId = makeRoomId();
    targetsRef.current = [...targetIds];
    setActiveRoom(roomId);
    activeRoomRef.current = roomId;
    setMinimized(false);
    setCallStartedAt(new Date());
    setIncoming(null);
    incomingRef.current = null;

    let callId = null;
    try {
      const payload =
        user?.role === 'MENTOR'
          ? { title, menteeIds: targetIds }
          : { title, mentorId: targetIds[0] };
      const response = await api.post('/video-calls/start', payload);
      callId = response.data?.id || null;
    } catch (err) {
      // Call history is best-effort; the live call can still proceed.
    }

    setCurrentCallId(callId);
    callIdRef.current = callId;

    sendSignal({
      type: 'call-invite',
      from: user?.id,
      targets: targetIds,
      roomId,
      title,
      callId,
    });
  };

  const acceptCall = async () => {
    const call = incoming;
    if (!call) return;

    setIncoming(null);
    incomingRef.current = null;
    setActiveRoom(call.roomId);
    activeRoomRef.current = call.roomId;
    setMinimized(false);
    targetsRef.current = call.from ? [call.from] : [];
    setCurrentCallId(call.callId || null);
    callIdRef.current = call.callId || null;
    setCallStartedAt(new Date());

    try {
      await ensureLocalStream();
    } catch (err) {
      window.alert('Unable to access camera/microphone. Please allow permissions and try again.');
      sendSignal({ type: 'reject-call', to: call.from, roomId: call.roomId });
      resetCallState();
      return;
    }

    sendSignal({ type: 'ready', to: call.from, from: user?.id, roomId: call.roomId });
  };

  const rejectCall = () => {
    const call = incoming;
    if (call) {
      sendSignal({ type: 'reject-call', to: call.from, roomId: call.roomId });
    }
    setIncoming(null);
    incomingRef.current = null;
  };

  const endCall = () => {
    const room = activeRoomRef.current;
    if (room) {
      targetsRef.current.forEach((targetId) => {
        sendSignal({ type: 'end-call', to: targetId, roomId: room });
      });
    }
    endCallRecord();
    resetCallState();
  };

  const value = useMemo(
    () => ({
      incoming,
      activeRoom,
      minimized,
      localStream,
      remoteStreams,
      currentCallId,
      callStartedAt,
      startCall,
      acceptCall,
      rejectCall,
      endCall,
      setMinimized,
    }),
    [
      incoming,
      activeRoom,
      minimized,
      localStream,
      remoteStreams,
      currentCallId,
      callStartedAt,
      startCall,
      acceptCall,
      rejectCall,
      endCall,
    ]
  );

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export const useCall = () => useContext(CallContext);
