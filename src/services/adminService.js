import api from './api';
import { normalizePageResponse } from '../utils/pageUtils';

export const adminService = {
  // Student Management
  createStudent: (studentData) => api.post('/api/admin/students', studentData),
  getAllStudents: async (page = 0, size = 20) => {
    const response = await api.get('/api/admin/students', { params: { page, size } });
    const pageData = normalizePageResponse(response.data);
    return { data: pageData.content, pagination: pageData };
  },
  updateStudent: (id, studentData) => api.put(`/api/admin/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/api/admin/students/${id}`),

  // Mentor Management
  createMentor: (mentorData) => api.post('/api/admin/mentors', mentorData),
  getAllMentors: async (page = 0, size = 20) => {
    const response = await api.get('/api/admin/mentors', { params: { page, size } });
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
    api.post('/api/admin/assign-mentor', { studentId, mentorId }),

  // Bulk assign multiple students to a mentor in a single request
  assignMentorToStudents: (assignmentData) =>
    api.post('/api/admin/assign-mentor', assignmentData),

  removeMentorFromStudent: (studentId) => api.delete(`/api/students/${studentId}/mentor`),

  // Batch Management
  createBatch: (batchData) => api.post('/api/admin/batches', batchData),
  getAllBatches: async () => {
    try {
      //console.log('Fetching all batches...');

      // Check if token exists and log it for debugging
      const token = localStorage.getItem('token');
      // console.log('Current token status:', {
      //   exists: !!token,
      //   length: token ? token.length : 0,
      //   preview: token ? token.substring(0, 15) + '...' : 'none'
      // });

      // First attempt
      try {
        const response = await api.get('/api/admin/batches?size=100');
        //console.log('Batches API response successful on first try');

        // Return the response data
        if (response.data) {
          if (Array.isArray(response.data)) {
            return { data: response.data };
          } else if (response.data.content && Array.isArray(response.data.content)) {
            return {
              data: response.data.content,
              pagination: {
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages,
                currentPage: response.data.number,
                pageSize: response.data.size
              }
            };
          }
        }

        // If we couldn't determine format, return the raw data
        return { data: response.data || [] };
      } catch (firstError) {
        // Log first attempt error
        console.error('First batch fetch attempt failed:', firstError);

        // If this was a 401 error, try to fix token and retry
        if (firstError.response?.status === 401) {
          //console.log('Authentication error on first attempt, trying to fix token...');

          // Try with a cleaned token (ensure it doesn't have Bearer prefix in storage)
          if (token && token.startsWith('Bearer ')) {
            const cleanToken = token.replace('Bearer ', '');
            localStorage.setItem('token', cleanToken);
            //console.log('Fixed token format, retrying...');
          }

          // Retry the request
          const response = await api.get('/api/admin/batches?size=100');
          //console.log('Retry successful after token fix');

          // Return the response data
          if (response.data) {
            if (Array.isArray(response.data)) {
              return { data: response.data };
            } else if (response.data.content && Array.isArray(response.data.content)) {
              return {
                data: response.data.content,
                pagination: {
                  totalElements: response.data.totalElements,
                  totalPages: response.data.totalPages,
                  currentPage: response.data.number,
                  pageSize: response.data.size
                }
              };
            }
          }

          // If we couldn't determine format, return the raw data
          return { data: response.data || [] };
        }

        // If not a 401 error, just rethrow
        throw firstError;
      }
    } catch (error) {
      console.error('Error fetching batches after all attempts:', error);
      // Log additional debugging info
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        data: error.response?.data
      });
      throw error;
    }
  },
  getStudentsInBatch: (batchId) => api.get(`/api/admin/batches/${batchId}/students`),
  getMentorsInBatch: (batchId) => api.get(`/api/admin/batches/${batchId}/mentors`),

  // Analytics
  getMentorEngagement: () => api.get('/api/admin/analytics/mentor-engagement'),
  getStudentProgress: () => api.get('/api/admin/analytics/student-progress'),

  // Batch Operations
  assignMentorToBatch: (batchId, mentorIds) =>
    api.post(`/api/admin/batches/assign-mentor`, { batchId, mentorIds }),
  assignStudentsToBatch: (batchId, studentIds) =>
    api.post(`/api/admin/batches/assign-students`, { batchId, studentIds }),
  updateBatch: (batchId, batchData) =>
    api.put(`/api/admin/batches/${batchId}`, batchData),

  // Bulk Upload Operations
  bulkUploadMentors: (formData) =>
    api.post('/api/admin/mentors/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  bulkUploadMentees: (formData) =>
    api.post('/api/admin/students/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  // Video Calls
  getVideoCalls: () => api.get('/api/admin/video-calls')
};

export default adminService;