import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { logger } from '../utils/logger';

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
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        const socket = new SockJS(baseUrl+'/ws');
        this.stompClient = Stomp.over(() => socket);
        
        // Disable debug logging in production
        this.stompClient.debug = () => {
          // Debug disabled
        };

        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        this.stompClient.connect(
          headers,
          (frame) => {
            this.connected = true;
            this.reconnectAttempts = 0;
            this.connectionPromise = null; // Clear promise
            resolve(frame);
          },
          (error) => {
            logger.error('WebSocket connection error');
            this.connected = false;
            this.connectionPromise = null; // Clear promise
            this.handleReconnect();
            reject(error);
          }
        );
      } catch (error) {
        logger.error('Error creating WebSocket connection');
        this.connectionPromise = null; // Clear promise
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      
      setTimeout(() => {
        this.connect().catch(() => {
          // Reconnection failed, will try again if attempts remain
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      logger.error('Max reconnection attempts reached');
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
      return subscription;
    } catch (error) {
      logger.error('Error subscribing to WebSocket channel');
      throw error;
    }
  }

  unsubscribe(destination) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  send(destination, body = {}, headers = {}) {
    if (!this.connected || !this.stompClient) {
      logger.error('WebSocket not connected. Cannot send message.');
      return false;
    }

    try {
      this.stompClient.send(destination, headers, JSON.stringify(body));
      return true;
    } catch (error) {
      logger.error('Error sending WebSocket message');
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
          logger.error('Error parsing join request message');
        }
      });
    } catch (error) {
      logger.error('Failed to subscribe to join requests');
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
          logger.error('Error parsing approval message');
        }
      });
    } catch (error) {
      logger.error('Failed to subscribe to meeting approval');
      throw error;
    }
  }

  async subscribeToMeetingStart(userId, callback) {
    const destination = `/queue/user/${userId}/meeting-start`;
    try {
      return await this.subscribe(destination, (message) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          logger.error('Error parsing meeting start message');
        }
      });
    } catch (error) {
      logger.error('Failed to subscribe to meeting start notifications');
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