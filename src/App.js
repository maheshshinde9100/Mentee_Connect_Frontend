import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CallProvider, useCall } from './context/CallContext';
import CallWindow from './components/call/CallWindow';
import IncomingCallModal from './components/call/IncomingCallModal';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import MentorDashboard from './pages/mentor/MentorDashboard';
import TaskManagement from './pages/mentor/TaskManagement';
import Analytics from './pages/admin/Analytics';
import UserManagement from './pages/admin/UserManagement';
import Users from './pages/admin/Users';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import BatchManagement from './pages/admin/BatchManagement';
import MentorAllocation from './pages/admin/MentorAllocation';
import Communication from './pages/admin/Communication';
import SendNotification from './pages/admin/SendNotification';
import NotificationManagement from './pages/admin/NotificationManagement';
import ManageMentorsMentees from './pages/admin/ManageMentorsMentees';
import Notifications from './pages/user/Notifications';
import NotFound from './pages/NotFound';
import DashboardLayout from './components/layout/DashboardLayout';
import Profile from './pages/profile/Profile';
import LandingPage from './pages/LandingPage';
import CertificateManagement from './components/CertificateManagement';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MentorDetails from './pages/student/MentorDetails';
import SkillsManagement from './pages/student/SkillsManagement';

import About from './pages/common/About';
import Contact from './pages/common/Contact';

import MyMentees from './pages/mentor/MyMentees';
import MenteeDetail from './pages/mentor/MenteeDetail';
import TaskForm from './pages/mentor/TaskForm';
import AttendanceForm from './pages/mentor/AttendanceForm';
import Updates from './pages/mentor/Updates';
import ShareUpdate from './pages/mentor/ShareUpdate';
import './App.css';

function App() {
  const CallOverlay = () => {
    const { incoming, activeRoom, minimized, localStream, remoteStreams, acceptCall, rejectCall, endCall, setMinimized } = useCall() || {};
    return (
      <>
        <IncomingCallModal incoming={incoming} onAccept={acceptCall} onReject={rejectCall} />
        {activeRoom && (
          <CallWindow
            localStream={localStream}
            remoteStreams={remoteStreams}
            onEnd={endCall}
            minimized={minimized}
            onToggleSize={() => setMinimized(!minimized)}
          />
        )}
      </>
    );
  };

  const CallProviderWrapper = ({ children }) => {
    const { user } = useAuth();
    return (
      <CallProvider user={user}>
        {children}
        <CallOverlay />
      </CallProvider>
    );
  };

  return (
    <Router>
      <AuthProvider>
        <CallProviderWrapper>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Profile Route - Accessible to all authenticated users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MENTOR', 'STUDENT', 'MENTEE']}>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Notifications Route - Accessible to all authenticated users */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MENTOR', 'STUDENT', 'MENTEE']}>
                <DashboardLayout>
                  <Notifications />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <Analytics />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/user-management"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <UserManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <Users />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/department-management"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <DepartmentManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/batch-management"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <BatchManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mentor-allocation"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <MentorAllocation />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-mentors-mentees"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <ManageMentorsMentees />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/communication"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <Communication />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <SendNotification />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notification-management"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <NotificationManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Mentor Routes */}
          <Route
            path="/mentor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['MENTOR']}>
                <DashboardLayout>
                  <MentorDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/tasks"
            element={
              <ProtectedRoute allowedRoles={['MENTOR']}>
                <DashboardLayout>
                  <TaskManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
         
          {/* New Mentor Routes */}
          <Route
            path="/mentor/mentees"
            element={
              <ProtectedRoute allowedRoles={['MENTOR']}>
                <DashboardLayout>
                  <MyMentees />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/mentees/:menteeId"
            element={
              <ProtectedRoute allowedRoles={['MENTOR']}>
                <DashboardLayout>
                  <MenteeDetail />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/tasks/new"
            element={
              <ProtectedRoute allowedRoles={['MENTOR']}>
                <DashboardLayout>
                  <TaskForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/tasks/edit/:taskId"
            element={
              <ProtectedRoute allowedRoles={['MENTOR']}>
                <DashboardLayout>
                  <TaskForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/attendance/record"
            element={
              <ProtectedRoute allowedRoles={['MENTOR']}>
                <DashboardLayout>
                  <AttendanceForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/updates"
            element={
              <ProtectedRoute allowedRoles={['MENTOR']}>
                <DashboardLayout>
                  <Updates />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/updates/new"
            element={
              <ProtectedRoute allowedRoles={['MENTOR']}>
                <DashboardLayout>
                  <ShareUpdate />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/updates/edit/:updateId"
            element={
              <ProtectedRoute allowedRoles={['MENTOR']}>
                <DashboardLayout>
                  <ShareUpdate />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'MENTEE']}>
                <DashboardLayout>
                  <StudentDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/mentor"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'MENTEE']}>
                <DashboardLayout>
                  <MentorDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/skills"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'MENTEE']}>
                <DashboardLayout>
                  <SkillsManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/certificates"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'MENTEE']}>
                <DashboardLayout>
                  <CertificateManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Default Route - Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* 404 Not Found Route - Must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CallProviderWrapper>
      </AuthProvider>
    </Router>
  );
}

export default App;