import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VideoCall from './VideoCall';

const MeetingView = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateMeeting = async () => {
      try {
        // Here you can add validation logic if needed
        // For example, checking if the meeting exists or if the user has access
        setLoading(false);
      } catch (error) {
        console.error('Error validating meeting:', error);
        setError('Invalid meeting or access denied');
        setLoading(false);
      }
    };

    validateMeeting();
  }, [meetingId]);

  const handleLeaveCall = () => {
    // Navigate back to the appropriate page based on user role
    if (user?.role === 'MENTOR') {
      navigate('/mentor/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleLeaveCall}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <VideoCall meetingId={meetingId} onLeave={handleLeaveCall} />
        </div>
      </div>
    </div>
  );
};

export default MeetingView; 