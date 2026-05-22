import React, { useState, useEffect, useCallback, useRef } from 'react';
import { adminService } from '../../services/api';
import useDebounce from '../../hooks/useDebounce';
import useFetchGuard from '../../hooks/useFetchGuard';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const initialLoadDone = useRef(false);

  const fetchUsers = useCallback(async (isCancelled) => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      if (!isCancelled()) {
        setUsers(response.data);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled()) {
        setError('Failed to fetch users');
        console.error(err);
      }
    } finally {
      if (!isCancelled()) setLoading(false);
    }
  }, []);

  useFetchGuard((isCancelled) => {
    initialLoadDone.current = true;
    return fetchUsers(isCancelled);
  }, []);

  useEffect(() => {
    if (!initialLoadDone.current) return;

    let cancelled = false;
    const runSearch = async () => {
      if (!debouncedSearch.trim()) {
        fetchUsers(() => cancelled);
        return;
      }
      try {
        setLoading(true);
        const response = await adminService.searchUsers(debouncedSearch);
        if (!cancelled) {
          setUsers(response.data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to search users');
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    runSearch();
    return () => { cancelled = true; };
  }, [debouncedSearch, fetchUsers]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setSuccessMessage('User deleted successfully');
      setError(null);
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  const handleUpdate = async (userId, updatedData) => {
    try {
      const response = await adminService.updateUser(userId, {
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email,
        phoneNumber: updatedData.phoneNumber
      });
      const updatedUser = response.data;
      setUsers(users.map(user =>
        user.id === userId ? updatedUser : user
      ));
      setEditingUser(null);
      setSuccessMessage('User updated successfully');
      setError(null);
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    }
  };

  const getRoleDisplay = (role) => {
    return role ? role.replace('ROLE_', '') : 'UNKNOWN';
  };

  const getRoleColor = (role) => {
    if (!role) return 'bg-gray-100 text-gray-800 dark:text-gray-100';
    switch (role) {
      case 'ROLE_ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'ROLE_MENTOR':
        return 'bg-green-100 text-green-800';
      case 'ROLE_STUDENT':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:text-gray-100';
    }
  };

  const handleEditClick = (user) => {
    setEditingUser({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      role: user.role
    });
  };

  const handleInputChange = (field, value) => {
    setEditingUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-900/50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage and monitor all users in the system
        </p>
      </div>

      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 dark:bg-green-900/20 p-4 text-green-700 flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="max-w-xl bg-white dark:bg-slate-800 rounded-lg shadow-sm flex items-center p-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name..."
            className="flex-1 px-4 py-2 focus:outline-none bg-transparent text-gray-900 dark:text-white"
          />
          {loading && (
            <span className="text-xs text-gray-500 dark:text-slate-400 px-2">Searching...</span>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-red-700 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-indigo-500" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:bg-slate-900/50 transition-colors duration-200">
                  <td className="whitespace-nowrap px-6 py-4">
                    {editingUser?.id === user.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingUser.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-24 rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="First Name"
                        />
                        <input
                          type="text"
                          value={editingUser.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-24 rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Last Name"
                        />
                      </div>
                    ) : (
                      <div className="font-medium text-gray-900 dark:text-white">{`${user.firstName} ${user.lastName}`}</div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {editingUser?.id === user.id ? (
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-40 rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    ) : (
                      <div className="text-gray-600 dark:text-gray-400">{user.email}</div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {editingUser?.id === user.id ? (
                      <input
                        type="text"
                        value={editingUser.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="w-32 rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    ) : (
                      <div className="text-gray-600 dark:text-gray-400">{user.phoneNumber || '-'}</div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 ${getRoleColor(user.role)}`}>
                      {getRoleDisplay(user.role)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {editingUser?.id === user.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(user.id, editingUser)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-slate-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
