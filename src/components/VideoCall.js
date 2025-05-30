import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { meetingService } from '../services/meetingService';
import webRTCService from '../services/webRTCService';

// Simple video call component that will be enhanced with real video integration
const VideoCall = ({ meetingId, meetingLink, isHost, onEndMeeting }) => {
  const { user } = useAuth();
  const [isJoined, setIsJoined] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  
  // Refs for video elements
  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef({});
  
  useEffect(() => {
    const initializeMeeting = async () => {
      try {
        // Get meeting details and participants
        const [meetingDetails, participantsList] = await Promise.all([
          meetingService.getMeetingDetails(meetingId),
          meetingService.getMeetingParticipants(meetingId)
        ]);
        
        setParticipants(participantsList.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to initialize meeting. Please try again.');
        setIsLoading(false);
      }
    };

    initializeMeeting();
    
    // Set up polling for participants list
    const participantsInterval = setInterval(async () => {
      if (isJoined) {
        try {
          const { data } = await meetingService.getMeetingParticipants(meetingId);
          setParticipants(data);
        } catch (err) {
          console.error('Error updating participants list:', err);
        }
      }
    }, 10000); // Poll every 10 seconds

    return () => {
      clearInterval(participantsInterval);
      if (isJoined) {
        handleLeaveMeeting();
      }
    };
  }, [meetingId, isJoined]);

  // Set up WebRTC callbacks
  useEffect(() => {
    webRTCService.setCallbacks({
      onParticipantJoined: (participantId) => {
        console.log('Participant joined:', participantId);
      },
      onParticipantLeft: (participantId) => {
        console.log('Participant left:', participantId);
        if (remoteVideosRef.current[participantId]) {
          delete remoteVideosRef.current[participantId];
        }
      },
      onStreamAdded: (participantId, stream) => {
        console.log('Stream added for participant:', participantId);
        if (remoteVideosRef.current[participantId]) {
          remoteVideosRef.current[participantId].srcObject = stream;
        }
      }
    });
  }, []);
  
  const handleJoinMeeting = async () => {
    try {
      setIsLoading(true);
      
      // Initialize WebRTC
      const localStream = await webRTCService.initialize(meetingId, user.id, isHost);
      
      // Set local video stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      
      if (isHost) {
        // If mentor (host), no need to call join endpoint
        setIsJoined(true);
      } else {
        // If student, call join endpoint
        await meetingService.joinMeeting(user.id, meetingId);
        setIsJoined(true);
      }
      
      console.log(`Joined meeting: ${meetingId}`);
    } catch (err) {
      setError('Failed to join meeting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLeaveMeeting = async () => {
    try {
      setIsLoading(true);
      
      // Clean up WebRTC
      webRTCService.leaveMeeting();
      
      if (isHost) {
        // If mentor (host), end the meeting
        await meetingService.endMeeting(user.id, meetingId);
        if (onEndMeeting) {
          onEndMeeting(meetingId);
        }
      } else {
        // If student, leave the meeting
        await meetingService.leaveMeeting(user.id, meetingId);
      }
      
      setIsJoined(false);
    } catch (err) {
      setError('Failed to leave meeting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleMic = () => {
    setIsMicOn(!isMicOn);
    webRTCService.toggleAudio(!isMicOn);
  };
  
  const handleToggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    webRTCService.toggleVideo(!isCameraOn);
  };
  
  const openMeetingLink = () => {
    // Open the meeting link in a new tab
    window.open(meetingLink, '_blank');
  };
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-red-50 rounded-lg p-6">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-red-600 text-center mb-4">{error}</p>
        <button
          onClick={() => setError(null)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Setting up your meeting...</p>
      </div>
    );
  }
  
  if (!isJoined) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Ready to join the meeting?</h2>
        <p className="text-gray-600 mb-2">Meeting ID: {meetingId}</p>
        <p className="text-gray-600 mb-8">Role: {isHost ? 'Host (Mentor)' : 'Participant (Student)'}</p>
        <div className="flex space-x-4">
          <button
            onClick={handleJoinMeeting}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Join Now
          </button>
          {isHost && (
            <button
              onClick={openMeetingLink}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Share Meeting Link
            </button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-96 bg-gray-900 rounded-lg overflow-hidden">
      {/* Video display area */}
      <div className="flex-1 flex flex-wrap items-center justify-center p-6 bg-gray-800 gap-4">
        {/* Main video (current user) */}
        <div className="aspect-video w-full md:w-2/3 bg-black rounded-lg flex items-center justify-center overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''}`}
          />
          {!isCameraOn && (
            <div className="text-white text-center">
              <p className="mb-2">Camera is off</p>
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>

        {/* Participants grid */}
        <div className="w-full md:w-1/3 grid grid-cols-2 gap-2">
          {participants.map((participant) => (
            <div key={participant.id} className="aspect-video bg-black rounded-lg flex items-center justify-center overflow-hidden">
              <video
                ref={el => {
                  if (el) {
                    remoteVideosRef.current[participant.id] = el;
                  }
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <p className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                {participant.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-gray-800 p-4 flex items-center justify-center space-x-6">
        <button
          onClick={handleToggleMic}
          className={`rounded-full p-3 ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
          title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
        >
          {isMicOn ? (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"></path>
            </svg>
          )}
        </button>
        
        <button
          onClick={handleToggleCamera}
          className={`rounded-full p-3 ${isCameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
          title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {isCameraOn ? (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          )}
        </button>
        
        {isHost && (
          <button
            onClick={openMeetingLink}
            className="rounded-full p-3 bg-green-600 hover:bg-green-700"
            title="Share meeting link"
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
        )}
        
        <button
          onClick={handleLeaveMeeting}
          className="rounded-full p-3 bg-red-600 hover:bg-red-700"
          title={isHost ? 'End meeting for all' : 'Leave meeting'}
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VideoCall; 