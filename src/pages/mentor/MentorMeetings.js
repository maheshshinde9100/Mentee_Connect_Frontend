import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CreateMeeting from '../../components/videocall/CreateMeeting';
import MeetingList from '../../components/videocall/MeetingList';
import WaitingRoom from '../../components/videocall/WaitingRoom';
import VideoCallInterface from '../../components/videocall/VideoCallInterface';
import JoinRequestNotification from '../../components/videocall/JoinRequestNotification';
import DebugInfo from '../../components/videocall/DebugInfo';

const MentorMeetings = () => {
  const { user } = useAuth();
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMeetingCreated = (meeting, autoStart = false) => {
    // Refresh the meeting list
    setRefreshTrigger(prev => prev + 1);
    
    // Auto-start the meeting if requested
    if (autoStart) {
      setCurrentMeeting(meeting);
      setShowWaitingRoom(true);
    }
  };

  const handleStartMeeting = (meeting) => {
    setCurrentMeeting(meeting);
    setShowWaitingRoom(true);
  };

  const handleJoinVideoCall = () => {
    setShowWaitingRoom(false);
  };

  const handleLeaveMeeting = () => {
    setCurrentMeeting(null);
    setShowWaitingRoom(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEndMeeting = () => {
    setCurrentMeeting(null);
    setShowWaitingRoom(false);
    setRefreshTrigger(prev => prev + 1);
  };

  // If in video call mode
  if (currentMeeting && !showWaitingRoom) {
    return (
      <div className="h-screen flex flex-col">
        <VideoCallInterface
          roomId={currentMeeting.roomId}
          meetingDetails={currentMeeting}
          onLeave={handleLeaveMeeting}
          onEnd={handleEndMeeting}
          isHost={true}
        />
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Meetings</h1>
          <p className="text-gray-600">Create and manage video meetings with your mentees</p>
        </div>

        {/* Join Request Notifications - Show when in waiting room or video call */}
        {currentMeeting && (
          <JoinRequestNotification
            roomId={currentMeeting.roomId}
            onApprove={(participantId) => {
              // Participant approved
            }}
            onReject={(participantId) => {
              // Participant rejected
            }}
          />
        )}

        {/* Show waiting room if meeting is selected */}
        {currentMeeting && showWaitingRoom ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{currentMeeting.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">Room ID: {currentMeeting.roomId}</p>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-700">
                      <strong>Share with students:</strong> Room ID: <span className="font-mono">{currentMeeting.roomId}</span>
                    </p>
                    {currentMeeting.password && (
                      <p className="text-sm text-blue-700 mt-1">
                        Password: <span className="font-mono">{currentMeeting.password}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleJoinVideoCall}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Start Video Call
                  </button>
                  <button
                    onClick={handleLeaveMeeting}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <WaitingRoom
              roomId={currentMeeting.roomId}
              onParticipantApproved={(participantId) => {
                // Optionally show success notification
              }}
              onParticipantRejected={(participantId) => {
                // Optionally show rejection notification
              }}
            />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Create Meeting Section */}
            <CreateMeeting onMeetingCreated={handleMeetingCreated} />

            {/* Meeting List Section */}
            <MeetingList 
              onStartMeeting={handleStartMeeting}
              refreshTrigger={refreshTrigger}
            />
          </div>
        )}
        
        {/* Debug Info */}
        <DebugInfo roomId={currentMeeting?.roomId} show={true} />
      </div>
    </div>
  );
};

export default MentorMeetings;