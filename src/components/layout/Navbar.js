import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-white text-xl font-bold">MenteeConnect</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md">
              Dashboard
            </Link>
            <Link to="/mentors" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md">
              Find Mentors
            </Link>
            <Link to="/sessions" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md">
              Sessions
            </Link>
            <Link to="/profile" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 