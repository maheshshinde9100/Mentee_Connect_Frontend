import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const MentorAllocation = () => {
  const [activeTab, setActiveTab] = useState('allocate'); // 'allocate' or 'allocated'
  const [students, setStudents] = useState([]);
  const [allocatedStudents, setAllocatedStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setLoadingMentors(true);
      setError('');

      // Fetch students
      const studentsResponse = await adminService.getAllStudents();

      // Handle students response - check for paginated structure
      const studentsData = studentsResponse?.data?.content || studentsResponse?.data || [];

      // Filter students
      const unassigned = studentsData.filter(student => !student.mentorId);
      const assigned = studentsData.filter(student => student.mentorId);

      setStudents(unassigned);
      setAllocatedStudents(assigned);

      console.log('Fetched students:', studentsData);

      // Separate the mentor fetching to handle large paginated responses
      try {
        console.log('Fetching mentors...');
        setLoadingMessage('Loading mentors...');

        // Use the updated getAllMentors that handles pagination for large datasets
        const mentorsResponse = await adminService.getAllMentors();

        // Get mentors array from response
        const mentorsData = mentorsResponse?.data || [];
        setMentors(mentorsData);

        setLoadingMessage(null);
        console.log(`Successfully loaded ${mentorsData.length} mentors`);
      } catch (mentorError) {
        console.error('Error fetching mentors:', mentorError);
        console.error('Error details:', mentorError.response?.data);
        setLoadingMessage(null);
        setError('Failed to fetch mentors. Please try again.');
      } finally {
        setLoadingMentors(false);
      }

    } catch (err) {
      console.error('Fetch error:', err);
      console.error('Error details:', err.response?.data);
      setLoadingMessage(null);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const handleMentorChange = (e) => {
    setSelectedMentor(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMentor || selectedStudents.length === 0) {
      setError('Please select both mentor and students');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Use the bulk assignment API to assign multiple students at once
      const assignmentData = {
        studentIds: selectedStudents,
        mentorId: selectedMentor
      };

      console.log('Assigning mentor with data:', assignmentData);
      await adminService.assignMentorToStudents(assignmentData);

      setSuccess('Mentor assigned successfully!');
      setSelectedStudents([]);
      setSelectedMentor('');
      fetchData(); // Refresh the data
    } catch (err) {
      console.error('Assignment error:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to assign mentor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMentor = async (studentId) => {
    if (!window.confirm('Are you sure you want to remove the assigned mentor from this student?')) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await adminService.removeMentorFromStudent(studentId);

      setSuccess('Mentor removed successfully');
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error removing mentor:', err);
      setError('Failed to remove mentor');
    } finally {
      setLoading(false);
    }
  };

  if (loading && (!students.length && !allocatedStudents.length)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mentor Allocation</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'allocate' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('allocate')}
        >
          Allocate Mentors
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'allocated' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('allocated')}
        >
          Allocated Mentors to Students
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
          {success}
        </div>
      )}

      {activeTab === 'allocate' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Mentor
            </label>
            {loadingMentors ? (
              <div className="flex flex-col items-center space-y-2 py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                {loadingMessage && (
                  <p className="text-sm text-gray-600 text-center">{loadingMessage}</p>
                )}
                <p className="text-xs text-gray-500">
                  This may take some time as we're fetching mentors
                </p>
              </div>
            ) : (
              <select
                value={selectedMentor}
                onChange={handleMentorChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Choose a mentor</option>
                {Array.isArray(mentors) && mentors.map(mentor => (
                  <option key={mentor.id} value={mentor.id}>
                    {`${mentor.firstName || ''} ${mentor.lastName || ''} (${mentor.email || 'No email'})`}
                  </option>
                ))}
              </select>
            )}
            {mentors.length > 0 && !loadingMentors && (
              <p className="text-xs text-gray-500 mt-1">
                Showing {mentors.length} total mentors
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Students
            </label>
            <div className="border border-gray-300 rounded-md max-h-96 overflow-y-auto">
              {!Array.isArray(students) || students.length === 0 ? (
                <p className="p-4 text-gray-500">No unassigned students available</p>
              ) : (
                students.map(student => (
                  <div
                    key={student.id}
                    className="flex items-center p-4 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      id={`student-${student.id}`}
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentSelect(student.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`student-${student.id}`}
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      {`${student.firstName || ''} ${student.lastName || ''} (${student.email || 'No email'})`}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || loadingMentors || !selectedMentor || selectedStudents.length === 0}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Assigning...
                </div>
              ) : (
                'Assign Mentor'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Mentor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allocatedStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No students with allocated mentors found.</td>
                </tr>
              ) : (
                allocatedStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.mentorName || 'Unknown Mentor'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleRemoveMentor(student.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md border border-red-200"
                      >
                        Remove Allocation
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MentorAllocation;