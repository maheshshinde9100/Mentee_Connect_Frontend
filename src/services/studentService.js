import api from './api';

export const studentService = {
  // Profile Management
  getCurrentProfile: () => api.get('/api/students/me'),
  getStudentById: (id) => api.get(`/api/students/${id}`),
  updateProfile: (id, profileData) => api.put(`/api/students/${id}`, profileData),

  // Mentor Related
  getMyMentor: () => api.get('/api/students/my-mentor'),
  getStudentsByMentor: (mentorId) => api.get(`/api/students/mentor/${mentorId}`),
  
  // Meeting Management
  getMyMeetings: (id) => api.get(`/api/students/${id}/meetings`),
  getUpcomingMeetings: () => api.get('/api/students/meetings/upcoming'),
  
  // Progress Management
  updateProgress: (id, progressData) => 
    api.put(`/api/students/${id}/progress`, progressData),

  // Batch Related
  getAllStudents: () => api.get('/api/students'),
  assignMentor: (studentId, mentorId) => 
    api.put(`/api/students/${studentId}/mentor/${mentorId}`),
  
  // Meeting Operations
  getMeetingById: (id) => api.get(`/api/meetings/${id}`),
  getMeetingsByRange: (startDate, endDate) => 
    api.get(`/api/meetings/range?start=${startDate}&end=${endDate}`)
};

export default studentService; 