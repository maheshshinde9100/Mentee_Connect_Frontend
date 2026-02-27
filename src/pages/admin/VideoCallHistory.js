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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Video Call History</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          All mentor video call sessions across the platform.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">All Video Calls</h2>
          {loading && <span className="text-xs text-gray-500 dark:text-gray-400">Loading...</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700 text-sm">
            <thead className="bg-gray-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Mentor</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Date</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Start</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">End</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Mentees</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {records.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No video call records found.
                  </td>
                </tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{r.mentorName}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                    {r.meetingDate || '-'}
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                    {r.startTime || '-'}
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                    {r.endTime || '-'}
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
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

