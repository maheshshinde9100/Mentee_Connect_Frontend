// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import AdminDashboard from '../pages/Dashboard/AdminDashboard';
import MentorDashboard from '../pages/Dashboard/MentorDashboard';
import StudentDashboard from '../pages/Dashboard/StudentDashboard';

const ProtectedRoute = ({ children, role }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== role) return <Navigate to="/login" replace />;
    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute role="ADMIN">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mentor"
                element={
                    <ProtectedRoute role="MENTOR">
                        <MentorDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student"
                element={
                    <ProtectedRoute role="STUDENT">
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;