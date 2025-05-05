import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MentorDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Total Mentees</h3>
                    <p className="text-2xl">8</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Upcoming Meetings</h3>
                    <p className="text-2xl">2</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Pending Tasks</h3>
                    <p className="text-2xl">3</p>
                </div>
            </div>
        </div>
    );
};

export default MentorDashboard;