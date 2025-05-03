import React from 'react';

const mentors = [
    { id: 1, name: 'Anjali Deshmukh', email: 'anjali@college.edu', subject: 'Java' },
    { id: 2, name: 'Rohit Patil', email: 'rohit@college.edu', subject: 'DSA' },
];

const MentorList = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Mentor List</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl shadow">
                    <thead>
                    <tr className="bg-blue-100 text-left text-sm font-semibold">
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Subject</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mentors.map((mentor) => (
                        <tr key={mentor.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">{mentor.id}</td>
                            <td className="px-4 py-3">{mentor.name}</td>
                            <td className="px-4 py-3">{mentor.email}</td>
                            <td className="px-4 py-3">{mentor.subject}</td>
                            <td className="px-4 py-3">
                                <button className="text-blue-500 hover:underline mr-2">Edit</button>
                                <button className="text-red-500 hover:underline">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MentorList;
