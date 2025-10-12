import React, { useState } from 'react';
import { videoCallService } from '../../services/meetingService';
import { useAuth } from '../../contexts/AuthContext';

const JoinMeetingDebug = ({ roomId }) => {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApiEndpoints = async () => {
    setLoading(true);
    const results = {};
    
    // Test different endpoints to see what's available
    const endpoints = [
      '/api/video-calls/available',
      '/api/meetings',
      '/api/video-calls/test',
      '/api/video-calls'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:8080${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        results[endpoint] = {
          status: response.status,
          ok: response.ok,
          data: response.ok ? await response.json() : await response.text()
        };
      } catch (error) {
        results[endpoint] = { error: error.message };
      }
    }
    
    setDebugInfo({ type: 'endpoints', data: results });
    setLoading(false);
  };

  const testMeetingDetails = async () => {
    setLoading(true);
    try {
      const details = await videoCallService.getMeetingDetails(roomId);
      setDebugInfo({ type: 'success', data: details });
    } catch (error) {
      setDebugInfo({ 
        type: 'error', 
        data: {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          url: error.config?.url,
          method: error.config?.method
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const testJoinMeeting = async () => {
    setLoading(true);
    try {
      // Try different data formats to see what works
      const joinDataVariations = [
        {
          roomId: roomId,
          participantName: user?.name || 'Test User',
          participantId: user?.id,
          password: null
        },
        {
          roomId: roomId,
          name: user?.name || 'Test User',
          userId: user?.id,
          password: null
        },
        {
          meetingId: roomId,
          participantName: user?.name || 'Test User',
          participantId: user?.id
        },
        {
          roomId: roomId,
          participant: {
            id: user?.id,
            name: user?.name || 'Test User'
          }
        }
      ];
      
      // Try the first format
      const result = await videoCallService.joinMeeting(joinDataVariations[0]);
      setDebugInfo({ type: 'success', data: result });
    } catch (error) {
      setDebugInfo({ 
        type: 'error', 
        data: {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          url: error.config?.url,
          method: error.config?.method,
          requestData: JSON.parse(error.config?.data || '{}'),
          responseData: error.response?.data
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <h3 className="text-sm font-bold mb-2">Debug Tools</h3>
      <div className="space-x-2 mb-4">
        <button
          onClick={testApiEndpoints}
          disabled={loading}
          className="px-3 py-1 bg-purple-500 text-white text-xs rounded disabled:opacity-50"
        >
          Test API Endpoints
        </button>
        <button
          onClick={testMeetingDetails}
          disabled={loading || !roomId}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded disabled:opacity-50"
        >
          Test Get Meeting Details
        </button>
        <button
          onClick={testJoinMeeting}
          disabled={loading || !roomId}
          className="px-3 py-1 bg-green-500 text-white text-xs rounded disabled:opacity-50"
        >
          Test Join Meeting
        </button>
      </div>
      
      {loading && <div className="text-xs text-gray-600">Loading...</div>}
      
      {debugInfo && (
        <div className={`p-3 rounded text-xs ${
          debugInfo.type === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(debugInfo.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default JoinMeetingDebug;