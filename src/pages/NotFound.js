import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="text-xl mt-4 text-gray-700">Oops! The page you're looking for does not exist.</p>
        <Link to="/login" className="mt-6 inline-block text-blue-600 hover:text-blue-800 font-semibold">
          Go back to Login
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
