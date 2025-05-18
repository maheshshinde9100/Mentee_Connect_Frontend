import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh-token', { refreshToken });
          const { token } = response.data;
          localStorage.setItem('token', token);
          
          // Retry the original request
          const config = error.config;
          config.headers.Authorization = `Bearer ${token}`;
          return api(config);
        } catch (refreshError) {
          // If refresh token fails, logout
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } else {
        // No refresh token available, logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
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

// Batch Services
export const batchService = {
  getAllBatches: () => api.get('/batches'),
  createBatch: (batchData) => api.post('/batches', batchData),
  updateBatch: (id, batchData) => api.put(`/batches/${id}`, batchData),
  assignMentor: (id, mentorData) => api.post(`/batches/${id}/assign-mentor`, mentorData),
  assignStudents: (id, studentData) => api.post(`/batches/${id}/assign-students`, studentData)
};

// Admin Services
export const adminService = {
  // Student Management
  getAdminStudents: () => api.get('/admin/students'),
  createAdminStudent: (studentData) => api.post('/admin/students', studentData),
  updateAdminStudent: (id, studentData) => api.put(`/admin/students/${id}`, studentData),
  deleteAdminStudent: (id) => api.delete(`/admin/students/${id}`),
  
  // Mentor Management
  getAdminMentors: () => api.get('/admin/mentors'),
  createAdminMentor: (mentorData) => api.post('/admin/mentors', mentorData),
  
  // Batch Management
  getBatchStudents: (id) => api.get(`/admin/batches/${id}/students`),
  assignMentorToStudent: (data) => api.post('/admin/assign-mentor', data),
  createAdminBatch: (batchData) => api.post('/admin/batches', batchData),
  
  // Analytics
  getMentorEngagement: () => api.get('/admin/analytics/mentor-engagement'),
  getStudentProgress: () => api.get('/admin/analytics/student-progress'),
  getMeetingMetrics: () => api.get('/admin/analytics/meeting-metrics')
};

// Meeting Services
export const meetingService = {
  getAllMeetings: () => api.get('/meetings'),
  getMeetingsByMentor: (mentorId) => api.get(`/meetings/mentor/${mentorId}`)
};

export default api; 