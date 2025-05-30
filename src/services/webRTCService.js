import { io } from 'socket.io-client';

class WebRTCService {
  constructor() {
    this.socket = null;
    this.peerConnections = {};
    this.localStream = null;
    this.onParticipantJoinedCallback = null;
    this.onParticipantLeftCallback = null;
    this.onStreamAddedCallback = null;
    this.connectionState = 'disconnected';
  }

  async initialize(meetingId, userId, isHost) {
    try {
      console.log('Initializing WebRTC service...', { meetingId, userId, isHost });
      
      // Connect to signaling server with timeout and reconnection options
      const socketUrl = process.env.REACT_APP_SOCKET_SERVER || 'http://localhost:3001';
      console.log('Connecting to socket server:', socketUrl);
      
      this.socket = io(socketUrl, {
        query: { meetingId, userId, isHost },
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000
      });

      // Return a promise that resolves when connection is established or rejects on error
      await new Promise((resolve, reject) => {
        this.socket.on('connect', () => {
          console.log('Socket connected successfully');
          this.connectionState = 'connected';
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          this.connectionState = 'error';
          reject(new Error('Failed to connect to signaling server'));
        });

        // Set a connection timeout
        setTimeout(() => {
          if (this.connectionState !== 'connected') {
            reject(new Error('Connection timeout'));
          }
        }, 10000);
      });

      // Set up socket event listeners
      this.setupSocketListeners();

      // Get local media stream with error handling
      try {
        console.log('Requesting media permissions...');
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        console.log('Media permissions granted');
      } catch (mediaError) {
        console.error('Media access error:', mediaError);
        throw new Error('Failed to access camera/microphone. Please check permissions.');
      }

      return this.localStream;
    } catch (error) {
      console.error('WebRTC initialization error:', error);
      this.connectionState = 'error';
      throw error;
    }
  }

  setupSocketListeners() {
    // New participant joined
    this.socket.on('participant-joined', async ({ participantId }) => {
      try {
        console.log('New participant joined:', participantId);
        
        // Create new RTCPeerConnection with more STUN/TURN servers
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' }
          ]
        });

        // Monitor peer connection state
        peerConnection.onconnectionstatechange = () => {
          console.log(`Peer connection state (${participantId}):`, peerConnection.connectionState);
        };

        peerConnection.oniceconnectionstatechange = () => {
          console.log(`ICE connection state (${participantId}):`, peerConnection.iceConnectionState);
        };

        // Add local stream tracks to peer connection
        this.localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, this.localStream);
        });

        // Store peer connection
        this.peerConnections[participantId] = peerConnection;

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            console.log('Sending ICE candidate to:', participantId);
            this.socket.emit('ice-candidate', {
              candidate: event.candidate,
              targetId: participantId
            });
          }
        };

        // Handle remote stream added
        peerConnection.ontrack = (event) => {
          console.log('Remote track received from:', participantId);
          if (this.onStreamAddedCallback) {
            this.onStreamAddedCallback(participantId, event.streams[0]);
          }
        };

        // Create and send offer if host
        if (this.socket.isHost) {
          console.log('Creating offer for:', participantId);
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          this.socket.emit('offer', {
            offer,
            targetId: participantId
          });
        }

        // Notify callback
        if (this.onParticipantJoinedCallback) {
          this.onParticipantJoinedCallback(participantId);
        }
      } catch (error) {
        console.error('Error handling new participant:', error);
      }
    });

    // Handle received offer
    this.socket.on('offer', async ({ offer, senderId }) => {
      try {
        console.log('Received offer from:', senderId);
        const peerConnection = this.peerConnections[senderId];
        await peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        this.socket.emit('answer', {
          answer,
          targetId: senderId
        });
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    });

    // Handle received answer
    this.socket.on('answer', async ({ answer, senderId }) => {
      try {
        console.log('Received answer from:', senderId);
        const peerConnection = this.peerConnections[senderId];
        await peerConnection.setRemoteDescription(answer);
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    });

    // Handle received ICE candidate
    this.socket.on('ice-candidate', async ({ candidate, senderId }) => {
      try {
        console.log('Received ICE candidate from:', senderId);
        const peerConnection = this.peerConnections[senderId];
        await peerConnection.addIceCandidate(candidate);
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    });

    // Handle participant left
    this.socket.on('participant-left', ({ participantId }) => {
      console.log('Participant left:', participantId);
      if (this.peerConnections[participantId]) {
        this.peerConnections[participantId].close();
        delete this.peerConnections[participantId];
      }

      if (this.onParticipantLeftCallback) {
        this.onParticipantLeftCallback(participantId);
      }
    });

    // Handle disconnection
    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.connectionState = 'disconnected';
    });
  }

  // Set callbacks
  setCallbacks(callbacks) {
    const {
      onParticipantJoined,
      onParticipantLeft,
      onStreamAdded
    } = callbacks;

    this.onParticipantJoinedCallback = onParticipantJoined;
    this.onParticipantLeftCallback = onParticipantLeft;
    this.onStreamAddedCallback = onStreamAdded;
  }

  // Toggle local audio
  toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  // Toggle local video
  toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  // Leave meeting
  leaveMeeting() {
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    // Close all peer connections
    Object.values(this.peerConnections).forEach(pc => pc.close());
    this.peerConnections = {};

    // Disconnect socket
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new WebRTCService(); 