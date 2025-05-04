import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MentorDashboard = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching mentor data:', error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Mentor Dashboard</h2>
      {students.length > 0 ? (
        <div>
          <h3 className="text-xl mb-2">Your Students</h3>
          <ul>
            {students.map((student, index) => (
              <li key={index}>{student.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No students assigned yet.</p>
      )}
    </div>
  );
};

export default MentorDashboard;
