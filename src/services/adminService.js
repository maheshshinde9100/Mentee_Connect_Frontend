import api from './api';

export const adminService = {
  // Student Management
  createStudent: (studentData) => api.post('/api/admin/students', studentData),
  getAllStudents: () => api.get('/api/admin/students'),
  updateStudent: (id, studentData) => api.put(`/api/admin/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/api/admin/students/${id}`),

  // Mentor Management
  createMentor: (mentorData) => api.post('/api/admin/mentors', mentorData),
  getAllMentors: async () => {
    try {
      // Request a large page size to get all mentors at once
      const response = await api.get('/api/admin/mentors?size=100');
      console.log('Raw mentors API response:', response);
      
      // Log the exact structure to debug
      console.log('Response structure:', {
        hasData: !!response.data,
        isDataArray: Array.isArray(response.data),
        dataType: typeof response.data,
        dataKeys: response.data && typeof response.data === 'object' ? Object.keys(response.data) : []
      });
      
      // Process different response formats:
      
      // Case 1: Direct array in response.data
      if (Array.isArray(response.data)) {
        console.log('Response data is directly an array, using it');
        return { data: response.data };
      }
      
      // Case 2: Array in response.data.data (Axios often wraps responses)
      if (response.data && Array.isArray(response.data.data)) {
        console.log('Found array in response.data.data');
        return { data: response.data.data };
      }
      
      // Case 3: If raw response contains the array (unusual but possible)
      if (Array.isArray(response)) {
        console.log('Raw response is an array, using it directly');
        return { data: response };
      }
      
      // Case 4: Paginated response
      if (response.data && response.data.content && Array.isArray(response.data.content)) {
        console.log('Found paginated mentors in content array');
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
      
      // If we got here but still have a valid response, try to extract the first array property
      if (response.data && typeof response.data === 'object') {
        const keys = Object.keys(response.data);
        for (const key of keys) {
          if (Array.isArray(response.data[key])) {
            console.log(`Found array in response.data.${key}`);
            return { data: response.data[key] };
          }
        }
      }
      
      // If all else fails, return empty array
      console.error('Could not extract mentor data from response');
      return { data: [] };
    } catch (error) {
      console.error('Error fetching mentors:', error);
      throw error;
    }
  },
  assignMentorToStudent: (studentId, mentorId) => 
    api.post('/api/admin/assign-mentor', { studentId, mentorId }),

  // Batch Management
  createBatch: (batchData) => api.post('/api/admin/batches', batchData),
  getAllBatches: () => api.get('/api/admin/batches'),
  getStudentsInBatch: (batchId) => api.get(`/api/admin/batches/${batchId}/students`),
  getMentorsInBatch: (batchId) => api.get(`/api/admin/batches/${batchId}/mentors`),

  // Analytics
  getMentorEngagement: () => api.get('/api/admin/analytics/mentor-engagement'),
  getStudentProgress: () => api.get('/api/admin/analytics/student-progress'),
  getMeetingMetrics: () => api.get('/api/admin/analytics/meeting-metrics'),

  // Batch Operations
  assignMentorToBatch: (batchId, mentorIds) => 
    api.post(`/api/admin/batches/assign-mentor`, { batchId, mentorIds }),
  assignStudentsToBatch: (batchId, studentIds) => 
    api.post(`/api/admin/batches/assign-students`, { batchId, studentIds }),
  updateBatch: (batchId, batchData) =>
    api.put(`/api/admin/batches/${batchId}`, batchData)
};

export default adminService; 