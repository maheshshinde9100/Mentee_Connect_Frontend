import React from 'react';

const students = [
    { id: 1, name: 'Mahesh Shinde', email: 'mahesh@student.edu', batch: 'B1' },
    { id: 2, name: 'Sneha Pawar', email: 'sneha@student.edu', batch: 'B2' },
];

const StudentList = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-green-600 mb-6">Student List</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl shadow">
                    <thead>
                    <tr className="bg-green-100 text-left text-sm font-semibold">
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Batch</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students.map((student) => (
                        <tr key={student.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">{student.id}</td>
                            <td className="px-4 py-3">{student.name}</td>
                            <td className="px-4 py-3">{student.email}</td>
                            <td className="px-4 py-3">{student.batch}</td>
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

export default StudentList;
