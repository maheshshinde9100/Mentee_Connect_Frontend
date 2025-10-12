import React, { useState, useEffect } from 'react';
import { videoCallService } from '../../services/meetingService';
import webSocketService from '../../services/websocketService';
import { useAuth } from '../../contexts/AuthContext';
import { VideoCameraIcon, ClockIcon } from '@heroicons/react/24/outline';
import JoinMeetingDebug from './JoinMeetingDebug';

const JoinMeeting = ({ onJoinSuccess, onJoinError }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    roomId: '',
    participantName: user?.name || '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [waitingForApproval, setWaitingForApproval] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState(null);

  useEffect(() => {
    // Extract room ID from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const roomIdFromUrl = urlParams.get('roomId');
    if (roomIdFromUrl) {
      setFormData(prev => ({ ...prev, roomId: roomIdFromUrl }));
    }

    // Connect to WebSocket for approval notifications
    const connectWebSocket = async () => {
      try {
        if (!webSocketService.isConnected()) {
          await webSocketService.connect();
        }
        
        // Subscribe to approval notifications
        await webSocketService.subscribeToMeetingApproval(user.id, (message) => {
          if (message.status === 'approved') {
            setWaitingForApproval(false);
            if (onJoinSuccess) {
              onJoinSuccess(message);
            }
          } else if (message.status === 'rejected') {
            setWaitingForApproval(false);
            setError('Your request to join the meeting was rejected.');
          }
        });
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (webSocketService.isConnected()) {
        webSocketService.unsubscribe(`/queue/user/${user.id}/meeting-approval`);
      }
    };
  }, [user.id, onJoinSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!formData.roomId.trim()) {
      setError('Please enter a Room ID');
      setLoading(false);
      return;
    }

    if (!formData.participantName.trim()) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to get meeting details for room:', formData.roomId);
      
      // First, get meeting details to check if password is required
      const meetingInfo = await videoCallService.getMeetingDetails(formData.roomId);
      console.log('Meeting details received:', meetingInfo);
      setMeetingDetails(meetingInfo);

      // Check if password is required but not provided
      if (meetingInfo.passwordRequired && !formData.password) {
        setError('This meeting requires a password');
        setLoading(false);
        return;
      }

      // Attempt to join the meeting
      const joinData = {
        roomId: formData.roomId,
        participantName: formData.participantName,
        participantId: user.id, // Add user ID
        password: formData.password || null // Use null instead of undefined
      };

      console.log('Sending join request with data:', joinData);
      await videoCallService.joinMeeting(joinData);
      
      // If successful, show waiting for approval
      setWaitingForApproval(true);
      
    } catch (error) {
      console.error('Join meeting error details:', error.response?.data);
      let errorMessage = 'Failed to join meeting';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid meeting details. Please check the Room ID and password.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Meeting not found. Please check the Room ID.';
      }
      
      setError(errorMessage);
      if (onJoinError) {
        onJoinError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelJoin = () => {
    setWaitingForApproval(false);
    setError(null);
    setMeetingDetails(null);
  };

  if (waitingForApproval) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Waiting for Approval</h3>
          <p className="text-sm text-gray-500 mb-4">
            Your request to join "{meetingDetails?.title}" has been sent to the host.
            Please wait for approval.
          </p>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Waiting for host approval...</span>
          </div>
          <button
            onClick={cancelJoin}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <VideoCameraIcon className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Join Meeting</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
            Room ID *
          </label>
          <input
            type="text"
            id="roomId"
            name="roomId"
            value={formData.roomId}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter the meeting room ID"
          />
        </div>

        <div>
          <label htmlFor="participantName" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name *
          </label>
          <input
            type="text"
            id="participantName"
            name="participantName"
            value={formData.participantName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Meeting Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter password if required"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Joining Meeting...
            </>
          ) : (
            <>
              <VideoCameraIcon className="h-4 w-4 mr-2" />
              Join Meeting
            </>
          )}
        </button>
      </form>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">How to join:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
          <li>Enter the Room ID provided by your mentor</li>
          <li>Enter your name as you want it to appear</li>
          <li>Enter the password if the meeting is protected</li>
          <li>Click "Join Meeting" and wait for host approval</li>
        </ol>
      </div>

      {/* Debug component for development */}
      <JoinMeetingDebug roomId={formData.roomId} />
    </div>
  );
};

export default JoinMeeting;