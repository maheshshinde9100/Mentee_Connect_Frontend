import api from './api';
import { normalizePageResponse } from '../utils/pageUtils';

export const adminService = {
  // Student Management
  createStudent: (studentData) => api.post('/admin/students', studentData),
  createAdminStudent: (studentData) => api.post('/admin/students', studentData),
  getAllStudents: async (page = 0, size = 100) => {
    const response = await api.get('/admin/students', { params: { page, size } });
    const pageData = normalizePageResponse(response.data);
    return { data: pageData.content, pagination: pageData };
  },
  updateStudent: (id, studentData) => api.put(`/admin/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),

  // Mentor Management
  createMentor: (mentorData) => api.post('/admin/mentors', mentorData),
  createAdminMentor: (mentorData) => api.post('/admin/mentors', mentorData),
  getAllMentors: async (page = 0, size = 100) => {
    const response = await api.get('/admin/mentors', { params: { page, size } });
    const pageData = normalizePageResponse(response.data);
    return {
      data: pageData.content,
      pagination: {
        totalElements: pageData.totalElements,
        totalPages: pageData.totalPages,
        currentPage: pageData.number,
        pageSize: pageData.size,
      },
    };
  },
  assignMentorToStudent: (studentId, mentorId) =>
    api.post('/admin/assign-mentor', { studentIds: [studentId], mentorId }),

  // Bulk assign multiple students to a mentor in a single request
  assignMentorToStudents: (assignmentData) =>
    api.post('/admin/assign-mentor', assignmentData),

  removeMentorFromStudent: (studentId) => api.delete(`/students/${studentId}/mentor`),

  // Batch Management
  createBatch: (batchData) => api.post('/admin/batches', batchData),
  getAllBatches: () => api.get('/admin/batches', { params: { size: 100 } }),
  getBatchById: (batchId) => api.get(`/admin/batches/${batchId}`),
  getStudentsInBatch: (batchId) => api.get(`/admin/batches/${batchId}/students`),
  getMentorsInBatch: (batchId) => api.get(`/admin/batches/${batchId}/mentors`),

  // Batch Operations
  assignMentorToBatch: (batchId, mentorIds) =>
    api.post('/admin/batches/assign-mentor', { batchId, mentorIds }),
  assignStudentsToBatch: (batchId, studentIds) =>
    api.post('/admin/batches/assign-students', { batchId, studentIds }),
  updateBatch: (batchId, batchData) =>
    api.put(`/admin/batches/${batchId}`, batchData),
  deleteBatch: (batchId) => api.delete(`/admin/batches/${batchId}`),

  // Bulk Upload Operations
  bulkUploadMentors: (formData) =>
    api.post('/admin/mentors/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  bulkUploadMentees: (formData) =>
    api.post('/admin/students/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  // Video Calls
  getVideoCalls: () => api.get('/admin/video-calls'),

  // User Management
  getAllUsers: () => api.get('/admin/users'),
  searchUsers: (name) =>
    api.get('/admin/users/search', { params: { name } }),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),

  // Analytics
  getAnalytics: () => api.get('/admin/analytics'),

  // Departments
  getAllDepartments: () => api.get('/admin/departments')
};

export default adminService;
