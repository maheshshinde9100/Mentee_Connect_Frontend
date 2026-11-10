import React, { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, BellIcon } from '@heroicons/react/24/outline';
import { notificationService } from '../../services/notificationService';
import NotificationPanel from '../../components/layout/NotificationPanel';

const Communication = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications when the notifications tab is selected
  useEffect(() => {
    if (activeTab === 'notifications') {
      fetchNotifications();
    }
  }, [activeTab]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      if (response && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="mx-auto max-w-2xl text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <ChatBubbleLeftRightIcon className="h-10 w-10" />
            </div>
          </div>

          {/* Title */}
          <h1 className="page-title mb-4">
            Communication Hub Coming Soon!
          </h1>

          {/* Description */}
          <p className="muted mb-8 text-lg">
            We're working hard to bring you an amazing communication experience. 
            Soon you'll be able to connect with mentors and mentees seamlessly.
          </p>

          {/* Features Preview */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="card card-pad text-left">
              <h3 className="section-title mb-2">Real-time Chat</h3>
              <p className="muted">
                Instant messaging between mentors and mentees with file sharing capabilities
              </p>
            </div>

            <div className="card card-pad text-left">
              <h3 className="section-title mb-2">Group Discussions</h3>
              <p className="muted">
                Create and manage topic-based group discussions for better collaboration
              </p>
            </div>

            <div className="card card-pad text-left">
              <h3 className="section-title mb-2">Announcements</h3>
              <p className="muted">
                Broadcast important messages and updates to specific groups or everyone
              </p>
            </div>

          </div>

          {/* Timeline */}
          <div className="card card-pad mt-12">
            <h3 className="section-title mb-4">Expected Timeline</h3>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="font-semibold text-brand-600 dark:text-brand-400">Phase 1</div>
                <div className="muted text-sm">Basic Chat</div>
                <div className="mt-1 text-xs text-gray-400 dark:text-slate-500">Coming in 2 weeks</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-brand-600 dark:text-brand-400">Phase 2</div>
                <div className="muted text-sm">Group Chat</div>
                <div className="mt-1 text-xs text-gray-400 dark:text-slate-500">Coming in 1 month</div>
              </div>
            </div>
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
                      fetchNotifications(); // Refresh the list
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