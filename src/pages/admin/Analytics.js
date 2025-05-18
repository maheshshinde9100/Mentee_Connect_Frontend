import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { adminService } from '../../services/api';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAnalytics();
      setAnalyticsData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading analytics data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  const { userCounts, departmentStats, studentStats, mentorStats } = analyticsData;

  // Transform data for charts
  const userDistributionData = [
    { name: 'Students', value: userCounts.totalStudents },
    { name: 'Mentors', value: userCounts.totalMentors },
    { name: 'Admins', value: userCounts.totalAdmins }
  ];

  const departmentData = Object.entries(departmentStats.studentsPerDepartment).map(([name, value]) => ({
    name,
    students: value,
    mentors: departmentStats.mentorsPerDepartment[name] || 0,
    avgCGPA: departmentStats.averageCgpaByDepartment[name] || 0
  }));

  const semesterData = Object.entries(studentStats.studentsBySemester).map(([semester, count]) => ({
    name: `Semester ${semester}`,
    students: count
  }));

  const mentorExperienceData = Object.entries(mentorStats.mentorsByExperience).map(([range, count]) => ({
    name: range,
    value: count
  }));

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of mentorship program metrics and performance indicators
        </p>
      </div>

      {/* Time Frame Selector */}
      <div className="mb-6">
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="mt-1 block w-48 rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="7days">Last 7 Days</option>
          <option value="1month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{userCounts.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{userCounts.activeUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Mentors</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{userCounts.totalMentors}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{userCounts.totalStudents}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">User Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDistributionData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {userDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Department Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#8884d8" name="Students" />
              <Bar dataKey="mentors" fill="#82ca9d" name="Mentors" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Students per Semester */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Students per Semester</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={semesterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#8884d8" name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mentor Experience Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Mentor Experience</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mentorExperienceData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {mentorExperienceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Mentors */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Top Performing Mentors</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {mentorStats.topPerformingMentors.map((mentor) => (
              <div key={mentor.mentorId} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{mentor.mentorName}</h3>
                    <p className="text-sm text-gray-500">ID: {mentor.mentorId}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Students: {mentor.studentCount}</p>
                    <p>Avg. CGPA: {mentor.averageStudentCgpa.toFixed(2)}</p>
                    <p>Attendance: {(mentor.averageStudentAttendance * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 