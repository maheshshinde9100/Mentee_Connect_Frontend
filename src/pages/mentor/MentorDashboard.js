import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mentorService } from '../../services/mentorService';
import { useCall } from '../../context/CallContext';
import MyMentees from './MyMentees';
import TaskManagement from './TaskManagement';

const MentorDashboard = () => {
  const { user } = useAuth();
  const { startCall, activeRoom } = useCall() || {};
  const [totalMentees, setTotalMentees] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mentees, setMentees] = useState([]);
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    if (user?.id) {
      loadMentees();
    }
  }, [user]);

  const loadMentees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mentorService.getMyStudents(user.id);
      const list = response.data || [];
      setMentees(list);
      setTotalMentees(list.length || 0);
    } catch (err) {
      console.error('Failed to load mentees for dashboard', err);
      setError('Unable to load mentee information right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
          <p className="text-gray-600">Track mentees and manage tasks.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total mentees</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {loading ? '...' : totalMentees}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Start Video Call</h2>
              <p className="text-sm text-gray-600">Select mentees to invite and start a call.</p>
            </div>
            <button
              onClick={() => startCall && startCall(Array.from(selected), 'Mentor Call')}
              disabled={!startCall || selected.size === 0 || !!activeRoom}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium disabled:opacity-60"
            >
              {activeRoom ? 'Call in progress' : 'Start Call'}
            </button>
          </div>
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {mentees.length === 0 && <p className="text-sm text-gray-500">No mentees assigned.</p>}
            {mentees.map((m) => (
              <label
                key={m.id}
                className={`border rounded-lg p-3 flex items-center space-x-3 cursor-pointer ${
                  selected.has(m.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600"
                  checked={selected.has(m.id)}
                  onChange={() =>
                    setSelected((prev) => {
                      const next = new Set(prev);
                      if (next.has(m.id)) next.delete(m.id);
                      else next.add(m.id);
                      return next;
                    })
                  }
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{m.firstName} {m.lastName}</p>
                  <p className="text-xs text-gray-500">{m.email}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Mentees</h2>
            <p className="text-sm text-gray-600">View and manage your mentee list.</p>
          </div>
          <div className="p-4 sm:p-6">
            <MyMentees />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Task Management</h2>
            <p className="text-sm text-gray-600">Assign and track mentee tasks.</p>
          </div>
          <div className="p-4 sm:p-6">
            <TaskManagement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;

