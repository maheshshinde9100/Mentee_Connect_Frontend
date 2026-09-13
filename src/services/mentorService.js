import api from './api';

export const mentorService = {
  // Profile Management
  getCurrentProfile: () => api.get('/mentors/me'),
  getMentorById: (id) => api.get(`/mentors/${id}`),
  updateProfile: (id, profileData) => api.put(`/mentors/${id}`, profileData),

  // Student Management
  getMyStudents: () => api.get('/mentors/me/students'),
  getMentorStudents: (id) => api.get(`/mentors/${id}/students`),
  getStudentDetails: (mentorId, studentId) => api.get(`/mentors/${mentorId}/students/${studentId}`),
  updateStudentInfo: (mentorId, studentId, studentData) => api.put(`/mentors/${mentorId}/students/${studentId}/update`, studentData),

  // Task Management
  createTask: (mentorId, taskData) => api.post(`/mentors/${mentorId}/tasks`, taskData),
  assignTask: (mentorId, taskData) => api.post(`/mentors/${mentorId}/tasks`, taskData),
  getMyTasks: () => api.get('/mentors/me/tasks'),
  getAssignedTasks: (mentorId) => api.get(`/mentors/${mentorId}/tasks`),
  getStudentTasks: (mentorId, studentId) => api.get(`/mentors/${mentorId}/students/${studentId}/tasks`),
  updateTask: (taskId, taskData) => api.put(`/mentors/tasks/${taskId}`, taskData),
  deleteTask: (taskId) => api.delete(`/mentors/tasks/${taskId}`),

  // Updates & Resources
  shareUpdate: (mentorId, updateData) => api.post(`/mentors/${mentorId}/updates`, updateData),
  getMySharedUpdates: (mentorId) => api.get(`/mentors/${mentorId}/updates`),
  getStudentUpdates: (mentorId, studentId) => api.get(`/mentors/${mentorId}/students/${studentId}/updates`),
  deleteUpdate: (updateId) => api.delete(`/mentors/updates/${updateId}`),
  editUpdate: (updateId, updateData) => api.put(`/mentors/updates/${updateId}`, updateData),

  // Attendance System
  recordAttendance: (mentorId, attendanceData) => api.post(`/mentors/${mentorId}/attendance`, attendanceData),
  getAttendance: (mentorId) => api.get(`/mentors/${mentorId}/attendance`),
  getStudentAttendance: (mentorId, studentId) => api.get(`/mentors/${mentorId}/students/${studentId}/attendance`),
  updateAttendance: (attendanceId, attendanceData) => api.put(`/mentors/attendance/${attendanceId}`, attendanceData),
  deleteAttendance: (attendanceId) => api.delete(`/mentors/attendance/${attendanceId}`),

  // Video Calls
  startVideoCall: (mentorId, payload) => api.post(`/mentors/${mentorId}/video-calls/start`, payload),
  endVideoCall: (mentorId, callId) => api.post(`/mentors/${mentorId}/video-calls/${callId}/end`),
  getVideoCalls: (mentorId) => api.get(`/mentors/${mentorId}/video-calls`)
};

export default mentorService; 