import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MentorLayout = () => {
    const { logout } = useAuth();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="bg-green-800 text-white w-64 p-4">
                <h1 className="text-2xl font-bold mb-8">Mentor Panel</h1>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/mentor" className="block py-2 px-4 rounded hover:bg-green-700">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/mentor/mentees" className="block py-2 px-4 rounded hover:bg-green-700">
                                My Mentees
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={logout}
                                className="block py-2 px-4 rounded hover:bg-green-700 w-full text-left"
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

export default MentorLayout;