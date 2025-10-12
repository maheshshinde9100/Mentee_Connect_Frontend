import React, { useState, useEffect } from 'react';
import { videoCallService } from '../../services/meetingService';
import webSocketService from '../../services/websocketService';
import { UserIcon, CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

const WaitingRoom = ({ roomId, onParticipantApproved, onParticipantRejected }) => {
  const [waitingParticipants, setWaitingParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingParticipants, setProcessingParticipants] = useState(new Set());

  useEffect(() => {
    if (!roomId) return;

    const fetchWaitingParticipants = async () => {
      try {
        const participants = await videoCallService.getWaitingParticipants(roomId);
        setWaitingParticipants(participants);
      } catch (error) {
        setError('Failed to fetch waiting participants');
        console.error('Error fetching waiting participants:', error);
      } finally {
        setLoading(false);
      }
    };

    const setupWebSocket = async () => {
      try {
        // Check if already subscribed to avoid duplicates
        const destination = `/topic/meeting/${roomId}/join-requests`;
        if (webSocketService.subscriptions.has(destination)) {
          console.log('Already subscribed to:', destination);
          return;
        }

        if (!webSocketService.isConnected()) {
          await webSocketService.connect();
        }

        // Subscribe to join requests for this meeting
        await webSocketService.subscribeToMeetingJoinRequests(roomId, (message) => {
          if (message.action === 'join_request') {
            setWaitingParticipants(prev => {
              // Check if participant already exists
              const exists = prev.some(p => p.participantId === message.participantId);
              if (!exists) {
                return [...prev, {
                  participantId: message.participantId,
                  participantName: message.participantName,
                  joinedAt: new Date().toISOString()
                }];
              }
              return prev;
            });
          }
        });
      } catch (error) {
        console.error('Failed to setup WebSocket for waiting room:', error);
      }
    };

    fetchWaitingParticipants();
    setupWebSocket();

    return () => {
      if (webSocketService.isConnected()) {
        webSocketService.unsubscribe(`/topic/meeting/${roomId}/join-requests`);
      }
    };
  }, [roomId]);

  const handleApprove = async (participantId) => {
    setProcessingParticipants(prev => new Set(prev).add(participantId));

    try {
      await videoCallService.approveParticipant(roomId, participantId);

      // Remove from waiting list
      setWaitingParticipants(prev =>
        prev.filter(p => p.participantId !== participantId)
      );

      if (onParticipantApproved) {
        onParticipantApproved(participantId);
      }
    } catch (error) {
      setError('Failed to approve participant');
      console.error('Error approving participant:', error);
    } finally {
      setProcessingParticipants(prev => {
        const newSet = new Set(prev);
        newSet.delete(participantId);
        return newSet;
      });
    }
  };

  const handleReject = async (participantId) => {
    setProcessingParticipants(prev => new Set(prev).add(participantId));

    try {
      await videoCallService.rejectParticipant(roomId, participantId);

      // Remove from waiting list
      setWaitingParticipants(prev =>
        prev.filter(p => p.participantId !== participantId)
      );

      if (onParticipantRejected) {
        onParticipantRejected(participantId);
      }
    } catch (error) {
      setError('Failed to reject participant');
      console.error('Error rejecting participant:', error);
    } finally {
      setProcessingParticipants(prev => {
        const newSet = new Set(prev);
        newSet.delete(participantId);
        return newSet;
      });
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading waiting room...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ClockIcon className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Waiting Room</h3>
          {waitingParticipants.length > 0 && (
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
              {waitingParticipants.length}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {waitingParticipants.length === 0 ? (
        <div className="text-center py-8">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No participants waiting to join</p>
        </div>
      ) : (
        <div className="space-y-3">
          {waitingParticipants.map((participant) => (
            <div
              key={participant.participantId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {participant.participantName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Requested at {formatTime(participant.joinedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleApprove(participant.participantId)}
                  disabled={processingParticipants.has(participant.participantId)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingParticipants.has(participant.participantId) ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CheckIcon className="h-3 w-3 mr-1" />
                      Approve
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleReject(participant.participantId)}
                  disabled={processingParticipants.has(participant.participantId)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingParticipants.has(participant.participantId) ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <XMarkIcon className="h-3 w-3 mr-1" />
                      Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;