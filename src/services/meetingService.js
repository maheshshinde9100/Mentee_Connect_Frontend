import api from './api';

// Video Call service for handling video meetings
export const videoCallService = {
  // Create a new video meeting
  createMeeting: async (meetingData) => {
    try {
      const response = await api.post('/api/video-calls/create', meetingData);
      return response.data;
    } catch (error) {
      console.error('Error creating video meeting:', error);
      throw error;
    }
  },

  // Get meeting details
  getMeetingDetails: async (roomId) => {
    try {
      const response = await api.get(`/api/video-calls/room/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      throw error;
    }
  },

  // Get shareable link
  getShareableLink: async (roomId) => {
    try {
      const response = await api.get(`/api/video-calls/link/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shareable link:', error);
      throw error;
    }
  },

  // Join meeting
  joinMeeting: async (joinData) => {
    try {
      const response = await api.post('/api/video-calls/join', joinData);
      return response.data;
    } catch (error) {
      console.error('Error joining meeting:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Start meeting (mentor only)
  startMeeting: async (roomId) => {
    try {
      const response = await api.post('/api/video-calls/start', { roomId });
      return response.data;
    } catch (error) {
      console.error('Error starting meeting:', error);
      throw error;
    }
  },

  // End meeting (mentor only)
  endMeeting: async (roomId) => {
    try {
      const response = await api.post('/api/video-calls/end', { roomId });
      return response.data;
    } catch (error) {
      console.error('Error ending meeting:', error);
      throw error;
    }
  },

  // Leave meeting
  leaveMeeting: async (roomId) => {
    try {
      const response = await api.post('/api/video-calls/leave', { roomId });
      return response.data;
    } catch (error) {
      console.error('Error leaving meeting:', error);
      throw error;
    }
  },

  // Get waiting participants (mentor only)
  getWaitingParticipants: async (roomId) => {
    try {
      const response = await api.get(`/api/video-calls/waiting/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching waiting participants:', error);
      throw error;
    }
  },

  // Approve participant (mentor only)
  approveParticipant: async (roomId, participantId) => {
    try {
      const response = await api.post('/api/video-calls/approve', { roomId, participantId });
      return response.data;
    } catch (error) {
      console.error('Error approving participant:', error);
      throw error;
    }
  },

  // Reject participant (mentor only)
  rejectParticipant: async (roomId, participantId) => {
    try {
      const response = await api.post('/api/video-calls/reject', { roomId, participantId });
      return response.data;
    } catch (error) {
      console.error('Error rejecting participant:', error);
      throw error;
    }
  },

  // Get mentor's meetings
  getMentorMeetings: async (mentorId) => {
    try {
      const response = await api.get(`/api/video-calls/mentor/${mentorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching mentor meetings:', error);
      throw error;
    }
  },

  // Get available meetings
  getAvailableMeetings: async () => {
    try {
      const response = await api.get('/api/video-calls/available');
      return response.data;
    } catch (error) {
      console.error('Error fetching available meetings:', error);
      throw error;
    }
  },

  // Get student's meetings
  getStudentMeetings: async (studentId) => {
    try {
      const response = await api.get(`/api/video-calls/mentee/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student meetings:', error);
      throw error;
    }
  }
};

// Legacy meeting service for backward compatibility
export const meetingService = {
  createMeeting: videoCallService.createMeeting,
  getMentorMeetings: videoCallService.getMentorMeetings,
  getMenteeMeetings: videoCallService.getStudentMeetings,
  getStudentMeetings: videoCallService.getStudentMeetings,
  getMeetingDetails: videoCallService.getMeetingDetails,
  getAvailableMeetings: videoCallService.getAvailableMeetings,
  joinMeeting: videoCallService.joinMeeting,
  startMeeting: videoCallService.startMeeting,
  endMeeting: videoCallService.endMeeting,
  leaveMeeting: videoCallService.leaveMeeting,
  deleteMeeting: async (meetingId) => {
    // This would need to be implemented if needed
    throw new Error('Delete meeting not implemented in new video call API');
  }
};

export default meetingService; 