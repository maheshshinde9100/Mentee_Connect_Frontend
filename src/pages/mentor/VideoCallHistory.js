import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mentorService } from '../../services/mentorService';

const MentorVideoCallHistory = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await mentorService.getVideoCalls(user.id);
        setRecords(response.data || []);
      } catch (err) {
        console.error('Failed to load mentor video call history', err);
        setError('Unable to load your video call history right now.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">My Video Calls</h1>
        <p className="page-subtitle">
          History of your video meetings with mentees.
        </p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="card overflow-hidden">
        <div className="card-pad flex items-center justify-between border-b border-gray-200 dark:border-slate-700">
          <h2 className="section-title">Meeting Records</h2>
          {loading && <span className="muted text-xs">Loading...</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Date</th>
                <th scope="col">Start</th>
                <th scope="col">End</th>
                <th scope="col">Mentees</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="muted text-center">
                    No video call records found.
                  </td>
                </tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium text-gray-900 dark:text-white">{r.title}</td>
                  <td>
                    {r.meetingDate || '-'}
                  </td>
                  <td>
                    {r.startTime || '-'}
                  </td>
                  <td>
                    {r.endTime || '-'}
                  </td>
                  <td>
                    {r.mentees && r.mentees.length > 0
                      ? r.mentees.map((m) => m.name || m.email).join(', ')
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MentorVideoCallHistory;

