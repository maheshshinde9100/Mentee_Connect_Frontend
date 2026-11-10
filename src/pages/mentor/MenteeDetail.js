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
      //console.log(`Loading details for mentee: ${menteeId}, mentor: ${user.id}`);
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
      
      //console.log(`Fetching mentee details - Mentor ID: ${user.id}, Mentee ID: ${menteeId}`);
      //console.log(`API endpoint: /api/mentors/${user.id}/students/${menteeId}`);
      
      const response = await mentorService.getStudentDetails(user.id, menteeId);
      
      // console.log('Mentee details API response:', {
      //   status: response?.status,
      //   data: response?.data,
      //   headers: response?.headers
      // });
      
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
      //console.log(`Fetching tasks for mentee: ${menteeId}, mentor: ${user.id}`);
      const response = await mentorService.getStudentTasks(user.id, menteeId);
      //console.log('Tasks response:', response);
      setTasks(response.data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const fetchAttendance = async () => {
    try {
      //console.log(`Fetching attendance for mentee: ${menteeId}, mentor: ${user.id}`);
      const response = await mentorService.getStudentAttendance(user.id, menteeId);
      //console.log('Attendance response:', response);
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
      
      // console.log('Updating mentee details:', {
      //   mentorId: user.id,
      //   menteeId: menteeId,
      //   endpoint: `/api/mentors/${user.id}/students/${menteeId}/update`,
      //   data: dataToSave
      // });
      
      const response = await mentorService.updateStudentInfo(user.id, menteeId, dataToSave);
      
      // console.log('Update response:', {
      //   status: response?.status,
      //   data: response?.data,
      //   headers: response?.headers
      // });
      
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
      <div className="flex h-full items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert-error">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/mentor/mentees')}
          className="btn-icon mr-2"
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <div>
          <h1 className="page-title">
            {mentee?.firstName || ''} {mentee?.lastName || ''}
          </h1>
          <p className="page-subtitle">{mentee?.email || ''}</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="alert-success">
          Mentee information updated successfully!
        </div>
      )}

      <Tab.Group>
        <Tab.List className="mb-6 flex gap-8 border-b border-gray-200 dark:border-slate-700">
          <Tab
            className={({ selected }) =>
              classNames(
                'tab',
                selected && 'tab-active'
              )
            }
          >
            Profile
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'tab',
                selected && 'tab-active'
              )
            }
          >
            Tasks
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'tab',
                selected && 'tab-active'
              )
            }
          >
            Attendance
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="card overflow-hidden">
              <div className="card-pad">
                <div className="mb-6 flex justify-between">
                  <h2 className="section-title">Mentee Information</h2>
                  <button
                    type="button"
                    onClick={() => setEditMode(!editMode)}
                    className="btn-secondary btn-sm"
                  >
                    {editMode ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {editMode ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="firstName" className="label">
                          First name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`input ${validationErrors.firstName ? 'border-red-400' : ''}`}
                          required
                        />
                        {validationErrors.firstName && (
                          <p className="form-error">{validationErrors.firstName}</p>
                        )}
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="lastName" className="label">
                          Last name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`input ${validationErrors.lastName ? 'border-red-400' : ''}`}
                          required
                        />
                        {validationErrors.lastName && (
                          <p className="form-error">{validationErrors.lastName}</p>
                        )}
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="email" className="label">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`input ${validationErrors.email ? 'border-red-400' : ''}`}
                          required
                        />
                        {validationErrors.email && (
                          <p className="form-error">{validationErrors.email}</p>
                        )}
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="phone" className="label">
                          Phone
                          <span className="ml-1 text-xs font-normal text-gray-500 dark:text-slate-400">(optional)</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`input ${validationErrors.phone ? 'border-red-400' : ''}`}
                        />
                        {validationErrors.phone && (
                          <p className="form-error">{validationErrors.phone}</p>
                        )}
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="department" className="label">
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          id="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="input"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="skills" className="label">
                          Skills
                        </label>
                        <div>
                          <div className="mb-2 flex flex-wrap gap-2">
                            {formData.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="badge-brand"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveSkill(skill);
                                  }}
                                  className="ml-1 inline-flex items-center rounded-full p-0.5 text-brand-500 hover:bg-brand-100 hover:text-brand-700 dark:hover:bg-brand-500/20"
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
                              className="input flex-1 rounded-r-none"
                            />
                            <button
                              type="button"
                              onClick={handleAddSkill}
                              className="btn-primary rounded-l-none"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="interests" className="label">
                          Interests
                        </label>
                        <input
                          type="text"
                          name="interests"
                          id="interests"
                          value={formData.interests}
                          onChange={handleInputChange}
                          className="input"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="notes" className="label">
                          Mentor Notes
                          <span className="ml-1 text-xs font-normal text-gray-500 dark:text-slate-400">(private to you)</span>
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          value={formData.notes}
                          onChange={handleInputChange}
                          className="textarea"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowConfirmDialog(true)}
                        disabled={loading}
                        className="btn-primary"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium muted">Full name</h3>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{mentee?.firstName || ''} {mentee?.lastName || ''}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium muted">Email address</h3>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{mentee?.email || ''}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium muted">Phone</h3>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{mentee?.phone || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium muted">Department</h3>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{mentee?.department || 'Not assigned'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium muted">Status</h3>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          <span className="badge-success">
                            ACTIVE
                          </span>
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium muted">Joined</h3>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {mentee?.joinedDate ? new Date(mentee.joinedDate).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium muted">Skills</h3>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {mentee?.skills && mentee.skills.length > 0 ? 
                          mentee.skills.map((skill, index) => (
                            <span key={index} className="badge-brand">
                              {skill}
                            </span>
                          )) : 
                          <p className="muted text-sm">No skills listed</p>
                        }
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium muted">Interests</h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">{mentee?.interests || 'Not provided'}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium muted">Mentor Notes</h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">{mentee?.notes || 'No notes yet'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel>
            <div className="card overflow-hidden">
              <div className="card-pad">
                <div className="mb-6 flex justify-between">
                  <h2 className="section-title">Assigned Tasks</h2>
                  <button
                    type="button"
                    onClick={() => navigate(`/mentor/tasks/new?menteeId=${menteeId}`)}
                    className="btn-primary"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Assign New Task
                  </button>
                </div>

                {tasks.length === 0 ? (
                  <div className="py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tasks assigned</h3>
                    <p className="muted mt-1 text-sm">Get started by assigning a new task.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100 dark:divide-slate-700/60">
                    {tasks.map((task) => (
                      <li key={task.id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{task.title}</p>
                            <p className="muted text-sm">{task.description}</p>
                            <div className="mt-2 flex">
                              <p className="muted flex items-center text-sm">
                                <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
                              className={`select h-auto w-auto py-1 pr-8 pl-2.5 text-xs font-medium ${
                                task.status === 'COMPLETED' ? 'border-emerald-300 text-emerald-700 dark:border-emerald-900/50 dark:text-emerald-300' :
                                task.status === 'IN_PROGRESS' ? 'border-amber-300 text-amber-700 dark:border-amber-900/50 dark:text-amber-300' :
                                'text-gray-700 dark:text-slate-300'
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
            <div className="card overflow-hidden">
              <div className="card-pad">
                <div className="mb-6 flex justify-between">
                  <h2 className="section-title">Attendance Record</h2>
                  <button
                    type="button"
                    onClick={() => navigate(`/mentor/attendance/record?menteeId=${menteeId}`)}
                    className="btn-primary"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Record Attendance
                  </button>
                </div>

                {attendance.length === 0 ? (
                  <div className="py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No attendance records</h3>
                    <p className="muted mt-1 text-sm">Start tracking attendance for this mentee.</p>
                  </div>
                ) : (
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Date</th>
                          <th scope="col">Status</th>
                          <th scope="col">Session Type</th>
                          <th scope="col">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.map((record) => (
                          <tr key={record.id}>
                            <td>
                              {new Date(record.date).toLocaleDateString()}
                            </td>
                            <td>
                              <span className={`${
                                record.status === 'PRESENT' ? 'badge-success' : 
                                record.status === 'ABSENT' ? 'badge-danger' : 
                                'badge-warn'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                            <td>
                              {record.sessionType}
                            </td>
                            <td>
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
        <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity dark:bg-black/70" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            <div className="card inline-block overflow-hidden px-4 pt-5 pb-4 text-left align-bottom sm:my-8 sm:w-full sm:max-w-lg sm:align-middle sm:p-6">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
                  <svg className="h-6 w-6 text-brand-600 dark:text-brand-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white" id="modal-title">
                    Save Changes?
                  </h3>
                  <div className="mt-2">
                    <p className="muted text-sm">
                      Are you sure you want to save these changes? This action will update the mentee's information.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn-primary w-full sm:col-start-2"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(false)}
                  className="btn-secondary mt-3 w-full sm:col-start-1 sm:mt-0"
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
