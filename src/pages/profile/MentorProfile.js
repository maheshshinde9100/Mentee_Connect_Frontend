import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MentorProfile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMentees: 0,
    completedSessions: 0,
    averageRating: 0,
  });

  // In a real application, fetch these stats from your backend
  useEffect(() => {
    // Mock data - replace with actual API call
    setStats({
      totalMentees: 12,
      completedSessions: 48,
      averageRating: 4.8,
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Mentor Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal and professional details</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.firstName} {user?.lastName}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.email}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Department</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.department}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Expertise</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {user?.expertise?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                    >
                      {skill}
                    </span>
                  )) || 'Not specified'}
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Mentees</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalMentees}</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Sessions Completed</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.completedSessions}</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.averageRating}/5.0</dd>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View Schedule
        </button>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default MentorProfile; 