import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const StudentProfile = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState({
    mentor: {
      name: 'Dr. Sarah Wilson',
      expertise: ['Web Development', 'React', 'Node.js'],
      email: 'sarah.wilson@example.com'
    },
    progress: {
      completedSessions: 8,
      upcomingSessions: 2,
      tasksCompleted: 15,
      totalTasks: 20
    },
    skills: [
      { name: 'React', progress: 75 },
      { name: 'JavaScript', progress: 85 },
      { name: 'Node.js', progress: 60 },
      { name: 'Git', progress: 90 }
    ]
  });

  // In a real application, fetch this data from your backend
  useEffect(() => {
    // Add actual API call here
  }, []);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Student Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and learning progress</p>
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
              <dt className="text-sm font-medium text-gray-500">Batch</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.batch || 'Not assigned'}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Mentor Information */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Mentor Information</h3>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-xl font-medium text-indigo-600">
                    {studentData.mentor.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">{studentData.mentor.name}</h4>
                <p className="text-sm text-gray-500">{studentData.mentor.email}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {studentData.mentor.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Completed Sessions</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {studentData.progress.completedSessions}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Sessions</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {studentData.progress.upcomingSessions}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Tasks Progress</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {studentData.progress.tasksCompleted}/{studentData.progress.totalTasks}
            </dd>
          </div>
        </div>
      </div>

      {/* Skills Progress */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Skills Progress</h3>
          <div className="mt-4 space-y-6">
            {studentData.skills.map((skill, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">{skill.name}</div>
                  <div className="text-sm font-medium text-gray-500">{skill.progress}%</div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${skill.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
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

export default StudentProfile; 