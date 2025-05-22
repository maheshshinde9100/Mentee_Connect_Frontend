import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import meetingService from '../../services/meetingService';
import { format } from 'date-fns';

const MeetingHistory = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'ended'
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchAllMeetings();
  }, []);
  
  const fetchAllMeetings = async () => {
    try {
      setLoading(true);
      const response = await meetingService.getAllMeetings();
      console.log('Meetings data:', response.data);
      setMeetings(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setError('Failed to load meetings from API. Check console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };
  
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const durationMs = end - start;
      
      // Convert to minutes
      const minutes = Math.floor(durationMs / 60000);
      
      if (minutes < 60) {
        return `${minutes} minutes`;
      } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
      }
    } catch (error) {
      return 'Invalid duration';
    }
  };
  
  const getFilteredMeetings = () => {
    return meetings
      .filter(meeting => {
        // Apply status filter
        if (filter === 'active') return meeting.status === 'active';
        if (filter === 'ended') return meeting.status === 'ended';
        return true; // 'all' filter
      })
      .filter(meeting => {
        // Apply search filter to title, mentor name, or description
        if (!searchTerm) return true;
        
        const searchLower = searchTerm.toLowerCase();
        return (
          (meeting.title && meeting.title.toLowerCase().includes(searchLower)) ||
          (meeting.mentorName && meeting.mentorName.toLowerCase().includes(searchLower)) ||
          (meeting.description && meeting.description.toLowerCase().includes(searchLower))
        );
      });
  };
  
  const filteredMeetings = getFilteredMeetings();
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Meeting History</h1>
        <p className="text-gray-600 mb-6">View all video call meetings between mentors and students</p>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${
                    filter === 'all' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${
                    filter === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter('ended')}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${
                    filter === 'ended' 
                      ? 'bg-gray-100 text-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Ended
                </button>
              </div>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Meeting List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No meetings found matching your criteria.
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredMeetings.map(meeting => (
                <li key={meeting.id}>
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-indigo-600">{meeting.title}</h3>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <p className="truncate">Mentor: {meeting.mentorName}</p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          meeting.status === 'active' ? 'bg-green-100 text-green-800' : 
                          meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-gray-200 pt-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Start Time</p>
                        <p className="mt-1 text-sm text-gray-900">{formatDateTime(meeting.startTime)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">End Time</p>
                        <p className="mt-1 text-sm text-gray-900">{formatDateTime(meeting.endTime)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Duration</p>
                        <p className="mt-1 text-sm text-gray-900">{calculateDuration(meeting.startTime, meeting.endTime)}</p>
                      </div>
                    </div>
                    
                    {meeting.attendees && meeting.attendees.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Attendees</p>
                        <p className="mt-1 text-sm text-gray-900">{meeting.attendees.join(', ')}</p>
                      </div>
                    )}
                    
                    {meeting.meetingLink && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Meeting Link</p>
                        <a 
                          href={meeting.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-1 text-sm text-indigo-600 hover:text-indigo-900"
                        >
                          {meeting.meetingLink}
                        </a>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingHistory; 