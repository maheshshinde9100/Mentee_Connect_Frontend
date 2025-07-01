import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MentorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/mentors/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        setProfile(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          mentorId: data.mentorId || '',
          department: data.department || '',
          specialization: data.specialization || '',
          designation: data.designation || '',
          yearsOfExperience: data.yearsOfExperience || 0,
        });
      } catch (err) {
        console.error('Failed to fetch mentor profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/mentors/${profile.id}`,
        {
          ...profile,
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile((prev) => ({ ...prev, ...formData }));
      setEditMode(false);
    } catch (err) {
      console.error('Failed to update mentor profile:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>Unable to load profile.</p>;

  const fields = [
    { label: 'First Name', key: 'firstName' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Email', key: 'email' },
    { label: 'Phone Number', key: 'phoneNumber' },
    { label: 'Mentor ID', key: 'mentorId' },
    { label: 'Department', key: 'department' },
    { label: 'Specialization', key: 'specialization' },
    { label: 'Designation', key: 'designation' },
    { label: 'Years of Experience', key: 'yearsOfExperience', type: 'number' },
    { label: 'Role', key: 'role', readonly: true },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Mentor Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal and professional details</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            {fields.map(({ label, key, readonly, type = 'text' }) => (
              <div
                key={key}
                className={`${
                  key === 'email' || key === 'mentorId' ? 'bg-gray-50' : 'bg-white'
                } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
              >
                <dt className="text-sm font-medium text-gray-500">{label}</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {editMode && !readonly ? (
                    <input
                      type={type}
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
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Save Changes
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default MentorProfile;
