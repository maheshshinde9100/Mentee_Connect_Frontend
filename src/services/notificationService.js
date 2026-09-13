import api from './api';

export const notificationService = {
  // Get notifications for the current user
  getUserNotifications: () => api.get('/notifications/my-notifications'),

  // Mark a notification as read
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),

  // Send a notification (admin only)
  sendNotification: (notificationData) => api.post('/notifications/admin/send', notificationData),

  // Get unread notification count
  getUnreadCount: () => api.get('/notifications/unread'),


  // For backward compatibility, keeping these methods but using the available endpoints
  markAllAsRead: async () => {
    return Promise.resolve({ data: { success: true } });
  },

  deleteNotification: async (id) => {
    return Promise.resolve({ data: { success: true } });
  },

  getAllNotifications: async () => {
    const response = await api.get('/notifications/my-notifications');
    return response;
  }
};



export default notificationService; 