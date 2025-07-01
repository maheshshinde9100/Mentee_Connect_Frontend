import React, { useState, useEffect } from 'react';
import { Copy, Video, Users, Calendar, Clock, Plus, ExternalLink, Trash2 } from 'lucide-react';

const MentorMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    scheduledAt: '',
    duration: 60
  });

  // Get JWT token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('jwt_token');
  };

  // Generate random meeting ID
  const generateMeetingId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  // Fetch meetings from backend
  const fetchMeetings = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:8081/api/meetings/mentor', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMeetings(data);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new meeting
  const createMeeting = async () => {
    if (!newMeeting.title.trim()) {
      alert('Please enter a meeting title');
      return;
    }

    setCreating(true);
    try {
      const token = getAuthToken();
      const meetingId = generateMeetingId();
      const meetingLink = `${window.location.origin}/meeting/join/${meetingId}`;
      
      const meetingData = {
        meetingId,
        title: newMeeting.title,
        description: newMeeting.description,
        scheduledAt: newMeeting.scheduledAt || new Date().toISOString(),
        duration: newMeeting.duration,
        meetingLink,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:8081/api/meetings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meetingData)
      });

      if (response.ok) {
        const savedMeeting = await response.json();
        setMeetings(prev => [savedMeeting, ...prev]);
        setNewMeeting({ title: '', description: '', scheduledAt: '', duration: 60 });
        alert('Meeting created successfully!');
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Failed to create meeting');
    } finally {
      setCreating(false);
    }
  };

  // Copy meeting link to clipboard
  const copyMeetingLink = async (meetingLink) => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      alert('Meeting link copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = meetingLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Meeting link copied to clipboard!');
    }
  };

  // Start meeting
  const startMeeting = async (meetingId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:8081/api/meetings/${meetingId}/start`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMeetings(prev => 
          prev.map(meeting => 
            meeting.meetingId === meetingId 
              ? { ...meeting, status: 'active' }
              : meeting
          )
        );
        // Here you would typically redirect to the meeting room
        window.open(`/meeting/room/${meetingId}`, '_blank');
      }
    } catch (error) {
      console.error('Error starting meeting:', error);
    }
  };

  // Delete meeting
  const deleteMeeting = async (meetingId) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to delete this meeting?')) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:8081/api/meetings/${meetingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMeetings(prev => prev.filter(meeting => meeting.meetingId !== meetingId));
        alert('Meeting deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
      alert('Failed to delete meeting');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading meetings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meeting Dashboard</h1>
          <p className="text-gray-600">Manage your mentoring sessions and create meeting links for students</p>
        </div>

        {/* Create Meeting Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <Plus className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Create New Meeting</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title *</label>
              <input
                type="text"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter meeting title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <select
                value={newMeeting.duration}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newMeeting.description}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Meeting description (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Time (optional)</label>
              <input
                type="datetime-local"
                value={newMeeting.scheduledAt}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, scheduledAt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={createMeeting}
            disabled={creating}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Create Meeting
              </>
            )}
          </button>
        </div>

        {/* Meetings List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Video className="h-6 w-6 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Your Meetings</h2>
              <span className="ml-2 bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                {meetings.length}
              </span>
            </div>
          </div>

          {meetings.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings yet</h3>
              <p className="text-gray-600">Create your first meeting to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {meetings.map((meeting) => (
                <div key={meeting.meetingId} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900 mr-3">{meeting.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                      </div>
                      
                      {meeting.description && (
                        <p className="text-gray-600 mb-3">{meeting.description}</p>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(meeting.scheduledAt)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {meeting.duration} minutes
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          Meeting ID: {meeting.meetingId}
                        </div>
                      </div>
                      
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-1">Meeting Link:</p>
                            <p className="text-sm font-mono text-gray-800 truncate pr-2">{meeting.meetingLink}</p>
                          </div>
                          <button
                            onClick={() => copyMeetingLink(meeting.meetingLink)}
                            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 focus:outline-none"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col space-y-2">
                      {meeting.status === 'scheduled' && (
                        <button
                          onClick={() => startMeeting(meeting.meetingId)}
                          className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Start
                        </button>
                      )}
                      
                      {meeting.status === 'active' && (
                        <button
                          onClick={() => window.open(`/meeting/room/${meeting.meetingId}`, '_blank')}
                          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Join
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteMeeting(meeting.meetingId)}
                        className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorMeetings;