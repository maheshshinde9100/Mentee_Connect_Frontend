import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import meetingService from '../../services/meetingService';
import studentService from '../../services/studentService';
import VideoCall from '../../components/VideoCall';
import CertificateManagement from '../../components/CertificateManagement';

const StudentDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeMeetings, setActiveMeetings] = useState([]);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (user && user.id) {
      fetchProfile();
      fetchMentor();
      fetchActiveMeetings();
    }
    
    const intervalId = setInterval(() => {
      if (user && user.id) {
        fetchActiveMeetings();
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await studentService.getCurrentProfile();
      setProfile(response.data);
    } catch (err) {
      setError('Failed to fetch profile');
      console.error('Error fetching profile:', err);
    }
  };

  const fetchMentor = async () => {
    try {
      const response = await studentService.getMyMentor();
      setMentor(response.data);
    } catch (err) {
      setError('Failed to fetch mentor details');
      console.error('Error fetching mentor:', err);
    }
  };

  const fetchActiveMeetings = async () => {
    try {
      setLoading(true);
      const studentId = user?.id;
      const response = await meetingService.getStudentMeetings(studentId);
      
      const active = response.data.filter(
        meeting => meeting.status === 'active' || meeting.status === 'scheduled'
      );
      
      setActiveMeetings(active);
    } catch (error) {
      console.error('Error fetching active meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = (meeting) => {
    setCurrentMeeting(meeting);
  };

  const handleLeaveMeeting = () => {
    setCurrentMeeting(null);
  };

  // If student is in a meeting, show the video call interface
  if (currentMeeting) {
    return (
      <div className="py-6 px-4 sm:px-6 md:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Meeting: {currentMeeting.title}
          </h1>
          <button
            onClick={handleLeaveMeeting}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition"
          >
            Back to Dashboard
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Mentor: <span className="font-medium">{currentMeeting.mentorName}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">{currentMeeting.description}</p>
          </div>
          
          <VideoCall
            meetingId={currentMeeting.id}
            meetingLink={currentMeeting.meetingLink}
            isHost={false}
          />
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Course',
      value: profile?.course || 'Not Set',
      description: 'Current Course',
      icon: AcademicCapIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Semester',
      value: profile?.semester || 'Not Set',
      description: 'Current Semester',
      icon: BookOpenIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Attendance',
      value: `${profile?.attendance || 0}%`,
      description: 'Overall attendance',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'CGPA',
      value: profile?.cgpa || '0.0',
      description: 'Current CGPA',
      icon: ChartBarIcon,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="py-6">
      {/* Student Info Header */}
      <div className="px-4 sm:px-6 md:px-8 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <div className="mt-1 flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  <span>{profile?.course}</span>
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  <span>Batch {profile?.batch}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>Semester {profile?.semester}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 sm:px-6 md:px-8 mb-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((card) => (
            <div
              key={card.title}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {card.title}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {card.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentor Information */}
      {mentor && (
        <div className="px-4 sm:px-6 md:px-8 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Mentor Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Name:</span> {mentor.firstName} {mentor.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {mentor.email}
                </p>
                {mentor.phoneNumber && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {mentor.phoneNumber}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Department:</span> {mentor.department}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Specialization:</span> {mentor.specialization}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Meetings */}
      <div className="px-4 sm:px-6 md:px-8 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Active Meetings</h2>
          {loading ? (
            <div className="text-center py-4">Loading meetings...</div>
          ) : activeMeetings.length > 0 ? (
            <div className="space-y-4">
              {activeMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {meeting.title}
                    </h3>
                    <p className="text-sm text-gray-500">{meeting.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(meeting.startTime).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleJoinMeeting(meeting)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <VideoCameraIcon className="h-5 w-5 mr-2" />
                    Join Meeting
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No active meetings</p>
          )}
        </div>
      </div>

      {/* Join Meeting by Link */}
      <div className="px-4 sm:px-6 md:px-8 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Join Meeting by Link</h2>
          <div className="max-w-xl">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Paste meeting link here"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  const link = e.target.value;
                  if (link.includes('/meeting/')) {
                    const meetingId = link.split('/meeting/')[1];
                    handleJoinMeeting({ id: meetingId, title: 'Meeting via Link' });
                  }
                }}
              />
              <button
                onClick={() => {
                  const link = document.querySelector('input[type="text"]').value;
                  if (link.includes('/meeting/')) {
                    const meetingId = link.split('/meeting/')[1];
                    handleJoinMeeting({ id: meetingId, title: 'Meeting via Link' });
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <VideoCameraIcon className="h-5 w-5 mr-2" />
                Join Meeting
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Paste the meeting link provided by your mentor to join the meeting
            </p>
          </div>
        </div>
      </div>

      {/* Certificate Management */}
      <div className="px-4 sm:px-6 md:px-8">
        <CertificateManagement />
      </div>
    </div>
  );
};

export default StudentDashboard;