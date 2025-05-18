import api from './api';

export const adminService = {
  // Student Management
  createStudent: (studentData) => api.post('/admin/students', studentData),
  getAllStudents: () => api.get('/api/admin/students'),
  updateStudent: (id, studentData) => api.put(`/admin/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),

  // Mentor Management
  createMentor: (mentorData) => api.post('/admin/mentors', mentorData),
  getAllMentors: () => api.get('/api/admin/mentors'),
  assignMentorToStudent: (studentId, mentorId) => 
    api.post('/api/admin/assign-mentor', { studentId, mentorId }),

  // Batch Management
  createBatch: (batchData) => api.post('/admin/batches', batchData),
  getAllBatches: () => api.get('/admin/batches'),
  getStudentsInBatch: (batchId) => api.get(`/admin/batches/${batchId}/students`),

  // Analytics
  getMentorEngagement: () => api.get('/admin/analytics/mentor-engagement'),
  getStudentProgress: () => api.get('/admin/analytics/student-progress'),
  getMeetingMetrics: () => api.get('/admin/analytics/meeting-metrics'),

  // Batch Operations
  assignMentorToBatch: (batchId, mentorId) => 
    api.post(`/admin/batches/${batchId}/assign-mentor`, { mentorId }),
  assignStudentsToBatch: (batchId, studentIds) => 
    api.post(`/admin/batches/${batchId}/assign-students`, { studentIds })
};

export default adminService; 