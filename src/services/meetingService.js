import api from './api';

// Meeting service for handling meetings and video calls
export const meetingService = {
  // Create a new meeting
  createMeeting: async (meetingData) => {
    try {
      console.log('Creating meeting with data:', meetingData);
      const response = await api.post('http://localhost:8080/api/meetings', {
        title: meetingData.title,
        description: meetingData.description,
        scheduledTime: meetingData.scheduledTime,
        mentorId: meetingData.mentorId,
        selectedMentees: meetingData.selectedMentees,
        duration: meetingData.duration
      });
      console.log('Meeting created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating meeting:', error.response?.data || error);
      throw error;
    }
  },

  // Get mentor's meetings
  getMentorMeetings: async (mentorId) => {
    try {
      console.log('Fetching meetings for mentor:', mentorId);
      const response = await api.get(`http://localhost:8080/api/meetings/mentor/${mentorId}`);
      console.log('Mentor meetings fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching mentor meetings:', error.response?.data || error);
      throw error;
    }
  },

  // Get mentee's meetings
  getMenteeMeetings: async (menteeId) => {
    try {
      console.log('Fetching meetings for mentee:', menteeId);
      const response = await api.get(`http://localhost:8080/api/meetings/mentee/${menteeId}`);
      console.log('Mentee meetings fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching mentee meetings:', error.response?.data || error);
      throw error;
    }
  },

  // Get meeting details
  getMeetingDetails: async (meetingId) => {
    try {
      console.log('Fetching details for meeting:', meetingId);
      const response = await api.get(`http://localhost:8080/api/meetings/${meetingId}`);
      console.log('Meeting details fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching meeting details:', error.response?.data || error);
      throw error;
    }
  },

  // Update meeting status
  updateMeetingStatus: async (meetingId, status) => {
    try {
      console.log('Updating meeting status:', { meetingId, status });
      const response = await api.put(`http://localhost:8080/api/meetings/${meetingId}/status`, { status });
      console.log('Meeting status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating meeting status:', error.response?.data || error);
      throw error;
    }
  },

  // Delete meeting
  deleteMeeting: async (meetingId) => {
    try {
      console.log('Deleting meeting:', meetingId);
      const response = await api.delete(`http://localhost:8080/api/meetings/${meetingId}`);
      console.log('Meeting deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting meeting:', error.response?.data || error);
      throw error;
    }
  },

  // Initialize video call
  initializeVideoCall: async (meetingId, mentorId) => {
    try {
      const response = await api.post('http://localhost:8080/api/video-calls', {
        meetingId,
        mentorId
      });
      return response.data;
    } catch (error) {
      console.error('Error initializing video call:', error);
      throw error;
    }
  },

  // Join video call
  joinVideoCall: async (roomId, participantId, participantName, participantRole) => {
    try {
      const response = await api.post('http://localhost:8080/api/video-calls/join', {
        roomId,
        participantId,
        participantName,
        participantRole
      });
      return response.data;
    } catch (error) {
      console.error('Error joining video call:', error);
      throw error;
    }
  },

  // Leave video call
  leaveVideoCall: async (roomId, participantId) => {
    try {
      const response = await api.post('http://localhost:8080/api/video-calls/leave', {
        roomId,
        participantId
      });
      return response.data;
    } catch (error) {
      console.error('Error leaving video call:', error);
      throw error;
    }
  },

  // End video call
  endVideoCall: async (roomId, mentorId) => {
    try {
      const response = await api.post('http://localhost:8080/api/video-calls/end', {
        roomId,
        mentorId
      });
      return response.data;
    } catch (error) {
      console.error('Error ending video call:', error);
      throw error;
    }
  },

  // Get active calls
  getActiveCalls: async () => {
    try {
      const response = await api.get('http://localhost:8080/api/video-calls/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active calls:', error);
      throw error;
    }
  }
};

export default meetingService; 