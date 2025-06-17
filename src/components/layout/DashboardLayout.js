import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  DocumentTextIcon,
  BuildingLibraryIcon,
  EnvelopeIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import NotificationIcon from './NotificationIcon';
import { notificationService } from '../../services/notificationService';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
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
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: ChartBarIcon,
      description: 'Overview and analytics',
    },
    {
      name: 'User Management',
      href: '/admin/user-management',
      icon: UsersIcon,
      description: 'Manage users and roles',
    },
    {
      name: 'Department Management',
      href: '/admin/department-management',
      icon: BuildingLibraryIcon,
      description: 'Manage departments and courses',
    },
    {
      name: 'Batch Management',
      href: '/admin/batch-management',
      icon: AcademicCapIcon,
      description: 'Manage batches and assignments',
    },
    {
      name: 'Mentor Allocation',
      href: '/admin/mentor-allocation',
      icon: UserGroupIcon,
      description: 'Assign mentors to students',
    },
    {
      name: 'Communication',
      href: '/admin/communication',
      icon: ChatBubbleLeftRightIcon,
      description: 'Announcements and messages',
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: DocumentTextIcon,
      description: 'Analytics and reporting',
    },
  ];

  const mentorNavigation = [
    {
      name: 'Dashboard',
      href: '/mentor/dashboard',
      icon: ChartBarIcon,
      description: 'Your overview',
    },
    {
      name: 'My Mentees',
      href: '/mentor/mentees',
      icon: UsersIcon,
      description: 'View and manage mentees',
    },
    {
      name: 'Tasks',
      href: '/mentor/tasks',
      icon: DocumentTextIcon,
      description: 'Manage tasks and goals',
    },
    {
      name: 'Meetings',
      href: '/mentor/meetings',
      icon: CalendarIcon,
      description: 'Schedule and conduct meetings',
    },
    {
      name: 'Attendance',
      href: '/mentor/attendance/record',
      icon: AcademicCapIcon,
      description: 'Record mentee attendance',
    },
    {
      name: 'Updates',
      href: '/mentor/updates',
      icon: ChatBubbleLeftRightIcon,
      description: 'Share resources and updates',
    },
  ];

  const studentNavigation = [
    {
      name: 'Dashboard',
      href: '/student/dashboard',
      icon: ChartBarIcon,
      description: 'Your overview',
    },
    {
      name: 'My Progress',
      href: '/student/progress',
      icon: AcademicCapIcon,
      description: 'Track your progress',
    },
    {
      name: 'Find Mentors',
      href: '/student/mentors',
      icon: UserGroupIcon,
      description: 'Browse available mentors',
    },
    {
      name: 'Join Meeting',
      href: '/student/join-meeting',
      icon: VideoCameraIcon,
      description: 'Join a meeting with your mentor',
    },
    {
      name: 'Certificates',
      href: '/student/certificates',
      icon: DocumentTextIcon,
      description: 'View and manage your certificates',
    },
  ];

  const navigation = user?.role === 'ADMIN' 
    ? adminNavigation 
    : user?.role === 'MENTOR'
    ? mentorNavigation
    : studentNavigation;

  const renderSidebarContent = () => (
    <>
      <div className="flex items-center flex-shrink-0 px-4">
        <MenteeConnectLogo size="sm" showText={false} />

      </div>
      <div className="mt-8">
        <div className="px-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {user?.role?.toLowerCase()}
          </p>
          <div className="mt-2 flex items-center">
            <div className="flex-shrink-0">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  isActive
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-3 py-2 text-sm font-medium border-l-4 hover:bg-gray-50'
                )}
              >
                <item.icon
                  className={classNames(
                    isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <span>{item.name}</span>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                {item.badge && (
                  <span className="bg-red-400 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-2">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex flex-col border-t border-gray-200 p-4 space-y-4">
        {/* Quick Links */}
        <div className="space-y-1">
          <Link
            to="/about"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-indigo-600 hover:bg-indigo-50"
          >
            <UserCircleIcon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
            About
          </Link>
          <Link
            to="/contact"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-indigo-600 hover:bg-indigo-50"
          >
            <EnvelopeIcon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
            Contact
          </Link>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
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
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
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
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
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
        <div className="flex flex-col w-80">
          <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto">
            {renderSidebarContent()}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1"></div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <NotificationIcon />

              {/* Profile dropdown */}
              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
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
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
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
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block w-full text-left px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
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