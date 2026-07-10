import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CallProvider, useCall } from './context/CallContext';
import CallWindow from './components/call/CallWindow';
import IncomingCallModal from './components/call/IncomingCallModal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import PageLoader from './components/common/PageLoader';
import './App.css';

// ─── Route-level code splitting ──────────────────────────────────────────────
const Login = React.lazy(() => import('./pages/authentication/Login'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const VideoCallHistory = React.lazy(() => import('./pages/admin/VideoCallHistory'));
const MentorDashboard = React.lazy(() => import('./pages/mentor/MentorDashboard'));
const TaskManagement = React.lazy(() => import('./pages/mentor/TaskManagement'));
const Analytics = React.lazy(() => import('./pages/admin/Analytics'));
const UserManagement = React.lazy(() => import('./pages/admin/UserManagement'));
const Users = React.lazy(() => import('./pages/admin/Users'));
const DepartmentManagement = React.lazy(() => import('./pages/admin/DepartmentManagement'));
const BatchManagement = React.lazy(() => import('./pages/admin/BatchManagement'));
const MentorAllocation = React.lazy(() => import('./pages/admin/MentorAllocation'));
const Communication = React.lazy(() => import('./pages/admin/Communication'));
const SendNotification = React.lazy(() => import('./pages/admin/SendNotification'));
const NotificationManagement = React.lazy(() => import('./pages/admin/NotificationManagement'));
const ManageMentorsMentees = React.lazy(() => import('./pages/admin/ManageMentorsMentees'));
const Notifications = React.lazy(() => import('./pages/user/Notifications'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Profile = React.lazy(() => import('./pages/profile/Profile'));
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const CertificateManagement = React.lazy(() => import('./components/CertificateManagement'));

const StudentDashboard = React.lazy(() => import('./pages/student/StudentDashboard'));
const MentorDetails = React.lazy(() => import('./pages/student/MentorDetails'));
const SkillsManagement = React.lazy(() => import('./pages/student/SkillsManagement'));

const About = React.lazy(() => import('./pages/common/About'));
const Contact = React.lazy(() => import('./pages/common/Contact'));

const MyMentees = React.lazy(() => import('./pages/mentor/MyMentees'));
const MenteeDetail = React.lazy(() => import('./pages/mentor/MenteeDetail'));
const TaskForm = React.lazy(() => import('./pages/mentor/TaskForm'));
const AttendanceForm = React.lazy(() => import('./pages/mentor/AttendanceForm'));
const Updates = React.lazy(() => import('./pages/mentor/Updates'));
const ShareUpdate = React.lazy(() => import('./pages/mentor/ShareUpdate'));
const MentorVideoCallHistory = React.lazy(() => import('./pages/mentor/VideoCallHistory'));

const LazyPage = ({ children }) => (
  <Suspense fallback={<PageLoader fullScreen />}>{children}</Suspense>
);

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
      <ThemeProvider>
        <AuthProvider>
          <CallProviderWrapper>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <LazyPage>
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  </LazyPage>
                }
              />
              <Route path="/about" element={<LazyPage><About /></LazyPage>} />
              <Route path="/contact" element={<LazyPage><Contact /></LazyPage>} />

              {/* Dashboard routes — single persistent layout prevents remount blink */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'MENTOR', 'STUDENT', 'MENTEE']}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'MENTOR', 'STUDENT', 'MENTEE']}>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />

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
                  path="/admin/video-calls"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <VideoCallHistory />
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
                  path="/admin/batch-management"
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
                <Route
                  path="/admin/manage-mentors-mentees"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <ManageMentorsMentees />
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
                <Route
                  path="/admin/notifications"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <SendNotification />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/notification-management"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <NotificationManagement />
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
                  path="/mentor/mentees"
                  element={
                    <ProtectedRoute allowedRoles={['MENTOR']}>
                      <MyMentees />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mentor/mentees/:menteeId"
                  element={
                    <ProtectedRoute allowedRoles={['MENTOR']}>
                      <MenteeDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mentor/tasks/new"
                  element={
                    <ProtectedRoute allowedRoles={['MENTOR']}>
                      <TaskForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mentor/tasks/edit/:taskId"
                  element={
                    <ProtectedRoute allowedRoles={['MENTOR']}>
                      <TaskForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mentor/attendance/record"
                  element={
                    <ProtectedRoute allowedRoles={['MENTOR']}>
                      <AttendanceForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mentor/updates"
                  element={
                    <ProtectedRoute allowedRoles={['MENTOR']}>
                      <Updates />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mentor/video-calls"
                  element={
                    <ProtectedRoute allowedRoles={['MENTOR']}>
                      <MentorVideoCallHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mentor/updates/new"
                  element={
                    <ProtectedRoute allowedRoles={['MENTOR']}>
                      <ShareUpdate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mentor/updates/edit/:updateId"
                  element={
                    <ProtectedRoute allowedRoles={['MENTOR']}>
                      <ShareUpdate />
                    </ProtectedRoute>
                  }
                />

                {/* Student Routes */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT', 'MENTEE']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/mentor"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT', 'MENTEE']}>
                      <MentorDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/skills"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT', 'MENTEE']}>
                      <SkillsManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/certificates"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT', 'MENTEE']}>
                      <CertificateManagement />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Default Route - Landing Page */}
              <Route
                path="/"
                element={
                  <LazyPage>
                    <PublicRoute>
                      <LandingPage />
                    </PublicRoute>
                  </LazyPage>
                }
              />

              {/* 404 Not Found Route - Must be last */}
              <Route path="*" element={<LazyPage><NotFound /></LazyPage>} />
            </Routes>
          </CallProviderWrapper>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
