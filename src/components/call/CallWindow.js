import React, { useMemo, useState, useEffect } from 'react';

const VideoTile = ({ label, stream }) => {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    } else if (videoRef.current && !stream) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  return (
    <div className="bg-black rounded-lg overflow-hidden relative min-h-[200px]">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted={label === 'You'}
      />
      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
          No video
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">{label}</div>
    </div>
  );
};

const CallWindow = ({ localStream, remoteStreams, onEnd, minimized, onToggleSize }) => {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Keep toggle state in sync if stream appears/disappears
  useEffect(() => {
    if (!localStream) return;
    const hasVideo = localStream.getVideoTracks().some((t) => t.enabled);
    const hasAudio = localStream.getAudioTracks().some((t) => t.enabled);
    setVideoEnabled(hasVideo || localStream.getVideoTracks().length === 0);
    setAudioEnabled(hasAudio || localStream.getAudioTracks().length === 0);
  }, [localStream]);

  const toggleVideo = () => {
    if (!localStream) return;
    const newValue = !videoEnabled;
    localStream.getVideoTracks().forEach((t) => {
      t.enabled = newValue;
    });
    setVideoEnabled(newValue);
  };

  const toggleAudio = () => {
    if (!localStream) return;
    const newValue = !audioEnabled;
    localStream.getAudioTracks().forEach((t) => {
      t.enabled = newValue;
    });
    setAudioEnabled(newValue);
  };

  const remoteList = useMemo(() => Object.entries(remoteStreams || {}), [remoteStreams]);

  return (
    <div
      className={`fixed ${minimized ? 'bottom-4 right-4 w-64 h-40' : 'inset-0'} z-40 bg-gray-900/80 backdrop-blur`}
    >
      <div className={`bg-white dark:bg-slate-800 shadow-lg ${minimized ? 'rounded-lg h-full' : 'h-full'} flex flex-col`}>
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="font-semibold text-gray-800 dark:text-gray-100">Live Call</div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleVideo}
              className={`text-xs px-2 py-1 rounded border ${
                videoEnabled
                  ? 'border-gray-300 dark:border-slate-600 hover:bg-gray-100'
                  : 'border-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300'
              }`}
              disabled={!localStream}
            >
              {videoEnabled ? 'Video On' : 'Video Off'}
            </button>
            <button
              onClick={toggleAudio}
              className={`text-xs px-2 py-1 rounded border ${
                audioEnabled
                  ? 'border-gray-300 dark:border-slate-600 hover:bg-gray-100'
                  : 'border-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300'
              }`}
              disabled={!localStream}
            >
              {audioEnabled ? 'Mic On' : 'Mic Off'}
            </button>
            <button
              onClick={onToggleSize}
              className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-slate-600 hover:bg-gray-100"
            >
              {minimized ? 'Maximize' : 'Minimize'}
            </button>
            <button
              onClick={onEnd}
              className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            >
              End
            </button>
          </div>
        </div>
        <div className="p-4 grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-auto flex-1">
          <VideoTile label="You" stream={localStream} />
          {remoteList.length === 0 && (
            <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center">Waiting for participants...</div>
          )}
          {remoteList.map(([id, stream]) => (
            <VideoTile key={id} label={`Participant ${id}`} stream={stream} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CallWindow;

