import axios from 'axios';

// Create a debug function to help troubleshoot token issues
const debugToken = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  console.log('Token check:', {
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    tokenStart: token ? token.substring(0, 15) + '...' : 'none',
    hasUser: !!user,
    userRole: user ? JSON.parse(user).role : 'none'
  });
  return !!token;
};

const api = axios.create({
  baseURL: '',  // Empty baseURL to use relative paths
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure there's a proper Authorization header with Bearer token format
      config.headers.Authorization = `Bearer ${token}`;
      
      // Log requests to admin endpoints for debugging
      if (config.url?.includes('/api/admin/')) {
        console.log(`Sending authenticated request to: ${config.url}`);
        console.log(`Auth header: Bearer ${token.substring(0, 15)}...`);
      }
    } else {
      console.warn(`Request to ${config.url} has no auth token available`);
      debugToken(); // Call debug function to get more info
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log all API errors for debugging
    console.error('API Error intercepted:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });
    
    // Additional error debugging for batch operations
    if (error.config?.url.includes('/api/admin/batches')) {
      console.log('Batch operation error detected, detailed diagnostics:');
      debugToken();
      console.log('Request headers:', error.config.headers);
      console.log('Request data:', error.config.data);
    }

    // Only handle 401 errors for non-login endpoints
    if (error.response?.status === 401 && 
        !error.config.url.includes('/api/auth/login') && 
        !error.config.url.includes('/api/auth/refresh-token')) {
      
      console.log('Handling 401 Unauthorized error - will not redirect to login');
      debugToken(); // Debug token in case of 401
      
      // Check if token needs format fixing for batch operations specifically
      if (error.config?.url.includes('/api/admin/batches')) {
        const token = localStorage.getItem('token');
        if (token) {
          // Fix token format if needed - ensure format is correct without 'Bearer ' prefix in storage
          if (token.startsWith('Bearer ')) {
            const cleanToken = token.replace('Bearer ', '');
            console.log('Correcting token storage format by removing Bearer prefix');
            localStorage.setItem('token', cleanToken);
          }
          
          // Retry with current token
          console.log('Retrying batch operation with corrected token format');
          const config = { ...error.config };
          const retryToken = localStorage.getItem('token');
          config.headers.Authorization = `Bearer ${retryToken}`;
          try {
            return await axios(config);
          } catch (retryError) {
            console.error('Retry failed:', retryError);
          }
        }
      }
      
      // Try refreshing token but never redirect
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          console.log('Attempting to refresh token...');
          const response = await api.post('/api/auth/refresh-token', { refreshToken });
          const { token } = response.data;
          
          // Store the new token
          console.log('Token refreshed successfully');
          localStorage.setItem('token', token);
          
          // Retry the original request
          const config = error.config;
          config.headers.Authorization = `Bearer ${token}`;
          return api(config);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Do NOT clear token here - this is likely the issue
          console.warn('Token refresh failed, but keeping existing token for now');
        }
      } else {
        console.warn('No refresh token available, but keeping existing token');
        // Do NOT remove the token here - that's causing the problem
      }
    }
    
    // Always pass through the error to be handled by the component
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  refreshToken: (refreshToken) => api.post('/api/auth/refresh-token', { refreshToken }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

// Student Services
export const studentService = {
  getAllStudents: () => api.get('/students'),
  createStudent: (studentData) => api.post('/students', studentData),
  updateStudent: (id, studentData) => api.put(`/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/students/${id}`),
  getStudentById: (id) => api.get(`/students/${id}`),
  getCurrentStudent: () => api.get('/students/me'),
  getStudentsByMentor: (mentorId) => api.get(`/students/mentor/${mentorId}`),
  updateStudentProgress: (id, progressData) => api.put(`/students/${id}/progress`, progressData),
  getStudentMeetings: (id) => api.get(`/students/${id}/meetings`),
  getMeetingDetails: (meetingId) => api.get(`/students/meetings/${meetingId}`),
  requestMeetingChanges: (meetingId, changes) => api.post(`/students/meetings/${meetingId}/request-changes`, changes),
  getMyMentor: () => api.get('/students/my-mentor'),
  getUpcomingMeetings: () => api.get('/students/meetings/upcoming'),
  getProgressReports: () => api.get('/students/progress-reports')
};

// Mentor Services
export const mentorService = {
  getAllMentors: () => api.get('/mentors'),
  createMentor: (mentorData) => api.post('/mentors', mentorData),
  updateMentor: (id, mentorData) => api.put(`/mentors/${id}`, mentorData),
  deleteMentor: (id) => api.delete(`/mentors/${id}`),
  getMentorById: (id) => api.get(`/mentors/${id}`),
  getCurrentMentor: () => api.get('/mentors/me'),
  getMentorStudents: (id) => api.get(`/mentors/${id}/students`),
  getMentorMeetings: (id) => api.get(`/mentors/${id}/meetings`),
  checkMentorSlots: (id) => api.get(`/mentors/${id}/slots`)
};

// Admin Services
export const adminService = {
  // User Management
  getAllUsers: () => api.get('/api/admin/users'),
  searchUsers: (name) => api.get(`/api/admin/users/search?name=${name}`),
  deleteUser: (userId) => api.delete(`/api/admin/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/api/admin/users/${userId}`, userData),
  getAnalytics: () => api.get('/api/admin/analytics'),

  // Student Management
  getAdminStudents: () => api.get('/api/admin/students'),
  createAdminStudent: (studentData) => api.post('/api/admin/students', studentData),
  updateAdminStudent: (id, studentData) => api.put(`/api/admin/students/${id}`, studentData),
  deleteAdminStudent: (id) => api.delete(`/api/admin/students/${id}`),
  
  // Mentor Management
  getAdminMentors: () => api.get('/api/admin/mentors'),
  createAdminMentor: (mentorData) => api.post('/api/admin/mentors', mentorData),
  updateAdminMentor: (id, mentorData) => api.put(`/api/admin/mentors/${id}`, mentorData),
  deleteAdminMentor: (id) => api.delete(`/api/admin/mentors/${id}`),
  
  // Mentor-Student Assignment
  assignMentorToStudent: (data) => api.post('/api/admin/assign-mentor', data),

  // Batch Management
  getBatches: () => api.get('/api/admin/batches'),
  createBatch: (batchData) => api.post('/api/admin/batches', batchData),
  getBatchStudents: (batchId) => api.get(`/api/admin/batches/${batchId}/students`),
  getBatchMentors: async (batchId) => {
    try {
      console.log(`Getting mentors for batch ${batchId}`);
      const response = await api.get(`/api/admin/batches/${batchId}/mentors?size=100`);
      console.log('Batch mentors raw response:', response);
      
      // Check different possible response formats
      if (Array.isArray(response.data)) {
        console.log('Batch mentors: data is an array, using directly');
        return { data: response.data };
      }
      
      // Handle paginated response
      if (response.data && response.data.content && Array.isArray(response.data.content)) {
        console.log('Batch mentors: Found paginated response with content array');
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
      
      // Check if response.data has a mentors property
      if (response.data && response.data.mentors && Array.isArray(response.data.mentors)) {
        console.log('Batch mentors: Found mentors array in response.data.mentors');
        return { data: response.data.mentors };
      }
      
      // If response.data is not an array but is an object, search for first array property
      if (response.data && typeof response.data === 'object') {
        const keys = Object.keys(response.data);
        for (const key of keys) {
          if (Array.isArray(response.data[key])) {
            console.log(`Batch mentors: Found array in response.data.${key}`);
            return { data: response.data[key] };
          }
        }
      }
      
      console.warn('Batch mentors: Could not extract mentor array from response', response.data);
      return { data: [] };
    } catch (error) {
      console.error(`Error getting mentors for batch ${batchId}:`, error);
      
      // When batch service is in mock mode, return mock data
      if (error.response?.status === 401 || error.response?.status === 404) {
        // Try to access the batchService to get mock data
        try {
          const batchService = require('./batchService').default;
          if (batchService.isMockModeEnabled && batchService.isMockModeEnabled()) {
            console.log('Using mock data for getBatchMentors');
            // Return mock mentors (assuming mockMentors is defined in batchService)
            return { 
              data: [
                { id: '1', firstName: 'Alice', lastName: 'Williams', email: 'alice@example.com', specialization: 'Web Development' },
                { id: '2', firstName: 'David', lastName: 'Brown', email: 'david@example.com', specialization: 'Data Science' }
              ]
            };
          }
        } catch (err) {
          console.error('Could not use mock data:', err);
        }
      }
      
      // If unable to get mock data, return empty array
      return { data: [] };
    }
  },
  assignStudentsToBatch: (batchId, studentIds) => 
    api.post('/api/admin/batches/assign-students', { batchId, studentIds }),
  assignMentorToBatch: (batchId, mentorIds) => 
    api.post('/api/admin/batches/assign-mentor', { batchId, mentorIds }),
  updateBatch: (batchId, batchData) =>
    api.put(`/api/admin/batches/${batchId}`, batchData),
  
  // Analytics
  getMentorEngagement: () => api.get('/api/admin/analytics/mentor-engagement'),
  getStudentProgress: () => api.get('/api/admin/analytics/student-progress'),
  getMeetingMetrics: () => api.get('/api/admin/analytics/meeting-metrics')
};

// Meeting Services
export const meetingService = {
  getAllMeetings: () => api.get('/meetings'),
  getMeetingsByMentor: (mentorId) => api.get(`/meetings/mentor/${mentorId}`)
};

export default api; 