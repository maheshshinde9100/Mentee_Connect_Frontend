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
  const [loadingMessage, setLoadingMessage] = useState(null);

  useEffect(() => {
    // Try to fetch batches
    fetchBatches();
  }, [isAuthenticated, user]);

  const fetchBatches = async () => {
    try {
      setLoading(prevState => ({ ...prevState, batches: true }));
      //console.log('Starting to fetch batches...');
      
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token && !isAuthenticated) {
        setError('Not authenticated. Please log in to access this feature.');
        setLoading(prevState => ({ ...prevState, batches: false }));
        return;
      }
      
      const response = await adminService.getAllBatches();
      //console.log('Batches fetched:', response);
      
      // Ensure batches is always an array
      let batchesArray = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          batchesArray = response.data;
          
          // Log pagination info if available
          if (response.pagination) {
            //console.log('Pagination info:', response.pagination);
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
      
      //console.log('Processed batches array:', batchesArray);
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
      //console.log('Fetching students...');
      
      const response = await adminService.getAllStudents(0, 100);
      //console.log('Students API response:', response);
      
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
      //console.log('Fetching mentors (this may take some time for ~1500 entries)...');
      
      // Set a message to show user that fetching large paginated data is in progress
      setMentors([]);
      setLoadingMessage('Loading mentors across multiple pages. This may take a moment...');
      
      const response = await adminService.getAllMentors(0, 100);
      console.log('Mentors API response in component:', {
        dataLength: response?.data?.length || 0,
        hasPagination: !!response?.pagination,
        totalPages: response?.pagination?.totalPages || 0,
        totalElements: response?.pagination?.totalElements || 0
      });
      
      // Process response to ensure we have an array
      let mentorsArray = [];
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          //console.log('Using data array from response with length:', response.data.length);
          mentorsArray = response.data;
          
          // If we have pagination info, log it
          if (response.pagination) {
            //console.log('Pagination info received:', response.pagination);
            
            // Update loading message with number of mentors loaded
            if (response.pagination.totalElements) {
              setLoadingMessage(`Successfully loaded ${mentorsArray.length} of ${response.pagination.totalElements} mentors`);
            }
          }
        } else if (response.content && Array.isArray(response.content)) {
          //console.log('Using content array directly from response');
          mentorsArray = response.content;
        } else if (Array.isArray(response)) {
          //console.log('Using response as direct array');
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
        setLoadingMessage(null);
        setError('No mentors found. Please check authentication and API configuration.');
      }
      
      // Ensure all mentors have id property (MongoDB may use _id)
      mentorsArray = mentorsArray.map(mentor => {
        if (mentor._id && !mentor.id) {
          return { ...mentor, id: mentor._id };
        }
        return mentor;
      });
      
      //console.log(`Processed ${mentorsArray.length} mentors successfully`);
      setMentors(mentorsArray);
      setLoadingMessage(null);
      setError(null);
    } catch (err) {
      console.error('Error fetching mentors:', err);
      console.error('Error details:', {
        response: err.response,
        request: err.request,
        message: err.message
      });
      setLoadingMessage(null);
      setError('Failed to load mentors from API. Check console for details.');
      setMentors([]);
    } finally {
      setLoading(prevState => ({ ...prevState, mentors: false }));
    }
  };

  const fetchBatchDetails = async (batchId) => {
    try {
      setLoading(prevState => ({ ...prevState, batchDetails: true }));
      //console.log(`Fetching details for batch ID: ${batchId}`);
      
      const batchResponse = await batchService.getBatchById(batchId);
      //console.log('Batch data fetched:', batchResponse.data);
      
      // Extract student IDs for filtering assigned students
      if (batchResponse.data) {
        let studentIds = [];
        
        if (batchResponse.data.studentsAssigned && Array.isArray(batchResponse.data.studentsAssigned)) {
          studentIds = batchResponse.data.studentsAssigned;
          //console.log('Extracted student IDs from batch:', studentIds);
        }
        // Ensure we always set currentBatchStudentIds, even if it's an empty array
        setCurrentBatchStudentIds(studentIds);
      }
      
      // Fetch detailed student information for the assigned student IDs
      let studentsData = [];
      try {
        // If we have student IDs assigned to this batch, fetch their details
        if (currentBatchStudentIds.length > 0) {
          const studentsResponse = await adminService.getAllStudents();
          
          if (studentsResponse && studentsResponse.data) {
            // Get all students
            const allStudents = Array.isArray(studentsResponse.data) 
              ? studentsResponse.data 
              : (studentsResponse.data.content || []);
            
            // Filter to only include students assigned to this batch
            studentsData = allStudents.filter(student => {
              const studentId = student.id || student._id;
              return studentId && currentBatchStudentIds.includes(studentId);
            });
            
            //console.log('Filtered students by ID:', studentsData);
          }
        } else {
          //console.log('No student IDs assigned to this batch');
        }
      } catch (studErr) {
        console.error('Error fetching student details:', studErr);
      }
      
      // Fetch mentors
      let mentorsData = [];
      try {
        // Extract mentor IDs for filtering assigned mentors
        let mentorIds = [];
        if (batchResponse.data.mentorsAssigned && Array.isArray(batchResponse.data.mentorsAssigned)) {
          mentorIds = batchResponse.data.mentorsAssigned;
        } else if (batchResponse.data.mentorAssigned) {
          if (Array.isArray(batchResponse.data.mentorAssigned)) {
            mentorIds = batchResponse.data.mentorAssigned;
          } else if (batchResponse.data.mentorAssigned !== null) {
            mentorIds = [batchResponse.data.mentorAssigned];
          }
        }
        
        //console.log('Extracted mentor IDs from batch:', mentorIds);
        // Ensure we always set currentBatchMentorIds, even if it's an empty array
        setCurrentBatchMentorIds(mentorIds);
        
        // If we have mentor IDs assigned to this batch, fetch their details
        if (mentorIds.length > 0) {
          const mentorsResponse = await adminService.getAllMentors(0, 100);
          
          if (mentorsResponse && mentorsResponse.data) {
            // Get all mentors
            const allMentors = Array.isArray(mentorsResponse.data) 
              ? mentorsResponse.data 
              : (mentorsResponse.data.content || []);
            
            // Filter to only include mentors assigned to this batch
            mentorsData = allMentors.filter(mentor => {
              const mentorId = mentor.id || mentor._id;
              return mentorId && mentorIds.includes(mentorId);
            });
            
            //console.log('Filtered mentors by ID:', mentorsData);
          }
        } else {
          //console.log('No mentor IDs assigned to this batch');
        }
      } catch (mentorErr) {
        console.error('Error fetching mentors for batch:', mentorErr);
        setError('Could not load mentors for this batch.');
        // Make sure to set empty array for mentors on error
        setCurrentBatchMentorIds([]);
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
      // Make sure to reset the ID arrays on error
      setCurrentBatchStudentIds([]);
      setCurrentBatchMentorIds([]);
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
      //console.log(`Assigning students ${JSON.stringify(selectedStudents)} to batch ${selectedBatch}`);
      
      // Use the correct format for the API
      const response = await batchService.assignStudentsToBatch(selectedBatch, selectedStudents);
      //console.log('Assignment response:', response.data);
      
      setSuccess('Students assigned to batch successfully!');
      
      // Update the current batch student IDs
      setCurrentBatchStudentIds(prev => {
        const updatedIds = [...prev];
        selectedStudents.forEach(id => {
          if (!updatedIds.includes(id)) {
            updatedIds.push(id);
          }
        });
        return updatedIds;
      });
      
      // Clear selection
      setSelectedStudents([]);
      
      // If we're showing batch details, refresh to show the newly assigned students
      if (activeTab === 'batchDetails') {
        fetchBatchDetails(selectedBatch);
      }
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
      //console.log(`Assigning mentors ${JSON.stringify(selectedMentors)} to batch ${selectedBatch}`);
      
      // Use the correct format for the API
      const response = await batchService.assignMentorsToBatch(selectedBatch, selectedMentors);
      //console.log('Assignment response:', response.data);
      
      setSuccess('Mentors assigned to batch successfully!');
      
      // Update the current batch mentor IDs
      setCurrentBatchMentorIds(prev => {
        const updatedIds = [...prev];
        selectedMentors.forEach(id => {
          if (!updatedIds.includes(id)) {
            updatedIds.push(id);
          }
        });
        return updatedIds;
      });
      
      // Clear selection
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
      //console.log(`Removing student ${studentId} from batch ${selectedBatch}`);
      
      // Call the API to remove the student
      const response = await batchService.removeStudentFromBatch(selectedBatch, studentId);
      //console.log('Removal response:', response.data);
      
      setSuccess('Student removed from batch successfully!');
      
      // Update currentBatchStudentIds to remove this student ID
      setCurrentBatchStudentIds(prev => {
        const updated = prev.filter(id => id !== studentId);
        //console.log('Updated currentBatchStudentIds:', updated);
        return updated;
      });
      
      // If we're in the assignStudents tab, refresh the student list to make the removed student available again
      if (activeTab === 'assignStudents') {
        fetchStudents();
      } else {
        // Refresh batch details to show updated students list
        fetchBatchDetails(selectedBatch);
      }
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
      //console.log(`Removing mentor ${mentorId} from batch ${selectedBatch}`);
      
      // Call the API to remove the mentor
      const response = await batchService.removeMentorFromBatch(selectedBatch, mentorId);
      //console.log('Removal response:', response.data);
      
      setSuccess('Mentor removed from batch successfully!');
      
      // Update currentBatchMentorIds to remove this mentor ID
      setCurrentBatchMentorIds(prev => {
        const updated = prev.filter(id => id !== mentorId);
        //console.log('Updated currentBatchMentorIds:', updated);
        return updated;
      });
      
      // If we're in the assignMentors tab, refresh the mentor list to make the removed mentor available again
      if (activeTab === 'assignMentors') {
        fetchMentors();
      } else {
        // Refresh batch details to show updated mentors list
        fetchBatchDetails(selectedBatch);
      }
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
    <div className="border-b border-gray-200 dark:border-slate-700">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Batch Management</h1>
          <p className="page-subtitle">Manage batches, students, and mentors</p>
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
            className="btn-secondary btn-sm"
            title="Debug authentication status and fix token issues"
          >
            Debug Auth
          </button>
        </div>
      </div>
      
      {error && (
        <div className="alert-error mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="alert-success mb-4">
          <p className="text-sm">{success}</p>
        </div>
      )}

      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="select"
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
              activeTab === 'allBatches' ? 'tab tab-active' : 'tab'
            )}
            onClick={() => handleTabChange('allBatches')}
          >
            All Batches
          </button>
          <button
            className={classNames(
              activeTab === 'createBatch' ? 'tab tab-active' : 'tab'
            )}
            onClick={() => handleTabChange('createBatch')}
          >
            Create Batch
          </button>
          <button
            className={classNames(
              activeTab === 'assignStudents' ? 'tab tab-active' : 'tab'
            )}
            onClick={() => handleTabChange('assignStudents')}
          >
            Assign Students
          </button>
          <button
            className={classNames(
              activeTab === 'assignMentors' ? 'tab tab-active' : 'tab'
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
            <h2 className="section-title mb-4">All Batches</h2>
            {loading.batches ? (
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
              </div>
            ) : batchesArray.length === 0 ? (
              <p className="muted text-center">No batches found</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">
                        Batch Name
                      </th>
                      <th scope="col">
                        Course
                      </th>
                      <th scope="col">
                        Start Date
                      </th>
                      <th scope="col">
                        End Date
                      </th>
                      <th scope="col">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchesArray.map((batch) => (
                      <tr key={batch.id || batch._id || `batch-${Math.random()}`}>
                        <td>
                          <div className="font-medium text-gray-900 dark:text-white">{batch.batchName}</div>
                        </td>
                        <td>
                          <div className="muted">{batch.course}</div>
                        </td>
                        <td>
                          <div className="muted">{formatDate(batch.startDate)}</div>
                        </td>
                        <td>
                          <div className="muted">{formatDate(batch.endDate)}</div>
                        </td>
                        <td className="font-medium">
                          <div className="flex items-center gap-4">
                            <button 
                              className="link"
                              onClick={() => {
                                setSelectedBatch(batch.id || batch._id);
                                handleTabChange('assignStudents');
                              }}
                            >
                              Assign Students
                            </button>
                            <button 
                              className="link"
                              onClick={() => {
                                setSelectedBatch(batch.id || batch._id);
                                handleTabChange('assignMentors');
                              }}
                            >
                              Assign Mentors
                            </button>
                            <button 
                              className="link"
                              onClick={() => handleViewBatchDetails(batch.id || batch._id)}
                            >
                              View Details
                            </button>
                          </div>
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
            <h2 className="section-title mb-4">Create New Batch</h2>
            <form onSubmit={handleCreateBatch} className="card card-pad space-y-4">
              <div>
                <label className="label">Batch Name</label>
                <input
                  type="text"
                  name="batchName"
                  value={batchForm.batchName}
                  onChange={handleBatchFormChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Course</label>
                <input
                  type="text"
                  name="course"
                  value={batchForm.course}
                  onChange={handleBatchFormChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={batchForm.startDate}
                  onChange={handleBatchFormChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={batchForm.endDate}
                  onChange={handleBatchFormChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="btn-primary"
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
            <h2 className="section-title mb-4">Assign Students to Batch</h2>
            <div className="mb-4">
              <label className="label">Select Batch</label>
              <select
                value={selectedBatch || ''}
                onChange={(e) => handleBatchSelect(e.target.value)}
                className="select"
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
              <h3 className="section-title mb-2">Select Students</h3>
              {loading.students ? (
                <div className="flex justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
                </div>
              ) : !Array.isArray(availableStudents) ? (
                <p className="muted text-center">Error loading students data. Please try again.</p>
              ) : availableStudents.length === 0 ? (
                <p className="muted text-center">No available students found. All students may already be assigned to this batch.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {availableStudents.map((student) => (
                    <div 
                      key={student.id} 
                      className={`card card-pad cursor-pointer ${
                        selectedStudents.includes(student.id) ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'card-hover'
                      }`}
                      onClick={() => handleStudentSelect(student.id)}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-gray-900 dark:text-white">{student.firstName} {student.lastName}</p>
                          <p className="muted">{student.email}</p>
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
                className="btn-primary"
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
            <h2 className="section-title mb-4">Assign Mentors to Batch</h2>
            <div className="mb-4">
              <label className="label">Select Batch</label>
              <select
                value={selectedBatch || ''}
                onChange={(e) => handleBatchSelect(e.target.value)}
                className="select"
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
              <h3 className="section-title mb-2">Select Mentors</h3>
              {loading.mentors ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
                  {loadingMessage && (
                    <p className="muted text-center text-sm">{loadingMessage}</p>
                  )}
                  <p className="muted mt-2 text-xs">
                    This may take some time as we're fetching approximately 1500 mentors
                  </p>
                </div>
              ) : !Array.isArray(availableMentors) ? (
                <p className="muted text-center">Error loading mentors data. Please try again.</p>
              ) : availableMentors.length === 0 ? (
                <div className="text-center">
                  <p className="muted mb-2">No available mentors found. All mentors may already be assigned to this batch.</p>
                  <button 
                    onClick={fetchMentors}
                    className="btn-secondary btn-sm"
                  >
                    <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Mentors List
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="muted text-sm">
                      Showing {availableMentors.length} available mentors
                    </p>
                    <button 
                      onClick={fetchMentors}
                      className="btn-secondary btn-sm"
                    >
                      <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {availableMentors.map((mentor) => (
                      <div
                        key={mentor.id || mentor._id || `mentor-${Math.random()}`}
                        className={`card card-pad cursor-pointer ${
                          selectedMentors.includes(mentor.id || mentor._id) ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'card-hover'
                        }`}
                        onClick={() => handleMentorSelect(mentor.id || mentor._id)}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedMentors.includes(mentor.id || mentor._id)}
                            onChange={() => {}}
                            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600"
                          />
                          <div className="ml-3">
                            <p className="truncate font-medium text-brand-600 dark:text-brand-400">{mentor.firstName || ''} {mentor.lastName || ''}</p>
                            <p className="muted">{mentor.email || 'No email provided'}</p>
                            {mentor.mentorId && (
                              <p className="muted text-xs">ID: {mentor.mentorId}</p>
                            )}
                            {mentor.department && (
                              <p className="muted text-xs">Department: {mentor.department}</p>
                            )}
                            {mentor.specialization && (
                              <p className="muted text-xs">Specialization: {mentor.specialization}</p>
                            )}
                            {mentor.designation && (
                              <p className="muted text-xs">Designation: {mentor.designation}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={handleAssignMentors}
                disabled={!selectedBatch || selectedMentors.length === 0 || loading.mentors}
                className="btn-primary"
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
            <h2 className="section-title mb-4">Batch Details</h2>
            {loading.batchDetails ? (
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
              </div>
            ) : !batchDetails.batch ? (
              <p className="muted text-center">Batch details not found</p>
            ) : (
              <div className="space-y-6">
                {/* Batch Information */}
                <div className="card overflow-hidden">
                  <div className="card-pad">
                    <h3 className="section-title">Batch Information</h3>
                    <p className="page-subtitle max-w-2xl">Details about the batch.</p>
                  </div>
                  <div className="border-t border-gray-200 dark:border-slate-700">
                    <dl>
                      <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="muted text-sm font-medium">Batch Name</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{batchDetails.batch.batchName}</dd>
                      </div>
                      <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="muted text-sm font-medium">Course</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{batchDetails.batch.course}</dd>
                      </div>
                      <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="muted text-sm font-medium">Start Date</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{formatDate(batchDetails.batch.startDate)}</dd>
                      </div>
                      <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="muted text-sm font-medium">End Date</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{formatDate(batchDetails.batch.endDate)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Enrolled Students */}
                <div className="card overflow-hidden">
                  <div className="card-pad">
                    <h3 className="section-title">Enrolled Students</h3>
                    <p className="page-subtitle max-w-2xl">Students currently enrolled in this batch.</p>
                  </div>
                  <div className="border-t border-gray-200 dark:border-slate-700">
                    {!batchDetails.batch || !Array.isArray(batchDetails.batch.studentsAssigned) ? (
                      <div className="muted p-4 text-center">Cannot display students (data format error)</div>
                    ) : batchDetails.batch.studentsAssigned.length === 0 ? (
                      <div className="muted p-4 text-center">No students assigned to this batch yet</div>
                    ) : (
                      <ul className="divide-y divide-gray-200 dark:divide-slate-700">
                        {/* If we have detailed student info, display it */}
                        {Array.isArray(batchDetails.students) && batchDetails.students.length > 0 ? (
                          batchDetails.students.map(student => (
                            <li key={student.id || student._id || `student-${Math.random()}`} className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="truncate text-sm font-medium text-brand-600 dark:text-brand-400">{student.firstName || ''} {student.lastName || ''}</p>
                                  <p className="muted">{student.email || 'No email provided'}</p>
                                </div>
                                <div className="flex flex-shrink-0 items-center space-x-2">
                                  <span className="badge badge-success">
                                    Active
                                  </span>
                                  <button
                                    onClick={() => handleRemoveStudent(student.id || student._id)}
                                    className="btn-danger btn-sm"
                                    disabled={loading.batchDetails}
                                  >
                                    {loading.batchDetails ? 'Removing...' : 'Remove'}
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          /* If we only have student IDs, display those */
                          batchDetails.batch.studentsAssigned.map(studentId => (
                            <li key={`student-id-${studentId}`} className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="truncate text-sm font-medium text-brand-600 dark:text-brand-400">Student ID: {studentId}</p>
                                </div>
                                <div className="flex flex-shrink-0 items-center space-x-2">
                                  <button
                                    onClick={() => handleRemoveStudent(studentId)}
                                    className="btn-danger btn-sm"
                                    disabled={loading.batchDetails}
                                  >
                                    {loading.batchDetails ? 'Removing...' : 'Remove'}
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Assigned Mentors */}
                <div className="card overflow-hidden">
                  <div className="card-pad">
                    <h3 className="section-title">Assigned Mentors</h3>
                    <p className="page-subtitle max-w-2xl">Mentors assigned to this batch.</p>
                  </div>
                  <div className="border-t border-gray-200 dark:border-slate-700">
                    {!batchDetails.batch || !Array.isArray(batchDetails.batch.mentorsAssigned) ? (
                      <div className="muted p-4 text-center">Cannot display mentors (data format error)</div>
                    ) : batchDetails.batch.mentorsAssigned.length === 0 ? (
                      <div className="muted p-4 text-center">No mentors assigned to this batch yet</div>
                    ) : (
                      <ul className="divide-y divide-gray-200 dark:divide-slate-700">
                        {/* If we have detailed mentor info, display it */}
                        {Array.isArray(batchDetails.mentors) && batchDetails.mentors.length > 0 ? (
                          batchDetails.mentors.map(mentor => (
                            <li key={mentor.id || mentor._id || `mentor-${Math.random()}`} className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="truncate text-sm font-medium text-brand-600 dark:text-brand-400">{mentor.firstName || ''} {mentor.lastName || ''}</p>
                                  <p className="muted">{mentor.email || 'No email provided'}</p>
                                  {mentor.mentorId && (
                                    <p className="muted text-xs">ID: {mentor.mentorId}</p>
                                  )}
                                  {mentor.department && (
                                    <p className="muted text-xs">Department: {mentor.department}</p>
                                  )}
                                  {mentor.specialization && (
                                    <p className="muted text-xs">Specialization: {mentor.specialization}</p>
                                  )}
                                  {mentor.designation && (
                                    <p className="muted text-xs">Designation: {mentor.designation}</p>
                                  )}
                                </div>
                                <div className="flex flex-shrink-0 items-center space-x-2">
                                  <span className="badge badge-brand">
                                    Mentor
                                  </span>
                                  <button
                                    onClick={() => handleRemoveMentor(mentor.id || mentor._id)}
                                    className="btn-danger btn-sm"
                                    disabled={loading.batchDetails}
                                  >
                                    {loading.batchDetails ? 'Removing...' : 'Remove'}
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          /* If we only have mentor IDs, display those */
                          batchDetails.batch.mentorsAssigned.map(mentorId => (
                            <li key={`mentor-id-${mentorId}`} className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="truncate text-sm font-medium text-brand-600 dark:text-brand-400">Mentor ID: {mentorId}</p>
                                </div>
                                <div className="flex flex-shrink-0 items-center space-x-2">
                                  <button
                                    onClick={() => handleRemoveMentor(mentorId)}
                                    className="btn-danger btn-sm"
                                    disabled={loading.batchDetails}
                                  >
                                    {loading.batchDetails ? 'Removing...' : 'Remove'}
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))
                        )}
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