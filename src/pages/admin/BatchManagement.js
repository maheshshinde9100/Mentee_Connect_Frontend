import React, { useState, useEffect } from 'react';
import { batchService } from '../../services/batchService';
import { adminService } from '../../services/adminService';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { debugAuthState, fixProxyAuth } from '../../utils/authUtils';
import { classNames } from '../../utils/classNames';

const BatchManagement = () => {
  const [activeTab, setActiveTab] = useState('allBatches');
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState({
    batches: true,
    students: false,
    mentors: false,
    batchDetails: false
  });
  const [error, setError] = useState(null);
  const [batchForm, setBatchForm] = useState({
    batchName: '',
    course: '',
    startDate: '',
    endDate: ''
  });
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedMentors, setSelectedMentors] = useState([]);
  const [success, setSuccess] = useState('');
  const [batchDetails, setBatchDetails] = useState({
    batch: null,
    students: [],
    mentors: []
  });
  const { isAuthenticated, user } = useAuth();
  const [currentBatchMentorIds, setCurrentBatchMentorIds] = useState([]);
  const [currentBatchStudentIds, setCurrentBatchStudentIds] = useState([]);

  useEffect(() => {
    // Try to fetch batches
    fetchBatches();
  }, [isAuthenticated, user]);

  const fetchBatches = async () => {
    try {
      setLoading(prevState => ({ ...prevState, batches: true }));
      console.log('Starting to fetch batches...');
      
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token && !isAuthenticated) {
        setError('Not authenticated. Please log in to access this feature.');
        setLoading(prevState => ({ ...prevState, batches: false }));
        return;
      }
      
      const response = await adminService.getAllBatches();
      console.log('Batches fetched:', response);
      
      // Ensure batches is always an array
      let batchesArray = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          batchesArray = response.data;
          
          // Log pagination info if available
          if (response.pagination) {
            console.log('Pagination info:', response.pagination);
          }
        } else if (response.data.content && Array.isArray(response.data.content)) {
          batchesArray = response.data.content;
        } else if (typeof response.data === 'object') {
          console.warn('API returned a non-array response:', response.data);
          // If it's an object, try to extract the first array property
          const firstArrayProperty = Object.values(response.data).find(val => Array.isArray(val));
          if (firstArrayProperty) {
            batchesArray = firstArrayProperty;
          } else {
            console.error('Could not find array in response, using empty array');
          }
        }
      }
      
      console.log('Processed batches array:', batchesArray);
      setBatches(batchesArray);
      setError(null);
    } catch (err) {
      console.error('Error fetching batches:', err);
      
      // Handle error based on response status
      if (err.response) {
        const { status } = err.response;
        if (status === 401) {
          setError('Authentication error. Please log in again.');
        } else if (status === 403) {
          setError('You do not have permission to access this resource.');
        } else if (status === 404) {
          setError('Resource not found. Please check the API endpoint.');
        } else {
          setError(`Server error: ${err.response.data?.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error connecting to server.');
      }
      
      // Set empty array on error
      setBatches([]);
    } finally {
      setLoading(prevState => ({ ...prevState, batches: false }));
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(prevState => ({ ...prevState, students: true }));
      console.log('Fetching students...');
      
      const response = await adminService.getAllStudents();
      console.log('Students API response:', response);
      
      // Process response to ensure we have an array
      let studentsArray = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          studentsArray = response.data;
        } else if (response.data.content && Array.isArray(response.data.content)) {
          studentsArray = response.data.content;
        }
      }
      
      // Ensure all students have id property (MongoDB may use _id)
      studentsArray = studentsArray.map(student => {
        if (student._id && !student.id) {
          return { ...student, id: student._id };
        }
        return student;
      });
      
      setStudents(studentsArray);
      setError(null);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students from API.');
      setStudents([]);
    } finally {
      setLoading(prevState => ({ ...prevState, students: false }));
    }
  };

  const fetchMentors = async () => {
    try {
      setLoading(prevState => ({ ...prevState, mentors: true }));
      console.log('Fetching mentors...');
      
      const response = await adminService.getAllMentors();
      console.log('Mentors API response in component:', response);
      
      // Process response to ensure we have an array
      let mentorsArray = [];
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          console.log('Using data array from response with length:', response.data.length);
          mentorsArray = response.data;
          
          // If we have pagination info, log it
          if (response.pagination) {
            console.log('Pagination info received:', response.pagination);
          }
        } else if (response.content && Array.isArray(response.content)) {
          console.log('Using content array directly from response');
          mentorsArray = response.content;
        } else if (Array.isArray(response)) {
          console.log('Using response as direct array');
          mentorsArray = response;
        }
      }
      
      // Check if mentors array is empty and log a detailed message
      if (mentorsArray.length === 0) {
        console.warn('No mentors found in the response. Please check:');
        console.warn('1. The API endpoint URL is correct (/api/admin/mentors)');
        console.warn('2. You have proper authentication');
        console.warn('3. The backend API is returning mentors in the expected format');
        console.warn('4. Check the Network tab in DevTools to see the actual response');
      }
      
      // Ensure all mentors have id property (MongoDB may use _id)
      mentorsArray = mentorsArray.map(mentor => {
        if (mentor._id && !mentor.id) {
          return { ...mentor, id: mentor._id };
        }
        return mentor;
      });
      
      console.log('Processed mentors array:', mentorsArray);
      setMentors(mentorsArray);
      setError(null);
    } catch (err) {
      console.error('Error fetching mentors:', err);
      console.error('Error details:', {
        response: err.response,
        request: err.request,
        message: err.message
      });
      setError('Failed to load mentors from API. Check console for details.');
      setMentors([]);
    } finally {
      setLoading(prevState => ({ ...prevState, mentors: false }));
    }
  };

  const fetchBatchDetails = async (batchId) => {
    try {
      setLoading(prevState => ({ ...prevState, batchDetails: true }));
      console.log(`Fetching details for batch ID: ${batchId}`);
      
      const batchResponse = await batchService.getBatchById(batchId);
      console.log('Batch data fetched:', batchResponse.data);
      
      const studentsResponse = await batchService.getBatchStudents(batchId);
      // Ensure students data is an array
      const studentsData = Array.isArray(studentsResponse.data) 
        ? studentsResponse.data 
        : (studentsResponse.data?.students || []);
      
      console.log('Batch students fetched:', studentsData);
      
      // Extract student IDs for filtering assigned students
      if (studentsData && Array.isArray(studentsData)) {
        const studentIds = studentsData.map(student => student.id || student._id);
        console.log('Extracted student IDs from batch:', studentIds);
        setCurrentBatchStudentIds(studentIds);
      }
      
      // Fetch mentors
      let mentorsData = [];
      try {
        const mentorsResponse = await batchService.getBatchMentors(batchId);
        // Ensure mentors data is an array
        mentorsData = Array.isArray(mentorsResponse.data) 
          ? mentorsResponse.data 
          : (mentorsResponse.data?.mentors || []);
        
        console.log('Batch mentors fetched:', mentorsData);
        
        // Extract mentor IDs for filtering assigned mentors
        if (batchResponse.data) {
          let mentorIds = [];
          
          if (batchResponse.data.mentorsAssigned && Array.isArray(batchResponse.data.mentorsAssigned)) {
            mentorIds = batchResponse.data.mentorsAssigned;
          } else if (batchResponse.data.mentorAssigned) {
            if (Array.isArray(batchResponse.data.mentorAssigned)) {
              mentorIds = batchResponse.data.mentorAssigned;
            } else {
              mentorIds = [batchResponse.data.mentorAssigned];
            }
          }
          
          console.log('Extracted mentor IDs from batch:', mentorIds);
          setCurrentBatchMentorIds(mentorIds);
        }
      } catch (mentorErr) {
        console.error('Error fetching mentors for batch:', mentorErr);
        setError('Could not load mentors for this batch.');
      }
      
      setBatchDetails({
        batch: batchResponse.data,
        students: studentsData,
        mentors: mentorsData
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching batch details:', err);
      setError('Could not load batch details.');
      setBatchDetails({
        batch: null,
        students: [],
        mentors: []
      });
    } finally {
      setLoading(prevState => ({ ...prevState, batchDetails: false }));
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'assignStudents' && students.length === 0) {
      fetchStudents();
    }
    if (tab === 'assignMentors' && mentors.length === 0) {
      fetchMentors();
    }
    if (tab === 'assignMentors' && selectedBatch) {
      // Get details of selected batch to know which mentors are already assigned
      fetchBatchDetails(selectedBatch);
    }
    // Reset success message when changing tabs
    setSuccess('');
  };

  const handleBatchFormChange = (e) => {
    const { name, value } = e.target;
    setBatchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      setLoading(prevState => ({ ...prevState, batches: true }));
      await batchService.createBatch(batchForm);
      setSuccess('Batch created successfully!');
      setBatchForm({
        batchName: '',
        course: '',
        startDate: '',
        endDate: ''
      });
      fetchBatches();
    } catch (err) {
      console.error('Error creating batch:', err);
      setError('Failed to create batch');
    } finally {
      setLoading(prevState => ({ ...prevState, batches: false }));
    }
  };

  const handleBatchSelect = (batchId) => {
    setSelectedBatch(batchId);
    // If we're in assign mentors or assign students tab, fetch batch details to know current assigned mentors/students
    if ((activeTab === 'assignMentors' || activeTab === 'assignStudents') && batchId) {
      fetchBatchDetails(batchId);
    }
  };

  const handleViewBatchDetails = (batchId) => {
    setSelectedBatch(batchId);
    fetchBatchDetails(batchId);
    handleTabChange('batchDetails');
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleMentorSelect = (mentorId) => {
    setSelectedMentors(prev => {
      if (prev.includes(mentorId)) {
        return prev.filter(id => id !== mentorId);
      } else {
        return [...prev, mentorId];
      }
    });
  };

  const handleAssignStudents = async () => {
    if (!selectedBatch || selectedStudents.length === 0) {
      setError('Please select a batch and at least one student');
      return;
    }

    try {
      setLoading(prevState => ({ ...prevState, students: true }));
      console.log(`Assigning students ${JSON.stringify(selectedStudents)} to batch ${selectedBatch}`);
      
      // Use the correct format for the API
      const response = await batchService.assignStudentsToBatch(selectedBatch, selectedStudents);
      console.log('Assignment response:', response.data);
      
      setSuccess('Students assigned to batch successfully!');
      setSelectedStudents([]);
    } catch (err) {
      console.error('Error assigning students:', err);
      setError('Failed to assign students to batch.');
    } finally {
      setLoading(prevState => ({ ...prevState, students: false }));
    }
  };

  const handleAssignMentors = async () => {
    if (!selectedBatch || selectedMentors.length === 0) {
      setError('Please select a batch and at least one mentor');
      return;
    }

    try {
      setLoading(prevState => ({ ...prevState, mentors: true }));
      console.log(`Assigning mentors ${JSON.stringify(selectedMentors)} to batch ${selectedBatch}`);
      
      // Use the correct format for the API
      const response = await batchService.assignMentorsToBatch(selectedBatch, selectedMentors);
      console.log('Assignment response:', response.data);
      
      setSuccess('Mentors assigned to batch successfully!');
      setSelectedMentors([]);
      
      // Refresh batch details to show updated mentors
      fetchBatchDetails(selectedBatch);
    } catch (err) {
      console.error('Error assigning mentors:', err);
      setError('Failed to assign mentors to batch.');
    } finally {
      setLoading(prevState => ({ ...prevState, mentors: false }));
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!selectedBatch) {
      setError('Batch not selected');
      return;
    }

    try {
      setLoading(prevState => ({ ...prevState, batchDetails: true }));
      console.log(`Removing student ${studentId} from batch ${selectedBatch}`);
      
      // Call the API to remove the student
      const response = await batchService.removeStudentFromBatch(selectedBatch, studentId);
      console.log('Removal response:', response.data);
      
      setSuccess('Student removed from batch successfully!');
      
      // Refresh batch details to show updated students list
      fetchBatchDetails(selectedBatch);
    } catch (err) {
      console.error('Error removing student:', err);
      setError('Failed to remove student from batch.');
    } finally {
      setLoading(prevState => ({ ...prevState, batchDetails: false }));
    }
  };

  const handleRemoveMentor = async (mentorId) => {
    if (!selectedBatch) {
      setError('Batch not selected');
      return;
    }

    try {
      setLoading(prevState => ({ ...prevState, batchDetails: true }));
      console.log(`Removing mentor ${mentorId} from batch ${selectedBatch}`);
      
      // Call the API to remove the mentor
      const response = await batchService.removeMentorFromBatch(selectedBatch, mentorId);
      console.log('Removal response:', response.data);
      
      setSuccess('Mentor removed from batch successfully!');
      
      // Refresh batch details to show updated mentors list
      fetchBatchDetails(selectedBatch);
    } catch (err) {
      console.error('Error removing mentor:', err);
      setError('Failed to remove mentor from batch.');
    } finally {
      setLoading(prevState => ({ ...prevState, batchDetails: false }));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const renderTabs = () => (
    <div className="border-b border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Batch Management</h1>
          <p className="text-sm text-gray-500">Manage batches, students, and mentors</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => {
              debugAuthState();
              const fixed = fixProxyAuth();
              if (fixed) {
                setSuccess('Token format fixed for proxy compatibility');
                // Try to fetch batches again with fixed token
                fetchBatches();
              }
            }}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            title="Debug authentication status and fix token issues"
          >
            Debug Auth
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
          value={activeTab}
          onChange={(e) => handleTabChange(e.target.value)}
        >
          <option value="allBatches">All Batches</option>
          <option value="createBatch">Create Batch</option>
          <option value="assignStudents">Assign Students</option>
          <option value="assignMentors">Assign Mentors</option>
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="-mb-px flex space-x-8">
          <button
            className={classNames(
              activeTab === 'allBatches'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            )}
            onClick={() => handleTabChange('allBatches')}
          >
            All Batches
          </button>
          <button
            className={classNames(
              activeTab === 'createBatch'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            )}
            onClick={() => handleTabChange('createBatch')}
          >
            Create Batch
          </button>
          <button
            className={classNames(
              activeTab === 'assignStudents'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            )}
            onClick={() => handleTabChange('assignStudents')}
          >
            Assign Students
          </button>
          <button
            className={classNames(
              activeTab === 'assignMentors'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            )}
            onClick={() => handleTabChange('assignMentors')}
          >
            Assign Mentors
          </button>
        </nav>
      </div>
    </div>
  );

  const renderTabContent = () => {
    // Ensure batches is always an array
    const batchesArray = Array.isArray(batches) ? batches : [];
    
    switch (activeTab) {
      case 'allBatches':
        return (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">All Batches</h2>
            {loading.batches ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : batchesArray.length === 0 ? (
              <p className="text-gray-500 text-center">No batches found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Batch Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {batchesArray.map((batch) => (
                      <tr key={batch.id || batch._id || `batch-${Math.random()}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{batch.batchName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{batch.course}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(batch.startDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(batch.endDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            onClick={() => {
                              setSelectedBatch(batch.id || batch._id);
                              handleTabChange('assignStudents');
                            }}
                          >
                            Assign Students
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-900 mr-4"
                            onClick={() => {
                              setSelectedBatch(batch.id || batch._id);
                              handleTabChange('assignMentors');
                            }}
                          >
                            Assign Mentors
                          </button>
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleViewBatchDetails(batch.id || batch._id)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'createBatch':
        return (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Create New Batch</h2>
            <form onSubmit={handleCreateBatch} className="space-y-4 bg-white p-6 rounded-lg shadow">
              <div>
                <label className="block text-sm font-medium text-gray-700">Batch Name</label>
                <input
                  type="text"
                  name="batchName"
                  value={batchForm.batchName}
                  onChange={handleBatchFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <input
                  type="text"
                  name="course"
                  value={batchForm.course}
                  onChange={handleBatchFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={batchForm.startDate}
                  onChange={handleBatchFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={batchForm.endDate}
                  onChange={handleBatchFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading.batches}
                >
                  {loading.batches ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    'Create Batch'
                  )}
                </button>
              </div>
            </form>
          </div>
        );

      case 'assignStudents':
        // Filter out already assigned students
        const availableStudents = Array.isArray(students) ? 
          students.filter(student => 
            !currentBatchStudentIds.includes(student.id) && 
            !currentBatchStudentIds.includes(student._id)
          ) : [];
        
        return (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Assign Students to Batch</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
              <select
                value={selectedBatch || ''}
                onChange={(e) => handleBatchSelect(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a batch</option>
                {batchesArray.map((batch) => (
                  <option key={batch.id || batch._id || `batch-${Math.random()}`} value={batch.id || batch._id}>
                    {batch.batchName} - {batch.course}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Select Students</h3>
              {loading.students ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
              ) : !Array.isArray(availableStudents) ? (
                <p className="text-gray-500 text-center">Error loading students data. Please try again.</p>
              ) : availableStudents.length === 0 ? (
                <p className="text-gray-500 text-center">No available students found. All students may already be assigned to this batch.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableStudents.map((student) => (
                    <div 
                      key={student.id} 
                      className={`border rounded-lg p-4 cursor-pointer ${
                        selectedStudents.includes(student.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleStudentSelect(student.id)}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => {}}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={handleAssignStudents}
                disabled={!selectedBatch || selectedStudents.length === 0 || loading.students}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  !selectedBatch || selectedStudents.length === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {loading.students ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Assigning...
                  </span>
                ) : (
                  'Assign Students'
                )}
              </button>
            </div>
          </div>
        );

      case 'assignMentors':
        // Filter out already assigned mentors
        const availableMentors = Array.isArray(mentors) ? 
          mentors.filter(mentor => 
            !currentBatchMentorIds.includes(mentor.id) && 
            !currentBatchMentorIds.includes(mentor._id)
          ) : [];
        
        return (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Assign Mentors to Batch</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
              <select
                value={selectedBatch || ''}
                onChange={(e) => handleBatchSelect(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a batch</option>
                {batchesArray.map((batch) => (
                  <option key={batch.id || batch._id || `batch-${Math.random()}`} value={batch.id || batch._id}>
                    {batch.batchName} - {batch.course}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Select Mentors</h3>
              {loading.mentors ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
              ) : !Array.isArray(availableMentors) ? (
                <p className="text-gray-500 text-center">Error loading mentors data. Please try again.</p>
              ) : availableMentors.length === 0 ? (
                <p className="text-gray-500 text-center">No available mentors found. All mentors may already be assigned to this batch.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableMentors.map((mentor) => (
                    <div
                      key={mentor.id || mentor._id || `mentor-${Math.random()}`}
                      className={`border rounded-lg p-4 cursor-pointer ${
                        selectedMentors.includes(mentor.id || mentor._id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleMentorSelect(mentor.id || mentor._id)}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedMentors.includes(mentor.id || mentor._id)}
                          onChange={() => {}}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-indigo-600 truncate">{mentor.firstName || ''} {mentor.lastName || ''}</p>
                          <p className="text-sm text-gray-500">{mentor.email || 'No email provided'}</p>
                          {mentor.mentorId && (
                            <p className="text-xs text-gray-500">ID: {mentor.mentorId}</p>
                          )}
                          {mentor.department && (
                            <p className="text-xs text-gray-500">Department: {mentor.department}</p>
                          )}
                          {mentor.specialization && (
                            <p className="text-xs text-gray-500">Specialization: {mentor.specialization}</p>
                          )}
                          {mentor.designation && (
                            <p className="text-xs text-gray-500">Designation: {mentor.designation}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={handleAssignMentors}
                disabled={!selectedBatch || selectedMentors.length === 0 || loading.mentors}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  !selectedBatch || selectedMentors.length === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {loading.mentors ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Assigning...
                  </span>
                ) : (
                  'Assign Mentors'
                )}
              </button>
            </div>
          </div>
        );

      case 'batchDetails':
        return (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Batch Details</h2>
            {loading.batchDetails ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : !batchDetails.batch ? (
              <p className="text-gray-500 text-center">Batch details not found</p>
            ) : (
              <div className="space-y-8">
                {/* Batch Information */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Batch Information</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about the batch.</p>
                  </div>
                  <div className="border-t border-gray-200">
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Batch Name</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{batchDetails.batch.batchName}</dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Course</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{batchDetails.batch.course}</dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(batchDetails.batch.startDate)}</dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">End Date</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(batchDetails.batch.endDate)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Enrolled Students */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Enrolled Students</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Students currently enrolled in this batch.</p>
                  </div>
                  <div className="border-t border-gray-200">
                    {!Array.isArray(batchDetails.students) ? (
                      <div className="p-4 text-center text-gray-500">Cannot display students (data format error)</div>
                    ) : batchDetails.students.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No students assigned to this batch yet</div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {batchDetails.students.map(student => (
                          <li key={student.id || `student-${Math.random()}`} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-indigo-600 truncate">{student.firstName || ''} {student.lastName || ''}</p>
                                <p className="text-sm text-gray-500">{student.email || 'No email provided'}</p>
                              </div>
                              <div className="flex-shrink-0 flex items-center space-x-2">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Active
                                </span>
                                <button
                                  onClick={() => handleRemoveStudent(student.id || student._id)}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                  disabled={loading.batchDetails}
                                >
                                  {loading.batchDetails ? 'Removing...' : 'Remove'}
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Assigned Mentors */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Assigned Mentors</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Mentors assigned to this batch.</p>
                  </div>
                  <div className="border-t border-gray-200">
                    {!Array.isArray(batchDetails.mentors) ? (
                      <div className="p-4 text-center text-gray-500">Cannot display mentors (data format error)</div>
                    ) : batchDetails.mentors.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No mentors assigned to this batch yet</div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {batchDetails.mentors.map(mentor => (
                          <li key={mentor.id || mentor._id || `mentor-${Math.random()}`} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-indigo-600 truncate">{mentor.firstName || ''} {mentor.lastName || ''}</p>
                                <p className="text-sm text-gray-500">{mentor.email || 'No email provided'}</p>
                                {mentor.mentorId && (
                                  <p className="text-xs text-gray-500">ID: {mentor.mentorId}</p>
                                )}
                                {mentor.department && (
                                  <p className="text-xs text-gray-500">Department: {mentor.department}</p>
                                )}
                                {mentor.specialization && (
                                  <p className="text-xs text-gray-500">Specialization: {mentor.specialization}</p>
                                )}
                                {mentor.designation && (
                                  <p className="text-xs text-gray-500">Designation: {mentor.designation}</p>
                                )}
                              </div>
                              <div className="flex-shrink-0 flex items-center space-x-2">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                  Mentor
                                </span>
                                <button
                                  onClick={() => handleRemoveMentor(mentor.id || mentor._id)}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                  disabled={loading.batchDetails}
                                >
                                  {loading.batchDetails ? 'Removing...' : 'Remove'}
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderTabs()}
      {renderTabContent()}
    </div>
  );
};

export default BatchManagement; 