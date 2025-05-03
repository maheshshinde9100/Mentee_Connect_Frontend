// src/pages/Auth/Register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let url = '';
            if (formData.role === 'ADMIN') url = 'http://localhost:8080/api/admin';
            else if (formData.role === 'MENTOR') url = 'http://localhost:8080/api/mentors';
            else if (formData.role === 'STUDENT') url = 'http://localhost:8080/api/students';

            const payload = { ...formData };
            delete payload.role;

            const res = await axios.post(url, payload);
            setSuccess('Registered successfully!');
            setError('');
        } catch (err) {
            setError('Registration failed');
            setSuccess('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border rounded"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border rounded"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 border rounded"
                        required
                    />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full p-3 border rounded"
                    >
                        <option value="STUDENT">Student</option>
                        <option value="MENTOR">Mentor</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
