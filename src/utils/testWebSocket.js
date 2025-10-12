import webSocketService from '../services/websocketService';

export const testWebSocketConnection = async () => {
  try {
    console.log('Testing WebSocket connection...');
    
    if (!webSocketService.isConnected()) {
      console.log('Connecting to WebSocket...');
      await webSocketService.connect();
    }
    
    console.log('WebSocket connection successful!');
    return true;
  } catch (error) {
    console.error('WebSocket connection failed:', error);
    return false;
  }
};

export const testMeetingSubscription = async (roomId) => {
  try {
    console.log(`Testing meeting subscription for room: ${roomId}`);
    
    await webSocketService.subscribeToMeetingJoinRequests(roomId, (message) => {
      console.log('Received test message:', message);
    });
    
    console.log('Meeting subscription successful!');
    return true;
  } catch (error) {
    console.error('Meeting subscription failed:', error);
    return false;
  }
};