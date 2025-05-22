import React, { useState, useEffect } from 'react';

// Simple video call component that will be enhanced with real video integration
const VideoCall = ({ meetingId, meetingLink, isHost, onEndMeeting }) => {
  const [isJoined, setIsJoined] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading the video call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleJoinMeeting = () => {
    setIsJoined(true);
    console.log(`Joined meeting: ${meetingId}`);
    
    // In a real implementation, this would initialize the video call SDK
  };
  
  const handleLeaveMeeting = () => {
    setIsJoined(false);
    console.log(`Left meeting: ${meetingId}`);
    
    // If the host leaves, end the meeting
    if (isHost && onEndMeeting) {
      onEndMeeting(meetingId);
    }
  };
  
  const handleToggleMic = () => {
    setIsMicOn(!isMicOn);
    console.log(`Microphone ${isMicOn ? 'muted' : 'unmuted'}`);
  };
  
  const handleToggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    console.log(`Camera turned ${isCameraOn ? 'off' : 'on'}`);
  };
  
  const openMeetingLink = () => {
    // Open the meeting link in a new tab
    window.open(meetingLink, '_blank');
  };
  
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
        <p className="text-gray-600 mb-8">Meeting ID: {meetingId}</p>
        <div className="flex space-x-4">
          <button
            onClick={handleJoinMeeting}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Join Now
          </button>
          <button
            onClick={openMeetingLink}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Open in Google Meet
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-96 bg-gray-900 rounded-lg overflow-hidden">
      {/* Video display area */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-800">
        <div className="aspect-video w-full max-h-full bg-black rounded-lg flex items-center justify-center">
          {isCameraOn ? (
            <div className="text-white">
              {/* This would be the actual video feed */}
              <svg className="w-24 h-24 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
              <p className="mt-4 text-center">{isHost ? 'You (Host)' : 'You'}</p>
            </div>
          ) : (
            <div className="text-white text-center">
              <p className="mb-2">Camera is off</p>
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
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
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          )}
        </button>
        
        <button
          onClick={openMeetingLink}
          className="rounded-full p-3 bg-green-600 hover:bg-green-700"
          title="Open in Google Meet"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8.414l-4-4H4zm6 5a1 1 0 10-2 0v1.586l-.293-.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 10-1.414-1.414l-.293.293V9a1 1 0 10-2 0z" clipRule="evenodd"></path>
          </svg>
        </button>
        
        <button
          onClick={handleLeaveMeeting}
          className="rounded-full p-3 bg-red-600 hover:bg-red-700"
          title="Leave meeting"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VideoCall; 