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
    <div className="relative min-h-[200px] overflow-hidden rounded-lg bg-black">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        autoPlay
        playsInline
        muted={label === 'You'}
      />
      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-white/70">
          No video
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 text-xs text-white">{label}</div>
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
      className={`fixed z-40 bg-slate-900/80 backdrop-blur ${minimized ? 'bottom-4 right-4 h-40 w-64' : 'inset-0'}`}
    >
      <div className={`flex h-full flex-col bg-white shadow-lg dark:bg-slate-800 ${minimized ? 'rounded-lg' : ''}`}>
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5 dark:border-slate-700">
          <div className="text-sm font-semibold text-gray-800 dark:text-slate-100">Live Call</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleVideo}
              className={videoEnabled ? 'btn-secondary btn-sm' : 'btn-sm border border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300'}
              disabled={!localStream}
            >
              {videoEnabled ? 'Video On' : 'Video Off'}
            </button>
            <button
              type="button"
              onClick={toggleAudio}
              className={audioEnabled ? 'btn-secondary btn-sm' : 'btn-sm border border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300'}
              disabled={!localStream}
            >
              {audioEnabled ? 'Mic On' : 'Mic Off'}
            </button>
            <button
              type="button"
              onClick={onToggleSize}
              className="btn-secondary btn-sm"
            >
              {minimized ? 'Maximize' : 'Minimize'}
            </button>
            <button
              type="button"
              onClick={onEnd}
              className="btn-danger btn-sm"
            >
              End
            </button>
          </div>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-3 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <VideoTile label="You" stream={localStream} />
          {remoteList.length === 0 && (
            <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">Waiting for participants...</div>
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
