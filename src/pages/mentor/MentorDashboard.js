import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import mentorService from '../../services/mentorService';
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

  const loadMentees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mentorService.getMyStudents();
      const list = response.data || [];
      setMentees(list);
      setTotalMentees(list.length || 0);
    } catch (err) {
      setError('Unable to load mentee information right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMentees();
  }, [loadMentees]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Mentor Dashboard</h1>
        <p className="page-subtitle">Track mentees and manage tasks.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card card-pad">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-slate-400">Total mentees</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {loading ? '...' : totalMentees}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-pad flex items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h2 className="section-title">Start Video Call</h2>
            <p className="muted mt-1 text-sm">Select mentees to invite and start a call.</p>
          </div>
          <button
            onClick={() => startCall && startCall(Array.from(selected), 'Mentor Call')}
            disabled={!startCall || selected.size === 0 || !!activeRoom}
            className="btn-primary"
          >
            {activeRoom ? 'Call in progress' : 'Start Call'}
          </button>
        </div>
        <div className="card-pad grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {mentees.length === 0 && <p className="muted text-sm">No mentees assigned.</p>}
          {mentees.map((m) => (
            <label
              key={m.id}
              className={`flex cursor-pointer items-center space-x-3 rounded-xl border p-3 transition-colors ${
                selected.has(m.id) ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-gray-200 dark:border-slate-700'
              }`}
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600"
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
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{m.firstName} {m.lastName}</p>
                <p className="muted text-xs">{m.email}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-pad border-b border-gray-200 dark:border-slate-700">
          <h2 className="section-title">My Mentees</h2>
          <p className="muted mt-1 text-sm">View and manage your mentee list.</p>
        </div>
        <div className="card-pad">
          <MyMentees />
        </div>
      </div>

      <div className="card">
        <div className="card-pad border-b border-gray-200 dark:border-slate-700">
          <h2 className="section-title">Task Management</h2>
          <p className="muted mt-1 text-sm">Assign and track mentee tasks.</p>
        </div>
        <div className="card-pad">
          <TaskManagement />
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
