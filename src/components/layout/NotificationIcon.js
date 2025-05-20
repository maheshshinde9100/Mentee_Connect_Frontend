import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import NotificationPanel from './NotificationPanel';
import { useLocation } from 'react-router-dom';

const NotificationIcon = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const location = useLocation();
  
  // Determine if we're in the dashboard layout by checking the path
  const isDashboard = location.pathname.includes('/admin') || 
                     location.pathname.includes('/mentor') || 
                     location.pathname.includes('/student');
  
  useEffect(() => {
    fetchUnreadCount();
    
    // Set up polling for new notifications
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const fetchUnreadCount = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getUnreadCount();
      if (response && response.data) {
        setUnreadCount(response.data.count || 0);
        console.log('Fetched unread count:', response.data);
      } else {
        console.warn('No data returned from notification service');
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      // Set to 0 on error to prevent displaying incorrect counts
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleNotificationPanel = () => {
    setIsPanelOpen(!isPanelOpen);
    if (!isPanelOpen) {
      fetchUnreadCount(); // Refresh count when opening
    }
  };
  
  const handleClosePanel = () => {
    setIsPanelOpen(false);
    fetchUnreadCount(); // Refresh count after closing
  };
  
  return (
    <div className="relative">
      <button 
        onClick={toggleNotificationPanel}
        className={`relative focus:outline-none ${
          isDashboard 
            ? 'p-1 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' 
            : 'text-white hover:bg-indigo-700 p-2 rounded-full'
        }`}
        aria-label="Notifications"
      >
        {isLoading ? (
          <div className="animate-pulse">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
              />
            </svg>
          </div>
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
            />
          </svg>
        )}
        
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${
            isDashboard ? 'bg-red-400 ring-2 ring-white' : 'bg-red-500'
          }`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      <NotificationPanel isOpen={isPanelOpen} onClose={handleClosePanel} />
    </div>
  );
};

export default NotificationIcon; 