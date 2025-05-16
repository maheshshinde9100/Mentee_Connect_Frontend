import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import TaskManagement from './TaskManagement';
import MeetingScheduler from './MeetingScheduler';

const MentorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - In real app, this would come from your Spring Boot backend
  const stats = {
    totalMentees: 12,
    completedSessions: 48,
    upcomingSessions: 3,
    averageRating: 4.8
  };

  const upcomingSessions = [
    {
      id: 1,
      mentee: "Alex Johnson",
      topic: "Web Development Basics",
      date: "2024-03-20",
      time: "14:00",
      status: "Confirmed"
    },
    {
      id: 2,
      mentee: "Sarah Williams",
      topic: "React Advanced Concepts",
      date: "2024-03-21",
      time: "15:30",
      status: "Pending"
    }
  ];

  const mentees = [
    {
      id: 1,
      name: "Alex Johnson",
      progress: 75,
      sessionsCompleted: 6,
      lastSession: "2024-03-15"
    },
    {
      id: 2,
      name: "Sarah Williams",
      progress: 45,
      sessionsCompleted: 3,
      lastSession: "2024-03-14"
    }
  ];

  const renderOverview = () => (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Mentees</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalMentees}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed Sessions</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completedSessions}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Sessions</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.upcomingSessions}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.averageRating}/5.0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Upcoming Sessions</h2>
        <div className="mt-4 grid gap-5 grid-cols-1 sm:grid-cols-2">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{session.topic}</h3>
                    <p className="mt-1 text-sm text-gray-500">with {session.mentee}</p>
                  </div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    session.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {session.status}
                  </span>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="text-sm text-gray-500">
                    <p>{session.date}</p>
                    <p>{session.time}</p>
                  </div>
                  <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMentees = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {mentees.map((mentee) => (
          <li key={mentee.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-indigo-600 truncate">{mentee.name}</p>
                  <p className="mt-1 flex items-center text-sm text-gray-500">
                    <span>Sessions completed: {mentee.sessionsCompleted}</span>
                    <span className="mx-2">•</span>
                    <span>Last session: {mentee.lastSession}</span>
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">Progress:</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${mentee.progress}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{mentee.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <TaskManagement />;
      case 'meetings':
        return <MeetingScheduler />;
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Mentor Dashboard</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mt-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`${
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`${
                  activeTab === 'tasks'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Task Management
              </button>
              <button
                onClick={() => setActiveTab('meetings')}
                className={`${
                  activeTab === 'meetings'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Schedule Meetings
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="py-6">{renderContent()}</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorDashboard; 