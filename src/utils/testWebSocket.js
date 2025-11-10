import webSocketService from '../services/websocketService';

export const testWebSocketConnection = async () => {
  try {
    if (!webSocketService.isConnected()) {
      await webSocketService.connect();
    }
    
    return true;
  } catch (error) {
    console.error('WebSocket connection failed:', error);
    return false;
  }
};

export const testMeetingSubscription = async (roomId) => {
  try {
    await webSocketService.subscribeToMeetingJoinRequests(roomId, (message) => {
      // Message received
    });
    
    return true;
  } catch (error) {
    console.error('Meeting subscription failed:', error);
    return false;
  }
};