import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

const Users = () => {
  // Sample data - Replace with API calls later
  const sampleUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'MENTOR', department: 'Computer Science', joinDate: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'MENTEE', department: 'Information Technology', joinDate: '2024-02-01', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'MENTOR', department: 'Electronics', joinDate: '2024-01-20', status: 'Inactive' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'MENTEE', department: 'Computer Science', joinDate: '2024-02-15', status: 'Active' },
    { id: 5, name: 'Robert Brown', email: 'robert@example.com', role: 'MENTOR', department: 'AIML', joinDate: '2024-01-10', status: 'Active' },
  ];

  const [users, setUsers] = useState(sampleUsers);
  const [searchRole, setSearchRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = searchRole === '' || user.role === searchRole;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="page-title mb-1">User Management</h1>
        <p className="page-subtitle mb-6">Manage users, roles and account status.</p>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="select w-full sm:w-48"
            value={searchRole}
            onChange={(e) => setSearchRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="MENTOR">Mentors</option>
            <option value="MENTEE">Mentees</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                  </td>
                  <td>
                    <div className="muted">{user.email}</div>
                  </td>
                  <td>
                    <span className={user.role === 'MENTOR' ? 'badge-brand' : 'badge-neutral'}>
                      {user.role}
                    </span>
                  </td>
                  <td className="muted">
                    {user.department}
                  </td>
                  <td>
                    <span className={user.status === 'Active' ? 'badge-success' : 'badge-danger'}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(user)}
                        className="btn-icon"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="btn-icon text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 sm:p-6">
          <div className="card card-pad relative mt-16 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="section-title">Edit User</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="btn-icon"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="label">
                  Name
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">
                  Department
                </label>
                <select
                  value={editingUser.department}
                  onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                  className="select"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                  <option value="AIML">AIML</option>
                </select>
              </div>
              <div>
                <label className="label">
                  Status
                </label>
                <select
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                  className="select"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users; 