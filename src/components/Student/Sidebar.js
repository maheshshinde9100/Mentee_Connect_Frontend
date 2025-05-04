import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md h-screen fixed">
      <div className="p-4 text-2xl font-bold text-purple-600 border-b">Student Panel</div>
      <nav className="p-4">
        <ul className="space-y-3">
          <li>
            <Link to="/student/dashboard" className="block p-2 rounded hover:bg-purple-100">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/student/profile" className="block p-2 rounded hover:bg-purple-100">
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
