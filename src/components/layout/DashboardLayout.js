import React, { Fragment, Suspense, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import PageLoader from '../common/PageLoader';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Dialog, Menu, Transition } from '@headlessui/react';
import MenteeConnectLogo from '../../MenteeConnectLogo';
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  UsersIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  BuildingLibraryIcon,
  LifebuoyIcon,
  SunIcon,
  MoonIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import NotificationIcon from './NotificationIcon';
import { notificationService } from '../../services/notificationService';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const DashboardLayout = () => {
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
    const intervalId = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
    { name: 'User Management', href: '/admin/user-management', icon: UsersIcon },
    { name: 'Departments', href: '/admin/department-management', icon: BuildingLibraryIcon },
    { name: 'Batches', href: '/admin/batch-management', icon: AcademicCapIcon },
    { name: 'Mentor Allocation', href: '/admin/mentor-allocation', icon: UserGroupIcon },
    { name: 'Communication', href: '/admin/communication', icon: ChatBubbleLeftRightIcon, badge: unreadCount > 0 ? unreadCount : null },
    { name: 'Add People', href: '/admin/manage-mentors-mentees', icon: UsersIcon },
    { name: 'Video Calls', href: '/admin/video-calls', icon: VideoCameraIcon },
    { name: 'Reports', href: '/admin/analytics', icon: DocumentTextIcon },
  ];

  const mentorNavigation = [
    { name: 'Dashboard', href: '/mentor/dashboard', icon: ChartBarIcon },
    { name: 'My Mentees', href: '/mentor/mentees', icon: UsersIcon },
    { name: 'Tasks', href: '/mentor/tasks', icon: DocumentTextIcon },
    { name: 'Attendance', href: '/mentor/attendance/record', icon: AcademicCapIcon },
    { name: 'Updates', href: '/mentor/updates', icon: ChatBubbleLeftRightIcon },
    { name: 'Video Calls', href: '/mentor/video-calls', icon: VideoCameraIcon },
  ];

  const studentNavigation = [
    { name: 'Dashboard', href: '/student/dashboard', icon: ChartBarIcon },
    { name: 'My Progress', href: '/student/progress', icon: AcademicCapIcon },
    { name: 'Find Mentors', href: '/student/mentors', icon: UserGroupIcon },
    { name: 'Certificates', href: '/student/certificates', icon: DocumentTextIcon },
  ];

  const navigation =
    user?.role === 'ADMIN' ? adminNavigation : user?.role === 'MENTOR' ? mentorNavigation : studentNavigation;

  const currentTitle = (() => {
    const segment = location.pathname.split('/').filter(Boolean).pop() || 'Dashboard';
    return segment.replace(/-/g, ' ');
  })();

  const renderSidebarContent = () => (
    <>
      <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-200 px-5 dark:border-slate-700/70">
        <Link to="/" className="flex items-center">
          <MenteeConnectLogo size="sm" />
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                isActive
                  ? 'bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                  : 'font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-700/40 dark:hover:text-white',
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors'
              )}
            >
              <item.icon
                className={classNames(
                  'h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-gray-400 group-hover:text-gray-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                )}
                aria-hidden="true"
              />
              <span className="flex-1 truncate">{item.name}</span>
              {item.badge && (
                <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1.5 text-[10px] font-semibold text-white">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex-shrink-0 space-y-3 border-t border-gray-200 p-3 dark:border-slate-700/70">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-slate-700/70 dark:bg-slate-800">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-semibold text-white">
            {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-xs capitalize text-gray-500 dark:text-slate-400">
              {user?.role?.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Link
            to="/about"
            className="flex flex-1 items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-700/40 dark:hover:text-white"
          >
            <LifebuoyIcon className="h-4 w-4" />
            Help
          </Link>
          <button
            onClick={handleLogout}
            className="flex flex-1 items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 transition-colors duration-200 dark:bg-slate-900">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-40 flex md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm dark:bg-black/70" />
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
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white shadow-xl dark:bg-slate-900">
              <div className="absolute right-0 top-0 -mr-12 pt-3">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white focus:outline-none"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              {renderSidebarContent()}
            </div>
          </Transition.Child>
          <div className="w-14 flex-shrink-0" aria-hidden="true" />
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex w-64 flex-col border-r border-gray-200 bg-white transition-colors duration-200 dark:border-slate-700/70 dark:bg-slate-900">
          {renderSidebarContent()}
        </div>
      </div>

      {/* Main content */}
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <header className="relative z-10 flex h-16 flex-shrink-0 items-center border-b border-gray-200 bg-white/80 backdrop-blur-md transition-colors duration-200 dark:border-slate-700/70 dark:bg-slate-900/80">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none md:hidden dark:text-slate-400"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 items-center justify-between px-4 sm:px-6">
            <h1 className="text-base font-semibold capitalize text-gray-900 transition-colors duration-200 dark:text-white">
              {currentTitle}
            </h1>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="btn-icon"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle theme"
              >
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>

              <NotificationIcon />

              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center rounded-lg focus:outline-none">
                  <span className="sr-only">Open user menu</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-semibold text-white">
                    {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white py-1 shadow-lg focus:outline-none dark:border-slate-700 dark:bg-slate-800">
                    <div className="border-b border-gray-100 px-4 py-3 dark:border-slate-700">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900 dark:bg-slate-700/60 dark:text-white'
                              : 'text-gray-700 dark:text-slate-300',
                            'block px-4 py-2 text-sm transition-colors'
                          )}
                        >
                          Your profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/notifications"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900 dark:bg-slate-700/60 dark:text-white'
                              : 'text-gray-700 dark:text-slate-300',
                            'block px-4 py-2 text-sm transition-colors'
                          )}
                        >
                          Notifications
                        </Link>
                      )}
                    </Menu.Item>
                    <div className="mt-1 border-t border-gray-100 dark:border-slate-700">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={classNames(
                              active
                                ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                                : 'text-gray-700 dark:text-slate-300',
                              'block w-full px-4 py-2 text-left text-sm transition-colors'
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
        </header>

        <main className="relative flex-1 overflow-y-auto bg-gray-50 focus:outline-none dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
