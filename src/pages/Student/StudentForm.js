import React, { useState } from 'react';

const StudentForm = () => {
    const [student, setStudent] = useState({
        name: '',
        email: '',
        batch: '',
    });

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Student submitted:', student);
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-green-600 mb-6">Add/Edit Student</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        name="name"
                        type="text"
                        value={student.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={student.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Batch</label>
                    <input
                        name="batch"
                        type="text"
                        value={student.batch}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Save Student
                </button>
            </form>
        </div>
    );
};

export default StudentForm;
