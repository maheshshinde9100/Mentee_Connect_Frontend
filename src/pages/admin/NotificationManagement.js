import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';
import { formatDateTime } from '../../utils/dateUtils';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  const fetchAllNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getAllNotifications();
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await notificationService.deleteNotification(id);
        setNotifications(notifications.filter(notification => notification.id !== id));
      } catch (err) {
        console.error('Error deleting notification:', err);
        alert('Failed to delete notification');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Notification Management</h1>
        <Link
          to="/admin/notifications"
          className="btn-primary"
        >
          Send New Notification
        </Link>
      </div>

      {error && (
        <div className="alert-error mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="card py-10 text-center">
          <p className="muted">No notifications have been sent yet.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <ul className="divide-y divide-gray-100 dark:divide-slate-700/60">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">{notification.title}</h3>
                      <p className="muted mt-1 text-sm">{notification.message}</p>
                      <div className="muted mt-2 flex items-center text-sm">
                        <span className="mr-2">Sent to: {notification.recipientType}</span>
                        <span className="mr-2">•</span>
                        <span>{formatDateTime(notification.createdAt)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="ml-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationManagement; 