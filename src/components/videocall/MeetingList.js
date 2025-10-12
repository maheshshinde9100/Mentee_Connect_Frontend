import React, { useState, useEffect } from 'react';
import { videoCallService } from '../../services/meetingService';
import { useAuth } from '../../contexts/AuthContext';
import { 
  VideoCameraIcon, 
  ClipboardDocumentIcon, 
  CalendarIcon,
  UsersIcon,
  PlayIcon,
  TrashIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const MeetingList = ({ onStartMeeting, refreshTrigger }) => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLinks, setCopiedLinks] = useState(new Set());

  useEffect(() => {
    fetchMeetings();
  }, [user.id, refreshTrigger]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      let meetingsData;
      
      if (user.role === 'MENTOR') {
        meetingsData = await videoCallService.getMentorMeetings(user.id);
      } else {
        meetingsData = await videoCallService.getStudentMeetings(user.id);
      }
      
      setMeetings(meetingsData);
    } catch (error) {
      setError('Failed to fetch meetings');
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async (roomId, joinLink) => {
    try {
      await navigator.clipboard.writeText(joinLink);
      setCopiedLinks(prev => new Set(prev).add(roomId));
      setTimeout(() => {
        setCopiedLinks(prev => {
          const newSet = new Set(prev);
          newSet.delete(roomId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canStartMeeting = (meeting) => {
    return user.role === 'MENTOR' && 
           (meeting.status === 'SCHEDULED' || meeting.status === 'scheduled');
  };

  const canJoinMeeting = (meeting) => {
    return meeting.status === 'ACTIVE' || meeting.status === 'active';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading meetings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchMeetings}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <VideoCameraIcon className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              {user.role === 'MENTOR' ? 'Your Meetings' : 'Available Meetings'}
            </h3>
            {meetings.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                {meetings.length}
              </span>
            )}
          </div>
          <button
            onClick={fetchMeetings}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {meetings.length === 0 ? (
        <div className="text-center py-12">
          <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {user.role === 'MENTOR' ? 'No meetings created yet' : 'No meetings available'}
          </h3>
          <p className="text-gray-600">
            {user.role === 'MENTOR' 
              ? 'Create your first meeting to get started'
              : 'Check back later for available meetings'
            }
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {meetings.map((meeting) => (
            <div key={meeting.roomId} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="text-lg font-medium text-gray-900 mr-3">
                      {meeting.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(meeting.status)}`}>
                      {meeting.status || 'scheduled'}
                    </span>
                  </div>
                  
                  {meeting.description && (
                    <p className="text-gray-600 mb-3">{meeting.description}</p>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {formatDate(meeting.scheduledTime)}
                    </div>
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      Max: {meeting.maxParticipants} participants
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs">Room ID: {meeting.roomId}</span>
                    </div>
                  </div>
                  
                  {user.role === 'MENTOR' && meeting.joinLink && (
                    <div className="bg-gray-50 rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-1">Shareable Link:</p>
                          <p className="text-sm font-mono text-gray-800 truncate pr-2">
                            {meeting.joinLink}
                          </p>
                        </div>
                        <button
                          onClick={() => copyLink(meeting.roomId, meeting.joinLink)}
                          className={`flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                            copiedLinks.has(meeting.roomId)
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200'
                          }`}
                        >
                          {copiedLinks.has(meeting.roomId) ? (
                            <>
                              <CheckIcon className="h-4 w-4 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex flex-col space-y-2">
                  {canStartMeeting(meeting) && (
                    <button
                      onClick={() => onStartMeeting(meeting)}
                      className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <PlayIcon className="h-4 w-4 mr-1" />
                      Start
                    </button>
                  )}
                  
                  {canJoinMeeting(meeting) && (
                    <button
                      onClick={() => onStartMeeting(meeting)}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <VideoCameraIcon className="h-4 w-4 mr-1" />
                      Join
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingList;