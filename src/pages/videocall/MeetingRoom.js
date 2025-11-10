import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { videoCallService } from '../../services/meetingService';
import VideoCallInterface from '../../components/videocall/VideoCallInterface';
import WaitingRoom from '../../components/videocall/WaitingRoom';

const MeetingRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [meetingDetails, setMeetingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showWaitingRoom, setShowWaitingRoom] = useState(false);

    useEffect(() => {
        const fetchMeetingDetails = async () => {
            try {
                const details = await videoCallService.getMeetingDetails(roomId);
                setMeetingDetails(details);

                // Show waiting room for mentors
                if (user.role === 'MENTOR') {
                    setShowWaitingRoom(true);
                }
            } catch (error) {
                setError('Meeting not found or access denied');
                console.error('Error fetching meeting details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (roomId) {
            fetchMeetingDetails();
        }
    }, [roomId, user.role]);

    const handleLeaveMeeting = () => {
        // Navigate back based on user role
        if (user.role === 'MENTOR') {
            navigate('/mentor/meetings');
        } else {
            navigate('/student/join-meeting');
        }
    };

    const handleEndMeeting = () => {
        navigate('/mentor/meetings');
    };

    const handleStartVideoCall = () => {
        setShowWaitingRoom(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading meeting...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={handleLeaveMeeting}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Show waiting room for mentors before starting video call
    if (showWaitingRoom && user.role === 'MENTOR') {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{meetingDetails.title}</h1>
                                <p className="text-sm text-gray-500">Room ID: {roomId}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleStartVideoCall}
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
                        roomId={roomId}
                        onParticipantApproved={(participantId) => {
                            // Participant approved
                        }}
                        onParticipantRejected={(participantId) => {
                            // Participant rejected
                        }}
                    />
                </div>
            </div>
        );
    }

    // Show video call interface
    return (
        <div className="h-screen flex flex-col">
            <VideoCallInterface
                roomId={roomId}
                meetingDetails={meetingDetails}
                onLeave={handleLeaveMeeting}
                onEnd={handleEndMeeting}
                isHost={user.role === 'MENTOR'}
            />
        </div>
    );
};

export default MeetingRoom;