// import React, { useState, useEffect } from 'react';
// import { getMentors, deleteMentor } from '../../api/mentors';
//
// const Mentors = () => {
//     const [mentors, setMentors] = useState([]);
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         const fetchMentors = async () => {
//             try {
//                 const data = await getMentors();
//                 setMentors(data);
//             } catch (error) {
//                 console.error('Error fetching mentors:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchMentors();
//     }, []);
//
//     const handleDelete = async (id) => {
//         if (window.confirm('Are you sure you want to delete this mentor?')) {
//             try {
//                 await deleteMentor(id);
//                 setMentors(mentors.filter(mentor => mentor._id !== id));
//             } catch (error) {
//                 console.error('Error deleting mentor:', error);
//             }
//         }
//     };
//
//     if (loading) return <div>Loading...</div>;
//
//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-6">Mentors</h1>
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                     <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Name
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Email
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Specialization
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Actions
//                         </th>
//                     </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                     {mentors.map((mentor) => (
//                         <tr key={mentor._id}>
//                             <td className="px-6 py-4 whitespace-nowrap">{mentor.name}</td>
//                             <td className="px-6 py-4 whitespace-nowrap">{mentor.email}</td>
//                             <td className="px-6 py-4 whitespace-nowrap">{mentor.specialization}</td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                                 <button
//                                     onClick={() => handleDelete(mentor._id)}
//                                     className="text-red-600 hover:text-red-900"
//                                 >
//                                     Delete
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };
//
// export default Mentors;

import React, { useState, useEffect } from 'react';
import { getMentors } from '../../api/mentors';

const Mentors = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const data = await getMentors();
                setMentors(data);
            } catch (err) {
                setError('Failed to load mentors');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    if (loading) return <div>Loading mentors...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">All Mentors</h1>
            {mentors.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expertise</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {mentors.map(mentor => (
                            <tr key={mentor.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{mentor.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{mentor.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{mentor.expertise}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow">
                    <p>No mentors found</p>
                </div>
            )}
        </div>
    );
};

export default Mentors;