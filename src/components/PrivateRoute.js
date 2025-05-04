import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // If the user is not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If the user's role is not allowed, redirect to a 403 page or error page
    return <Navigate to="/not-found" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
