import React, { useState, useEffect } from 'react';
import { getMentees } from '../../api/mentors';

const Mentees = () => {
    const [mentees, setMentees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMentees = async () => {
            try {
                const data = await getMentees();
                setMentees(data);
            } catch (error) {
                console.error('Error fetching mentees:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMentees();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Mentees</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Batch
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {mentees.map((mentee) => (
                        <tr key={mentee._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{mentee.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{mentee.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{mentee.batch}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Mentees;