import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin Services
export const adminService = {
  // Batch Management
  createBatch: (batchData) => api.post('/admin/batches', batchData),
  getBatches: () => api.get('/admin/batches'),
  addStudentsToBatch: (batchId, students) => api.post(`/admin/batches/${batchId}/students`, students),
  
  // Mentor Allocation
  allocateMentor: (mentorId, studentIds) => api.post(`/admin/allocate-mentor/${mentorId}`, { studentIds }),
  getMentorAllocations: () => api.get('/admin/mentor-allocations'),
  
  // User Management
  getAllUsers: () => api.get('/admin/users'),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  
  // Notifications
  sendAdminNotification: (notification) => api.post('/admin/notifications', notification),
};

// Mentor Services
export const mentorService = {
  // Task Management
  createTask: (task) => api.post('/mentor/tasks', task),
  getTasks: () => api.get('/mentor/tasks'),
  updateTask: (taskId, taskData) => api.put(`/mentor/tasks/${taskId}`, taskData),
  
  // Meeting Management
  scheduleMeeting: (meetingData) => api.post('/mentor/meetings', meetingData),
  getMeetings: () => api.get('/mentor/meetings'),
  
  // Notifications
  sendNoticeToStudents: (notice) => api.post('/mentor/notices', notice),
  getNotifications: () => api.get('/mentor/notifications'),
  
  // Student Management
  getAssignedStudents: () => api.get('/mentor/students'),
  updateStudentProgress: (studentId, progress) => api.put(`/mentor/students/${studentId}/progress`, progress),
};

// Student Services
export const studentService = {
  // Profile Management
  updateProfile: (profileData) => api.put('/student/profile', profileData),
  addSkill: (skill) => api.post('/student/skills', skill),
  getSkills: () => api.get('/student/skills'),
  
  // Mentor Information
  getAssignedMentor: () => api.get('/student/mentor'),
  
  // Meetings
  getMentorMeetings: () => api.get('/student/meetings'),
  confirmMeetingAttendance: (meetingId, status) => api.put(`/student/meetings/${meetingId}/attendance`, { status }),
  
  // Notifications
  getNotifications: () => api.get('/student/notifications'),
};

// Common Services
export const commonService = {
  updatePersonalDetails: (details) => api.put('/users/profile', details),
  getProfile: () => api.get('/users/profile'),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
};

export default api; 