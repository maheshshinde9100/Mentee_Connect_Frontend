import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMyMentees } from '../../api/mentors';

const Mentees = () => {
    const [mentees, setMentees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMentees = async () => {
            try {
                const data = await getMyMentees();
                setMentees(data);
            } catch (err) {
                setError('Failed to load mentees');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMentees();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Mentees</h1>
            {mentees.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* Table headers and rows */}
                    </table>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow">
                    <p>No mentees assigned to you yet.</p>
                </div>
            )}
        </div>
    );
};

export  default Mentees;