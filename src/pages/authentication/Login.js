import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

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
      
      // Store refresh token if provided
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

      const userData = {
        id,
        email,
        role: roles[0].replace('ROLE_', ''), // Convert 'ROLE_ADMIN' to 'ADMIN'
        roles
      };
      
      await login(userData, token);
      
      // Verify token was stored correctly
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        console.error('Token was not stored in localStorage');
        // Try storing it again
        localStorage.setItem('token', token);
      }

      // Redirect based on user role
      const redirectPath = `/${userData.role.toLowerCase()}/dashboard`;
      navigate(redirectPath);
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Login failed: ${err.response.data?.message || err.response.statusText || 'Server error'}`);
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your internet connection and try again.');
        console.error('No response received');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(err.message || 'Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-300/10 to-indigo-300/10 rounded-full blur-2xl"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Logo section */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center transform -rotate-12">
                <span className="text-indigo-600 font-bold text-2xl">M</span>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <h2 className="text-center text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-lg text-gray-600 mb-8">
          Sign in to continue your mentorship journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-10 px-6 shadow-2xl sm:rounded-2xl sm:px-12 border border-white/20">
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6 backdrop-blur-sm">
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
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="appearance-none block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-indigo-300"
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="appearance-none block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-indigo-300"
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
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white mr-3"></div>
                    <span>Signing you in...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Sign In</span>
                    <div className="ml-3 group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </div>
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Additional footer section */}
          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <p className="text-center text-sm text-gray-500">
              New to MenteeConnect?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-10 left-10 w-4 h-4 bg-indigo-400 rounded-full animate-bounce"></div>
      <div className="absolute top-32 right-16 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 left-8 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
    </div>
  );
};

export default Login;