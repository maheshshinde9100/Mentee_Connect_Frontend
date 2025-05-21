import React, { useState } from 'react';
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
  const [debug, setDebug] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

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
    setDebug('');

    try {
      console.log('Login attempt for:', formData.email);
      const response = await authService.login(formData);
      console.log('Login response received:', {
        hasToken: !!response.data.token,
        tokenLength: response.data.token ? response.data.token.length : 0
      });
      
      const { token, email, roles, id } = response.data;
      
      // Validate token
      if (!token) {
        throw new Error('Server returned success but no token was provided');
      }
      
      // Store refresh token if provided
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
        console.log('Refresh token stored');
      }

      const userData = {
        id,
        email,
        role: roles[0].replace('ROLE_', ''), // Convert 'ROLE_ADMIN' to 'ADMIN'
        roles
      };
      
      console.log('Calling login with userData:', {
        id: userData.id,
        role: userData.role,
        tokenStart: token.substring(0, 15) + '...'
      });
      
      await login(userData, token);
      
      // Verify token was stored correctly
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setDebug('WARNING: Token was not stored in localStorage after login');
        console.error('Token was not stored in localStorage');
        // Try storing it again
        localStorage.setItem('token', token);
      } else {
        console.log('Token successfully stored:', storedToken.substring(0, 15) + '...');
      }

      // Redirect based on user role
      const redirectPath = `/${userData.role.toLowerCase()}/dashboard`;
      console.log('Redirecting to:', redirectPath);
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {debug && (
            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md mb-4">
              {debug}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
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