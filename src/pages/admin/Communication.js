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
    <div className="min-h-[80vh] flex flex-col px-4 bg-gray-50">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`py-4 px-6 text-sm font-medium ${
            activeTab === 'overview' 
              ? 'border-b-2 border-indigo-500 text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`py-4 px-6 text-sm font-medium flex items-center ${
            activeTab === 'notifications' 
              ? 'border-b-2 border-indigo-500 text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Notifications
          <BellIcon className="ml-1 h-4 w-4" />
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <div className="text-center max-w-2xl mx-auto">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <ChatBubbleLeftRightIcon className="w-24 h-24 text-indigo-600 animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <span className="flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Communication Hub Coming Soon!
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8">
            We're working hard to bring you an amazing communication experience. 
            Soon you'll be able to connect with mentors and mentees seamlessly.
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Chat</h3>
              <p className="text-gray-600">
                Instant messaging between mentors and mentees with file sharing capabilities
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Group Discussions</h3>
              <p className="text-gray-600">
                Create and manage topic-based group discussions for better collaboration
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Announcements</h3>
              <p className="text-gray-600">
                Broadcast important messages and updates to specific groups or everyone
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Meetings</h3>
              <p className="text-gray-600">
                Schedule and conduct video meetings with screen sharing support
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expected Timeline</h3>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-indigo-600 font-semibold">Phase 1</div>
                <div className="text-sm text-gray-600">Basic Chat</div>
                <div className="text-xs text-gray-500">Coming in 2 weeks</div>
              </div>
              <div className="text-center">
                <div className="text-indigo-600 font-semibold">Phase 2</div>
                <div className="text-sm text-gray-600">Group Chat</div>
                <div className="text-xs text-gray-500">Coming in 1 month</div>
              </div>
              <div className="text-center">
                <div className="text-indigo-600 font-semibold">Phase 3</div>
                <div className="text-sm text-gray-600">Video Calls</div>
                <div className="text-xs text-gray-500">Coming in 2 months</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto w-full bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium p-4 border-b">Recent Notifications</h2>
          
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {/* Embed the NotificationPanel content directly */}
              <NotificationPanel isOpen={true} embedded={true} onClose={() => {}} />
              
              {/* Mark all as read button */}
              <div className="p-4 flex justify-center">
                <button 
                  onClick={async () => {
                    try {
                      await notificationService.markAllAsRead();
                      fetchNotifications(); // Refresh the list
                    } catch (error) {
                      console.error('Error marking notifications as read:', error);
                    }
                  }}
                  className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
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