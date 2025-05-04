import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md h-screen fixed">
      <div className="p-4 text-2xl font-bold text-blue-600 border-b">Admin Panel</div>
      <nav className="p-4">
        <ul className="space-y-3">
          <li>
            <Link to="/admin/dashboard" className="block p-2 rounded hover:bg-blue-100">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/assign-mentor" className="block p-2 rounded hover:bg-blue-100">
              Assign Mentor
            </Link>
          </li>
          <li>
            <Link to="/mentors" className="block p-2 rounded hover:bg-blue-100">
              Mentor List
            </Link>
          </li>
          <li>
            <Link to="/students" className="block p-2 rounded hover:bg-blue-100">
              Student List
            </Link>
          </li>
          <li>
            <Link to="/batches" className="block p-2 rounded hover:bg-blue-100">
              Batch List
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
