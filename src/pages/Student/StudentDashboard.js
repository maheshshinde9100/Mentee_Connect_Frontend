import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/students/1'); // Modify to use the current student's ID
        setStudentInfo(response.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentInfo();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Student Dashboard</h2>
      {studentInfo ? (
        <div>
          <h3 className="text-xl mb-2">Student Information</h3>
          <p>Name: {studentInfo.name}</p>
          <p>Email: {studentInfo.email}</p>
          <p>Assigned Mentor: {studentInfo.mentorName}</p>
        </div>
      ) : (
        <p>Loading student information...</p>
      )}
    </div>
  );
};

export default StudentDashboard;
