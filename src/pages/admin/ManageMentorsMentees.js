import React from 'react';
import AddMentor from './AddMentor';
import AddStudent from './AddStudent';

const ManageMentorsMentees = () => {
  return (
    <div className="py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="page-title">Manage Mentors &amp; Mentees</h1>
          <p className="page-subtitle">Add new mentors and students with credentials.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card card-pad">
            <AddMentor />
          </div>
          <div className="card card-pad">
            <AddStudent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMentorsMentees;

