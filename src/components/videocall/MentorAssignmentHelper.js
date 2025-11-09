import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/api';

const MentorAssignmentHelper = ({ mentorId, onAssignmentComplete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  
  const handleAssignToMentor = async () => {
    if (!user?.id || !mentorId) {
      setError('Missing user or mentor information');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try admin service first
      try {
        await adminService.assignMentorToStudent({
          studentId: user.id,
          mentorId: mentorId
        });
      } catch (adminError) {
        // If admin service fails, try alternative approach
        console.log('Admin assignment failed, trying alternative approach...');
        
        // Try direct API call with different endpoint
        const response = await fetch(baseUrl+'/api/students/assign-mentor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            studentId: user.id,
            mentorId: mentorId
          })
        });
        
        if (!response.ok) {
          throw new Error(`Assignment failed: ${response.status}`);
        }
      }
      
      setSuccess(true);
      if (onAssignmentComplete) {
        onAssignmentComplete();
      }
    } catch (error) {
      console.error('Error assigning mentor:', error);
      setError(`Assignment failed: ${error.message}. You may need admin permissions or the mentor assignment endpoint might not be available.`);
    } finally {
      setLoading(false);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
        <div className="text-green-700">
          ✅ Successfully assigned to mentor! You can now join the meeting.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
      <h3 className="text-sm font-medium text-yellow-800 mb-2">
        🔧 Development Helper: Mentor Assignment
      </h3>
      <p className="text-sm text-yellow-700 mb-3">
        You need to be assigned to this mentor to join their meeting.
      </p>
      
      {error && (
        <div className="text-red-600 text-sm mb-2">{error}</div>
      )}
      
      <button
        onClick={handleAssignToMentor}
        disabled={loading}
        className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:opacity-50"
      >
        {loading ? 'Assigning...' : 'Auto-Assign to This Mentor'}
      </button>
      
      <p className="text-xs text-yellow-600 mt-2">
        This button is only available in development mode for testing.
      </p>
    </div>
  );
};

export default MentorAssignmentHelper;