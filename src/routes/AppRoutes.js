import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import the pages
import AdminDashboard from '../pages/Admin/AdminDashboard';
import MentorDashboard from '../pages/Mentor/MentorDashboard';
import StudentDashboard from '../pages/Student/StudentDashboard';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/mentor/dashboard" element={<MentorDashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="*" element={<NotFound />} /> {/* Handle 404 */}
    </Routes>
  );
};

export default AppRoutes;
