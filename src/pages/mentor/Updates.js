import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import mentorService from '../../services/mentorService';

const Updates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchUpdates();
    }
  }, [user]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) return;
      
      //console.log(`Fetching updates for mentor ID: ${user.id}`);
      const response = await mentorService.getMySharedUpdates(user.id);
      //console.log('Updates response:', response);
      
      if (response && response.data) {
        setUpdates(response.data);
      } else {
        setUpdates([]);
        console.warn('API returned empty or invalid updates data');
      }
    } catch (err) {
      console.error('Error fetching updates:', err);
      setError(`Failed to load your updates: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUpdate = async (updateId) => {
    try {
      setLoading(true);
      //console.log(`Deleting update with ID: ${updateId}`);
      await mentorService.deleteUpdate(updateId);
      
      // Remove from state
      setUpdates(updates.filter(update => update._id !== updateId && update.id !== updateId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting update:', err);
      setError(`Failed to delete update: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter updates based on search term and filter type
  const filteredUpdates = updates.filter(update => {
    const title = update.title || '';
    const content = update.content || '';
    
    const matchesSearch = 
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'public' && update.isPublic === true) return matchesSearch;
    if (filterType === 'private' && update.isPublic === false) return matchesSearch;
    
    return false;
  });

  const formatRelativeDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      
      if (isNaN(diff)) return 'Invalid date';
      
      const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diff / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diff / (1000 * 60));
      
      if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
      if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      
      return date.toLocaleDateString();
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'Unknown date';
    }
  };

  if (loading && updates.length === 0) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title">Shared Updates</h1>
          <p className="page-subtitle">
            Manage updates and resources shared with your mentees
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => navigate('/mentor/updates/new')}
            className="btn-primary"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Update
          </button>
        </div>
      </div>

      {error && (
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
      )}

      {/* Filters and Search */}
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilterType('all')}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filterType === 'all' 
                ? 'bg-brand-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterType('public')}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filterType === 'public' 
                ? 'bg-brand-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            Public
          </button>
          <button 
            onClick={() => setFilterType('private')}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filterType === 'private' 
                ? 'bg-brand-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            Specific Mentees
          </button>
        </div>
        
        <div>
          <input
            type="text"
            placeholder="Search updates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input w-full sm:w-64"
          />
        </div>
      </div>

      {/* Updates List */}
      {filteredUpdates.length === 0 ? (
        <div className="card card-pad text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2m14 0a2 2 0 00-2-2H5a2 2 0 00-2 2m14 0h-3m-1-4l-3-3m0 0L8 7m6 0v6" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No updates found</h3>
          <p className="muted mt-1 text-sm">
            {searchTerm || filterType !== 'all' ? 'Try adjusting your search or filters.' : 'Get started by creating a new update.'}
          </p>
          {(!searchTerm && filterType === 'all') && (
            <div className="mt-6">
              <button
                onClick={() => navigate('/mentor/updates/new')}
                className="btn-primary"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Update
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <ul className="divide-y divide-gray-100 dark:divide-slate-700/60">
            {filteredUpdates.map((update) => {
              const updateId = update._id || update.id;
              return (
                <li key={updateId} className="relative hover:bg-gray-50 dark:hover:bg-slate-700/25">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div className="max-w-2xl">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{update.title || 'Untitled Update'}</h3>
                        <div className="mt-2">
                          <p className="muted text-sm line-clamp-2">
                            {update.content || 'No content'}
                          </p>
                        </div>
                        <div className="muted mt-3 flex items-center text-sm">
                          <span className={`${
                            update.isPublic ? 'badge-success' : 'badge-warn'
                          }`}>
                            {update.isPublic ? 'Public' : 'Specific Mentees'}
                          </span>
                          
                          <span className="ml-6 flex items-center">
                            <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {formatRelativeDate(update.createdAt)}
                          </span>

                          {update.attachmentUrls && update.attachmentUrls.length > 0 && (
                            <span className="ml-6 flex items-center">
                              <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                              </svg>
                              {update.resourceType || 'Links'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/mentor/updates/edit/${updateId}`)}
                          className="btn-ghost btn-sm"
                        >
                          <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(updateId)}
                          className="btn-ghost btn-sm text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                        >
                          <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Delete confirmation dialog */}
                    {deleteConfirm === updateId && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-900/60 backdrop-blur-sm dark:bg-black/70">
                        <div className="card card-pad w-full max-w-sm">
                          <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-50 sm:mx-0 dark:bg-red-950/40">
                              <svg className="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Delete Update</h3>
                              <div className="mt-2">
                                <p className="muted text-sm">
                                  Are you sure you want to delete this update? This action cannot be undone.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                              type="button"
                              className="btn-danger w-full sm:ml-3 sm:w-auto"
                              onClick={() => handleDeleteUpdate(updateId)}
                            >
                              Delete
                            </button>
                            <button
                              type="button"
                              className="btn-secondary mt-3 w-full sm:mt-0 sm:w-auto"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Updates; 
