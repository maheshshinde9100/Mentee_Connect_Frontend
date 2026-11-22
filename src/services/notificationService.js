import api from './api';

export const notificationService = {
  getUserNotifications: () => api.get('/notifications/my-notifications'),
  getNotifications: () => api.get('/notifications/my-notifications'),
  getAllNotifications: () => api.get('/notifications/my-notifications'),

  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),

  getUnreadNotifications: () => api.get('/notifications/unread'),
  getUnreadCount: () => api.get('/notifications/unread-count'),

  sendNotification: (notificationData) =>
    api.post('/notifications/admin/send', notificationData),

  deleteNotification: (notificationId) =>
    api.delete(`/notifications/${notificationId}`),
};

export default notificationService;
