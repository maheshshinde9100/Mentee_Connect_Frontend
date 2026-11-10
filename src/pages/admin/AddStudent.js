import React, { useState } from 'react';
import { adminService } from '../../services/api';

const AddStudent = ({ onStudentAdded }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    studentId: '',
    course: '',
    batch: '',
    semester: '',
    department: '',
    dob: '',
    attendance: '',
    cgpa: ''
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
      // Convert numeric fields to numbers
      const studentData = {
        ...formData,
        semester: parseInt(formData.semester, 10),
        attendance: parseFloat(formData.attendance),
        cgpa: parseFloat(formData.cgpa)
      };

      const response = await adminService.createAdminStudent(studentData);

      if (response.data) {
        setSuccess('Student created successfully!');
        setFormData({
          username: '',
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          studentId: '',
          course: '',
          batch: '',
          semester: '',
          department: '',
          dob: '',
          attendance: '',
          cgpa: ''
        });
        if (onStudentAdded) {
          onStudentAdded();
        }
      }
    } catch (err) {
      console.error('Error creating student:', err);
      setError(err.response?.data?.message || 'Failed to create student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="page-title">Add New Student</h2>
        <p className="page-subtitle">Create a student account with login and academic details.</p>
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

          {/* Academic Information */}
          <div>
            <label htmlFor="studentId" className="label">
              Student ID
            </label>
            <input
              type="text"
              name="studentId"
              id="studentId"
              required
              value={formData.studentId}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="course" className="label">
              Course
            </label>
            <input
              type="text"
              name="course"
              id="course"
              required
              value={formData.course}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="batch" className="label">
              Batch
            </label>
            <input
              type="text"
              name="batch"
              id="batch"
              required
              value={formData.batch}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="semester" className="label">
              Semester
            </label>
            <input
              type="number"
              name="semester"
              id="semester"
              required
              min="1"
              max="8"
              value={formData.semester}
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
            <label htmlFor="dob" className="label">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              id="dob"
              required
              value={formData.dob}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="attendance" className="label">
              Attendance (%)
            </label>
            <input
              type="number"
              name="attendance"
              id="attendance"
              required
              min="0"
              max="100"
              step="0.01"
              value={formData.attendance}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="cgpa" className="label">
              CGPA
            </label>
            <input
              type="number"
              name="cgpa"
              id="cgpa"
              required
              min="0"
              max="10"
              step="0.01"
              value={formData.cgpa}
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
              'Create Student'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;