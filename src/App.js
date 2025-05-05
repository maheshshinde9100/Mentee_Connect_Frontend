import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminDashboard from './pages/AdminDashboard';
import MentorDashboard from './pages/MentorDashboard';
import StudentDashboard from './pages/StudentDashboard';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user')); // Parse user data from localStorage
  const isAuthenticated = user && user.role; // Check if the user is logged in and has a role

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Route: Redirect to Login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Route for Login */}
          <Route path="/login" element={<Login />} />

          {/* Route for Register */}
          <Route path="/register" element={<Register />} />

          {/* Role-Based Dashboards */}
          <Route
            path="/admin-dashboard"
            element={isAuthenticated && user.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/mentor-dashboard"
            element={isAuthenticated && user.role === 'MENTOR' ? <MentorDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/student-dashboard"
            element={isAuthenticated && user.role === 'STUDENT' ? <StudentDashboard /> : <Navigate to="/login" />}
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;