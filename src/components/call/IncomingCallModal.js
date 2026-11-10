import React from 'react';
import { PhoneIcon } from '@heroicons/react/24/solid';

const IncomingCallModal = ({ incoming, onAccept, onReject }) => {
  if (!incoming) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <PhoneIcon className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Incoming call</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {incoming.title || 'Mentor is calling'}
            </p>
          </div>
        </div>

        <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:bg-slate-900/60 dark:text-slate-400">
          Room: <span className="font-medium text-gray-700 dark:text-slate-300">{incoming.roomId}</span>
        </p>

        <div className="mt-6 flex gap-3">
          <button onClick={onAccept} className="btn-primary flex-1">
            Accept
          </button>
          <button onClick={onReject} className="btn-secondary flex-1">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
