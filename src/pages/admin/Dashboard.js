import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stats cards */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Total Students</h3>
                    <p className="text-2xl">120</p>
                </div>
                {/* Add more stats */}
            </div>
        </div>
    );
};

export default AdminDashboard;