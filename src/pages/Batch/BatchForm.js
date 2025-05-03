import React, { useState } from 'react';
import axios from 'axios';

const BatchForm = () => {
    const [batch, setBatch] = useState({
        name: '',
        details: '',
    });

    const handleChange = (e) => {
        setBatch({ ...batch, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/batches', batch);
            console.log('Batch created:', response.data);
        } catch (error) {
            console.error('Error creating batch:', error);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-green-600 mb-6">Create/Edit Batch</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
                <div>
                    <label className="block font-medium mb-1">Batch Name</label>
                    <input
                        name="name"
                        type="text"
                        value={batch.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Batch Details</label>
                    <textarea
                        name="details"
                        value={batch.details}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Save Batch
                </button>
            </form>
        </div>
    );
};

export default BatchForm;
