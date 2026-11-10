import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import { notificationService } from '../../services/notificationService';
import NotificationPanel from './NotificationPanel';

const NotificationIcon = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const location = useLocation();

  const isDashboard =
    location.pathname.includes('/admin') ||
    location.pathname.includes('/mentor') ||
    location.pathname.includes('/student');

  const fetchUnreadCount = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getUnreadCount();
      if (response && response.data) {
        setUnreadCount(response.data.count || 0);
      } else {
        setUnreadCount(0);
      }
    } catch (error) {
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotificationPanel = () => {
    setIsPanelOpen(!isPanelOpen);
    fetchUnreadCount();
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    fetchUnreadCount();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleNotificationPanel}
        className={isDashboard ? 'btn-icon relative' : 'relative rounded-lg p-2 text-white transition-colors hover:bg-white/10'}
        aria-label="Notifications"
      >
        <BellIcon className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white dark:ring-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationPanel isOpen={isPanelOpen} onClose={handleClosePanel} />
    </div>
  );
};

export default NotificationIcon;
