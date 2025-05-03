import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

// Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AssignMentor from './pages/Admin/AssignMentor';
import MentorList from './pages/Mentor/MentorList';
import MentorForm from './pages/Mentor/MentorForm';
import StudentList from './pages/Student/StudentList';
import StudentForm from './pages/Student/StudentForm';
import BatchList from './pages/Batch/BatchList';
import BatchForm from './pages/Batch/BatchForm';
import Login from './pages/Auth/Login';
import NotFound from './pages/NotFound';

// Protected Routes Component
import ProtectedRoute from './components/ProtectedRoutes';

const App = () => {
    return (
        <Router>
            <div className="flex">
                <Sidebar />
                <div className="flex-1">
                    <Header />
                    <main className="p-6">
                        <Routes>
                            {/* Auth Routes */}
                            <Route path="/login" element={<Login />} />

                            {/* Admin Routes */}
                            <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN" />}>
                                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            </Route>
                            <Route path="/admin/assign-mentor" element={<ProtectedRoute role="ADMIN" />}>
                                <Route path="/admin/assign-mentor" element={<AssignMentor />} />
                            </Route>

                            {/* Mentor Routes */}
                            <Route path="/mentors" element={<ProtectedRoute role="MENTOR" />}>
                                <Route path="/mentors" element={<MentorList />} />
                            </Route>
                            <Route path="/mentors/add" element={<ProtectedRoute role="MENTOR" />}>
                                <Route path="/mentors/add" element={<MentorForm />} />
                            </Route>

                            {/* Student Routes */}
                            <Route path="/students" element={<ProtectedRoute role="STUDENT" />}>
                                <Route path="/students" element={<StudentList />} />
                            </Route>
                            <Route path="/students/add" element={<ProtectedRoute role="STUDENT" />}>
                                <Route path="/students/add" element={<StudentForm />} />
                            </Route>

                            {/* Batch Routes */}
                            <Route path="/batches" element={<ProtectedRoute role="ADMIN" />}>
                                <Route path="/batches" element={<BatchList />} />
                            </Route>
                            <Route path="/batches/add" element={<ProtectedRoute role="ADMIN" />}>
                                <Route path="/batches/add" element={<BatchForm />} />
                            </Route>

                            {/* 404 Not Found */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </div>
        </Router>
    );
};

export default App;
