import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';

const VideoCallHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminService.getVideoCalls();
        setRecords(response.data || []);
      } catch (err) {
        console.error('Failed to load video call history for admin', err);
        setError('Unable to load video call history right now.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="page-title">Video Call History</h1>
        <p className="page-subtitle">
          All mentor video call sessions across the platform.
        </p>
      </div>

      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-slate-700/70">
          <h2 className="section-title">All Video Calls</h2>
          {loading && <span className="muted text-xs">Loading...</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Mentor</th>
                <th>Date</th>
                <th>Start</th>
                <th>End</th>
                <th>Mentees</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="text-center">
                    No video call records found.
                  </td>
                </tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium text-gray-900 dark:text-white">{r.mentorName}</td>
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
                    {r.menteeCount ?? 0}
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

export default VideoCallHistory;

