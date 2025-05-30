import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import mentorService from '../../services/mentorService';
import { Tab } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const MenteeDetail = () => {
  const { menteeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mentee, setMentee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (menteeId && user?.id) {
      console.log(`Loading details for mentee: ${menteeId}, mentor: ${user.id}`);
      fetchMenteeDetails();
      fetchTasks();
      fetchAttendance();
    }
  }, [menteeId, user?.id]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchMenteeDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id || !menteeId) {
        setError('Missing required IDs. Please try again.');
        return;
      }
      
      console.log(`Fetching mentee details - Mentor ID: ${user.id}, Mentee ID: ${menteeId}`);
      console.log(`API endpoint: /api/mentors/${user.id}/students/${menteeId}`);
      
      const response = await mentorService.getStudentDetails(user.id, menteeId);
      
      console.log('Mentee details API response:', {
        status: response?.status,
        data: response?.data,
        headers: response?.headers
      });
      
      if (response && response.data) {
        const menteeData = {
          ...response.data,
          status: 'ACTIVE'
        };
        
        setMentee(menteeData);
        setFormData({
          firstName: menteeData.firstName || '',
          lastName: menteeData.lastName || '',
          email: menteeData.email || '',
          phone: menteeData.phone || '',
          department: menteeData.department || '',
          skills: menteeData.skills || [],
          interests: menteeData.interests || '',
          notes: menteeData.notes || '',
          status: 'ACTIVE',
          joinedDate: menteeData.joinedDate || '',
        });
      } else {
        throw new Error('Empty or invalid response received');
      }
    } catch (err) {
      console.error('Error fetching mentee details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      let errorMessage = 'Failed to load mentee details: ';
      if (err.response?.status === 404) {
        errorMessage += 'Mentee not found';
      } else if (err.response?.status === 403) {
        errorMessage += 'You do not have permission to view this mentee';
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += err.message || 'Unknown error occurred';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      console.log(`Fetching tasks for mentee: ${menteeId}, mentor: ${user.id}`);
      const response = await mentorService.getStudentTasks(user.id, menteeId);
      console.log('Tasks response:', response);
      setTasks(response.data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const fetchAttendance = async () => {
    try {
      console.log(`Fetching attendance for mentee: ${menteeId}, mentor: ${user.id}`);
      const response = await mentorService.getStudentAttendance(user.id, menteeId);
      console.log('Attendance response:', response);
      setAttendance(response.data || []);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
      if (!formData.skills.includes(newSkill.trim())) {
        setFormData({
          ...formData,
          skills: [...formData.skills, newSkill.trim()]
        });
      }
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSaveSuccess(false);
      
      if (!user?.id || !menteeId) {
        throw new Error('Missing required IDs. Please try again.');
      }
      
      const dataToSave = {
        ...formData,
        status: 'ACTIVE'
      };
      
      console.log('Updating mentee details:', {
        mentorId: user.id,
        menteeId: menteeId,
        endpoint: `/api/mentors/${user.id}/students/${menteeId}/update`,
        data: dataToSave
      });
      
      const response = await mentorService.updateStudentInfo(user.id, menteeId, dataToSave);
      
      console.log('Update response:', {
        status: response?.status,
        data: response?.data,
        headers: response?.headers
      });
      
      await fetchMenteeDetails();
      setEditMode(false);
      setSaveSuccess(true);
      setShowConfirmDialog(false);
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating mentee:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      let errorMessage = 'Failed to update mentee information: ';
      if (err.response?.status === 404) {
        errorMessage += 'Mentee not found';
      } else if (err.response?.status === 403) {
        errorMessage += 'You do not have permission to update this mentee';
      } else if (err.response?.status === 400) {
        errorMessage += err.response.data.message || 'Invalid data provided';
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += err.message || 'Unknown error occurred';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await mentorService.updateTask(taskId, { status: newStatus });
      fetchTasks(); // Refresh tasks
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  if (loading && !mentee) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate('/mentor/mentees')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mentee?.firstName || ''} {mentee?.lastName || ''}
          </h1>
          <p className="text-gray-600">{mentee?.email || ''}</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-md">
          Mentee information updated successfully!
        </div>
      )}

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-indigo-50 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-indigo-700'
                  : 'text-indigo-500 hover:bg-white/[0.12] hover:text-indigo-700'
              )
            }
          >
            Profile
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-indigo-700'
                  : 'text-indigo-500 hover:bg-white/[0.12] hover:text-indigo-700'
              )
            }
          >
            Tasks
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-indigo-700'
                  : 'text-indigo-500 hover:bg-white/[0.12] hover:text-indigo-700'
              )
            }
          >
            Attendance
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Mentee Information</h2>
                  <button
                    type="button"
                    onClick={() => setEditMode(!editMode)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {editMode ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {editMode ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border ${
                            validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          required
                        />
                        {validationErrors.firstName && (
                          <p className="mt-1 text-xs text-red-600">{validationErrors.firstName}</p>
                        )}
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border ${
                            validationErrors.lastName ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          required
                        />
                        {validationErrors.lastName && (
                          <p className="mt-1 text-xs text-red-600">{validationErrors.lastName}</p>
                        )}
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border ${
                            validationErrors.email ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          required
                        />
                        {validationErrors.email && (
                          <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
                        )}
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone
                          <span className="ml-1 text-xs text-gray-500">(optional)</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border ${
                            validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {validationErrors.phone && (
                          <p className="mt-1 text-xs text-red-600">{validationErrors.phone}</p>
                        )}
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          id="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                          Skills
                        </label>
                        <div className="mt-1">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {formData.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveSkill(skill);
                                  }}
                                  className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                                >
                                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex">
                            <input
                              type="text"
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              placeholder="Add a skill"
                              className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <button
                              type="button"
                              onClick={handleAddSkill}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
                          Interests
                        </label>
                        <input
                          type="text"
                          name="interests"
                          id="interests"
                          value={formData.interests}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Mentor Notes
                          <span className="ml-1 text-xs text-gray-500">(private to you)</span>
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          value={formData.notes}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowConfirmDialog(true)}
                        disabled={loading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full name</h3>
                        <p className="mt-1 text-sm text-gray-900">{mentee?.firstName || ''} {mentee?.lastName || ''}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email address</h3>
                        <p className="mt-1 text-sm text-gray-900">{mentee?.email || ''}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        <p className="mt-1 text-sm text-gray-900">{mentee?.phone || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Department</h3>
                        <p className="mt-1 text-sm text-gray-900">{mentee?.department || 'Not assigned'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Status</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ACTIVE
                          </span>
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Joined</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {mentee?.joinedDate ? new Date(mentee.joinedDate).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Skills</h3>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {mentee?.skills && mentee.skills.length > 0 ? 
                          mentee.skills.map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {skill}
                            </span>
                          )) : 
                          <p className="text-sm text-gray-500">No skills listed</p>
                        }
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Interests</h3>
                      <p className="mt-1 text-sm text-gray-900">{mentee?.interests || 'Not provided'}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Mentor Notes</h3>
                      <p className="mt-1 text-sm text-gray-900">{mentee?.notes || 'No notes yet'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Assigned Tasks</h2>
                  <button
                    type="button"
                    onClick={() => navigate(`/mentor/tasks/new?menteeId=${menteeId}`)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Assign New Task
                  </button>
                </div>

                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks assigned</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by assigning a new task.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {tasks.map((task) => (
                      <li key={task.id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-indigo-600 truncate">{task.title}</p>
                            <p className="text-sm text-gray-500">{task.description}</p>
                            <div className="mt-2 flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <select
                              value={task.status}
                              onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                              className={`inline-flex rounded-full text-xs font-semibold py-1 px-2 ${
                                task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                                task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="COMPLETED">Completed</option>
                            </select>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Attendance Record</h2>
                  <button
                    type="button"
                    onClick={() => navigate(`/mentor/attendance/record?menteeId=${menteeId}`)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Record Attendance
                  </button>
                </div>

                {attendance.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
                    <p className="mt-1 text-sm text-gray-500">Start tracking attendance for this mentee.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {attendance.map((record) => (
                          <tr key={record.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(record.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                record.status === 'PRESENT' ? 'bg-green-100 text-green-800' : 
                                record.status === 'ABSENT' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.sessionType}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {record.notes || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                  <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Save Changes?
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to save these changes? This action will update the mentee's information.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteeDetail; 