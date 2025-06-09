import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TaskManagement from './TaskManagement';
import MeetingScheduler from './MeetingScheduler';
import { meetingService } from '../../services/meetingService';
import { mentorService } from '../../services/mentorService';
import VideoCall from '../../components/VideoCall';
import MyMentees from './MyMentees';

const MentorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [meetings, setMeetings] = useState([]);
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    scheduledTime: '',
    selectedMentees: []
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalMentees: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    averageRating: 0
  });
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [myMentees, setMyMentees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchMeetings();
      fetchDashboardStats();
      fetchMyMentees();
    }
  }, [user]);

  const fetchMyMentees = async () => {
    try {
      const response = await mentorService.getMyStudents(user.id);
      setMyMentees(response.data);
    } catch (err) {
      console.error('Error fetching mentees:', err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const mentorId = user?.id;
      const menteesResponse = await mentorService.getMyStudents(mentorId);
      const sessionsResponse = await meetingService.getMentorMeetings(mentorId);
      
      const totalMentees = menteesResponse.data?.length || 0;
      const completedSessions = sessionsResponse.data?.filter(s => s.status === 'COMPLETED')?.length || 0;
      const upcomingSessions = sessionsResponse.data?.filter(s => s.status === 'SCHEDULED')?.length || 0;
      
      setStats({
        totalMentees,
        completedSessions,
        upcomingSessions,
        averageRating: 0
      });

      const upcoming = sessionsResponse.data
        ?.filter(s => s.status === 'SCHEDULED')
        ?.map(session => ({
          id: session.id,
          mentee: session.menteeName,
          topic: session.title,
          date: new Date(session.scheduledTime).toLocaleDateString(),
          time: new Date(session.scheduledTime).toLocaleTimeString(),
          status: session.status
        })) || [];
      
      setUpcomingSessions(upcoming);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const mentorId = user?.id;
      const response = await meetingService.getMentorMeetings(mentorId);
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewMeeting = async () => {
    try {
      setLoading(true);
      console.log('Starting new instant meeting...');
      
      // Create meeting data
      const meetingData = {
        title: "Instant Meeting",
        description: "Instant meeting started by mentor",
        scheduledTime: new Date().toISOString(),
        mentorId: user.id,
        selectedMentees: [], // Empty array for instant meeting
        duration: 60, // Default duration in minutes
        status: 'IN_PROGRESS' // Set status directly in creation
      };

      console.log('Creating meeting with data:', meetingData);
      const response = await meetingService.createMeeting(meetingData);
      console.log('Meeting created successfully:', response);

      // Set current meeting and show video call
      setCurrentMeeting(response);
      setShowNewMeetingForm(true);
      setLoading(false);
    } catch (error) {
      console.error('Error starting instant meeting:', error);
      setError('Failed to start instant meeting. Please try again.');
      setLoading(false);
    }
  };

  const handleMeetingFormChange = (e) => {
    const { name, value } = e.target;
    setMeetingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectMentee = (menteeId) => {
    setMeetingForm(prev => {
      const selectedMentees = prev.selectedMentees.includes(menteeId)
        ? prev.selectedMentees.filter(id => id !== menteeId)
        : [...prev.selectedMentees, menteeId];
      
      return {
        ...prev,
        selectedMentees
      };
    });
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const meetingData = {
        title: meetingForm.title,
        description: meetingForm.description,
        scheduledTime: meetingForm.scheduledTime,
        mentor: {
          id: user.id
        },
        student: {
          id: meetingForm.selectedMentees[0] // Using the first selected mentee
        },
        type: 'ONLINE',
        status: 'SCHEDULED'
      };

      const response = await meetingService.createMeeting(meetingData);
      setCurrentMeeting(response.data);
      setShowNewMeetingForm(false);
      setMeetingForm({
        title: '',
        description: '',
        scheduledTime: '',
        selectedMentees: []
      });
      
    } catch (error) {
      console.error('Error creating meeting:', error);
      setError('Failed to create meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEndMeeting = async (meetingId) => {
    try {
      setLoading(true);
      setError(null);

      await meetingService.endMeeting(user.id, meetingId);
      setCurrentMeeting(null);
      fetchMeetings();
    } catch (error) {
      console.error('Error ending meeting:', error);
      setError('Failed to end meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderVideoCall = () => {
    if (!currentMeeting) {
      return (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No active meeting</h3>
          <p className="mt-1 text-sm text-gray-500">Start a new video call with your mentees.</p>
          <div className="mt-6">
            <button
              onClick={handleStartNewMeeting}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start New Meeting
            </button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Active Meeting: {currentMeeting.title}
          </h2>
          <div className="text-sm text-gray-500">
            Started at: {new Date(currentMeeting.scheduledTime).toLocaleTimeString()}
          </div>
        </div>
        
        <VideoCall 
          meetingId={currentMeeting.id} 
          meetingLink={currentMeeting.meetingLink}
          isHost={true}
          onEndMeeting={handleEndMeeting}
        />
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Share meeting link with your mentees: <span className="font-medium text-indigo-600">{currentMeeting.meetingLink}</span></p>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Mentees */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Mentees</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalMentees}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Sessions */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed Sessions</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.completedSessions}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Sessions</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.upcomingSessions}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.averageRating.toFixed(1)}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Sessions</h3>
          <button
            onClick={handleStartNewMeeting}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start New Meeting
          </button>
        </div>
        <div className="border-t border-gray-200">
          <div className="divide-y divide-gray-200">
            {upcomingSessions.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No upcoming sessions scheduled</p>
            ) : (
              upcomingSessions.map((session) => (
                <div key={session.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-indigo-600">{session.topic}</h4>
                      <p className="mt-1 text-sm text-gray-500">with {session.mentee}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        session.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.status}
                      </span>
                      <div className="ml-4 text-sm text-gray-500">
                        {session.date} at {session.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMentees = () => (
    <MyMentees />
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`${
                  activeTab === 'overview'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 font-medium text-sm rounded-md`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('mentees')}
                className={`${
                  activeTab === 'mentees'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 font-medium text-sm rounded-md`}
              >
                My Mentees
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`${
                  activeTab === 'tasks'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 font-medium text-sm rounded-md`}
              >
                Tasks
              </button>
              <button
                onClick={() => setActiveTab('meetings')}
                className={`${
                  activeTab === 'meetings'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 font-medium text-sm rounded-md`}
              >
                Meetings
              </button>
            </nav>
          </div>

          <div className="mt-2">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'mentees' && renderMentees()}
            {activeTab === 'tasks' && <TaskManagement />}
            {activeTab === 'meetings' && (
              showNewMeetingForm || currentMeeting ? (
                renderVideoCall()
              ) : (
                <MeetingScheduler onStartNewMeeting={handleStartNewMeeting} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;