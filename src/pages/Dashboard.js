import React from 'react';

const Dashboard = () => {
  // Mock data - In real app, this would come from your Spring Boot backend
  const upcomingSessions = [
    { id: 1, mentor: "Dr. Sarah Wilson", topic: "Career Guidance", date: "2024-03-20", time: "14:00" },
    { id: 2, mentor: "Prof. James Miller", topic: "Academic Planning", date: "2024-03-22", time: "15:30" }
  ];

  const recentActivities = [
    { id: 1, type: "Session Completed", description: "Database Design with Prof. Anderson", date: "2024-03-15" },
    { id: 2, type: "Assignment Submitted", description: "System Architecture Review", date: "2024-03-14" }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg mb-6">
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-gray-900">Welcome back, Student!</h1>
              <p className="mt-1 text-gray-600">Here's an overview of your mentoring journey</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Upcoming Sessions */}
            <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Sessions</h2>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="border-l-4 border-indigo-500 bg-indigo-50 p-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-indigo-800">{session.topic}</p>
                          <p className="text-sm text-gray-600">with {session.mentor}</p>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{session.date}</p>
                          <p>{session.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                  Schedule New Session
                </button>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h2>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentActivities.map((activity, index) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {index !== recentActivities.length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">{activity.type}: <span className="font-medium text-gray-900">{activity.description}</span></p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time dateTime={activity.date}>{activity.date}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="mt-6 bg-white overflow-hidden shadow-xl sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Progress</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-indigo-800">Sessions Completed</p>
                  <p className="mt-2 text-3xl font-semibold text-indigo-600">12</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Skills Acquired</p>
                  <p className="mt-2 text-3xl font-semibold text-green-600">8</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-purple-800">Achievements</p>
                  <p className="mt-2 text-3xl font-semibold text-purple-600">5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 