import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const StudentLayout = () => {
    const { logout } = useAuth();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="bg-purple-800 text-white w-64 p-4">
                <h1 className="text-2xl font-bold mb-8">Student Panel</h1>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/student" className="block py-2 px-4 rounded hover:bg-purple-700">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/student/mentor" className="block py-2 px-4 rounded hover:bg-purple-700">
                                My Mentor
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={logout}
                                className="block py-2 px-4 rounded hover:bg-purple-700 w-full text-left"
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

export default StudentLayout;