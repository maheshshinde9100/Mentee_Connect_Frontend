import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const StudentVideoCallHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/video-calls/me');
        setRecords(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Failed to load student video call history', err);
        setError('Unable to load your video call history right now.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">My Video Calls</h1>
        <p className="page-subtitle">History of your video meetings with your mentor.</p>
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
                <th scope="col">Mentor</th>
                <th scope="col">Date</th>
                <th scope="col">Start</th>
                <th scope="col">End</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="muted text-center">
                    No video call records found.
                  </td>
                </tr>
              )}
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="font-medium text-gray-900 dark:text-white">
                    {record.mentorName || 'Mentor'}
                  </td>
                  <td>{record.meetingDate || '-'}</td>
                  <td>{record.startTime || '-'}</td>
                  <td>{record.endTime || 'In progress'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentVideoCallHistory;
