import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.connectionPromise = null; // Track connection promise
  }

  connect() {
    // Return existing connection promise if already connecting
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // If already connected, return resolved promise
    if (this.connected && this.stompClient) {
      return Promise.resolve();
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        const socket = new SockJS('http://localhost:8080/api/ws');
        this.stompClient = Stomp.over(() => socket);
        
        // Disable debug logging in production
        this.stompClient.debug = (str) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('STOMP: ' + str);
          }
        };

        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        this.stompClient.connect(
          headers,
          (frame) => {
            console.log('WebSocket connected: ' + frame);
            this.connected = true;
            this.reconnectAttempts = 0;
            this.connectionPromise = null; // Clear promise
            resolve(frame);
          },
          (error) => {
            console.error('WebSocket connection error:', error);
            this.connected = false;
            this.connectionPromise = null; // Clear promise
            this.handleReconnect();
            reject(error);
          }
        );
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        this.connectionPromise = null; // Clear promise
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(() => {
          // Reconnection failed, will try again if attempts remain
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      // Unsubscribe from all channels
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      
      this.stompClient.disconnect(() => {
        console.log('WebSocket disconnected');
        this.connected = false;
      });
    }
  }

  async subscribe(destination, callback, headers = {}) {
    // Ensure connection first
    if (!this.connected) {
      await this.connect();
    }

    // Wait a bit more for connection to be fully established
    let attempts = 0;
    while (!this.connected && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (!this.connected || !this.stompClient) {
      throw new Error('WebSocket not connected after waiting');
    }

    try {
      const subscription = this.stompClient.subscribe(destination, callback, headers);
      this.subscriptions.set(destination, subscription);
      console.log('Subscribed to:', destination);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to:', destination, error);
      throw error;
    }
  }

  unsubscribe(destination) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
      console.log('Unsubscribed from:', destination);
    }
  }

  send(destination, body = {}, headers = {}) {
    if (!this.connected || !this.stompClient) {
      console.error('WebSocket not connected. Cannot send to:', destination);
      return false;
    }

    try {
      this.stompClient.send(destination, headers, JSON.stringify(body));
      return true;
    } catch (error) {
      console.error('Error sending message to:', destination, error);
      return false;
    }
  }

  isConnected() {
    return this.connected;
  }

  // Meeting-specific methods
  async subscribeToMeetingJoinRequests(roomId, callback) {
    const destination = `/topic/meeting/${roomId}/join-requests`;
    try {
      return await this.subscribe(destination, (message) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          console.error('Error parsing join request message:', error);
        }
      });
    } catch (error) {
      console.error('Failed to subscribe to join requests:', error);
      throw error;
    }
  }

  async subscribeToMeetingApproval(userId, callback) {
    const destination = `/queue/user/${userId}/meeting-approval`;
    try {
      return await this.subscribe(destination, (message) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          console.error('Error parsing approval message:', error);
        }
      });
    } catch (error) {
      console.error('Failed to subscribe to meeting approval:', error);
      throw error;
    }
  }

  sendJoinRequest(roomId, participantData) {
    const destination = `/app/meeting/${roomId}/join-request`;
    return this.send(destination, participantData);
  }

  sendApprovalResponse(roomId, approvalData) {
    const destination = `/app/meeting/${roomId}/approval`;
    return this.send(destination, approvalData);
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;