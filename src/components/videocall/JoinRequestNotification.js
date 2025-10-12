import React, { useState, useEffect } from 'react';
import { BellIcon, UserIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { videoCallService } from '../../services/meetingService';
import webSocketService from '../../services/websocketService';

const JoinRequestNotification = ({ roomId, onApprove, onReject }) => {
  const [notifications, setNotifications] = useState([]);
  const [processing, setProcessing] = useState(new Set());

  useEffect(() => {
    if (!roomId) return;

    const setupWebSocket = async () => {
      try {
        // Check if already subscribed to avoid duplicates
        const destination = `/topic/meeting/${roomId}/join-requests`;
        if (webSocketService.subscriptions.has(destination)) {
          console.log('Already subscribed to notifications for:', destination);
          return;
        }

        if (!webSocketService.isConnected()) {
          await webSocketService.connect();
        }

        // Subscribe to join requests for this meeting
        await webSocketService.subscribeToMeetingJoinRequests(roomId, (message) => {
          if (message.action === 'join_request') {
            const notification = {
              id: `${message.participantId}_${Date.now()}`,
              participantId: message.participantId,
              participantName: message.participantName,
              timestamp: new Date().toISOString()
            };

            setNotifications(prev => {
              // Check if notification already exists
              const exists = prev.some(n => n.participantId === message.participantId);
              if (!exists) {
                return [notification, ...prev];
              }
              return prev;
            });

            // Auto-remove notification after 30 seconds if not acted upon
            setTimeout(() => {
              setNotifications(prev => prev.filter(n => n.id !== notification.id));
            }, 30000);
          }
        });
      } catch (error) {
        console.error('Failed to setup WebSocket for notifications:', error);
      }
    };

    setupWebSocket();

    return () => {
      if (webSocketService.isConnected()) {
        webSocketService.unsubscribe(`/topic/meeting/${roomId}/join-requests`);
      }
    };
  }, [roomId]);

  const handleApprove = async (notification) => {
    setProcessing(prev => new Set(prev).add(notification.participantId));
    
    try {
      await videoCallService.approveParticipant(roomId, notification.participantId);
      
      // Remove notification
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
      
      if (onApprove) {
        onApprove(notification.participantId);
      }
    } catch (error) {
      console.error('Error approving participant:', error);
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(notification.participantId);
        return newSet;
      });
    }
  };

  const handleReject = async (notification) => {
    setProcessing(prev => new Set(prev).add(notification.participantId));
    
    try {
      await videoCallService.rejectParticipant(roomId, notification.participantId);
      
      // Remove notification
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
      
      if (onReject) {
        onReject(notification.participantId);
      }
    } catch (error) {
      console.error('Error rejecting participant:', error);
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(notification.participantId);
        return newSet;
      });
    }
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-slide-in-right"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <BellIcon className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Join Request</p>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center mt-1">
                <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                <p className="text-sm text-gray-600">{notification.participantName}</p>
              </div>
              
              <p className="text-xs text-gray-500 mt-1">
                wants to join the meeting
              </p>
              
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleApprove(notification)}
                  disabled={processing.has(notification.participantId)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing.has(notification.participantId) ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CheckIcon className="h-3 w-3 mr-1" />
                      Approve
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleReject(notification)}
                  disabled={processing.has(notification.participantId)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing.has(notification.participantId) ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                  ) : (
                    <>
                      <XMarkIcon className="h-3 w-3 mr-1" />
                      Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JoinRequestNotification;