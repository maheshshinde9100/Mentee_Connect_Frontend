import axios from 'axios';

// ─── In-Memory GET Response Cache ────────────────────────────────────────────
// Caches GET responses for 30 seconds to avoid redundant network round-trips.
// Write operations (POST/PUT/DELETE) automatically clear the cache.
const API_CACHE = new Map();
const CACHE_TTL_MS = 30 * 1000; // 30 seconds
const CACHE_MAX_ENTRIES = 100;

const getCacheKey = (config) => {
  const params = config.params ? JSON.stringify(config.params) : '';
  return `${config.method}:${config.url}:${params}`;
};

const isGetRequest = (config) =>
  config.method === 'get' || config.method === 'GET';

const isWriteRequest = (config) =>
  ['post', 'put', 'patch', 'delete'].includes((config.method || '').toLowerCase());

const pruneCache = () => {
  const now = Date.now();
  for (const [key, entry] of API_CACHE) {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      API_CACHE.delete(key);
    }
  }
  // Evict oldest entries if cache is too large
  if (API_CACHE.size > CACHE_MAX_ENTRIES) {
    const oldest = [...API_CACHE.entries()]
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toRemove = oldest.slice(0, API_CACHE.size - CACHE_MAX_ENTRIES);
    toRemove.forEach(([key]) => API_CACHE.delete(key));
  }
};

/** Programmatically clear all cached GET responses */
export const clearApiCache = () => API_CACHE.clear();
// ─────────────────────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
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
      // Using .set() ensures compatibility with AxiosHeaders in Axios 1.x+
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Serve GET requests from cache if a fresh entry exists
    if (isGetRequest(config) && !config.skipCache) {
      const key = getCacheKey(config);
      const cached = API_CACHE.get(key);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        // Return a resolved adapter response so Axios skips the network
        config.adapter = () =>
          Promise.resolve({
            data: cached.data,
            status: cached.status,
            statusText: cached.statusText,
            headers: cached.headers,
            config,
            request: {},
          });
      }
    }

    // Write operations bust the entire cache to keep data fresh
    if (isWriteRequest(config)) {
      API_CACHE.clear();
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (isGetRequest(response.config) && response.status >= 200 && response.status < 300) {
      pruneCache();
      const key = getCacheKey(response.config);
      API_CACHE.set(key, {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        timestamp: Date.now(),
      });
    }
    return response;
  },
  async (error) => {
    const originalConfig = error.config;

    if (
      error.response?.status === 401 &&
      originalConfig &&
      !originalConfig._retry &&
      !originalConfig.url.includes('/api/auth/login') &&
      !originalConfig.url.includes('/api/auth/refresh-token')
    ) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        originalConfig._retry = true;
        try {
          const response = await api.post('/api/auth/refresh-token', { refreshToken });
          const { token } = response.data;

          // Store the new token
          localStorage.setItem('token', token);

          // Retry the original request with new token
          originalConfig.headers.Authorization = `Bearer ${token}`;
          return api(originalConfig);
        } catch (refreshError) {
          // Refresh failed — clear session and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          API_CACHE.clear();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
            return new Promise(() => {}); // Return a never-resolving promise to halt further execution
          }
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token — clear session and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        API_CACHE.clear();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
          return new Promise(() => {}); // Return a never-resolving promise to halt further execution
        }
      }
    }

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
  getAllStudents: (page = 0, size = 20) =>
    api.get('/students', { params: { page, size } }),
  createStudent: (studentData) => api.post('/students', studentData),
  updateStudent: (id, studentData) => api.put(`/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/students/${id}`),
  getStudentById: (id) => api.get(`/students/${id}`),
  getCurrentStudent: () => api.get('/students/me'),
  getStudentsByMentor: (mentorId, page = 0, size = 20) =>
    api.get(`/students/mentor/${mentorId}`, { params: { page, size } }),
  updateStudentProgress: (id, progressData) => api.put(`/students/${id}/progress`, progressData),
  getMyMentor: () => api.get('/students/my-mentor'),
  getProgressReports: () => api.get('/students/progress-reports')
};

// Mentor Services
export const mentorService = {
  getAllMentors: (page = 0, size = 20) =>
    api.get('/mentors', { params: { page, size } }),
  createMentor: (mentorData) => api.post('/mentors', mentorData),
  updateMentor: (id, mentorData) => api.put(`/mentors/${id}`, mentorData),
  deleteMentor: (id) => api.delete(`/mentors/${id}`),
  getMentorById: (id) => api.get(`/mentors/${id}`),
  getCurrentMentor: () => api.get('/mentors/me'),
  getMentorStudents: (id) => api.get(`/mentors/${id}/students`),
  checkMentorSlots: (id) => api.get(`/mentors/${id}/slots`)
};

// Admin Services
export const adminService = {
  // User Management
  getAllUsers: () => api.get('/api/admin/users'),
  searchUsers: (name) => api.get(`/api/admin/users/search?name=${name}`),
  deleteUser: (userId) => api.delete(`/api/admin/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/api/admin/users/${userId}`, userData),
  getAnalytics: () => api.get('/api/admin/analytics', { skipCache: true }),

  // Student Management
  getAdminStudents: (page = 0, size = 20) =>
    api.get('/api/admin/students', { params: { page, size } }),
  createAdminStudent: (studentData) => api.post('/api/admin/students', studentData),
  updateAdminStudent: (id, studentData) => api.put(`/api/admin/students/${id}`, studentData),
  deleteAdminStudent: (id) => api.delete(`/api/admin/students/${id}`),

  // Mentor Management
  getAdminMentors: (page = 0, size = 20) =>
    api.get('/api/admin/mentors', { params: { page, size } }),
  createAdminMentor: (mentorData) => api.post('/api/admin/mentors', mentorData),
  updateAdminMentor: (id, mentorData) => api.put(`/api/admin/mentors/${id}`, mentorData),
  deleteAdminMentor: (id) => api.delete(`/api/admin/mentors/${id}`),

  // Mentor-Student Assignment
  assignMentorToStudent: (data) => api.post('/api/admin/assign-mentor', data),
  removeMentorFromStudent: (studentId) => api.delete(`/api/students/${studentId}/mentor`),

  // Batch Management
  getBatches: () => api.get('/api/admin/batches'),
  createBatch: (batchData) => api.post('/api/admin/batches', batchData),
  getBatchStudents: (batchId) => api.get(`/api/admin/batches/${batchId}/students`),
  getBatchMentors: async (batchId) => {
    try {
      //console.log(`Getting mentors for batch ${batchId}`);
      const response = await api.get(`/api/admin/batches/${batchId}/mentors?size=100`);
      //console.log('Batch mentors raw response:', response);

      // Check different possible response formats
      if (Array.isArray(response.data)) {
        //console.log('Batch mentors: data is an array, using directly');
        return { data: response.data };
      }

      // Handle paginated response
      if (response.data && response.data.content && Array.isArray(response.data.content)) {
        //console.log('Batch mentors: Found paginated response with content array');
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
        //console.log('Batch mentors: Found mentors array in response.data.mentors');
        return { data: response.data.mentors };
      }

      // If response.data is not an array but is an object, search for first array property
      if (response.data && typeof response.data === 'object') {
        const keys = Object.keys(response.data);
        for (const key of keys) {
          if (Array.isArray(response.data[key])) {
            //console.log(`Batch mentors: Found array in response.data.${key}`);
            return { data: response.data[key] };
          }
        }
      }

      return { data: [] };
    } catch (error) {
      // Error handling: silently fall back to empty data on auth or not-found errors
      if (error.response?.status === 401 || error.response?.status === 404) {
        try {
          const batchService = require('./batchService').default;
          if (batchService.isMockModeEnabled && batchService.isMockModeEnabled()) {
            return {
              data: [
                { id: '1', firstName: 'Alice', lastName: 'Williams', email: 'alice@example.com', specialization: 'Web Development' },
                { id: '2', firstName: 'David', lastName: 'Brown', email: 'david@example.com', specialization: 'Data Science' }
              ]
            };
          }
        } catch (err) {
          // fallthrough to empty
        }
      }

      // Return empty array to prevent UI crash
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
  // Meeting metrics removed with video call feature cleanup
};

export default api; 