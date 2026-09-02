import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">

      {/* Dark Mode Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-lg border border-white/20 dark:border-slate-700"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Logo section */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-2xl">M</span>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full"></div>
          </div>
        </div>

        <h2 className="text-center text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-lg text-slate-600 dark:text-slate-400 mb-8">
          Sign in to continue your mentorship journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl py-10 px-6 shadow-2xl sm:rounded-2xl sm:px-12 border border-white/20 dark:border-slate-700 transition-colors duration-200">
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-xl mb-6 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-red-500 rounded-full mr-3 flex-shrink-0">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                </div>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white backdrop-blur-sm hover:border-indigo-300 dark:hover:border-indigo-500"
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white backdrop-blur-sm hover:border-indigo-300 dark:hover:border-indigo-500"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-150 shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white mr-3"></div>
                    <span>Signing you in...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Sign In</span>
                    <div className="ml-3">
                      →
                    </div>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;