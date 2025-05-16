import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import BatchManagement from './pages/admin/BatchManagement';
import MentorAllocation from './pages/admin/MentorAllocation';

// Mentor Pages
import MentorDashboard from './pages/mentor/MentorDashboard';
import TaskManagement from './pages/mentor/TaskManagement';
import MeetingScheduler from './pages/mentor/MeetingScheduler';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MentorDetails from './pages/student/MentorDetails';
import SkillsManagement from './pages/student/SkillsManagement';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={`/${user?.role?.toLowerCase()}/dashboard`} />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
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
            path="/admin/batches"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <BatchManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mentor-allocation"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <MentorAllocation />
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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;