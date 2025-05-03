import React, { useState } from 'react';

const AssignMentor = () => {
    const [studentId, setStudentId] = useState('');
    const [mentorId, setMentorId] = useState('');

    const handleAssign = (e) => {
        e.preventDefault();
        console.log(`Assigned mentor ${mentorId} to student ${studentId}`);
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Assign Mentor</h1>
            <form onSubmit={handleAssign} className="space-y-4 bg-white p-6 rounded-xl shadow">
                <div>
                    <label className="block font-medium mb-1">Student ID</label>
                    <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter student ID"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Mentor ID</label>
                    <input
                        type="text"
                        value={mentorId}
                        onChange={(e) => setMentorId(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter mentor ID"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Assign
                </button>
            </form>
        </div>
    );
};

export default AssignMentor;
