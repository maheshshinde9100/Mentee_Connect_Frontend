import React, { useState, useEffect } from 'react';
import { getMyMentor } from '../../api/students';

const Mentor = () => {
    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMentor = async () => {
            try {
                const data = await getMyMentor();
                setMentor(data);
            } catch (error) {
                console.error('Error fetching mentor:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMentor();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Mentor</h1>
            {mentor ? (
                <div className="bg-white rounded-lg shadow p-6 max-w-md">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-xl">
                  {mentor.name.charAt(0)}
                </span>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{mentor.name}</h2>
                            <p className="text-gray-600">{mentor.email}</p>
                            <p className="text-gray-600">{mentor.specialization}</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Contact Mentor
                        </button>
                    </div>
                </div>
            ) : (
                <p>No mentor assigned yet.</p>
            )}
        </div>
    );
};

export default Mentor;