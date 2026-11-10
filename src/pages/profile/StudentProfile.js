import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(baseUrl+'/api/profile/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        // Parse additionalInfo
        const course = data.additionalInfo?.match(/Course:\s?([^,]+)/)?.[1] || '';
        const semester = data.additionalInfo?.match(/Semester:\s?([^,]+)/)?.[1] || '';
        const batch = data.additionalInfo?.match(/Batch:\s?(.+)/)?.[1] || '';

        setProfile(data);
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber || '',
          specificId: data.specificId || '',
          course,
          semester,
          batch,
        });
      } catch (err) {
        console.error('Failed to fetch student profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const updatedData = {
      ...profile,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      specificId: formData.specificId,
      additionalInfo: `Course: ${formData.course}, Semester: ${formData.semester}, Batch: ${formData.batch}`,
    };

    try {
      await axios.put(baseUrl+'/api/profile/me', updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(updatedData);
      setEditMode(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
    </div>
  );
  if (!profile) return <p className="muted">Unable to load profile.</p>;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card overflow-hidden">
        <div className="card-pad border-b border-gray-200 dark:border-slate-700/70">
          <h3 className="section-title">Student Profile</h3>
          <p className="page-subtitle">Personal details and academic info.</p>
        </div>
        <div>
          <dl>
            {[
              { label: 'First Name', key: 'firstName' },
              { label: 'Last Name', key: 'lastName' },
              { label: 'Email', key: 'email' },
              { label: 'Phone Number', key: 'phoneNumber' },
              { label: 'Student ID', key: 'specificId' },
              { label: 'Course', key: 'course' },
              { label: 'Semester', key: 'semester' },
              { label: 'Batch', key: 'batch' },
              { label: 'Role', key: 'role', readonly: true },
            ].map(({ label, key, readonly }) => (
              <div key={key} className={`${
                key === 'course' || key === 'semester' ? 'bg-white dark:bg-slate-800/40' : 'bg-gray-50 dark:bg-slate-900/30'
              } border-b border-gray-100 px-5 py-4 dark:border-slate-700/60 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">{label}</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {editMode && !readonly ? (
                    <input
                      type="text"
                      name={key}
                      value={formData[key] || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  ) : key === 'role' ? (
                    profile.role
                  ) : (
                    formData[key]
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {editMode ? (
          <>
            <button
              onClick={() => setEditMode(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary"
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-secondary"
            >
              View Schedule
            </button>
            <button
              onClick={() => setEditMode(true)}
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
