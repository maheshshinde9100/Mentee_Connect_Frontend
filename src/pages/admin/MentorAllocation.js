import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';

const MentorAllocation = () => {
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      setMentors(response.data.filter(user => user.role === 'MENTOR'));
      setStudents(response.data.filter(user => user.role === 'MENTEE'));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllocateMentor = async () => {
    if (!selectedMentor || selectedStudents.length === 0) return;

    try {
      setLoading(true);
      await adminService.allocateMentor(selectedMentor.id, selectedStudents);
      setSelectedStudents([]);
      fetchUsers();
    } catch (error) {
      console.error('Error allocating mentor:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Mentor Allocation</h3>
            <p className="mt-1 text-sm text-gray-500">
              Allocate mentors to students for the mentoring program.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-1 gap-6">
              {/* Mentor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Mentor</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedMentor?.id || ''}
                  onChange={(e) => setSelectedMentor(mentors.find(m => m.id === e.target.value))}
                >
                  <option value="">Select a mentor</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Students</label>
                <div className="mt-1 border border-gray-300 rounded-md max-h-60 overflow-y-auto">
                  {students.map((student) => (
                    <div key={student.id} className="relative flex items-start p-3">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents([...selectedStudents, student.id]);
                            } else {
                              setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                            }
                          }}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label className="font-medium text-gray-700">{student.name}</label>
                        <p className="text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleAllocateMentor}
                  disabled={loading || !selectedMentor || selectedStudents.length === 0}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                >
                  {loading ? 'Allocating...' : 'Allocate Mentor'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Allocations */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Current Allocations</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {mentors.map((mentor) => (
              <li key={mentor.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-indigo-600">{mentor.name}</h4>
                    <p className="text-sm text-gray-500">{mentor.email}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {mentor.assignedStudents?.length || 0} students assigned
                  </div>
                </div>
                {mentor.assignedStudents && mentor.assignedStudents.length > 0 && (
                  <div className="mt-2">
                    <ul className="text-sm text-gray-500 list-disc list-inside">
                      {mentor.assignedStudents.map((student) => (
                        <li key={student.id}>{student.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MentorAllocation; 