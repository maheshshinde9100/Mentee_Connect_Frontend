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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="page-title mb-6">Mentor Allocation</h1>

      <div className="mb-6 flex border-b border-gray-200 dark:border-slate-700">
        <button
          type="button"
          className={activeTab === 'allocate' ? 'tab tab-active' : 'tab'}
          onClick={() => setActiveTab('allocate')}
        >
          Allocate Mentors
        </button>
        <button
          type="button"
          className={activeTab === 'allocated' ? 'tab tab-active' : 'tab'}
          onClick={() => setActiveTab('allocated')}
        >
          Allocated Mentors to Students
        </button>
      </div>

      {error && (
        <div className="alert-error mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="alert-success mb-4">
          {success}
        </div>
      )}

      {activeTab === 'allocate' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label mb-2">
              Select Mentor
            </label>
            {loadingMentors ? (
              <div className="flex justify-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
              </div>
            ) : (
              <select
                value={selectedMentor}
                onChange={(e) => setSelectedMentor(e.target.value)}
                className="select"
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
            <label className="label mb-2">
              Select Students (unassigned on this page)
            </label>
            <div className="card max-h-96 overflow-y-auto">
              {students.length === 0 ? (
                <p className="muted p-4">No unassigned students on this page</p>
              ) : (
                students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center border-b border-gray-200 p-4 last:border-b-0 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/40"
                  >
                    <input
                      type="checkbox"
                      id={`student-${student.id}`}
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentSelect(student.id)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600"
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
            className="btn-primary w-full"
          >
            {loading ? 'Assigning...' : 'Assign Mentor'}
          </button>
        </form>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Assigned Mentor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocatedStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="muted text-center">
                    No students with allocated mentors on this page.
                  </td>
                </tr>
              ) : (
                allocatedStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="font-medium text-gray-900 dark:text-white">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="muted">
                      {student.email}
                    </td>
                    <td className="muted">
                      {student.mentorName || 'Unknown Mentor'}
                    </td>
                    <td className="font-medium">
                      <button
                        type="button"
                        onClick={() => handleRemoveMentor(student.id)}
                        className="btn-danger btn-sm"
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
