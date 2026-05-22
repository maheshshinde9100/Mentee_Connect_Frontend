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
import './App.css';

// ─── Route-level code splitting ──────────────────────────────────────────────
// Each page is loaded on-demand as a separate JS chunk, reducing the initial
// bundle size and time-to-interactive significantly.
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

// Student Pages
const StudentDashboard = React.lazy(() => import('./pages/student/StudentDashboard'));
const MentorDetails = React.lazy(() => import('./pages/student/MentorDetails'));
const SkillsManagement = React.lazy(() => import('./pages/student/SkillsManagement'));

const About = React.lazy(() => import('./pages/common/About'));
const Contact = React.lazy(() => import('./pages/common/Contact'));

// Mentor Pages
const MyMentees = React.lazy(() => import('./pages/mentor/MyMentees'));
const MenteeDetail = React.lazy(() => import('./pages/mentor/MenteeDetail'));
const TaskForm = React.lazy(() => import('./pages/mentor/TaskForm'));
const AttendanceForm = React.lazy(() => import('./pages/mentor/AttendanceForm'));
const Updates = React.lazy(() => import('./pages/mentor/Updates'));
const ShareUpdate = React.lazy(() => import('./pages/mentor/ShareUpdate'));
const MentorVideoCallHistory = React.lazy(() => import('./pages/mentor/VideoCallHistory'));

// ─── Suspense fallback ───────────────────────────────────────────────────────
const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '60vh', width: '100%',
  }}>
    <div style={{
      width: 40, height: 40,
      border: '4px solid rgba(99, 102, 241, 0.2)',
      borderTopColor: '#6366f1',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
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
            <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
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
                path="/admin/video-calls"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <DashboardLayout>
                      <VideoCallHistory />
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
                path="/mentor/video-calls"
                element={
                  <ProtectedRoute allowedRoles={['MENTOR']}>
                    <DashboardLayout>
                      <MentorVideoCallHistory />
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
              <Route path="/" element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              } />

              {/* 404 Not Found Route - Must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </CallProviderWrapper>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;