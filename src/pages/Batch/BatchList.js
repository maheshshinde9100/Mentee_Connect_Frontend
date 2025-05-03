import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BatchList = () => {
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const response = await axios.get('/api/batches');
                setBatches(response.data);
            } catch (error) {
                console.error('Error fetching batches:', error);
            }
        };

        fetchBatches();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-green-600 mb-6">Batch List</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl shadow">
                    <thead>
                    <tr className="bg-green-100 text-left text-sm font-semibold">
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Details</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {batches.map((batch) => (
                        <tr key={batch.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">{batch.id}</td>
                            <td className="px-4 py-3">{batch.name}</td>
                            <td className="px-4 py-3">{batch.details}</td>
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

export default BatchList;
