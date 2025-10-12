import React from 'react';
import { CheckCircleIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

const ApprovalSuccess = ({ meetingTitle, onJoinVideoCall }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Request Approved!</h3>
        <p className="text-sm text-gray-500 mb-6">
          Your request to join "{meetingTitle}" has been approved by the host.
        </p>
        <button
          onClick={onJoinVideoCall}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <VideoCameraIcon className="h-5 w-5 mr-2" />
          Join Video Call
        </button>
      </div>
    </div>
  );
};

export default ApprovalSuccess;