import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';

const MentorAllocation = () => {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsResponse, mentorsResponse] = await Promise.all([
        adminService.getAdminStudents(),
        adminService.getAdminMentors()
      ]);
      
      // Handle students response (array of students)
      const unassignedStudents = studentsResponse.data.filter(student => !student.mentorId);
      setStudents(unassignedStudents);

      // Handle mentors response (paginated response with content array)
      const mentorsList = mentorsResponse.data.content || mentorsResponse.data;
      setMentors(mentorsList);

    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Fetch error:', err);
      console.error('Error details:', err.response?.data);
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

      // Process each student assignment sequentially
      for (const studentId of selectedStudents) {
        await adminService.assignMentorToStudent({
          studentId,
          mentorId: selectedMentor
        });
      }

      setSuccess('Mentor assigned successfully!');
      setSelectedStudents([]);
      setSelectedMentor('');
      fetchData(); // Refresh the data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign mentor. Please try again.');
      console.error('Assignment error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !students.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mentor Allocation</h1>
      
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Mentor
          </label>
          <select
            value={selectedMentor}
            onChange={handleMentorChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Choose a mentor</option>
            {mentors.map(mentor => (
              <option key={mentor.id} value={mentor.id}>
                {`${mentor.firstName} ${mentor.lastName} (${mentor.email}) - ${mentor.department}`}
              </option>
            ))}
          </select>
          {selectedMentor && mentors.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              {(() => {
                const mentor = mentors.find(m => m.id === selectedMentor);
                if (mentor) {
                  return `Available slots: ${mentor.maxStudents - (mentor.assignedStudents?.length || 0)}`;
                }
                return '';
              })()}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Students
          </label>
          <div className="border border-gray-300 rounded-md max-h-96 overflow-y-auto">
            {students.length === 0 ? (
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
                    {`${student.firstName} ${student.lastName} (${student.email}) - ${student.branch} - Roll: ${student.rollNumber}`}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || !selectedMentor || selectedStudents.length === 0}
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
    </div>
  );
};

export default MentorAllocation; 