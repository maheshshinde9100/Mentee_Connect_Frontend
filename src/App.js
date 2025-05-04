import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

const App = () => {
  const isAuthenticated = localStorage.getItem('user'); // Check if the user is logged in

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Route: Redirect to Login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Route for Login */}
          <Route path="/login" element={<Login />} />

          {/* Route for Register */}
          <Route path="/register" element={<Register />} />

          {/* Route for Dashboard */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;