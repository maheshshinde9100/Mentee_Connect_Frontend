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
    if (!role) return 'badge-neutral';
    switch (role) {
      case 'ROLE_ADMIN':
        return 'badge-brand';
      case 'ROLE_MENTOR':
        return 'badge-success';
      case 'ROLE_STUDENT':
        return 'badge-neutral';
      default:
        return 'badge-neutral';
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
    <div className="space-y-6 p-6">
      <div>
        <h1 className="page-title">User Management</h1>
        <p className="page-subtitle">
          Manage and monitor all users in the system
        </p>
      </div>

      {successMessage && (
        <div className="alert-success">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      <div className="max-w-xl">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by name..."
          className="input"
        />
        {loading && (
          <span className="field-hint">Searching...</span>
        )}
      </div>

      {error && (
        <div className="alert-error">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
                    <span className="ml-3">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center muted">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    {editingUser?.id === user.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingUser.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="input w-24"
                          placeholder="First Name"
                        />
                        <input
                          type="text"
                          value={editingUser.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="input w-24"
                          placeholder="Last Name"
                        />
                      </div>
                    ) : (
                      <div className="font-medium text-gray-900 dark:text-white">{`${user.firstName} ${user.lastName}`}</div>
                    )}
                  </td>
                  <td>
                    {editingUser?.id === user.id ? (
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="input w-40"
                      />
                    ) : (
                      <div className="muted">{user.email}</div>
                    )}
                  </td>
                  <td>
                    {editingUser?.id === user.id ? (
                      <input
                        type="text"
                        value={editingUser.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="input w-32"
                      />
                    ) : (
                      <div className="muted">{user.phoneNumber || '-'}</div>
                    )}
                  </td>
                  <td>
                    <span className={getRoleColor(user.role)}>
                      {getRoleDisplay(user.role)}
                    </span>
                  </td>
                  <td>
                    {editingUser?.id === user.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(user.id, editingUser)}
                          className="btn-primary btn-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="btn-secondary btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="btn-secondary btn-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="btn-danger btn-sm"
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
