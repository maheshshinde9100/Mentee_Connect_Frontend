import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login'); // Redirect to login if no user is logged in
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/admin/students');
        const result = await res.json();
        setData(result);
      } catch (err) {
        setMessage('Failed to fetch data.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Dashboard</h2>
        {message && <p className="text-center text-sm text-red-500 mb-4">{message}</p>}
        {user ? (
          <>
            <p className="text-center text-lg mb-4">
              Welcome, <strong>{user.role}</strong>!
            </p>
            <p className="text-center text-sm text-gray-600">
              Logged in as: <strong>{user.email}</strong>
            </p>
          </>
        ) : (
          <p>Loading user information...</p>
        )}
        {data ? (
          <div className="mt-6">
            <h3 className="text-xl mb-4">Student List</h3>
            <ul>
              {data.map((student, index) => (
                <li key={index} className="mb-2">
                  {student.name} - {student.email}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Loading student data...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;