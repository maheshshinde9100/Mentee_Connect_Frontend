import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import MenteeConnectLogo from '../../MenteeConnectLogo';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user && user.role) {
      const dashboardPath = `/${user.role.toLowerCase()}/dashboard`;
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);

      const { token, email, roles, id } = response.data;

      // Validate token
      if (!token) {
        throw new Error('Server returned success but no token was provided');
      }

      // Store refresh token if provided; otherwise fall back to token itself so the
      // 401 interceptor has SOMETHING to try before wiping the session.
      const refreshToken = response.data.refreshToken || token;
      localStorage.setItem('refreshToken', refreshToken);

      const rawRole = Array.isArray(roles) && roles.length > 0 ? roles[0] : 'ROLE_STUDENT';
      const userData = {
        id,
        email,
        // DB/JWT use ROLE_ADMIN; web routes use ADMIN, MENTOR, STUDENT
        role: rawRole.replace('ROLE_', ''),
        roles: Array.isArray(roles) ? roles : [rawRole]
      };

      await login(userData, token);

      // Verify token was stored correctly
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        localStorage.setItem('token', token);
      }
      if (!localStorage.getItem('refreshToken')) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Redirect based on user role
      const redirectPath = `/${userData.role.toLowerCase()}/dashboard`;
      navigate(redirectPath);
    } catch (err) {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Login failed: ${err.response.data?.message || err.response.statusText || 'Server error'}`);
      } else if (err.request) {
        setError('No response from server. Please check your internet connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(err.message || 'Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center bg-gray-50 py-12 dark:bg-slate-900 sm:px-6 lg:px-8">
      {/* Dark Mode Toggle */}
      <div className="absolute right-6 top-6 z-10">
        <button
          type="button"
          onClick={toggleTheme}
          className="btn-icon"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <MenteeConnectLogo size="lg" showText={false} />
        </div>
        <h2 className="page-title mt-6 text-center">Welcome back</h2>
        <p className="page-subtitle mt-2 text-center">
          Sign in to continue your mentorship journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-6 sm:p-8">
          {error && (
            <div className="alert-error mb-6">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-lg w-full"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                  Signing you in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-slate-400">
          New to MenteeConnect?{' '}
          <Link to="/register" className="link font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
