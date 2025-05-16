import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MentorDetails from './MentorDetails';
import SkillsManagement from './SkillsManagement';
import { studentService } from '../../services/api';

const StudentDashboard = () => {
  const { } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [meetings, setMeetings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMeetings();
    fetchNotifications();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await studentService.getMentorMeetings();
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await studentService.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleConfirmAttendance = async (meetingId, status) => {
    try {
      setLoading(true);
      await studentService.confirmMeetingAttendance(meetingId, status);
      fetchMeetings();
    } catch (error) {
      console.error('Error confirming attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Upcoming Meetings */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Meetings</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {meetings.map((meeting) => (
            <li key={meeting.id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-indigo-600 truncate">{meeting.title}</h4>
                  <p className="mt-1 text-sm text-gray-500">{meeting.description}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(`${meeting.date}T${meeting.time}`).toLocaleString()}
                  </p>
                </div>
                <div className="ml-4">
                  {!meeting.attendance && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleConfirmAttendance(meeting.id, 'ATTENDING')}
                        disabled={loading}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Attend
                      </button>
                      <button
                        onClick={() => handleConfirmAttendance(meeting.id, 'NOT_ATTENDING')}
                        disabled={loading}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Notifications */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Important Notifications</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <li key={notification.id} className="px-4 py-4">
              <div className="flex items-center">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                  <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'mentor':
        return <MentorDetails />;
      case 'skills':
        return <SkillsManagement />;
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Student Dashboard</h1>
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
                onClick={() => setActiveTab('mentor')}
                className={`${
                  activeTab === 'mentor'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                My Mentor
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`${
                  activeTab === 'skills'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Skills
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

export default StudentDashboard; 