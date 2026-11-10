import React, { useState, useCallback } from 'react';
import useFetchGuard from '../../hooks/useFetchGuard';
import { useAuth } from '../../contexts/AuthContext';
import mentorService from '../../services/mentorService';
import { Link } from 'react-router-dom';

const MyMentees = () => {
  const { user } = useAuth();
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMentees = useCallback(async (isCancelled) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mentorService.getMyStudents();

      if (!isCancelled() && response?.data) {
        setMentees(
          response.data.map((mentee) => ({ ...mentee, status: 'ACTIVE' }))
        );
      } else if (!isCancelled()) {
        setMentees([]);
      }
    } catch (err) {
      if (!isCancelled()) {
        setError(`Failed to load your mentees: ${err.message || 'Unknown error'}`);
      }
    } finally {
      if (!isCancelled()) setLoading(false);
    }
  }, []);

  useFetchGuard(fetchMentees, [user?.id]);

  const filteredMentees = mentees.filter(mentee => {
    // Safely handle potentially missing properties
    const firstName = mentee.firstName || '';
    const lastName = mentee.lastName || '';
    const email = mentee.email || '';
    
    return firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert-error">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">My Mentees</h1>
        <p className="page-subtitle">Manage and monitor your assigned mentees</p>
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search mentees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input w-full sm:w-64"
        />
      </div>

      {/* Mentees List */}
      {filteredMentees.length === 0 ? (
        <div className="card card-pad text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No mentees found</h3>
          <p className="muted mt-1 text-sm">
            {searchTerm ? 'Try adjusting your search criteria.' : 'You have no mentees assigned currently.'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <ul className="divide-y divide-gray-100 dark:divide-slate-700/60">
            {filteredMentees.map((mentee) => (
              <li key={mentee._id || mentee.id}>
                <Link to={`/mentor/mentees/${mentee._id || mentee.id}`} className="block transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/25">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                          <span className="font-medium">
                            {(mentee.firstName || '?')[0]}{(mentee.lastName || '?')[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{mentee.firstName || ''} {mentee.lastName || ''}</p>
                          <p className="muted text-sm">{mentee.email || 'No email'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge-success">
                          ACTIVE
                        </span>
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="muted flex items-center text-sm">
                          <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                          {mentee.department || 'No Department'}
                        </p>
                        <p className="muted mt-2 flex items-center text-sm sm:mt-0 sm:ml-6">
                          <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {mentee.joinedDate ? new Date(mentee.joinedDate).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyMentees; 
