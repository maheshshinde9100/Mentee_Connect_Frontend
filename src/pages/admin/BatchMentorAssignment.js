import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const BatchMentorAssignment = () => {
  const [batches, setBatches] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedMentors, setSelectedMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBatchesAndMentors();
  }, []);

  const fetchBatchesAndMentors = async () => {
    try {
      setLoading(true);
      const [batchesResponse, mentorsResponse] = await Promise.all([
        adminService.getAllBatches(),
        adminService.getAllMentors()
      ]);

      const batchesList = Array.isArray(batchesResponse.data) ? batchesResponse.data : 
                         (batchesResponse.data?.content || []);
      const mentorsList = Array.isArray(mentorsResponse.data) ? mentorsResponse.data : 
                         (mentorsResponse.data?.content || []);

      setBatches(batchesList);
      setMentors(mentorsList);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMentorSelection = (mentorId) => {
    setSelectedMentors(prev => {
      if (prev.includes(mentorId)) {
        return prev.filter(id => id !== mentorId);
      } else {
        return [...prev, mentorId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatch || !selectedMentors.length) {
      setError('Please select a batch and at least one mentor');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Assign each mentor to the batch
      await Promise.all(
        selectedMentors.map(mentorId =>
          adminService.assignMentorToBatch(selectedBatch, mentorId)
        )
      );

      setSuccess('Mentors assigned to batch successfully!');
      setSelectedMentors([]);
      setSelectedBatch('');
      await fetchBatchesAndMentors(); // Refresh data
    } catch (err) {
      console.error('Error assigning mentors to batch:', err);
      setError(err.response?.data?.message || 'Failed to assign mentors to batch');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !batches.length && !mentors.length) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Assign Mentors to Batch</h2>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Batch
          </label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Choose a batch</option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.batchName} ({batch.course})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Mentors
          </label>
          <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleMentorSelection(mentor.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedMentors.includes(mentor.id)}
                  onChange={() => handleMentorSelection(mentor.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="flex-1 cursor-pointer">
                  <span className="block text-sm font-medium text-gray-900">
                    {mentor.name || mentor.email}
                  </span>
                  {mentor.email && mentor.name && (
                    <span className="block text-sm text-gray-500">
                      {mentor.email}
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
          {selectedMentors.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {selectedMentors.length} mentor(s) selected
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !selectedBatch || !selectedMentors.length}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Assigning...
            </span>
          ) : (
            `Assign ${selectedMentors.length} Mentor${selectedMentors.length !== 1 ? 's' : ''} to Batch`
          )}
        </button>
      </form>

      {/* Display current batch-mentor assignments */}
      {batches.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Current Batch Assignments</h3>
          <div className="space-y-4">
            {batches.map(batch => {
              const assignedMentors = mentors.filter(mentor => 
                mentor.batchIds?.includes(batch.id)
              );
              return (
                <div key={batch.id} className="border border-gray-200 rounded-md p-4">
                  <h4 className="font-medium text-gray-900">{batch.batchName}</h4>
                  <p className="text-sm text-gray-500">{batch.course}</p>
                  {assignedMentors.length > 0 ? (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Assigned Mentors:</p>
                      <ul className="mt-1 space-y-1">
                        {assignedMentors.map(mentor => (
                          <li key={mentor.id} className="text-sm text-gray-600">
                            {mentor.name || mentor.email}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">No mentors assigned</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchMentorAssignment; 