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
      console.log('Fetching all mentors with pagination...');
      
      const initialResponse = await api.get('/api/admin/mentors?size=100&page=0');
      console.log('Initial mentors API response:', initialResponse);
      
     
      if (initialResponse.data && 
          initialResponse.data.content && 
          Array.isArray(initialResponse.data.content)) {
        
        const totalPages = initialResponse.data.totalPages || 1;
        const totalElements = initialResponse.data.totalElements || 0;
        
        console.log(`Detected paginated response with ${totalElements} total mentors across ${totalPages} pages`);
        
        if (totalPages <= 1) {
          console.log('Single page of mentors, returning directly');
          return { 
            data: initialResponse.data.content,
            pagination: {
              totalElements: initialResponse.data.totalElements,
              totalPages: initialResponse.data.totalPages,
              currentPage: initialResponse.data.number,
              pageSize: initialResponse.data.size
            }
          };
        }
      
        console.log(`Fetching all ${totalPages} pages of mentors...`);
        let allMentors = [...initialResponse.data.content];
        const pagePromises = [];
        for (let page = 1; page < totalPages; page++) {
          pagePromises.push(api.get(`/api/admin/mentors?size=100&page=${page}`));
        }
        
        const pageResponses = await Promise.all(pagePromises);
        
        pageResponses.forEach(response => {
          if (response.data && 
              response.data.content && 
              Array.isArray(response.data.content)) {
            allMentors = [...allMentors, ...response.data.content];
          }
        });
        
        console.log(`Successfully fetched all ${allMentors.length} mentors across ${totalPages} pages`);
        
        return { 
          data: allMentors,
          pagination: {
            totalElements: initialResponse.data.totalElements,
            totalPages: initialResponse.data.totalPages,
            currentPage: 'all',
            pageSize: allMentors.length
          }
        };
      }
      
      // Handle non-paginated responses (fallback to previous implementation)
      
      // Log the exact structure to debug
      console.log('Response structure:', {
        hasData: !!initialResponse.data,
        isDataArray: Array.isArray(initialResponse.data),
        dataType: typeof initialResponse.data,
        dataKeys: initialResponse.data && typeof initialResponse.data === 'object' ? Object.keys(initialResponse.data) : []
      });
      
      // Case 1: Direct array in response.data
      if (Array.isArray(initialResponse.data)) {
        console.log('Response data is directly an array, using it');
        return { data: initialResponse.data };
      }
      
      // Case 2: Array in response.data.data (Axios often wraps responses)
      if (initialResponse.data && Array.isArray(initialResponse.data.data)) {
        console.log('Found array in response.data.data');
        return { data: initialResponse.data.data };
      }
      
      // Case 3: If raw response contains the array (unusual but possible)
      if (Array.isArray(initialResponse)) {
        console.log('Raw response is an array, using it directly');
        return { data: initialResponse };
      }
      
      // If we got here but still have a valid response, try to extract the first array property
      if (initialResponse.data && typeof initialResponse.data === 'object') {
        const keys = Object.keys(initialResponse.data);
        for (const key of keys) {
          if (Array.isArray(initialResponse.data[key])) {
            console.log(`Found array in response.data.${key}`);
            return { data: initialResponse.data[key] };
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

  // Bulk assign multiple students to a mentor in a single request
  assignMentorToStudents: (assignmentData) =>
    api.post('/api/admin/assign-mentor', assignmentData),

  // Batch Management
  createBatch: (batchData) => api.post('/api/admin/batches', batchData),
  getAllBatches: async () => {
    try {
      console.log('Fetching all batches...');
      
      // Check if token exists and log it for debugging
      const token = localStorage.getItem('token');
      console.log('Current token status:', { 
        exists: !!token, 
        length: token ? token.length : 0,
        preview: token ? token.substring(0, 15) + '...' : 'none' 
      });
      
      // First attempt
      try {
        const response = await api.get('/api/admin/batches?size=100');
        console.log('Batches API response successful on first try');
        
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
          console.log('Authentication error on first attempt, trying to fix token...');
          
          // Try with a cleaned token (ensure it doesn't have Bearer prefix in storage)
          if (token && token.startsWith('Bearer ')) {
            const cleanToken = token.replace('Bearer ', '');
            localStorage.setItem('token', cleanToken);
            console.log('Fixed token format, retrying...');
          }
          
          // Retry the request
          const response = await api.get('/api/admin/batches?size=100');
          console.log('Retry successful after token fix');
          
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