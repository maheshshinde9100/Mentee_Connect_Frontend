import React, { useState } from 'react';
import { videoCallService } from '../../services/meetingService';
import { useAuth } from '../../contexts/AuthContext';
import { VideoCameraIcon, CheckIcon } from '@heroicons/react/24/outline';
import CopyButton from './CopyButton';

const CreateMeeting = ({ onMeetingCreated }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledTime: '',
    maxParticipants: 10,
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdMeeting, setCreatedMeeting] = useState(null);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const meetingData = {
        ...formData,
        scheduledTime: formData.scheduledTime || new Date().toISOString(),
        maxParticipants: parseInt(formData.maxParticipants)
      };

      const response = await videoCallService.createMeeting(meetingData);
      setCreatedMeeting(response);

      // Reset form
      setFormData({
        title: '',
        description: '',
        scheduledTime: '',
        maxParticipants: 10,
        password: ''
      });

      if (onMeetingCreated) {
        onMeetingCreated(response, true); // Pass true to indicate auto-start
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };



  const closeSuccessModal = () => {
    setCreatedMeeting(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <VideoCameraIcon className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Create New Meeting</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Meeting Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter meeting title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Meeting description (optional)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-1">
              Scheduled Time
            </label>
            <input
              type="datetime-local"
              id="scheduledTime"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
              Max Participants
            </label>
            <select
              id="maxParticipants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5 participants</option>
              <option value={10}>10 participants</option>
              <option value={20}>20 participants</option>
              <option value={50}>50 participants</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Meeting Password (Optional)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter password for meeting security"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Meeting...
            </>
          ) : (
            <>
              <VideoCameraIcon className="h-4 w-4 mr-2" />
              Create Meeting
            </>
          )}
        </button>
      </form>

      {/* Success Modal */}
      {createdMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Meeting Created Successfully!</h3>
              <p className="text-sm text-gray-500 mb-4">
                Room ID: <span className="font-mono font-medium">{createdMeeting.roomId}</span>
              </p>
            </div>

            <div className="space-y-4 mb-4">
              <div className="bg-gray-50 rounded-md p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Room ID:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={createdMeeting.roomId}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white font-mono"
                  />
                  <CopyButton text={createdMeeting.roomId} label="Copy ID" />
                </div>
              </div>

              <div className="bg-gray-50 rounded-md p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shareable Link:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={createdMeeting.joinLink}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
                  />
                  <CopyButton text={createdMeeting.joinLink} label="Copy Link" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={closeSuccessModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMeeting;