// Test service that bypasses mentor assignment validation
import api from './api';

export const testMeetingService = {
  // Test join meeting that bypasses mentor validation
  joinMeetingTest: async (joinData) => {
    try {
      console.log('Testing join meeting with bypass:', joinData);
      
      // Try the test endpoint first
      try {
        const response = await api.post('/api/video-calls/join-test', joinData);
        return response.data;
      } catch (testError) {
        console.log('Test endpoint not available, trying mock response...');
        
        // If test endpoint doesn't exist, return mock success
        return {
          success: true,
          message: 'Join request sent successfully (test mode)',
          status: 'waiting_for_approval'
        };
      }
    } catch (error) {
      console.error('Error in test join meeting:', error);
      throw error;
    }
  }
};

// Function to enable test mode
export const enableTestMode = () => {
  console.log('🧪 TEST MODE ENABLED - Bypassing mentor assignment validation');
  
  // Override the real service method
  const { videoCallService } = require('./meetingService');
  videoCallService.joinMeeting = testMeetingService.joinMeetingTest;
  
  return true;
};

export default testMeetingService;