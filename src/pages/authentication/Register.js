import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Users } from 'lucide-react';
import MenteeConnectLogo from '../../MenteeConnectLogo';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

const roles = [
  {
    value: 'STUDENT',
    label: 'Student',
    description: 'Get mentorship, complete tasks and track your progress.',
    icon: GraduationCap,
  },
  {
    value: 'MENTOR',
    label: 'Mentor',
    description: 'Guide students, assign tasks and monitor their growth.',
    icon: Users,
  },
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const selectRole = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const response = await authService.register({
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      const { token, refreshToken, id, email, roles } = response.data;

      if (!token) {
        throw new Error('Server returned success but no token was provided');
      }

      const rawRole = Array.isArray(roles) && roles.length > 0 ? roles[0] : `ROLE_${formData.role}`;
      const userData = {
        id,
        email,
        name: formData.name,
        // DB/JWT use ROLE_STUDENT; web routes use STUDENT, MENTOR, ADMIN
        role: rawRole.replace('ROLE_', ''),
        roles: Array.isArray(roles) ? roles : [rawRole],
      };

      localStorage.setItem('refreshToken', refreshToken || token);
      await login(userData, token);

      navigate(`/${userData.role.toLowerCase()}/dashboard`);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || err.response.statusText || 'Registration failed');
      } else if (err.request) {
        setError('No response from server. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 dark:bg-slate-900 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <MenteeConnectLogo size="lg" showText={false} />
        </div>
        <h2 className="page-title mt-6 text-center">Create your account</h2>
        <p className="page-subtitle mt-2 text-center">
          Already have an account?{' '}
          <Link to="/login" className="link">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-6 sm:p-8">
          {error && (
            <div className="alert-error mb-6" role="alert">
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Role selection */}
            <div>
              <span className="label">I want to join as</span>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const selected = formData.role === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => selectRole(role.value)}
                      className={`flex flex-col items-start rounded-xl border p-3 text-left transition-colors ${
                        selected
                          ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/10'
                          : 'border-gray-200 hover:border-gray-300 dark:border-slate-700 dark:hover:border-slate-600'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          selected
                            ? 'bg-brand-600 text-white'
                            : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                        {role.label}
                      </span>
                      <span className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                        {role.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email address
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="Re-enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-lg w-full"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
