import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import Pagination from '../../components/common/Pagination';

const MentorAllocation = () => {
  const [activeTab, setActiveTab] = useState('allocate');
  const [students, setStudents] = useState([]);
  const [allocatedStudents, setAllocatedStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [studentPage, setStudentPage] = useState(0);
  const [studentPageSize, setStudentPageSize] = useState(20);
  const [studentTotalPages, setStudentTotalPages] = useState(0);
  const [studentTotalElements, setStudentTotalElements] = useState(0);

  const [mentorPage, setMentorPage] = useState(0);
  const [mentorPageSize, setMentorPageSize] = useState(20);
  const [mentorTotalPages, setMentorTotalPages] = useState(0);
  const [mentorTotalElements, setMentorTotalElements] = useState(0);
  const [loadingMentors, setLoadingMentors] = useState(false);

  const fetchStudents = useCallback(async (page, size) => {
    const response = await adminService.getAllStudents(page, size);
    const studentsData = response?.data || [];
    const pagination = response?.pagination || {};
    setStudents(studentsData.filter((s) => !s.mentorId));
    setAllocatedStudents(studentsData.filter((s) => s.mentorId));
    setStudentTotalPages(pagination.totalPages ?? 1);
    setStudentTotalElements(pagination.totalElements ?? studentsData.length);
  }, []);

  const fetchMentors = useCallback(async (page, size) => {
    setLoadingMentors(true);
    try {
      const mentorsResponse = await adminService.getAllMentors(page, size);
      setMentors(mentorsResponse?.data || []);
      const p = mentorsResponse?.pagination || {};
      setMentorTotalPages(p.totalPages ?? 1);
      setMentorTotalElements(p.totalElements ?? mentorsResponse?.data?.length ?? 0);
    } finally {
      setLoadingMentors(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      await Promise.all([
        fetchStudents(studentPage, studentPageSize),
        fetchMentors(mentorPage, mentorPageSize),
      ]);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [fetchStudents, fetchMentors, studentPage, studentPageSize, mentorPage, mentorPageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStudentSelect = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
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
      await adminService.assignMentorToStudents({
        studentIds: selectedStudents,
        mentorId: selectedMentor,
      });
      setSuccess('Mentor assigned successfully!');
      setSelectedStudents([]);
      setSelectedMentor('');
      fetchData();
    } catch (err) {
      console.error('Assignment error:', err);
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
      fetchData();
    } catch (err) {
      console.error('Error removing mentor:', err);
      setError('Failed to remove mentor');
    } finally {
      setLoading(false);
    }
  };

  if (loading && students.length === 0 && allocatedStudents.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Mentor Allocation</h1>

      <div className="flex border-b border-gray-200 dark:border-slate-700 mb-6">
        <button
          type="button"
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'allocate' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'}`}
          onClick={() => setActiveTab('allocate')}
        >
          Allocate Mentors
        </button>
        <button
          type="button"
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'allocated' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'}`}
          onClick={() => setActiveTab('allocated')}
        >
          Allocated Mentors to Students
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-md mb-4 border border-red-200 dark:border-red-800/30">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-md mb-4 border border-green-200 dark:border-green-800/30">
          {success}
        </div>
      )}

      {activeTab === 'allocate' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Select Mentor
            </label>
            {loadingMentors ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <select
                value={selectedMentor}
                onChange={(e) => setSelectedMentor(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="">Choose a mentor</option>
                {mentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {`${mentor.firstName || ''} ${mentor.lastName || ''} (${mentor.email || 'No email'})`}
                  </option>
                ))}
              </select>
            )}
            <Pagination
              page={mentorPage}
              totalPages={mentorTotalPages}
              totalElements={mentorTotalElements}
              pageSize={mentorPageSize}
              onPageChange={setMentorPage}
              onPageSizeChange={(size) => { setMentorPageSize(size); setMentorPage(0); }}
              disabled={loadingMentors}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Select Students (unassigned on this page)
            </label>
            <div className="border border-gray-300 dark:border-slate-600 rounded-md max-h-96 overflow-y-auto bg-white dark:bg-slate-800">
              {students.length === 0 ? (
                <p className="p-4 text-gray-500 dark:text-slate-400">No unassigned students on this page</p>
              ) : (
                students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-200 dark:border-slate-700 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      id={`student-${student.id}`}
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentSelect(student.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
                    />
                    <label
                      htmlFor={`student-${student.id}`}
                      className="ml-3 block text-sm font-medium text-gray-700 dark:text-slate-300"
                    >
                      {`${student.firstName || ''} ${student.lastName || ''} (${student.email || 'No email'})`}
                    </label>
                  </div>
                ))
              )}
            </div>
            <Pagination
              page={studentPage}
              totalPages={studentTotalPages}
              totalElements={studentTotalElements}
              pageSize={studentPageSize}
              onPageChange={setStudentPage}
              onPageSizeChange={(size) => { setStudentPageSize(size); setStudentPage(0); }}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || loadingMentors || !selectedMentor || selectedStudents.length === 0}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Assigning...' : 'Assign Mentor'}
          </button>
        </form>
      ) : (
        <div className="bg-white dark:bg-slate-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-slate-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Assigned Mentor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {allocatedStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-slate-400">
                    No students with allocated mentors on this page.
                  </td>
                </tr>
              ) : (
                allocatedStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                      {student.mentorName || 'Unknown Mentor'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => handleRemoveMentor(student.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-md border border-red-200 dark:border-red-800/30"
                      >
                        Remove Allocation
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <Pagination
            page={studentPage}
            totalPages={studentTotalPages}
            totalElements={studentTotalElements}
            pageSize={studentPageSize}
            onPageChange={setStudentPage}
            onPageSizeChange={(size) => { setStudentPageSize(size); setStudentPage(0); }}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
};

export default MentorAllocation;
