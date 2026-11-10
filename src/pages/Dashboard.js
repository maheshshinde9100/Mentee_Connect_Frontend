import React from 'react';

const Dashboard = () => {
  // Mock data - In real app, this would come from your Spring Boot backend
  const upcomingSessions = [
    { id: 1, mentor: "Dr. Thor Odinson", topic: "Career Guidance", date: "2024-03-20", time: "14:00" },
    { id: 2, mentor: "Prof. Loki", topic: "Academic Planning", date: "2024-03-22", time: "15:30" }
  ];

  const recentActivities = [
    { id: 1, type: "Session Completed", description: "Database Design with Prof. Anderson", date: "2024-03-15" },
    { id: 2, type: "Assignment Submitted", description: "System Architecture Review", date: "2024-03-14" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="card card-pad">
          <h1 className="page-title">Welcome back, Student!</h1>
          <p className="page-subtitle">Here's an overview of your mentoring journey</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Upcoming Sessions */}
          <div className="card card-pad">
            <h2 className="section-title mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700/70 dark:bg-slate-900/40">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-brand-700 dark:text-brand-300">{session.topic}</p>
                      <p className="muted text-sm">with {session.mentor}</p>
                    </div>
                    <div className="text-right muted text-sm">
                      <p>{session.date}</p>
                      <p>{session.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-secondary mt-4">
              Schedule New Session
            </button>
          </div>

          {/* Recent Activities */}
          <div className="card card-pad">
            <h2 className="section-title mb-4">Recent Activities</h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, index) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {index !== recentActivities.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-slate-700" aria-hidden="true" />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center ring-8 ring-white dark:ring-slate-800">
                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="muted text-sm">{activity.type}: <span className="font-medium text-gray-900 dark:text-white">{activity.description}</span></p>
                          </div>
                          <div className="text-right whitespace-nowrap muted text-sm">
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

        {/* Progress Section */}
        <div>
          <h2 className="section-title mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="card card-pad">
              <p className="muted text-sm font-medium">Sessions Completed</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">12</p>
            </div>
            <div className="card card-pad">
              <p className="muted text-sm font-medium">Skills Acquired</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">8</p>
            </div>
            <div className="card card-pad">
              <p className="muted text-sm font-medium">Achievements</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
