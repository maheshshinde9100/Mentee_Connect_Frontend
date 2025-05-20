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
    console.warn('markAllAsRead is not available in the backend API');
    return Promise.resolve({ data: { success: true } });
  },
  
  deleteNotification: async (id) => {
    console.warn('deleteNotification is not available in the backend API');
    return Promise.resolve({ data: { success: true } });
  },
  
  getAllNotifications: async () => {
    console.warn('getAllNotifications is not available, using my-notifications instead');
    const response = await api.get('/api/notifications/my-notifications');
    return response;
  }
};

// For debug purposes, log the endpoints
console.log('Notification service endpoints:', {
  getUserNotifications: '/api/notifications/my-notifications',
  getUnreadCount: '/api/notifications/unread',
  authTest: '/api/notifications/auth-test',
  authStatus: '/api/notifications/auth-status',
  sendNotification: '/api/notifications/admin/send'
});

export default notificationService; 