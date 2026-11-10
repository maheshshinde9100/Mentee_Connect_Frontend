import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminProfile from './AdminProfile';
import MentorProfile from './MentorProfile';
import StudentProfile from './StudentProfile';

const Profile = () => {
  const { user } = useAuth();

  const renderProfileByRole = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <AdminProfile />;
      case 'MENTOR':
        return <MentorProfile />;
      case 'STUDENT':
      case 'MENTEE':
        return <StudentProfile />;
      default:
        return (
          <div className="card card-pad text-center">
            <h2 className="page-title">Profile Not Found</h2>
            <p className="mt-2 muted">Please log in to view your profile.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderProfileByRole()}
      </div>
    </div>
  );
};

export default Profile; 