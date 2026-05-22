import React, { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';
import { studentService } from '../services/studentService';
import { mentorService } from '../services/mentorService';
import { clearApiCache } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ── Instant session restore helpers ──────────────────────────────────────────
// Read localStorage synchronously during component mount (lazy initializer)
// so the very first render already has the user data — no FOUC.
const restoreUser = () => {
  try {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (token && stored) return JSON.parse(stored);
  } catch {
    // Corrupted storage — clear it
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return null;
};

const restoreAuth = () => {
  const token = localStorage.getItem('token');
  const stored = localStorage.getItem('user');
  return !!(token && stored);
};
// ─────────────────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  // Lazy initializers run synchronously on first render — no useEffect needed
  const [user, setUser] = useState(restoreUser);
  const [isAuthenticated, setIsAuthenticated] = useState(restoreAuth);
  const [error, setError] = useState(null);

  const login = useCallback(async (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    clearApiCache(); // Prevent stale cached data leaking across sessions
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setError(null);
      const { user: newUser } = await authService.register(userData);
      setUser(newUser);
      return newUser;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      setError(null);
      let response;
      
      if (user.role === 'MENTOR') {
        response = await mentorService.updateProfile(user.id, profileData);
      } else if (user.role === 'MENTEE') {
        response = await studentService.updateProfile(user.id, profileData);
      }
      
      setUser(response.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Profile update failed');
      throw error;
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        error,
        login,
        logout,
        updateUser,
        register,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 