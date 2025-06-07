import api from './api';

export const studentService = {
  // Profile Management
  getCurrentProfile: () => api.get('/api/students/me/profile'),
  updateProfile: (profileData) => api.put('/api/students/me/profile', profileData),
  getStudentById: (id) => api.get(`/api/students/${id}`),

  // Mentor Related
  getMyMentor: () => api.get('/api/students/me/mentor'),
  getStudentsByMentor: (mentorId) => api.get(`/api/students/mentor/${mentorId}`),
  
  // Certificate Management
  uploadCertificate: (formData) => api.post('/api/students/me/certificates', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getMyCertificates: () => api.get('/api/students/me/certificates'),
  deleteCertificate: (certificateId) => api.delete(`/api/students/me/certificates/${certificateId}`),
  getCertificateFile: (filename) => api.get(`/api/certificates/${filename}`),
  
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