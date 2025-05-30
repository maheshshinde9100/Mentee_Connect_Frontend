import api from './api';

export const mentorService = {
  // Profile Management
  getCurrentProfile: () => api.get('/api/mentors/me'),
  getMentorById: (id) => api.get(`/api/mentors/${id}`),
  updateProfile: (id, profileData) => api.put(`/api/mentors/${id}`, profileData),

  // Student Management
  getMyStudents: (id) => api.get(`/api/mentors/${id}/students`),
  getStudentDetails: (mentorId, studentId) => api.get(`/api/mentors/${mentorId}/students/${studentId}`),
  updateStudentInfo: (mentorId, studentId, studentData) => api.put(`/api/mentors/${mentorId}/students/${studentId}/update`, studentData),
  
  // Meeting Management
  getMyMeetings: (id) => api.get(`/api/mentors/${id}/meetings`),
  getAvailableSlots: (id) => api.get(`/api/mentors/${id}/slots`),
  
  // Task Management
  assignTask: (mentorId, taskData) => api.post(`/api/mentors/${mentorId}/tasks`, taskData),
  getAssignedTasks: (mentorId) => api.get(`/api/mentors/${mentorId}/tasks`),
  getStudentTasks: (mentorId, studentId) => api.get(`/api/mentors/${mentorId}/students/${studentId}/tasks`),
  updateTask: (taskId, taskData) => api.put(`/api/mentors/tasks/${taskId}`, taskData),
  deleteTask: (taskId) => api.delete(`/api/mentors/tasks/${taskId}`),
  
  // Updates & Resources
  shareUpdate: (mentorId, updateData) => api.post(`/api/mentors/${mentorId}/updates`, updateData),
  getMySharedUpdates: (mentorId) => api.get(`/api/mentors/${mentorId}/updates`),
  getStudentUpdates: (mentorId, studentId) => api.get(`/api/mentors/${mentorId}/students/${studentId}/updates`),
  deleteUpdate: (updateId) => api.delete(`/api/mentors/updates/${updateId}`),
  editUpdate: (updateId, updateData) => api.put(`/api/mentors/updates/${updateId}`, updateData),
  
  // Attendance System
  recordAttendance: (mentorId, attendanceData) => api.post(`/api/mentors/${mentorId}/attendance`, attendanceData),
  getAttendance: (mentorId) => api.get(`/api/mentors/${mentorId}/attendance`),
  getStudentAttendance: (mentorId, studentId) => api.get(`/api/mentors/${mentorId}/students/${studentId}/attendance`),
  updateAttendance: (attendanceId, attendanceData) => api.put(`/api/mentors/attendance/${attendanceId}`, attendanceData),
  deleteAttendance: (attendanceId) => api.delete(`/api/mentors/attendance/${attendanceId}`)
};

export default mentorService; 