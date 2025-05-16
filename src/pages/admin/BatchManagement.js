import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';

const BatchManagement = () => {
  const [batches, setBatches] = useState([]);
  const [newBatch, setNewBatch] = useState({ name: '', startDate: '', description: '' });
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await adminService.getBatches();
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminService.createBatch(newBatch);
      setNewBatch({ name: '', startDate: '', description: '' });
      fetchBatches();
    } catch (error) {
      console.error('Error creating batch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudents = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;

    try {
      setLoading(true);
      await adminService.addStudentsToBatch(selectedBatch.id, students);
      setStudents([]);
      fetchBatches();
    } catch (error) {
      console.error('Error adding students:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Batch Form */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Batch</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create a new batch of students for mentoring program.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleCreateBatch}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="batch-name" className="block text-sm font-medium text-gray-700">
                    Batch Name
                  </label>
                  <input
                    type="text"
                    name="batch-name"
                    id="batch-name"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start-date"
                    id="start-date"
                    value={newBatch.startDate}
                    onChange={(e) => setNewBatch({ ...newBatch, startDate: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={newBatch.description}
                    onChange={(e) => setNewBatch({ ...newBatch, description: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Creating...' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Batch List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {batches.map((batch) => (
            <li key={batch.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">{batch.name}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Start Date: {new Date(batch.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button
                      onClick={() => setSelectedBatch(batch)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      Manage Students
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">{batch.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BatchManagement; 