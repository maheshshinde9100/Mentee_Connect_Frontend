import api from './api';

// Meeting service for handling video calls
export const meetingService = {
  // Start a new meeting
  startMeeting: async (mentorId, meetingData) => {
    try {
      const response = await api.post(`/api/mentors/${mentorId}/meetings/start`, meetingData);
      return response;
    } catch (error) {
      console.error('Error starting meeting:', error);
      throw error;
    }
  },
  
  // End an active meeting
  endMeeting: async (mentorId, meetingId) => {
    try {
      const response = await api.put(`/api/mentors/${mentorId}/meetings/${meetingId}/end`);
      return response;
    } catch (error) {
      console.error('Error ending meeting:', error);
      throw error;
    }
  },
  
  // Get all meetings for a mentor
  getMentorMeetings: async (mentorId) => {
    try {
      const response = await api.get(`/api/mentors/${mentorId}/meetings`);
      return response;
    } catch (error) {
      console.error('Error fetching mentor meetings:', error);
      throw error;
    }
  },
  
  // Get active meeting for a mentor
  getActiveMeeting: async (mentorId) => {
    try {
      const response = await api.get(`/api/mentors/${mentorId}/meetings/active`);
      return response;
    } catch (error) {
      console.error('Error fetching active meeting:', error);
      throw error;
    }
  },
  
  // Get all meetings for a student
  getStudentMeetings: async (studentId) => {
    try {
      const response = await api.get(`/api/students/${studentId}/meetings`);
      return response;
    } catch (error) {
      console.error('Error fetching student meetings:', error);
      throw error;
    }
  },

  // Join a meeting as a student
  joinMeeting: async (studentId, meetingId) => {
    try {
      const response = await api.post(`/api/students/${studentId}/meetings/${meetingId}/join`);
      return response;
    } catch (error) {
      console.error('Error joining meeting:', error);
      throw error;
    }
  },

  // Leave a meeting as a student
  leaveMeeting: async (studentId, meetingId) => {
    try {
      const response = await api.post(`/api/students/${studentId}/meetings/${meetingId}/leave`);
      return response;
    } catch (error) {
      console.error('Error leaving meeting:', error);
      throw error;
    }
  },

  // Get meeting details
  getMeetingDetails: async (meetingId) => {
    try {
      const response = await api.get(`/api/meetings/${meetingId}`);
      return response;
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      throw error;
    }
  },

  // Get meeting participants
  getMeetingParticipants: async (meetingId) => {
    try {
      const response = await api.get(`/api/meetings/${meetingId}/participants`);
      return response;
    } catch (error) {
      console.error('Error fetching meeting participants:', error);
      throw error;
    }
  },
  
  // Get all meetings (for admin)
  getAllMeetings: async () => {
    try {
      console.log('Fetching all meetings for admin');
      
      // For demo, simulate meetings data
      const mockMeetings = [
        {
          id: 'meeting-1',
          mentorId: 'mentor1',
          mentorName: 'John Doe',
          title: 'Weekly Check-in',
          description: 'Regular weekly session to discuss progress',
          startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          attendees: ['Student A', 'Student B', 'Student C'],
          status: 'ended'
        },
        {
          id: 'meeting-2',
          mentorId: 'mentor1',
          mentorName: 'John Doe',
          title: 'Project Review',
          description: 'Review project progress and provide feedback',
          startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
          meetingLink: 'https://meet.google.com/xyz-uvwx-yz',
          attendees: ['Student A', 'Student C'],
          status: 'ended'
        },
        {
          id: 'meeting-3',
          mentorId: 'mentor2',
          mentorName: 'Jane Smith',
          title: 'Upcoming Group Session',
          description: 'Group discussion on upcoming project deadlines',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          meetingLink: 'https://meet.google.com/lmn-opqr-stu',
          status: 'scheduled'
        }
      ];
      
      // In a real implementation, this would be an actual API call:
      // const response = await api.get(`/api/admin/meetings`);
      // return response;
      
      return { data: mockMeetings };
    } catch (error) {
      console.error('Error fetching all meetings:', error);
      throw error;
    }
  }
};

export default meetingService; 