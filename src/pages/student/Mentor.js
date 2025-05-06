import React, { useState, useEffect } from 'react';
import { getMyMentor } from '../../api/students'; // Ensure this imports from .js file

const Mentor = () => {
    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMentor = async () => {
            try {
                const data = await getMyMentor();
                setMentor(data);
            } catch (err) {
                setError('Failed to load mentor information');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMentor();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Mentor</h1>
            {mentor ? (
                <div className="bg-white rounded-lg shadow p-6 max-w-md">
                    {/* Mentor details */}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow">
                    <p>No mentor assigned yet.</p>
                </div>
            )}
        </div>
    );
};
export default Mentor;