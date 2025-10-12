import React, { useState } from 'react';
import webSocketService from '../../services/websocketService';
import { enableMockMode } from '../../services/mockMeetingService';

const DebugInfo = ({ roomId, show = false }) => {
  const [mockEnabled, setMockEnabled] = useState(false);

  if (!show || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleEnableMock = () => {
    enableMockMode();
    setMockEnabled(true);
  };

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-sm">
      <h4 className="font-bold mb-2">Debug Info</h4>
      <div className="space-y-1">
        <div>Room ID: {roomId}</div>
        <div>WebSocket Connected: {webSocketService.isConnected() ? '✅' : '❌'}</div>
        <div>Jitsi API Available: {window.JitsiMeetExternalAPI ? '✅' : '❌'}</div>
        <div>Environment: {process.env.NODE_ENV}</div>
        <div>Mock Mode: {mockEnabled ? '✅' : '❌'}</div>
      </div>
      
      {!mockEnabled && (
        <button
          onClick={handleEnableMock}
          className="mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
        >
          Enable Mock Mode
        </button>
      )}
    </div>
  );
};

export default DebugInfo;