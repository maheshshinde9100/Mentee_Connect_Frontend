import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { createSignalingClient } from '../services/signalingClient';
import { useWebRTC } from '../hooks/useWebRTC';
const makeRoomId = () => `room-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const CallContext = createContext(null);

export const CallProvider = ({ user, children }) => {
  const [wsClient, setWsClient] = useState(null);
  const [incoming, setIncoming] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [currentCallId, setCurrentCallId] = useState(null);
  const [callStartedAt, setCallStartedAt] = useState(null);
  const targetsRef = useRef([]);
  const incomingRef = useRef(null);
  const activeRoomRef = useRef(null);
  const startWithTargetsRef = useRef(null);
  const handleSignalRef = useRef(null);
  const leaveRef = useRef(null);

  const sendSignal = useCallback((payload) => {
    if (wsClient && wsClient.ws && wsClient.ws.readyState === WebSocket.OPEN) {
      wsClient.send(payload);
    } else {
      console.warn('Cannot send signal: WebSocket not connected', {
        hasClient: !!wsClient,
        hasWs: !!wsClient?.ws,
        readyState: wsClient?.ws?.readyState
      });
    }
  }, [wsClient]);

  const { localStream, remoteStreams, startWithTargets, handleSignal, leave, ensureLocalStream } = useWebRTC({
    sendSignal,
    roomId: activeRoom,
    selfId: user?.id,
  });

  // Keep refs in sync with state/callbacks
  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  useEffect(() => {
    incomingRef.current = incoming;
  }, [incoming]);

  useEffect(() => {
    startWithTargetsRef.current = startWithTargets;
  }, [startWithTargets]);

  useEffect(() => {
    handleSignalRef.current = handleSignal;
  }, [handleSignal]);

  useEffect(() => {
    leaveRef.current = leave;
  }, [leave]);

  // Establish websocket connection when user is present
  useEffect(() => {
    if (!user?.id) return;
    
    let client = null;
    let reconnectTimeout = null;
    let isMounted = true;
    let isConnecting = false;
    
    const connect = () => {
      if (!isMounted || !user?.id || isConnecting) {
        if (isConnecting) {
          console.log('WebSocket connection already in progress, skipping...');
        }
        return;
      }
      
      // Check if we already have an open connection
      if (client?.ws && client.ws.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected');
        return;
      }
      
      isConnecting = true;
      
      try {
        console.log('Creating WebSocket connection for user:', user.id);
        client = createSignalingClient(
          user.id,
          (msg) => {
            if (!isMounted) return;
            console.log('Signaling message received:', msg);
            // Handle incoming call invites (for students)
            if (msg.type === 'call-invite' && msg.roomId) {
              // Use ref to check current activeRoom value
              if (!activeRoomRef.current) {
                console.log('Received call invite:', msg);
                setIncoming({ roomId: msg.roomId, from: msg.from, title: msg.title || 'Mentor Call' });
              }
              return;
            }
            // Handle ready signal (when student accepts)
            // Note: The mentor should already have created peer connections as initiators
            // The mentee will handle the offer when it arrives, so we don't need to create peers here
            if (msg.type === 'ready' && msg.roomId) {
              const currentRoom = activeRoomRef.current;
              if (currentRoom === msg.roomId) {
                console.log('Participant ready:', msg.from);
                // The mentor's peer connections are already created as initiators
                // The offers should already be sent, so we just log this
              }
              return;
            }
            // Process WebRTC signaling for active room
            const currentRoom = activeRoomRef.current;
            if (currentRoom && msg.roomId === currentRoom && handleSignalRef.current) {
              console.log(`Processing ${msg.type} signal for active room ${currentRoom} from ${msg.from}`);
              handleSignalRef.current(msg);
            } else if (msg.type === 'offer' && incomingRef.current && incomingRef.current.roomId === msg.roomId) {
              // If we receive an offer while we have an incoming call, process it
              // This handles the case where offer arrives before acceptCall is called
              console.log('Received offer for incoming call, processing it');
              // Process it - the handleSignal will create the peer connection when needed
              if (handleSignalRef.current) {
                handleSignalRef.current(msg);
              }
            } else if (msg.type === 'end-call' && currentRoom && msg.roomId === currentRoom) {
              console.log('Received end-call signal, ending call locally');
              if (leaveRef.current) {
                leaveRef.current();
              }
              setActiveRoom(null);
              setMinimized(false);
              targetsRef.current = [];
              setCurrentCallId(null);
              setCallStartedAt(null);
            } else if (msg.type === 'offer' || msg.type === 'answer' || msg.type === 'candidate') {
              // Log unprocessed signaling messages for debugging
              console.log(`Received ${msg.type} signal but no active room. Current room: ${currentRoom}, Message room: ${msg.roomId}`);
            }
          },
          () => {
            if (!isMounted) return;
            isConnecting = false;
            console.log('WebSocket connected successfully');
            setWsClient(client);
          },
          () => {
            if (!isMounted) return;
            isConnecting = false;
            console.log('WebSocket disconnected');
            setWsClient(null);
            // Attempt reconnect after 3 seconds, but only if still mounted
            reconnectTimeout = setTimeout(() => {
              if (isMounted && user?.id && !isConnecting) {
                console.log('Attempting WebSocket reconnection...');
                connect();
              }
            }, 3000);
          }
        );
      } catch (error) {
        isConnecting = false;
        console.error('Failed to create WebSocket client:', error);
        // Retry after error
        reconnectTimeout = setTimeout(() => {
          if (isMounted && user?.id) {
            connect();
          }
        }, 3000);
      }
    };
    
    connect();
    
    return () => {
      isMounted = false;
      isConnecting = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (client?.ws) {
        try {
          if (client.ws.readyState === WebSocket.OPEN || client.ws.readyState === WebSocket.CONNECTING) {
            client.ws.close();
          }
        } catch (e) {
          console.error('Error closing WebSocket:', e);
        }
      }
    };
  }, [user?.id]);

  const startCall = async (targetIds, title = 'Mentor Call') => {
    if (!targetIds || targetIds.length === 0) {
      console.warn('No targets provided for call');
      alert('Please select at least one mentee to start a call.');
      return;
    }
    
    // Check WebSocket connection state
    const wsState = wsClient?.ws?.readyState;
    if (!wsClient || !wsClient.ws || wsState !== WebSocket.OPEN) {
      const stateMessages = {
        [WebSocket.CONNECTING]: 'WebSocket is connecting...',
        [WebSocket.CLOSING]: 'WebSocket is closing...',
        [WebSocket.CLOSED]: 'WebSocket is closed',
        [undefined]: 'WebSocket client not initialized'
      };
      const message = stateMessages[wsState] || 'WebSocket not connected';
      console.error('WebSocket client not available or not connected. Current state:', wsState, message);
      alert(`Cannot start call: ${message}. Please wait a moment and try again.`);
      return;
    }
    
    const roomId = makeRoomId();
    targetsRef.current = targetIds;
    setActiveRoom(roomId);
    activeRoomRef.current = roomId;
    setMinimized(false);
    const startedAt = new Date();
    setCallStartedAt(startedAt);
    console.log('Starting call with targets:', targetIds, 'roomId:', roomId);
    sendSignal({ type: 'call-invite', from: user?.id, targets: targetIds, roomId, title });

    // Create backend record for mentor call history (only for mentors)
    if (user?.role === 'MENTOR') {
      try {
        const { mentorService } = await import('../services/mentorService');
        const response = await mentorService.startVideoCall(user.id, {
          title,
          menteeIds: targetIds,
        });
        if (response && response.data && response.data.id) {
          setCurrentCallId(response.data.id);
        }
      } catch (err) {
        console.error('Failed to create video call record', err);
      }
    }

    // Wait a bit for invites to be sent before starting WebRTC
    setTimeout(async () => {
      // Use ref to ensure we call the latest startWithTargets
      if (startWithTargetsRef.current) {
        await startWithTargetsRef.current(targetIds);
      }
    }, 500);
  };

  const acceptCall = async () => {
    if (!incoming) return;
    setActiveRoom(incoming.roomId);
    setMinimized(false);
    setIncoming(null);
    // Ensure local stream is ready
    await ensureLocalStream();
    // Send ready signal - mentor will send offer, mentee will handle it via handleSignal
    sendSignal({ type: 'ready', to: incoming.from, from: user?.id, roomId: incoming.roomId });
    // Don't create peer connection as initiator - wait for offer from mentor
    // The offer will be handled by handleSignal when it arrives
  };

  const rejectCall = () => {
    setIncoming(null);
  };

  const endCall = () => {
    // Notify remote participants that the call has ended
    const room = activeRoomRef.current;
    if (room && targetsRef.current && targetsRef.current.length > 0) {
      targetsRef.current.forEach((targetId) => {
        sendSignal({
          type: 'end-call',
          to: targetId,
          from: user?.id,
          roomId: room,
        });
      });
    }

    if (leaveRef.current) {
      leaveRef.current();
    } else {
      leave();
    }

    // Persist video call end for mentor
    if (user?.role === 'MENTOR' && currentCallId) {
      import('../services/mentorService')
        .then(({ mentorService }) => mentorService.endVideoCall(user.id, currentCallId))
        .catch((err) => console.error('Failed to mark video call ended', err));
    }

    setActiveRoom(null);
    activeRoomRef.current = null;
    setMinimized(false);
    targetsRef.current = [];
    setCurrentCallId(null);
    setCallStartedAt(null);
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
    [incoming, activeRoom, minimized, localStream, remoteStreams, currentCallId, callStartedAt, startCall, acceptCall]
  );

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export const useCall = () => useContext(CallContext);

