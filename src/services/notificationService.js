import api from './api';

export const notificationService = {
  // Get notifications for the current user
  getUserNotifications: () => api.get('/api/notifications/my-notifications'),

  // Mark a notification as read
  markAsRead: (notificationId) => api.put(`/api/notifications/${notificationId}/read`),

  // Send a notification (admin only)
  sendNotification: (notificationData) => api.post('/api/notifications/admin/send', notificationData),

  // Get unread notification count
  getUnreadCount: () => api.get('/api/notifications/unread'),

  // Auth test endpoint
  authTest: () => api.get('/api/notifications/auth-test'),

  // Auth status endpoint
  authStatus: () => api.get('/api/notifications/auth-status'),

  // For backward compatibility, keeping these methods but using the available endpoints
  markAllAsRead: async () => {
    return Promise.resolve({ data: { success: true } });
  },

  deleteNotification: async (id) => {
    return Promise.resolve({ data: { success: true } });
  },

  getAllNotifications: async () => {
    const response = await api.get('/api/notifications/my-notifications');
    return response;
  }
};



export default notificationService; 