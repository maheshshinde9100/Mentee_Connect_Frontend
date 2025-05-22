import React, { useState, useEffect, useRef } from 'react';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../contexts/AuthContext';
import { formatRelativeTime } from '../../utils/dateUtils';
import { Link, useLocation } from 'react-router-dom';

const NotificationPanel = ({ isOpen, onClose, embedded = false }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const panelRef = useRef(null);
  const location = useLocation();
  
  // Determine if we're in the dashboard layout by checking the path
  const isDashboard = location.pathname.includes('/admin') || 
                     location.pathname.includes('/mentor') || 
                     location.pathname.includes('/student');

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen && !embedded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, embedded]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getUserNotifications();
      if (response && response.data) {
        setNotifications(response.data);
        console.log('Fetched notifications:', response.data);
      } else {
        console.warn('No data returned from notification service');
        setNotifications([]);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  if (!isOpen) return null;

  // Content of the notification panel
  const notificationContent = (
    <>
      <div className={`p-3 ${embedded ? 'bg-gray-100' : 'bg-indigo-600 text-white'} flex justify-between items-center`}>
        <h3 className="font-medium">Notifications</h3>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={handleMarkAllAsRead}
            className={`text-xs ${embedded ? 'bg-indigo-600 text-white' : 'bg-indigo-500 hover:bg-indigo-400'} py-1 px-2 rounded`}
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.slice(0, embedded ? 10 : 5).map(notification => (
            <div 
              key={notification.id} 
              className={`p-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="ml-2 text-indigo-600 text-xs hover:text-indigo-800"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {!embedded && (
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <Link 
            to="/notifications"
            className="text-indigo-600 text-sm hover:text-indigo-800"
            onClick={onClose}
          >
            View all notifications
          </Link>
          
          {user?.role === 'ADMIN' && (
            <Link 
              to="/admin/notifications"
              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
              onClick={onClose}
            >
              Send New
            </Link>
          )}
        </div>
      )}
    </>
  );

  // If embedded, return content directly; otherwise wrap in the floating panel
  if (embedded) {
    return notificationContent;
  }

  // Floating panel for header notifications
  return (
    <div 
      ref={panelRef}
      className={`absolute ${isDashboard ? 'right-0 top-12' : 'right-0 mt-2'} w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 max-h-96 overflow-y-auto`}
    >
      {notificationContent}
    </div>
  );
};

export default NotificationPanel; 