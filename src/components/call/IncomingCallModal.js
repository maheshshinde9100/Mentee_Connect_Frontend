import React from 'react';

const IncomingCallModal = ({ incoming, onAccept, onReject }) => {
  if (!incoming) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <div className="text-lg font-semibold text-gray-900 mb-2">Incoming Call</div>
        <p className="text-sm text-gray-600 mb-4">
          {incoming.title || 'Mentor is calling'} (Room: {incoming.roomId})
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onAccept}
            className="flex-1 inline-flex justify-center px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="flex-1 inline-flex justify-center px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;

