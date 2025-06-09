import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

class WebRTCService {
  constructor() {
    this.localStream = null;
    this.peerConnection = null;
    this.roomId = null;
    this.userId = null;
    this.mediaConstraints = {
      audio: true,
      video: {
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 }
      }
    };
    this.callbacks = {
      onStreamAdded: null,
      onStreamRemoved: null,
      onError: null
    };
  }

  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async requestPermissions() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      // Stop the stream immediately after getting permissions
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  async initialize(meetingId, userId, userName, role) {
    try {
      console.log('Initializing video call...', { meetingId, userId, userName, role });
      
      // Get local media stream
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
      
      // Initialize video call through API
      const response = await axios.post(`${API_URL}/video-calls`, {
        meetingId,
        mentorId: userId
      }, {
        headers: this.getAuthHeader()
      });

      console.log('Video call initialized:', response.data);
      this.roomId = response.data.roomId;
      this.userId = userId;
      
      return response.data;
    } catch (error) {
      console.error('Error initializing video call:', error);
      // Clean up if initialization fails
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }
      throw error;
    }
  }

  getLocalStream() {
    return this.localStream;
  }

  async joinCall(roomId, userId, userName, role) {
    try {
      const response = await axios.post(`${API_URL}/video-calls/join`, {
        roomId,
        participantId: userId,
        participantName: userName,
        participantRole: role
      }, {
        headers: this.getAuthHeader()
      });
      return response.data;
      } catch (error) {
      console.error('Error joining call:', error);
      throw error;
    }
  }

  async leaveCall(roomId, userId) {
    try {
      console.log('Leaving video call...', { roomId, userId });
      
      // Stop all tracks
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }

      // Close peer connection if exists
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }

      // Notify server
      const response = await axios.post(`${API_URL}/video-calls/leave`, {
        roomId,
        participantId: userId
      }, {
        headers: this.getAuthHeader()
      });

      console.log('Left video call:', response.data);
      this.roomId = null;
      this.userId = null;
      
      return response.data;
    } catch (error) {
      console.error('Error leaving call:', error);
      // Still clean up local resources even if server call fails
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }
      this.roomId = null;
      this.userId = null;
      throw error;
    }
  }

  async endCall(roomId, userId) {
    try {
      const response = await axios.post(`${API_URL}/video-calls/end`, {
        roomId,
        mentorId: userId
      }, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error ending call:', error);
      throw error;
    }
  }

  async getActiveCalls() {
    try {
      const response = await axios.get(`${API_URL}/video-calls/active`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error getting active calls:', error);
      throw error;
    }
  }
}

export default new WebRTCService(); 