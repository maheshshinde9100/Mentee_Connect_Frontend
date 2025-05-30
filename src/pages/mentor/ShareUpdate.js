import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import mentorService from '../../services/mentorService';

const ShareUpdate = () => {
  const { updateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mentees, setMentees] = useState([]);
  const [selectedMentees, setSelectedMentees] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    attachmentUrls: [],
    resourceType: 'GITHUB',
    isImportant: false,
    isPublic: true
  });

  useEffect(() => {
    if (user?.id) {
      fetchMentees();
      
      if (updateId) {
        fetchUpdateDetails();
      }
    }
  }, [updateId, user]);

  const fetchMentees = async () => {
    try {
      if (!user?.id) return;
      
      console.log(`Fetching mentees for mentor ID: ${user.id}`);
      const response = await mentorService.getMyStudents(user.id);
      console.log('Mentees response:', response);
      
      if (response && response.data) {
        setMentees(response.data);
      } else {
        setMentees([]);
        console.warn('API returned empty or invalid mentees data');
      }
    } catch (err) {
      console.error('Error fetching mentees:', err);
      setError(`Failed to load your mentees: ${err.message || 'Unknown error'}`);
    }
  };

  const fetchUpdateDetails = async () => {
    try {
      setLoading(true);
      console.log(`Fetching update details for ID: ${updateId}`);
      const response = await mentorService.getMySharedUpdates(user.id);
      console.log('Updates response:', response);
      
      if (!response || !response.data) {
        setError('Failed to load update details. Empty response received.');
        return;
      }
      
      const update = response.data.find(u => u._id === updateId || u.id === updateId);
      console.log('Found update:', update);
      
      if (update) {
        setFormData({
          title: update.title || '',
          content: update.content || '',
          attachmentUrls: update.attachmentUrls || [],
          resourceType: update.resourceType || 'GITHUB',
          isImportant: update.isImportant || false,
          isPublic: update.isPublic || true,
        });
        
        // Set selected mentees
        if (update.students && Array.isArray(update.students)) {
          setSelectedMentees(update.students.map(student => student._id || student.id));
        } else if (update.studentIds && Array.isArray(update.studentIds)) {
          setSelectedMentees(update.studentIds);
        }
      } else {
        setError(`Update with ID ${updateId} not found`);
      }
    } catch (err) {
      console.error('Error fetching update details:', err);
      setError(`Failed to load update details: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAttachmentChange = (e) => {
    const value = e.target.value;
    if (value) {
      // Split the URLs by commas and trim whitespace
      const urlArray = value.split(',').map(url => url.trim());
      setFormData({
        ...formData,
        attachmentUrls: urlArray
      });
    } else {
      setFormData({
        ...formData,
        attachmentUrls: []
      });
    }
  };

  const handleMenteeSelect = (e, menteeId) => {
    if (e.target.checked) {
      setSelectedMentees([...selectedMentees, menteeId]);
    } else {
      setSelectedMentees(selectedMentees.filter(id => id !== menteeId));
    }
  };

  const handleSelectAllMentees = (e) => {
    if (e.target.checked) {
      setSelectedMentees(mentees.map(mentee => mentee.id));
    } else {
      setSelectedMentees([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!formData.isPublic && selectedMentees.length === 0) {
      setError('Please select at least one mentee or make the update public');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Submitting update data:', { ...formData, studentIds: formData.isPublic ? [] : selectedMentees });
      
      const updateData = {
        ...formData,
        studentIds: formData.isPublic ? [] : selectedMentees,
      };
      
      if (updateId) {
        // Update existing update
        await mentorService.editUpdate(updateId, updateData);
      } else {
        // Create new update
        await mentorService.shareUpdate(user.id, updateData);
      }
      
      setSuccess(true);
      
      // Reset form or navigate away after success
      setTimeout(() => {
        navigate('/mentor/updates');
      }, 1500);
      
    } catch (err) {
      console.error('Error saving update:', err);
      setError(`Failed to save update: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && updateId) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => navigate('/mentor/updates')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {updateId ? 'Edit Update' : 'Share New Update'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Update saved successfully!</h3>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                rows={6}
                value={formData.content}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                You can use Markdown syntax for formatting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="resourceType" className="block text-sm font-medium text-gray-700">
                  Resource Type
                </label>
                <select
                  id="resourceType"
                  name="resourceType"
                  value={formData.resourceType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="GITHUB">GitHub</option>
                  <option value="ARTICLE">Article</option>
                  <option value="VIDEO">Video</option>
                  <option value="BOOK">Book</option>
                  <option value="TUTORIAL">Tutorial</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="attachmentUrls" className="block text-sm font-medium text-gray-700">
                  Resource Links
                </label>
                <input
                  type="text"
                  name="attachmentUrls"
                  id="attachmentUrls"
                  value={formData.attachmentUrls.join(', ')}
                  onChange={handleAttachmentChange}
                  placeholder="Enter URLs separated by commas"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center mb-4">
                <input
                  id="isImportant"
                  name="isImportant"
                  type="checkbox"
                  checked={formData.isImportant}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isImportant" className="ml-2 text-sm text-gray-700">
                  Mark as important
                </label>
              </div>
              
              <div className="flex items-center mb-4">
                <input
                  id="isPublic"
                  name="isPublic"
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                  Share with all my mentees
                </label>
              </div>

              {!formData.isPublic && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Select specific mentees</h3>
                    <div className="flex items-center">
                      <input
                        id="select-all"
                        type="checkbox"
                        checked={selectedMentees.length === mentees.length && mentees.length > 0}
                        onChange={handleSelectAllMentees}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="select-all" className="ml-2 text-xs text-gray-500">
                        Select All
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {mentees.map((mentee) => (
                      <div key={mentee.id} className="flex items-center">
                        <input
                          id={`mentee-${mentee.id}`}
                          type="checkbox"
                          checked={selectedMentees.includes(mentee.id)}
                          onChange={(e) => handleMenteeSelect(e, mentee.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`mentee-${mentee.id}`} className="ml-2 text-sm text-gray-700">
                          {mentee.firstName} {mentee.lastName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/mentor/updates')}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Saving...' : updateId ? 'Update' : 'Share'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShareUpdate; 