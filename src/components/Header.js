import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    <Link to="/">Mentee Connect</Link>
                </h1>
                <nav className="space-x-4">
                    <Link to="/" className="hover:text-gray-300">Home</Link>
                    <Link to="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>
                    <Link to="/login" className="hover:text-gray-300">Login</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
