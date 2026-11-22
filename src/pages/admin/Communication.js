import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChatBubbleLeftRightIcon,
  BellIcon,
  PaperAirplaneIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { notificationService } from '../../services/notificationService';
import NotificationPanel from '../../components/layout/NotificationPanel';

const Communication = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      if (response && response.data) {
        setNotifications(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-[80vh] flex-col px-4 py-6">
      {/* Tabs */}
      <div className="mb-6 flex border-b border-gray-200 dark:border-slate-700/70">
        <button
          onClick={() => setActiveTab('overview')}
          className={`tab px-6 py-4 ${activeTab === 'overview' ? 'tab-active' : ''}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`tab flex items-center px-6 py-4 ${activeTab === 'notifications' ? 'tab-active' : ''}`}
        >
          Notifications
          <BellIcon className="ml-1 h-4 w-4" />
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <div>
            <h1 className="page-title">Communication</h1>
            <p className="page-subtitle">
              Send announcements and review everything that has been delivered to your users.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="card card-pad">
              <p className="muted text-sm">Total Notifications</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {loading ? '—' : notifications.length}
              </p>
            </div>
            <div className="card card-pad">
              <p className="muted text-sm">Unread</p>
              <p className="mt-1 text-2xl font-semibold text-brand-600 dark:text-brand-400">
                {loading ? '—' : unreadCount}
              </p>
            </div>
            <div className="card card-pad">
              <p className="muted text-sm">Delivery</p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                In-app notifications
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link to="/admin/notifications" className="card card-pad card-hover block">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <PaperAirplaneIcon className="h-6 w-6" />
              </div>
              <h3 className="section-title mb-1">Send a notification</h3>
              <p className="muted text-sm">
                Broadcast an announcement to every user, or target a single person by name.
              </p>
            </Link>

            <Link to="/admin/notification-management" className="card card-pad card-hover block">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <InboxIcon className="h-6 w-6" />
              </div>
              <h3 className="section-title mb-1">Manage history</h3>
              <p className="muted text-sm">
                Browse the full notification log and remove outdated entries.
              </p>
            </Link>
          </div>

          <div className="card card-pad">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="section-title">Recent notifications</h3>
                <p className="muted text-sm">The last few messages sent by the admin team.</p>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center p-6">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
              </div>
            ) : notifications.length === 0 ? (
              <p className="muted text-sm">No notifications have been sent yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-slate-700/60">
                {notifications.slice(0, 5).map((n) => (
                  <li key={n.id} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900 dark:text-white">
                        {n.title || 'Notification'}
                      </p>
                      <p className="muted mt-0.5 line-clamp-2 text-sm">{n.message}</p>
                    </div>
                    {!n.read && <span className="badge-brand shrink-0">Unread</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="card mx-auto w-full max-w-3xl">
          <h2 className="section-title border-b border-gray-200 p-4 dark:border-slate-700/70">Recent Notifications</h2>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-700/60">
              {/* Embed the NotificationPanel content directly */}
              <NotificationPanel isOpen={true} embedded={true} onClose={() => {}} />

              {/* Mark all as read button */}
              <div className="flex justify-center p-4">
                <button
                  onClick={async () => {
                    try {
                      await notificationService.markAllAsRead();
                      fetchNotifications();
                    } catch (error) {
                      console.error('Error marking notifications as read:', error);
                    }
                  }}
                  className="btn-ghost btn-sm"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Communication;
