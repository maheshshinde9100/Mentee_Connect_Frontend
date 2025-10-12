import React, { useEffect, useRef, useState } from 'react';
import { videoCallService } from '../../services/meetingService';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MicrophoneIcon, 
  VideoCameraIcon, 
  PhoneXMarkIcon,
  ComputerDesktopIcon,
  UsersIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const VideoCallInterface = ({ roomId, meetingDetails, onLeave, onEnd, isHost = false }) => {
  const { user } = useAuth();
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [containerReady, setContainerReady] = useState(false);

  // Effect to check if container is ready
  useEffect(() => {
    if (jitsiContainerRef.current) {
      setContainerReady(true);
    }
  }, []);

  useEffect(() => {
    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initializeJitsi = async () => {
      try {
        await loadJitsiScript();
        
        // Wait for the container to be available with multiple attempts
        let attempts = 0;
        while (!jitsiContainerRef.current && attempts < 10) {
          console.log(`Waiting for Jitsi container... attempt ${attempts + 1}`);
          await new Promise(resolve => setTimeout(resolve, 200));
          attempts++;
        }
        
        if (!jitsiContainerRef.current) {
          throw new Error('Jitsi container not available after waiting');
        }
        
        console.log('Jitsi container is ready, initializing...');
        
        const domain = 'meet.jit.si';
        const options = {
          roomName: `MenteeConnect_${roomId}`,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: user?.name || 'User',
            email: user?.email || ''
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            prejoinPageEnabled: false,
            disableModeratorIndicator: false,
            startScreenSharing: false,
            enableEmailInStats: false
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
            ],
            SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: '',
            SHOW_POWERED_BY: false,
            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            SHOW_CHROME_EXTENSION_BANNER: false
          }
        };

        jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

        // Event listeners
        jitsiApiRef.current.addEventListener('videoConferenceJoined', (event) => {
          console.log('Joined video conference:', event);
          setLoading(false);
          setMeetingStarted(true);
        });

        jitsiApiRef.current.addEventListener('participantJoined', (event) => {
          console.log('Participant joined:', event);
          setParticipants(prev => [...prev, event.participant]);
        });

        jitsiApiRef.current.addEventListener('participantLeft', (event) => {
          console.log('Participant left:', event);
          setParticipants(prev => prev.filter(p => p.id !== event.participant.id));
        });

        jitsiApiRef.current.addEventListener('videoConferenceLeft', () => {
          console.log('Left video conference');
          if (onLeave) {
            onLeave();
          }
        });

        jitsiApiRef.current.addEventListener('readyToClose', () => {
          console.log('Ready to close');
          if (onLeave) {
            onLeave();
          }
        });

      } catch (error) {
        console.error('Error initializing Jitsi:', error);
        setError('Failed to initialize video call. Please try again.');
        setLoading(false);
      }
    };

    if (roomId && containerReady) {
      // Add a small delay to ensure the component is fully mounted
      const timer = setTimeout(() => {
        initializeJitsi();
      }, 100);
      
      return () => {
        clearTimeout(timer);
      };
    }

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [roomId, user, onLeave, containerReady]);

  const handleStartMeeting = async () => {
    if (isHost) {
      try {
        await videoCallService.startMeeting(roomId);
        setMeetingStarted(true);
      } catch (error) {
        console.error('Error starting meeting:', error);
        setError('Failed to start meeting');
      }
    }
  };

  const handleEndMeeting = async () => {
    if (isHost) {
      try {
        await videoCallService.endMeeting(roomId);
        if (jitsiApiRef.current) {
          jitsiApiRef.current.executeCommand('hangup');
        }
        if (onEnd) {
          onEnd();
        }
      } catch (error) {
        console.error('Error ending meeting:', error);
        setError('Failed to end meeting');
      }
    }
  };

  const handleLeaveMeeting = async () => {
    try {
      await videoCallService.leaveMeeting(roomId);
      if (jitsiApiRef.current) {
        jitsiApiRef.current.executeCommand('hangup');
      }
      if (onLeave) {
        onLeave();
      }
    } catch (error) {
      console.error('Error leaving meeting:', error);
      // Still try to leave the UI even if API call fails
      if (jitsiApiRef.current) {
        jitsiApiRef.current.executeCommand('hangup');
      }
      if (onLeave) {
        onLeave();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading video call...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg">
        <div className="text-center">
          <InformationCircleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={onLeave}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Meeting Info Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {meetingDetails?.title || 'Video Meeting'}
              </h2>
              <p className="text-sm text-gray-500">
                Room ID: {roomId} • {participants.length + 1} participant(s)
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isHost && !meetingStarted && (
              <button
                onClick={handleStartMeeting}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <VideoCameraIcon className="h-4 w-4 mr-1" />
                Start Meeting
              </button>
            )}
            
            <button
              onClick={handleLeaveMeeting}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
            >
              <PhoneXMarkIcon className="h-4 w-4 mr-1" />
              Leave
            </button>
            
            {isHost && (
              <button
                onClick={handleEndMeeting}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <PhoneXMarkIcon className="h-4 w-4 mr-1" />
                End Meeting
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Jitsi Meet Container */}
      <div className="flex-1 bg-black">
        <div ref={jitsiContainerRef} className="jitsi-container" />
      </div>
    </div>
  );
};

export default VideoCallInterface;