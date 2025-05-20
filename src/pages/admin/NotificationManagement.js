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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notification Management</h1>
        <Link
          to="/admin/notifications"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Send New Notification
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No notifications have been sent yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="mr-2">Sent to: {notification.recipientType}</span>
                        <span className="mr-2">•</span>
                        <span>{formatDateTime(notification.createdAt)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="ml-2 text-sm text-red-600 hover:text-red-900"
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