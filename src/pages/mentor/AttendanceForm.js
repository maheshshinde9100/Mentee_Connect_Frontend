import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import mentorService from '../../services/mentorService';

const AttendanceForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mentees, setMentees] = useState([]);
  const [selectedMentees, setSelectedMentees] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    sessionType: 'PHYSICAL',
    sessionTopic: '',
    notes: '',
  });

  useEffect(() => {
    if (user?.id) {
      const query = new URLSearchParams(location.search);
      const menteeId = query.get('menteeId');
      
      console.log(`Loading attendance form with menteeId from query: ${menteeId}`);
      fetchMentees();
      
      if (menteeId) {
        setSelectedMentees([menteeId]);
      }
    }
  }, [location.search, user]);

  const fetchMentees = async () => {
    try {
      if (!user?.id) return;
      
      console.log(`Fetching mentees for mentor ID: ${user.id}`);
      const response = await mentorService.getMyStudents(user.id);
      console.log('Mentees response:', response);
      
      if (response && response.data) {
        setMentees(response.data);
      } else {
        setMentees([]);
        console.warn('API returned empty or invalid mentees data');
      }
    } catch (err) {
      console.error('Error fetching mentees:', err);
      setError(`Failed to load your mentees: ${err.message || 'Unknown error'}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMenteeSelect = (e, menteeId) => {
    if (e.target.checked) {
      console.log(`Adding mentee ${menteeId} to selected list`);
      setSelectedMentees([...selectedMentees, menteeId]);
    } else {
      console.log(`Removing mentee ${menteeId} from selected list`);
      setSelectedMentees(selectedMentees.filter(id => {
        if (typeof id === 'object') {
          return id.id !== menteeId && id._id !== menteeId;
        }
        return id !== menteeId;
      }));
    }
  };

  const handleSelectAllMentees = (e) => {
    if (e.target.checked) {
      console.log('Selecting all mentees');
      setSelectedMentees(mentees.map(mentee => mentee._id || mentee.id));
    } else {
      console.log('Deselecting all mentees');
      setSelectedMentees([]);
    }
  };

  const handleAttendanceChange = (menteeId, status) => {
    console.log(`Changing attendance status for mentee ${menteeId} to ${status}`);
    setSelectedMentees(prev => 
      prev.map(item => 
        typeof item === 'object' && (item.id === menteeId || item._id === menteeId)
          ? { ...item, status } 
          : item === menteeId 
          ? { id: menteeId, status } 
          : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedMentees.length === 0) {
      setError('Please select at least one mentee');
      return;
    }
    
    if (!formData.sessionTopic) {
      setError('Please enter a session topic');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare attendance records for each selected mentee
      const studentAttendance = {};
      
      selectedMentees.forEach(mentee => {
        const id = typeof mentee === 'object' ? (mentee._id || mentee.id) : mentee;
        const status = typeof mentee === 'object' ? mentee.status : 'PRESENT';
        studentAttendance[id] = status;
      });
      
      const attendanceData = {
        date: formData.date,
        sessionTopic: formData.sessionTopic,
        sessionType: formData.sessionType,
        notes: formData.notes,
        studentAttendance: studentAttendance
      };
      
      console.log('Submitting attendance data:', attendanceData);
      await mentorService.recordAttendance(user.id, attendanceData);
      console.log('Attendance recorded successfully');
      
      setSuccess(true);
      
      // Clear form after success
      setTimeout(() => {
        // Navigate based on origin
        const query = new URLSearchParams(location.search);
        const menteeId = query.get('menteeId');
        
        if (menteeId) {
          navigate(`/mentor/mentees/${menteeId}`);
        } else {
          setSelectedMentees([]);
          setSuccess(false);
        }
      }, 1500);
      
    } catch (err) {
      console.error('Error recording attendance:', err);
      setError(`Failed to record attendance: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Record Attendance</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 p-4 rounded-md">
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
        )}

        {success && (
          <div className="mb-6 bg-green-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Attendance recorded successfully!</h3>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]} // Can't record future attendance
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="sessionType" className="block text-sm font-medium text-gray-700">
                  Session Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="sessionType"
                  name="sessionType"
                  value={formData.sessionType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="PHYSICAL">Physical Meeting</option>
                  <option value="VIRTUAL">Virtual Meeting</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="sessionTopic" className="block text-sm font-medium text-gray-700">
                Session Topic <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sessionTopic"
                id="sessionTopic"
                value={formData.sessionTopic}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Session Notes
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

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Select Mentees</h3>
                <div className="flex items-center">
                  <input
                    id="select-all"
                    type="checkbox"
                    checked={selectedMentees.length === mentees.length && mentees.length > 0}
                    onChange={handleSelectAllMentees}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
                    Select All
                  </label>
                </div>
              </div>

              {mentees.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">No mentees available</p>
                </div>
              ) : (
                <div className="overflow-hidden border border-gray-200 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Select
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mentees.map((mentee) => {
                        const menteeId = mentee._id || mentee.id;
                        return (
                          <tr key={menteeId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedMentees.some(item => 
                                  typeof item === 'object' 
                                    ? (item.id === menteeId || item._id === menteeId) 
                                    : item === menteeId
                                )}
                                onChange={(e) => handleMenteeSelect(e, menteeId)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                  <span className="text-indigo-800 font-medium">
                                    {(mentee.firstName || '?')[0]}{(mentee.lastName || '?')[0]}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{mentee.firstName || ''} {mentee.lastName || ''}</div>
                                  <div className="text-sm text-gray-500">{mentee.email || ''}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                disabled={!selectedMentees.some(item => 
                                  typeof item === 'object' 
                                    ? (item.id === menteeId || item._id === menteeId) 
                                    : item === menteeId
                                )}
                                onChange={(e) => handleAttendanceChange(menteeId, e.target.value)}
                                className={`text-sm rounded-full px-3 py-1 ${
                                  !selectedMentees.some(item => 
                                    typeof item === 'object' 
                                      ? (item.id === menteeId || item._id === menteeId) 
                                      : item === menteeId
                                  ) ? 'bg-gray-100 text-gray-400' :
                                  'bg-green-100 text-green-800'
                                }`}
                                defaultValue="PRESENT"
                              >
                                <option value="PRESENT">Present</option>
                                <option value="ABSENT">Absent</option>
                                <option value="LATE">Late</option>
                                <option value="EXCUSED">Excused</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || selectedMentees.length === 0}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Record Attendance'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm; 