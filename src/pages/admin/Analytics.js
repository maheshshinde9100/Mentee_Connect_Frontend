import React, { useState } from 'react';
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

const Analytics = () => {
  // Sample data - Replace with API calls later
  const mentorshipData = {
    totalMentors: 45,
    totalMentees: 110,
    activeMentorships: 85,
    completedMentorships: 25,
    averageRating: 4.5
  };

  const monthlyMentorshipData = [
    { month: 'Jan', mentorships: 65, meetings: 120 },
    { month: 'Feb', mentorships: 75, meetings: 135 },
    { month: 'Mar', mentorships: 85, meetings: 150 },
    { month: 'Apr', mentorships: 95, meetings: 165 },
    { month: 'May', mentorships: 105, meetings: 180 },
    { month: 'Jun', mentorships: 110, meetings: 195 }
  ];

  const departmentDistribution = [
    { name: 'Computer Science', value: 40 },
    { name: 'Information Technology', value: 30 },
    { name: 'Electronics', value: 15 },
    { name: 'AIML', value: 15 }
  ];

  const mentorshipStatus = [
    { name: 'Active', value: 85 },
    { name: 'Completed', value: 25 },
    { name: 'On Hold', value: 10 },
    { name: 'Pending', value: 5 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');

  const renderMetricCard = (title, value, description, icon) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {description && (
            <p className="mt-2 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {icon && (
          <div className="text-indigo-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  );

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
          className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
        {renderMetricCard(
          'Total Mentors',
          mentorshipData.totalMentors,
          'Active mentors in the program'
        )}
        {renderMetricCard(
          'Total Mentees',
          mentorshipData.totalMentees,
          'Registered mentees'
        )}
        {renderMetricCard(
          'Active Mentorships',
          mentorshipData.activeMentorships,
          'Currently ongoing mentorships'
        )}
        {renderMetricCard(
          'Average Rating',
          `${mentorshipData.averageRating}/5`,
          'Overall mentorship satisfaction'
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mentorship Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Mentorship Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyMentorshipData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="mentorships"
                stroke="#8884d8"
                name="Active Mentorships"
              />
              <Line
                type="monotone"
                dataKey="meetings"
                stroke="#82ca9d"
                name="Monthly Meetings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Department Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {departmentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Mentorship Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Mentorship Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mentorshipStatus}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {mentorshipStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyMentorshipData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="mentorships" fill="#8884d8" name="Mentorships" />
              <Bar dataKey="meetings" fill="#82ca9d" name="Meetings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Top Performing Mentors</h3>
          <div className="space-y-4">
            {[
              { name: 'John Doe', rating: 4.9, mentees: 12 },
              { name: 'Jane Smith', rating: 4.8, mentees: 10 },
              { name: 'Mike Johnson', rating: 4.7, mentees: 8 }
            ].map((mentor, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{mentor.name}</p>
                  <p className="text-sm text-gray-500">{mentor.mentees} mentees</p>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-gray-600">{mentor.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Recent Activities</h3>
          <div className="space-y-4">
            {[
              { type: 'Meeting', description: 'Technical Discussion', time: '2 hours ago' },
              { type: 'Assignment', description: 'Project Review', time: '5 hours ago' },
              { type: 'Feedback', description: 'Monthly Assessment', time: '1 day ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upcoming Sessions</h3>
          <div className="space-y-4">
            {[
              { title: 'Code Review', mentor: 'John Doe', time: 'Tomorrow, 10:00 AM' },
              { title: 'Project Discussion', mentor: 'Jane Smith', time: 'Tomorrow, 2:00 PM' },
              { title: 'Technical Interview', mentor: 'Mike Johnson', time: 'Thursday, 11:00 AM' }
            ].map((session, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{session.title}</p>
                  <p className="text-sm text-gray-500">with {session.mentor}</p>
                </div>
                <span className="text-sm text-gray-400">{session.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 