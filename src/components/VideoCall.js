import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { meetingService } from '../services/meetingService';
import webRTCService from '../services/webRTCService';
import { useNavigate } from 'react-router-dom';

// Simple video call component that will be enhanced with real video integration
const VideoCall = ({ meetingId, meetingLink, isHost, onEndMeeting, onLeave }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [error, setError] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('pending'); // 'pending', 'granted', 'denied'
  const [loadingState, setLoadingState] = useState('initializing'); // 'initializing', 'joining', 'connected'
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  // Refs for video elements
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const initializationRef = useRef(false);
  const localStreamRef = useRef(null);
  
  const initializeCall = useCallback(async () => {
    if (initializationRef.current) {
      console.log('Video call already initializing, skipping...');
      return;
    }

    try {
      initializationRef.current = true;
      setLoadingState('initializing');
      console.log('Initializing video call for meeting:', meetingId);

      // Wait for the next render cycle to ensure video element is mounted
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get local media stream first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: true
      });
      
      if (!stream) {
        setPermissionStatus('denied');
        setError('Camera and microphone access is required for video calls. Please allow access and try again.');
        return;
      }

      console.log('Got local media stream:', stream.getVideoTracks().length, 'video tracks');

      // Store the local stream
      localStreamRef.current = stream;
      
      // Ensure video element is ready before setting srcObject
      if (localVideoRef.current) {
        console.log('Setting local video stream to video element');
        localVideoRef.current.srcObject = stream;
        // Force video element to play
        try {
          await localVideoRef.current.play();
          console.log('Local video playback started');
        } catch (error) {
          console.error('Error playing local video:', error);
        }
      } else {
        console.error('Local video element not found');
        // Retry after a short delay
        setTimeout(() => {
          if (localVideoRef.current) {
            console.log('Retrying to set local video stream');
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play().catch(error => {
              console.error('Error playing local video on retry:', error);
            });
          }
        }, 500);
      }

      setPermissionStatus('granted');

      // Initialize video call
      const response = await webRTCService.initialize(
        meetingId,
        user.id,
        user.name || 'Mentor',
        'MENTOR'
      );
      
      setRoomId(response.roomId);
      setLoadingState('joining');

      // Join the call after initialization
      await webRTCService.joinCall(
        response.roomId,
        user.id,
        user.name || 'Mentor',
        'MENTOR'
      );

      setIsConnected(true);
      setLoadingState('connected');
    } catch (error) {
      console.error('Error initializing video call:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please try logging in again.');
      } else {
        setError('Failed to initialize video call. Please check your camera and microphone permissions.');
      }
      setPermissionStatus('denied');
    } finally {
      initializationRef.current = false;
    }
  }, [meetingId, user]);

  // Effect to handle video element updates
  useEffect(() => {
    const setupVideo = async () => {
      if (localStreamRef.current && localVideoRef.current) {
        console.log('Setting up local video in useEffect');
        localVideoRef.current.srcObject = localStreamRef.current;
        try {
          await localVideoRef.current.play();
          console.log('Local video playback started in useEffect');
        } catch (error) {
          console.error('Error playing local video in useEffect:', error);
        }
      }
    };

    setupVideo();
  }, []);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      console.log('Setting remote video stream');
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    let isMounted = true;

    const setupCall = async () => {
      if (isMounted) {
        await initializeCall();
      }
    };

    setupCall();

    return () => {
      isMounted = false;
      if (roomId) {
        console.log('Cleaning up video call...');
        // Stop all tracks when leaving
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (remoteStream) {
          remoteStream.getTracks().forEach(track => track.stop());
        }
        webRTCService.leaveCall(roomId, user.id);
      }
    };
  }, [initializeCall, roomId, user.id]);

  useEffect(() => {
    webRTCService.setCallbacks({
      onParticipantJoined: (participantId) => {
        console.log('Participant joined:', participantId);
      },
      onParticipantLeft: (participantId) => {
        console.log('Participant left:', participantId);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      },
      onStreamAdded: (participantId, stream) => {
        console.log('Stream added for participant:', participantId);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      }
    });
  }, []);
  
  const handleLeaveCall = async () => {
    try {
      if (roomId) {
        await webRTCService.leaveCall(roomId, user.id);
      }
      // Stop all tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      // Navigate back to dashboard
      window.location.href = '/mentor/dashboard';
    } catch (error) {
      console.error('Error leaving call:', error);
      // Still navigate back even if there's an error
      window.location.href = '/mentor/dashboard';
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
  
  const handleRetryPermissions = async () => {
    setError(null);
    setPermissionStatus('pending');
    setLoadingState('initializing');
    await initializeCall();
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const copyMeetingLink = () => {
    const meetingLink = `${window.location.origin}/meeting/${meetingId}`;
    navigator.clipboard.writeText(meetingLink);
    alert('Meeting link copied to clipboard!');
  };
  
  if (permissionStatus === 'denied') {
    return (
      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
        <div className="w-full mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
          <p className="mb-4">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={handleRetryPermissions}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
            <button
              onClick={handleLeaveCall}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Leave Call
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (loadingState === 'initializing' || loadingState === 'joining') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-lg text-gray-700">
          {loadingState === 'initializing' ? 'Setting up your meeting...' : 'Joining the meeting...'}
        </p>
      </div>
    );
  }
  
    return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
      {error && (
        <div className="w-full mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="w-full mb-4 p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Meeting ID: {meetingId}</p>
            <p className="text-sm text-gray-600">Room ID: {roomId}</p>
          </div>
          <button
            onClick={() => setShowShareDialog(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Share Meeting
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-4xl mb-4">
        <div className="relative">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-lg shadow-lg bg-gray-900"
            style={{ transform: 'scaleX(-1)' }} // Mirror the video
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            You
            </div>
        </div>
        <div className="relative">
              <video
            ref={remoteVideoRef}
                autoPlay
                playsInline
            className="w-full rounded-lg shadow-lg bg-gray-900"
              />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            Remote User
            </div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={toggleVideo}
          className={`px-4 py-2 rounded ${
            isVideoEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
          } text-white`}
        >
          {isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}
        </button>
        <button
          onClick={toggleAudio}
          className={`px-4 py-2 rounded ${
            isAudioEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
          } text-white`}
        >
          {isAudioEnabled ? 'Mute' : 'Unmute'}
        </button>
        <button
          onClick={handleLeaveCall}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Leave Call
        </button>
      </div>

      {showShareDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Share Meeting</h3>
            <p className="text-sm text-gray-600 mb-2">Meeting ID: {meetingId}</p>
            <p className="text-sm text-gray-600 mb-4">Share this link with your mentees:</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/meeting/${meetingId}`}
                className="flex-1 px-3 py-2 border rounded"
              />
              <button
                onClick={copyMeetingLink}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => setShowShareDialog(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall; 