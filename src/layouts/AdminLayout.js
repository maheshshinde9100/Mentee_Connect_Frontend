import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="bg-blue-800 text-white w-64 p-4">
                <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/admin" className="block py-2 px-4 rounded hover:bg-blue-700">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/assign-mentor" className="block py-2 px-4 rounded hover:bg-blue-700">
                                Assign Mentor
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/mentors" className="block py-2 px-4 rounded hover:bg-blue-700">
                                Mentors
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/students" className="block py-2 px-4 rounded hover:bg-blue-700">
                                Students
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/batches" className="block py-2 px-4 rounded hover:bg-blue-700">
                                Batches
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={logout}
                                className="block py-2 px-4 rounded hover:bg-blue-700 w-full text-left"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;