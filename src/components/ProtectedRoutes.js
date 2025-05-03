import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// ProtectedRoute Component to handle role-based access control
const ProtectedRoute = ({ children, role }) => {
    const user = JSON.parse(localStorage.getItem('user'));  // Retrieve logged-in user data
    const location = useLocation();  // Get the current location of the route

    // If the user is not logged in or doesn't have the right role, redirect them to login
    if (!user || user.role !== role) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user is authorized, render the protected component
    return children;
};

export default ProtectedRoute;
