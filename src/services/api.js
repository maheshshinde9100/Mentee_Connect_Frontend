import axios from 'axios';

const API_CACHE = new Map();
const CACHE_TTL_MS = 30 * 1000;
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
  if (API_CACHE.size > CACHE_MAX_ENTRIES) {
    const oldest = [...API_CACHE.entries()]
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toRemove = oldest.slice(0, API_CACHE.size - CACHE_MAX_ENTRIES);
    toRemove.forEach(([key]) => API_CACHE.delete(key));
  }
};

export const clearApiCache = () => API_CACHE.clear();

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  API_CACHE.clear();
};

const redirectToLogin = () => {
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (isGetRequest(config) && !config.skipCache) {
      const key = getCacheKey(config);
      const cached = API_CACHE.get(key);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
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

    if (isWriteRequest(config)) {
      API_CACHE.clear();
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
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

    if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !error.response) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      originalConfig &&
      !originalConfig._retry &&
      !originalConfig.url?.includes('/api/auth/login') &&
      !originalConfig.url?.includes('/api/auth/refresh-token')
    ) {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken') || token;

      if (!refreshToken) {
        clearSession();
        redirectToLogin();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalConfig.headers.Authorization = `Bearer ${token}`;
          return api(originalConfig);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalConfig._retry = true;
      isRefreshing = true;

      try {
        let newToken;
        try {
          const response = await api.post('/api/auth/refresh-token', { refreshToken });
          newToken = response.data?.token || response.data?.accessToken;
          if (newToken) {
            localStorage.setItem('token', newToken);
            if (response.data?.refreshToken) {
              localStorage.setItem('refreshToken', response.data.refreshToken);
            }
            processQueue(null, newToken);
          }
        } catch (refreshError) {
          try {
            const ping = await api.get('/api/auth/ping');
            if (ping?.status === 200 && token) {
              newToken = token;
              processQueue(null, newToken);
            } else {
              throw refreshError;
            }
          } catch (_e) {
            processQueue(refreshError, null);
            clearSession();
            redirectToLogin();
            return Promise.reject(refreshError);
          }
        }

        if (newToken) {
          originalConfig.headers.Authorization = `Bearer ${newToken}`;
          return api(originalConfig);
        } else {
          clearSession();
          redirectToLogin();
          return Promise.reject(error);
        }
      } catch (err) {
        clearSession();
        redirectToLogin();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

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

export const mentorService = {
  getAllMentors: (page = 0, size = 20) =>
    api.get('/mentors', { params: { page, size } }),
  createMentor: (mentorData) => api.post('/mentors', mentorData),
  updateMentor: (id, mentorData) => api.put(`/mentors/${id}`, mentorData),
  deleteMentor: (id) => api.delete(`/mentors/${id}`),
  getMentorById: (id) => api.get(`/mentors/${id}`),
  getCurrentMentor: () => api.get('/mentors/me'),
  getMentorStudents: (id) => api.get(`/mentors/${id}/students`),
  getMyStudents: () => api.get('/mentors/me/students'),
  checkMentorSlots: (id) => api.get(`/mentors/${id}/slots`),
  createTask: (mentorId, taskData) =>
    api.post(`/mentors/${mentorId}/tasks`, taskData),
  getMentorTasks: (mentorId) =>
    api.get(`/mentors/${mentorId}/tasks`),
  getMyTasks: () => api.get('/mentors/me/tasks'),
  getStudentTasks: (mentorId, studentId) =>
    api.get(`/mentors/${mentorId}/students/${studentId}/tasks`),
  updateTask: (taskId, taskData) =>
    api.put(`/mentors/tasks/${taskId}`, taskData),
  deleteTask: (taskId) => api.delete(`/mentors/tasks/${taskId}`),
  getMentorUpdates: (mentorId, page = 0, size = 20) =>
    api.get(`/mentors/${mentorId}/updates`, { params: { page, size } }),
  createMentorUpdate: (mentorId, updateData) =>
    api.post(`/mentors/${mentorId}/updates`, updateData),
  getMentorAttendance: (mentorId, page = 0, size = 20) =>
    api.get(`/mentors/${mentorId}/attendance`, { params: { page, size } }),
  markAttendance: (mentorId, attendanceData) =>
    api.post(`/mentors/${mentorId}/attendance`, attendanceData),
  updateStudentAsMentor: (mentorId, studentId, updateData) =>
    api.put(`/mentors/${mentorId}/students/${studentId}`, updateData),
  getMenteeDetails: (mentorId, studentId) =>
    api.get(`/mentors/${mentorId}/students/${studentId}`),
  updateMenteeDetails: (mentorId, studentId, updateData) =>
    api.put(`/mentors/${mentorId}/students/${studentId}/update`, updateData)
};

export const adminService = {
  getAllUsers: () => api.get('/api/admin/users'),
  searchUsers: (name) => api.get(`/api/admin/users/search?name=${name}`),
  deleteUser: (userId) => api.delete(`/api/admin/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/api/admin/users/${userId}`, userData),
  getAnalytics: () => api.get('/api/admin/analytics', { skipCache: true }),

  getAdminStudents: (page = 0, size = 20) =>
    api.get('/api/admin/students', { params: { page, size } }),
  createAdminStudent: (studentData) => api.post('/api/admin/students', studentData),
  updateAdminStudent: (id, studentData) => api.put(`/api/admin/students/${id}`, studentData),
  deleteAdminStudent: (id) => api.delete(`/api/admin/students/${id}`),

  getAdminMentors: (page = 0, size = 20) =>
    api.get('/api/admin/mentors', { params: { page, size } }),
  createAdminMentor: (mentorData) => api.post('/api/admin/mentors', mentorData),
  updateAdminMentor: (id, mentorData) => api.put(`/api/admin/mentors/${id}`, mentorData),
  deleteAdminMentor: (id) => api.delete(`/api/admin/mentors/${id}`),

  assignMentorToStudent: (data) => api.post('/api/admin/assign-mentor', data),
  removeMentorFromStudent: (studentId) => api.delete(`/api/students/${studentId}/mentor`),

  getBatches: () => api.get('/api/admin/batches'),
  createBatch: (batchData) => api.post('/api/admin/batches', batchData),
  getBatchStudents: (batchId) => api.get(`/api/admin/batches/${batchId}/students`),
  getBatchMentors: async (batchId) => {
    try {
      const response = await api.get(`/api/admin/batches/${batchId}/mentors?size=100`);

      if (Array.isArray(response.data)) {
        return { data: response.data };
      }

      if (response.data && response.data.content && Array.isArray(response.data.content)) {
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

      if (response.data && response.data.mentors && Array.isArray(response.data.mentors)) {
        return { data: response.data.mentors };
      }

      if (response.data && typeof response.data === 'object') {
        const keys = Object.keys(response.data);
        for (const key of keys) {
          if (Array.isArray(response.data[key])) {
            return { data: response.data[key] };
          }
        }
      }

      return { data: [] };
    } catch (error) {
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
        }
      }

      return { data: [] };
    }
  },
  assignStudentsToBatch: (batchId, studentIds) =>
    api.post('/api/admin/batches/assign-students', { batchId, studentIds }),
  assignMentorToBatch: (batchId, mentorIds) =>
    api.post('/api/admin/batches/assign-mentor', { batchId, mentorIds }),
  updateBatch: (batchId, batchData) =>
    api.put(`/api/admin/batches/${batchId}`, batchData),

  getMentorEngagement: () => api.get('/api/admin/analytics/mentor-engagement'),
  getStudentProgress: () => api.get('/api/admin/analytics/student-progress'),
};

export default api; 