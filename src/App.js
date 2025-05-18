import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import MentorDashboard from './pages/mentor/MentorDashboard';
import TaskManagement from './pages/mentor/TaskManagement';
import MeetingScheduler from './pages/mentor/MeetingScheduler';
import Analytics from './pages/admin/Analytics';
import UserManagement from './pages/admin/UserManagement';
import Users from './pages/admin/Users';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import Communication from './pages/admin/Communication';
import NotFound from './pages/NotFound';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MentorDetails from './pages/student/MentorDetails';
import SkillsManagement from './pages/student/SkillsManagement';

import About from './pages/common/About';
import Contact from './pages/common/Contact';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/user-management"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/department-management"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DepartmentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/communication"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Communication />
              </ProtectedRoute>
            }
          />

          {/* Mentor Routes */}
          <Route
            path="/mentor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['MENTOR']}>
                <MentorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/tasks"
            element={
              <ProtectedRoute allowedRoles={['MENTOR']}>
                <TaskManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/meetings"
            element={
              <ProtectedRoute allowedRoles={['MENTOR']}>
                <MeetingScheduler />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['MENTEE']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/mentor"
            element={
              <ProtectedRoute allowedRoles={['MENTEE']}>
                <MentorDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/skills"
            element={
              <ProtectedRoute allowedRoles={['MENTEE']}>
                <SkillsManagement />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* 404 Not Found Route - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;