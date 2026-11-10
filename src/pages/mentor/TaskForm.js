import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import mentorService from '../../services/mentorService';

const TaskForm = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mentees, setMentees] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    studentId: '',
  });

  // Get menteeId from query params if it exists
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const menteeId = query.get('menteeId');
    
    if (menteeId) {
      setFormData(prev => ({ ...prev, studentId: menteeId }));
    }
    
    fetchMentees();
    
    // If editing, fetch task data
    if (taskId) {
      fetchTaskDetails();
    }
  }, [location.search, taskId, user]);

  const fetchMentees = async () => {
    try {
      if (!user?.id) return;
      
      const response = await mentorService.getMyStudents(user.id);
      setMentees(response.data || []);
    } catch (err) {
      console.error('Error fetching mentees:', err);
      setError('Failed to load your mentees. Please try again later.');
    }
  };

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await mentorService.getAssignedTasks(user.id);
      const task = response.data.find(t => t.id === taskId);
      
      if (task) {
        // Format date to YYYY-MM-DD for input
        const dueDate = new Date(task.dueDate);
        const formattedDate = dueDate.toISOString().split('T')[0];
        
        setFormData({
          title: task.title || '',
          description: task.description || '',
          dueDate: formattedDate,
          priority: task.priority || 'MEDIUM',
          studentId: task.studentId || ''
        });
      } else {
        setError('Task not found');
      }
    } catch (err) {
      console.error('Error fetching task details:', err);
      setError('Failed to load task details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.dueDate || !formData.studentId) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const taskData = { ...formData };
      
      if (taskId) {
        // Update existing task
        await mentorService.updateTask(taskId, taskData);
      } else {
        // Create new task
        await mentorService.assignTask(user.id, taskData);
      }
      
      // Navigate back based on where we came from
      if (formData.studentId) {
        navigate(`/mentor/mentees/${formData.studentId}`);
      } else {
        navigate('/mentor/tasks');
      }
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && taskId) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-3xl">
        {/* Header with back button */}
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="btn-icon mr-2"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="page-title">
            {taskId ? 'Edit Task' : 'Assign New Task'}
          </h1>
        </div>

        {error && (
          <div className="alert-error mb-6">
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

        <div className="card overflow-hidden">
          <form onSubmit={handleSubmit} className="card-pad space-y-6">
            <div>
              <label htmlFor="title" className="label">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="label">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="textarea"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="dueDate" className="label">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label htmlFor="priority" className="label">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="select"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="studentId" className="label">
                Assign To <span className="text-red-500">*</span>
              </label>
              <select
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                className="select"
                required
                disabled={formData.studentId && location.search.includes('menteeId')}
              >
                <option value="">Select a mentee</option>
                {mentees.map(mentee => (
                  <option key={mentee.id} value={mentee.id}>
                    {mentee.firstName} {mentee.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Saving...' : taskId ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm; 
