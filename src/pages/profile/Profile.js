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
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">Profile Not Found</h2>
            <p className="mt-2 text-gray-600">Please log in to view your profile.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderProfileByRole()}
      </div>
    </div>
  );
};

export default Profile; 