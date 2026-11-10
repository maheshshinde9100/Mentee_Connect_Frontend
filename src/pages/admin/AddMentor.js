import React, { useState } from 'react';
import { adminService } from '../../services/api';

const AddMentor = ({ onMentorAdded }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    mentorId: '',
    department: '',
    specialization: '',
    designation: '',
    yearsOfExperience: '',
    maxStudents: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminService.createAdminMentor(formData);
      setSuccess('Mentor created successfully!');
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        mentorId: '',
        department: '',
        specialization: '',
        designation: '',
        yearsOfExperience: '',
        maxStudents: ''
      });
      if (onMentorAdded) {
        onMentorAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create mentor. Please try again.');
      console.error('Error creating mentor:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="page-title">Add New Mentor</h2>
        <p className="page-subtitle">Create a mentor account with login and professional details.</p>
      </div>

      {error && (
        <div className="alert-error mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="alert-success mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card card-pad space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Basic Information */}
          <div>
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="firstName" className="label">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="label">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="label">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Professional Information */}
          <div>
            <label htmlFor="mentorId" className="label">
              Mentor ID
            </label>
            <input
              type="text"
              name="mentorId"
              id="mentorId"
              required
              value={formData.mentorId}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="department" className="label">
              Department
            </label>
            <input
              type="text"
              name="department"
              id="department"
              required
              value={formData.department}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="specialization" className="label">
              Specialization
            </label>
            <input
              type="text"
              name="specialization"
              id="specialization"
              required
              value={formData.specialization}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="designation" className="label">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              id="designation"
              required
              value={formData.designation}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="yearsOfExperience" className="label">
              Years of Experience
            </label>
            <input
              type="number"
              name="yearsOfExperience"
              id="yearsOfExperience"
              required
              min="0"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="maxStudents" className="label">
              Maximum Students
            </label>
            <input
              type="number"
              name="maxStudents"
              id="maxStudents"
              required
              min="1"
              value={formData.maxStudents}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Creating...
              </div>
            ) : (
              'Create Mentor'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMentor;