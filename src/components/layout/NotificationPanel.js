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
        
      } else {
        
        setNotifications([]);
      }
    } catch (error) {
      
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
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-100 dark:divide-slate-700/60">
        {loading ? (
          <div className="p-6 text-center text-sm text-gray-500 dark:text-slate-400">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500 dark:text-slate-400">
            You have no notifications
          </div>
        ) : (
          notifications.slice(0, embedded ? 10 : 5).map((notification) => (
            <div
              key={notification.id}
              className={`p-4 transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/30 ${
                !notification.read ? 'bg-brand-50/60 dark:bg-brand-500/5' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {notification.message}
                  </p>
                  <p className="mt-1.5 text-xs text-gray-400 dark:text-slate-500">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="whitespace-nowrap text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
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
        <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
          <Link
            to="/notifications"
            className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            onClick={onClose}
          >
            View all
          </Link>

          {user?.role === 'ADMIN' && (
            <Link
              to="/admin/notifications"
              className="btn-primary btn-sm"
              onClick={onClose}
            >
              Send new
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
      className={`absolute ${
        isDashboard ? 'right-0 top-12' : 'right-0 mt-2'
      } z-30 max-h-96 w-80 overflow-hidden overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800`}
    >
      {notificationContent}
    </div>
  );
};

export default NotificationPanel; 