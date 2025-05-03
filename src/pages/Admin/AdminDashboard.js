import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-lg font-semibold">Total Students</h2>
                    <p className="text-2xl font-bold text-blue-500">120</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-lg font-semibold">Total Mentors</h2>
                    <p className="text-2xl font-bold text-green-500">25</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-lg font-semibold">Batches</h2>
                    <p className="text-2xl font-bold text-purple-500">8</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-lg font-semibold">Mentors Assigned</h2>
                    <p className="text-2xl font-bold text-yellow-500">80%</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
