import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Dialog, Menu, Transition } from '@headlessui/react';
import MenteeConnectLogo from '../../MenteeConnectLogo';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  UsersIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  BuildingLibraryIcon,
  EnvelopeIcon,
  SunIcon,
  MoonIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import NotificationIcon from './NotificationIcon';
import { notificationService } from '../../services/notificationService';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await notificationService.getUnreadCount();
        if (response && response.data) {
          setUnreadCount(response.data.count || 0);
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
        setUnreadCount(0);
      }
    };

    fetchUnreadCount();

    // Refresh unread count every 30 seconds
    const intervalId = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon, description: 'Overview' },
    { name: 'User Management', href: '/admin/user-management', icon: UsersIcon, description: 'Manage users' },
    { name: 'Department Management', href: '/admin/department-management', icon: BuildingLibraryIcon, description: 'Departments' },
    { name: 'Batch Management', href: '/admin/batch-management', icon: AcademicCapIcon, description: 'Batches' },
    { name: 'Mentor Allocation', href: '/admin/mentor-allocation', icon: UserGroupIcon, description: 'Allocations' },
    { name: 'Communication', href: '/admin/communication', icon: ChatBubbleLeftRightIcon, description: 'Messages', badge: unreadCount > 0 ? unreadCount : null },
    { name: 'Reports', href: '/admin/reports', icon: DocumentTextIcon, description: 'Analytics' },
    { name: 'Video Calls', href: '/admin/video-calls', icon: VideoCameraIcon, description: 'Call history' },
    { name: 'Add Mentors & Students', href: '/admin/manage-mentors-mentees', icon: UsersIcon, description: 'Create users' },
  ];

  const mentorNavigation = [
    { name: 'Dashboard', href: '/mentor/dashboard', icon: ChartBarIcon, description: 'Overview' },
    { name: 'My Mentees', href: '/mentor/mentees', icon: UsersIcon, description: 'Mentees' },
    { name: 'Tasks', href: '/mentor/tasks', icon: DocumentTextIcon, description: 'Tasks' },
    { name: 'Attendance', href: '/mentor/attendance/record', icon: AcademicCapIcon, description: 'Attendance' },
    { name: 'Updates', href: '/mentor/updates', icon: ChatBubbleLeftRightIcon, description: 'Updates' },
    { name: 'Video Calls', href: '/mentor/video-calls', icon: VideoCameraIcon, description: 'Call history' },
  ];

  const studentNavigation = [
    { name: 'Dashboard', href: '/student/dashboard', icon: ChartBarIcon, description: 'Overview' },
    { name: 'My Progress', href: '/student/progress', icon: AcademicCapIcon, description: 'Progress' },
    { name: 'Find Mentors', href: '/student/mentors', icon: UserGroupIcon, description: 'Mentors' },
    { name: 'Certificates', href: '/student/certificates', icon: DocumentTextIcon, description: 'Certificates' },
  ];

  const navigation = user?.role === 'ADMIN'
    ? adminNavigation
    : user?.role === 'MENTOR'
      ? mentorNavigation
      : studentNavigation;

  const renderSidebarContent = () => (
    <>
      <div className="flex items-center flex-shrink-0 px-6 pt-4 pb-2">
        <MenteeConnectLogo size="sm" showText={true} variant={darkMode ? 'sidebar' : 'default'} />
      </div>

      {/* User Profile Summary */}
      <div className="mt-6 px-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm transition-colors duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-500 dark:text-indigo-300 truncate capitalize">
                {user?.role?.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white border-transparent',
                'group flex items-center px-3 py-3 text-sm font-medium rounded-xl border-l-4 transition-all duration-200 mb-1'
              )}
            >
              <item.icon
                className={classNames(
                  isActive ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400',
                  'mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-200'
                )}
                aria-hidden="true"
              />
              <div className="flex-1">
                <span className="block">{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center ml-2 shadow-sm">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-800 p-4 space-y-2 mt-auto bg-white dark:bg-slate-900 transition-colors duration-200">
        {/* Quick Links */}
        <div className="space-y-1 mb-4">
          <Link
            to="/about"
            className="group flex items-center px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-xl hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
          >
            <UserCircleIcon className="mr-3 flex-shrink-0 h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
            About
          </Link>
          <Link
            to="/contact"
            className="group flex items-center px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-xl hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
          >
            <EnvelopeIcon className="mr-3 flex-shrink-0 h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
            Contact
          </Link>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 group"
        >
          <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-slate-600 bg-opacity-75 dark:bg-slate-900/80 backdrop-blur-sm" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white dark:bg-slate-900 shadow-2xl">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              {renderSidebarContent()}
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className="flex flex-col flex-grow bg-white dark:bg-slate-900 overflow-y-auto border-r border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors duration-200">
            {renderSidebarContent()}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
          <button
            type="button"
            className="px-4 border-r border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-slate-800 dark:text-white capitalize transition-colors duration-200">
                {location.pathname.split('/').pop().replace(/-/g, ' ')}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
              </button>

              {/* Notifications */}
              <NotificationIcon />

              {/* Profile dropdown */}
              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="max-w-xs bg-white dark:bg-slate-800 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:ring-2 hover:ring-indigo-200 dark:hover:ring-indigo-800">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none border border-slate-100 dark:border-slate-700">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm text-slate-900 dark:text-white font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={classNames(
                            active ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300',
                            'block px-4 py-2 text-sm transition-colors'
                          )}
                        >
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/settings"
                          className={classNames(
                            active ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300',
                            'block px-4 py-2 text-sm transition-colors'
                          )}
                        >
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <div className="border-t border-slate-100 dark:border-slate-700 mt-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={classNames(
                              active ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'text-slate-700 dark:text-slate-300',
                              'block w-full text-left px-4 py-2 text-sm transition-colors'
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;