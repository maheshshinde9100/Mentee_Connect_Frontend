import React from 'react';
import AddMentor from './AddMentor';
import AddStudent from './AddStudent';

const ManageMentorsMentees = () => {
  return (
    <div className="py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Mentors & Mentees</h1>
          <p className="text-gray-600 dark:text-gray-400">Add new mentors and students with credentials.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <AddMentor />
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <AddStudent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMentorsMentees;

