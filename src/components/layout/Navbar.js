import React from 'react';
import { Link } from 'react-router-dom';
import NotificationIcon from './NotificationIcon';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-slate-700/70 dark:bg-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">MenteeConnect</span>
          </Link>
          <div className="flex items-center gap-1">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white">
                  Dashboard
                </Link>
                <Link to="/mentors" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white">
                  Find Mentors
                </Link>
                <Link to="/sessions" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white">
                  Sessions
                </Link>
                <Link to="/profile" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white">
                  Profile
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white">
                    Admin
                  </Link>
                )}
                <NotificationIcon />
              </>
            )}
            {!isAuthenticated && (
              <Link to="/login" className="btn-primary btn-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;