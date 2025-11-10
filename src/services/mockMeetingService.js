// Mock service for testing meeting functionality when backend is not ready
import webSocketService from './websocketService';

export const mockMeetingService = {
  // Mock join meeting - simulates backend behavior
  joinMeeting: async (joinData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate sending WebSocket notification to mentor
    setTimeout(() => {
      const mockMessage = {
        action: 'join_request',
        participantId: joinData.participantId,
        participantName: joinData.participantName,
        roomId: joinData.roomId,
        timestamp: new Date().toISOString()
      };
      
      // Try to send via WebSocket if connected
      if (webSocketService.isConnected()) {
        webSocketService.send(`/app/meeting/${joinData.roomId}/join-request`, mockMessage);
      }
    }, 500);
    
    return {
      success: true,
      message: 'Join request sent successfully',
      status: 'waiting_for_approval'
    };
  },

  // Mock approve participant
  approveParticipant: async (roomId, participantId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate sending approval notification to student
    setTimeout(() => {
      const mockApprovalMessage = {
        status: 'approved',
        roomId: roomId,
        meetingTitle: 'Test Meeting',
        message: 'You have been approved to join the meeting'
      };
      
      // Try to send via WebSocket if connected
      if (webSocketService.isConnected()) {
        webSocketService.send(`/queue/user/${participantId}/meeting-approval`, mockApprovalMessage);
      }
    }, 200);
    
    return {
      success: true,
      message: 'Participant approved successfully'
    };
  }
};

// Function to enable mock mode
export const enableMockMode = () => {
  // Override the real service methods
  const { videoCallService } = require('./meetingService');
  
  videoCallService.joinMeeting = mockMeetingService.joinMeeting;
  videoCallService.approveParticipant = mockMeetingService.approveParticipant;
  
  return true;
};

export default mockMeetingService;