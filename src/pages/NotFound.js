import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Text */}
        <h1 className="text-9xl font-bold text-indigo-600 animate-bounce">404</h1>
        
        {/* Main Message */}
        <h2 className="mt-8 text-3xl font-bold text-gray-900 sm:text-4xl">Page not found</h2>
        <p className="mt-4 text-lg text-gray-600">
          Sorry, we couldn't find the page you're looking for. The URL might be incorrect, or the page may have been moved or deleted.
        </p>

        {/* MenteeConnect Logo/Text */}
        <div className="mt-6 text-xl font-semibold text-indigo-600">
          MenteeConnect
        </div>

        {/* Back to Home Button */}
        <div className="mt-10">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>

        {/* Additional Links */}
        <div className="mt-8 space-x-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Go to Dashboard
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={() => navigate('/contact')}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 