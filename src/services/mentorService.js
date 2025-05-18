import api from './api';

export const mentorService = {
  // Profile Management
  getCurrentProfile: () => api.get('/api/mentors/me'),
  getMentorById: (id) => api.get(`/api/mentors/${id}`),
  updateProfile: (id, profileData) => api.put(`/api/mentors/${id}`, profileData),

  // Student Management
  getMyStudents: (id) => api.get(`/api/mentors/${id}/students`),
  
  // Meeting Management
  getMyMeetings: (id) => api.get(`/api/mentors/${id}/meetings`),
  getAvailableSlots: (id) => api.get(`/api/mentors/${id}/slots`),
  
  // Meeting Operations
  createMeeting: (meetingData) => api.post('/api/meetings', meetingData),
  updateMeeting: (id, meetingData) => api.put(`/api/meetings/${id}`, meetingData),
  deleteMeeting: (id) => api.delete(`/api/meetings/${id}`),
  getMeetingsByRange: (startDate, endDate) => 
    api.get(`/api/meetings/range?start=${startDate}&end=${endDate}`),
  updateMeetingStatus: (id, status) => 
    api.put(`/api/meetings/${id}/status`, { status }),
  addMeetingNotes: (id, notes) => 
    api.put(`/api/meetings/${id}/notes`, { notes })
};

export default mentorService; 