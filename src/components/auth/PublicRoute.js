import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated && user) {
        // Redirect based on role
        switch (user.role) {
            case 'ADMIN':
                return <Navigate to="/admin/dashboard" replace />;
            case 'MENTOR':
                return <Navigate to="/mentor/dashboard" replace />;
            case 'STUDENT':
            case 'MENTEE':
                return <Navigate to="/student/dashboard" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default PublicRoute;
