import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoCameraIcon } from '@heroicons/react/24/outline';
import VideoCall from '../../components/VideoCall';

const JoinMeeting = () => {
  const navigate = useNavigate();
  const [meetingLink, setMeetingLink] = useState('');
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [error, setError] = useState(null);

  const handleJoinMeeting = () => {
    if (!meetingLink) {
      setError('Please enter a meeting link');
      return;
    }

    if (!meetingLink.includes('/meeting/')) {
      setError('Invalid meeting link format');
      return;
    }

    const meetingId = meetingLink.split('/meeting/')[1];
    setCurrentMeeting({ id: meetingId, title: 'Meeting via Link' });
    setError(null);
  };

  const handleLeaveMeeting = () => {
    setCurrentMeeting(null);
    setMeetingLink('');
  };

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
            Back to Join Meeting
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <VideoCall
            meetingId={currentMeeting.id}
            meetingLink={meetingLink}
            isHost={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Join a Meeting</h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="meeting-link" className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Link
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  id="meeting-link"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="Paste the meeting link here"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleJoinMeeting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <VideoCameraIcon className="h-5 w-5 mr-2" />
                  Join Meeting
                </button>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-medium text-gray-900 mb-2">How to join a meeting:</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Copy the meeting link provided by your mentor</li>
                <li>Paste the link in the input field above</li>
                <li>Click the "Join Meeting" button</li>
                <li>Allow camera and microphone access when prompted</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinMeeting; 