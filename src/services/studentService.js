import api from './api';

export const studentService = {
  // Profile Management
  getCurrentProfile: () => api.get('/students/me/profile'),
  updateProfile: (profileData) => api.put('/students/me/profile', profileData),
  getStudentById: (id) => api.get(`/students/${id}`),

  // Mentor Related
  getMyMentor: () => api.get('/students/me/mentor'),
  getStudentsByMentor: (mentorId) => api.get(`/students/mentor/${mentorId}`),

  // Certificate Management
  uploadCertificate: (formData) => api.post('/students/me/certificates', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getMyCertificates: () => api.get('/students/me/certificates'),
  deleteCertificate: (certificateId) => api.delete(`/students/me/certificates/${certificateId}`),
  getCertificateFile: (filename) => api.get(`/certificates/${filename}`),

  // Progress Management
  updateProgress: (id, progressData) =>
    api.put(`/students/${id}/progress`, progressData),

  // Batch Related
  getAllStudents: () => api.get('/students'),
  assignMentor: (studentId, mentorId) =>
    api.put(`/students/${studentId}/mentor/${mentorId}`),

};

export default studentService;