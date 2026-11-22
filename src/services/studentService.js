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
  getCertificateFile: (certificateUrl) => {
    const filename = String(certificateUrl || '').split('/').filter(Boolean).pop() || '';
    return api.get(`/certificates/${filename}`, { responseType: 'blob' });
  },

  // Skills
  getSkills: () => api.get('/students/me/skills'),
  addSkill: (skill) => api.post('/students/me/skills', skill),
  deleteSkill: (skillId) => api.delete(`/students/me/skills/${skillId}`),

  // Progress Management
  updateProgress: (id, { attendance, cgpa }) =>
    api.put(`/students/${id}/progress`, null, { params: { attendance, cgpa } }),

  // Batch Related
  getAllStudents: () => api.get('/students'),
  assignMentor: (studentId, mentorId) =>
    api.put(`/students/${studentId}/mentor/${mentorId}`),

};

export default studentService;