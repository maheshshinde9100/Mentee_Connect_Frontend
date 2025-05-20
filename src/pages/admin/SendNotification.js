import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';

const SendNotification = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    recipientType: 'ALL' // Default to ALL
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.message.trim()) {
        throw new Error('Message is required');
      }

      // Send notification
      const response = await notificationService.sendNotification(formData);
      
      // Handle success
      setSuccess('Notification sent successfully!');
      setFormData({
        title: '',
        message: '',
        recipientType: 'ALL'
      });
    } catch (err) {
      setError(err.message || 'Failed to send notification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Send Notification</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Notification Title"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Notification Message"
            rows="4"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Recipients
          </label>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="ALL"
              name="recipientType"
              value="ALL"
              checked={formData.recipientType === 'ALL'}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="ALL">All Users</label>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="MENTORS"
              name="recipientType"
              value="MENTORS"
              checked={formData.recipientType === 'MENTORS'}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="MENTORS">All Mentors</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="STUDENTS"
              name="recipientType"
              value="STUDENTS"
              checked={formData.recipientType === 'STUDENTS'}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="STUDENTS">All Students</label>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Notification'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendNotification; 