import React, { useState, useCallback } from 'react';
import useFetchGuard from '../../hooks/useFetchGuard';
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

  const fetchAnalytics = useCallback(async (isCancelled) => {
    try {
      setLoading(true);
      const response = await adminService.getAnalytics();
      const payload = response?.data;
      if (!isCancelled() && payload?.userCounts) {
        setAnalyticsData(payload);
        setError(null);
      } else if (!isCancelled()) {
        setError('Analytics response format was unexpected');
      }
    } catch (err) {
      if (!isCancelled()) {
        setError('Failed to fetch analytics data');
        console.error(err);
      }
    } finally {
      if (!isCancelled()) setLoading(false);
    }
  }, []);

  useFetchGuard(fetchAnalytics, []);

  const COLORS = ['#7065f0', '#475569', '#94a3b8', '#a5b4fc', '#cbd5e1'];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="alert-error">
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
    <div className="space-y-8 p-6">
      <div>
        <h1 className="page-title">Analytics Dashboard</h1>
        <p className="page-subtitle">
          Overview of mentorship program metrics and performance indicators
        </p>
      </div>

      {/* Time Frame Selector */}
      <div>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="select w-48"
        >
          <option value="7days">Last 7 Days</option>
          <option value="1month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="card card-pad">
          <h3 className="text-sm font-medium muted">Total Users</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{userCounts.totalUsers}</p>
        </div>
        <div className="card card-pad">
          <h3 className="text-sm font-medium muted">Active Users</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{userCounts.activeUsers}</p>
        </div>
        <div className="card card-pad">
          <h3 className="text-sm font-medium muted">Total Mentors</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{userCounts.totalMentors}</p>
        </div>
        <div className="card card-pad">
          <h3 className="text-sm font-medium muted">Total Students</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{userCounts.totalStudents}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Distribution */}
        <div className="card card-pad">
          <h2 className="section-title mb-4">User Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDistributionData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#7065f0"
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
        <div className="card card-pad">
          <h2 className="section-title mb-4">Department Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#7065f0" name="Students" />
              <Bar dataKey="mentors" fill="#94a3b8" name="Mentors" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Students per Semester */}
        <div className="card card-pad">
          <h2 className="section-title mb-4">Students per Semester</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={semesterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#7065f0" name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mentor Experience Distribution */}
        <div className="card card-pad">
          <h2 className="section-title mb-4">Mentor Experience</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mentorExperienceData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#7065f0"
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
      <div>
        <div className="card">
          <div className="border-b border-gray-200 px-5 py-4 dark:border-slate-700/70">
            <h2 className="section-title">Top Performing Mentors</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-slate-700/60">
            {mentorStats.topPerformingMentors.map((mentor) => (
              <div key={mentor.mentorId} className="px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{mentor.mentorName}</h3>
                    <p className="text-sm muted">ID: {mentor.mentorId}</p>
                  </div>
                  <div className="text-right text-sm muted">
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