import api from './api';

// Meeting service for handling video calls
export const meetingService = {
  // Start a new meeting as a mentor
  startMeeting: async (mentorId, meetingData) => {
    try {
      console.log('Starting a new meeting:', meetingData);
      
      // This would call a real API endpoint in production
      // Mocking the API response for now
      
      // For demo, simulate successful response
      const mockResponse = {
        id: `meeting-${Date.now()}`,
        mentorId,
        title: meetingData.title,
        description: meetingData.description,
        startTime: new Date().toISOString(),
        meetingLink: `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}`,
        status: 'active'
      };
      
      console.log('Meeting created successfully:', mockResponse);
      
      // In a real implementation, this would be an actual API call:
      // const response = await api.post(`/api/meetings`, meetingData);
      // return response;
      
      return { data: mockResponse };
    } catch (error) {
      console.error('Error starting meeting:', error);
      throw error;
    }
  },
  
  // End an active meeting
  endMeeting: async (meetingId) => {
    try {
      console.log(`Ending meeting: ${meetingId}`);
      
      // For demo, simulate successful response
      const mockResponse = {
        id: meetingId,
        endTime: new Date().toISOString(),
        status: 'ended'
      };
      
      // In a real implementation, this would be an actual API call:
      // const response = await api.put(`/api/meetings/${meetingId}/end`);
      // return response;
      
      return { data: mockResponse };
    } catch (error) {
      console.error(`Error ending meeting (${meetingId}):`, error);
      throw error;
    }
  },
  
  // Get all meetings for a mentor
  getMentorMeetings: async (mentorId) => {
    try {
      console.log(`Fetching meetings for mentor: ${mentorId}`);
      
      // For demo, simulate meetings data
      const mockMeetings = [
        {
          id: 'meeting-1',
          mentorId,
          title: 'Weekly Check-in',
          description: 'Regular weekly session to discuss progress',
          startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          attendees: ['student1', 'student2', 'student3'],
          status: 'ended'
        },
        {
          id: 'meeting-2',
          mentorId,
          title: 'Project Review',
          description: 'Review project progress and provide feedback',
          startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
          meetingLink: 'https://meet.google.com/xyz-uvwx-yz',
          attendees: ['student1', 'student3'],
          status: 'ended'
        }
      ];
      
      // In a real implementation, this would be an actual API call:
      // const response = await api.get(`/api/mentors/${mentorId}/meetings`);
      // return response;
      
      return { data: mockMeetings };
    } catch (error) {
      console.error(`Error fetching mentor meetings (${mentorId}):`, error);
      throw error;
    }
  },
  
  // Get all active meetings for a student
  getStudentMeetings: async (studentId) => {
    try {
      console.log(`Fetching meetings for student: ${studentId}`);
      
      // For demo, simulate meetings data
      const mockMeetings = [
        {
          id: 'meeting-3',
          mentorId: 'mentor1',
          mentorName: 'John Doe',
          title: 'Upcoming Group Session',
          description: 'Group discussion on upcoming project deadlines',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          meetingLink: 'https://meet.google.com/lmn-opqr-stu',
          status: 'scheduled'
        }
      ];
      
      // In a real implementation, this would be an actual API call:
      // const response = await api.get(`/api/students/${studentId}/meetings`);
      // return response;
      
      return { data: mockMeetings };
    } catch (error) {
      console.error(`Error fetching student meetings (${studentId}):`, error);
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