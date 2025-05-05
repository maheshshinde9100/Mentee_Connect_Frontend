import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Mentee Connect</h1>
                    {user ? (
                        <Link
                            to={`/${user.role.toLowerCase()}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-semibold mb-4">Welcome to Mentee Connect</h2>
                        <p className="mb-6">A platform connecting students with mentors for better guidance and support</p>
                        {!user && (
                            <Link
                                to="/login"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-lg"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;