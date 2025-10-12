import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import JoinMeetingComponent from '../../components/videocall/JoinMeeting';
import VideoCallInterface from '../../components/videocall/VideoCallInterface';
import MeetingList from '../../components/videocall/MeetingList';
import ApprovalSuccess from '../../components/videocall/ApprovalSuccess';

const JoinMeeting = () => {
  const { user } = useAuth();
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [approvalData, setApprovalData] = useState(null);
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);

  const handleJoinSuccess = (approvalData) => {
    // When approved, show success screen first
    setApprovalData(approvalData);
    setShowApprovalSuccess(true);
  };

  const handleJoinVideoCall = () => {
    // Start the video call
    setCurrentMeeting({
      roomId: approvalData.roomId,
      title: approvalData.meetingTitle || 'Video Meeting'
    });
    setShowApprovalSuccess(false);
  };

  const handleJoinError = (error) => {
    console.error('Join error:', error);
  };

  const handleStartMeeting = (meeting) => {
    setCurrentMeeting(meeting);
  };

  const handleLeaveMeeting = () => {
    setCurrentMeeting(null);
    setApprovalData(null);
    setShowApprovalSuccess(false);
    setRefreshTrigger(prev => prev + 1);
  };

  // If showing approval success screen
  if (showApprovalSuccess && approvalData) {
    return (
      <div className="py-6 px-4 sm:px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <ApprovalSuccess
            meetingTitle={approvalData.meetingTitle}
            onJoinVideoCall={handleJoinVideoCall}
          />
        </div>
      </div>
    );
  }

  // If in video call mode
  if (currentMeeting) {
    return (
      <div className="h-screen flex flex-col">
        <VideoCallInterface
          roomId={currentMeeting.roomId}
          meetingDetails={currentMeeting}
          onLeave={handleLeaveMeeting}
          isHost={false}
        />
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Meeting</h1>
          <p className="text-gray-600">Join video meetings with your mentors</p>
        </div>

        <div className="space-y-8">
          {/* Join Meeting Form */}
          <JoinMeetingComponent
            onJoinSuccess={handleJoinSuccess}
            onJoinError={handleJoinError}
          />

          {/* Available Meetings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Meetings</h2>
            <MeetingList 
              onStartMeeting={handleStartMeeting}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinMeeting; 