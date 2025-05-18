import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({
    mentorEngagement: null,
    studentProgress: null,
    meetingMetrics: null
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [mentorEngagement, studentProgress, meetingMetrics] = await Promise.all([
        adminService.getMentorEngagement(),
        adminService.getStudentProgress(),
        adminService.getMeetingMetrics()
      ]);

      setAnalytics({
        mentorEngagement: mentorEngagement.data,
        studentProgress: studentProgress.data,
        meetingMetrics: meetingMetrics.data
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Mentor Engagement Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Mentor Engagement</h3>
            <div className="mt-4">
              <dl>
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">Active Mentors</dt>
                  <dd className="text-lg font-semibold text-indigo-600">
                    {analytics.mentorEngagement?.activeMentors || 0}
                  </dd>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <dt className="text-sm font-medium text-gray-500">Average Sessions/Week</dt>
                  <dd className="text-lg font-semibold text-indigo-600">
                    {analytics.mentorEngagement?.averageSessionsPerWeek || 0}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Student Progress Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Student Progress</h3>
            <div className="mt-4">
              <dl>
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">Active Students</dt>
                  <dd className="text-lg font-semibold text-green-600">
                    {analytics.studentProgress?.activeStudents || 0}
                  </dd>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <dt className="text-sm font-medium text-gray-500">Average Progress</dt>
                  <dd className="text-lg font-semibold text-green-600">
                    {analytics.studentProgress?.averageProgress || 0}%
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Meeting Metrics Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Meeting Metrics</h3>
            <div className="mt-4">
              <dl>
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">Total Meetings</dt>
                  <dd className="text-lg font-semibold text-blue-600">
                    {analytics.meetingMetrics?.totalMeetings || 0}
                  </dd>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <dt className="text-sm font-medium text-gray-500">Completion Rate</dt>
                  <dd className="text-lg font-semibold text-blue-600">
                    {analytics.meetingMetrics?.completionRate || 0}%
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics Sections */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Statistics</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Mentor Distribution</h4>
              {/* Add charts or detailed stats here */}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Student Performance</h4>
              {/* Add charts or detailed stats here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 