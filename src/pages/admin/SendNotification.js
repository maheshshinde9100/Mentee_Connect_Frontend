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
      <h1 className="page-title mb-6">Send Notification</h1>
      
      {error && (
        <div className="alert-error mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert-success mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="card card-pad mb-4">
        <div className="mb-4">
          <label className="label" htmlFor="title">
            Title
          </label>
          <input
            className="input"
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
          <label className="label" htmlFor="message">
            Message
          </label>
          <textarea
            className="textarea"
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
          <label className="label">
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
              className="mr-2 h-4 w-4 accent-brand-600"
            />
            <label htmlFor="ALL" className="text-sm text-gray-700 dark:text-slate-300">All Users</label>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="MENTORS"
              name="recipientType"
              value="MENTORS"
              checked={formData.recipientType === 'MENTORS'}
              onChange={handleChange}
              className="mr-2 h-4 w-4 accent-brand-600"
            />
            <label htmlFor="MENTORS" className="text-sm text-gray-700 dark:text-slate-300">All Mentors</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="STUDENTS"
              name="recipientType"
              value="STUDENTS"
              checked={formData.recipientType === 'STUDENTS'}
              onChange={handleChange}
              className="mr-2 h-4 w-4 accent-brand-600"
            />
            <label htmlFor="STUDENTS" className="text-sm text-gray-700 dark:text-slate-300">All Students</label>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="btn-primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Notification'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendNotification; 