import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data related to admins, mentors, and students
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/students');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      {data ? (
        <div>
          <h3 className="text-xl mb-2">Total Students</h3>
          <p>{data.length} students enrolled</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-6">
            Manage Students
          </button>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default AdminDashboard;
