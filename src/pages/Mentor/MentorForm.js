import React, { useState } from 'react';

const MentorForm = () => {
    const [mentor, setMentor] = useState({
        name: '',
        email: '',
        subject: '',
    });

    const handleChange = (e) => {
        setMentor({ ...mentor, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Mentor submitted:', mentor);
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Add/Edit Mentor</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        name="name"
                        type="text"
                        value={mentor.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={mentor.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Subject</label>
                    <input
                        name="subject"
                        type="text"
                        value={mentor.subject}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Save Mentor
                </button>
            </form>
        </div>
    );
};

export default MentorForm;
