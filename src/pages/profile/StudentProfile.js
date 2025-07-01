import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/profile/me', {
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
      await axios.put('http://localhost:8080/api/profile/me', updatedData, {
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

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>Unable to load profile.</p>;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Student Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and academic info.</p>
        </div>
        <div className="border-t border-gray-200">
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
                key === 'course' || key === 'semester' ? 'bg-white' : 'bg-gray-50'
              } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                <dt className="text-sm font-medium text-gray-500">{label}</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {editMode && !readonly ? (
                    <input
                      type="text"
                      name={key}
                      value={formData[key] || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm px-3 py-1"
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
      <div className="flex justify-end space-x-4">
        {editMode ? (
          <>
            <button
              onClick={() => setEditMode(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              View Schedule
            </button>
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
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
