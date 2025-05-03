import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaChalkboardTeacher, FaUsers, FaLayerGroup } from 'react-icons/fa';

const Sidebar = () => {
    return (
        <aside className="w-64 min-h-screen bg-white shadow-md p-4">
            <h2 className="text-xl font-semibold mb-6 text-center text-blue-600">Admin Panel</h2>
            <nav className="flex flex-col space-y-4">
                <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                    <FaUser /> Admin Dashboard
                </Link>
                <Link to="/admin/assign-mentor" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                    <FaChalkboardTeacher /> Assign Mentor
                </Link>
                <Link to="/students" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                    <FaUsers /> Students
                </Link>
                <Link to="/mentors" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                    <FaChalkboardTeacher /> Mentors
                </Link>
                <Link to="/batches" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                    <FaLayerGroup /> Batches
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;
