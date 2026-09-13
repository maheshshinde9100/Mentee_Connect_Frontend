import api from './api';

// Flag to enable mock mode for testing
let useMockData = false;

// Helper function to process student response data
const processStudentsResponse = (response) => {
  let studentsArray = [];
  
  if (response.data) {
    if (Array.isArray(response.data)) {
      studentsArray = response.data;
    } else if (response.data.students && Array.isArray(response.data.students)) {
      studentsArray = response.data.students;
    } else if (response.data.content && Array.isArray(response.data.content)) {
      studentsArray = response.data.content;
    } else if (typeof response.data === 'object') {
      // If it has student-like properties, it might be a single student
      if (response.data.firstName || response.data.email) {
        studentsArray = [response.data];
      } else {
        // Try to find student arrays in the object
        const potentialStudents = Object.values(response.data).find(val => Array.isArray(val));
        if (potentialStudents) {
          studentsArray = potentialStudents;
        }
      }
    }
  }
  
  // Ensure all students have id property (may be _id in MongoDB)
  studentsArray = studentsArray.map(student => {
    if (student._id && !student.id) {
      return { ...student, id: student._id };
    }
    return student;
  });
  
  return studentsArray;
};

// Helper function to process mentor response data
const processMentorsResponse = (response) => {
  let mentorsArray = [];
  
  if (response.data) {
    // Case 1: Direct array
    if (Array.isArray(response.data)) {
      mentorsArray = response.data;
    } 
    // Case 2: Nested mentors array
    else if (response.data.mentors && Array.isArray(response.data.mentors)) {
      mentorsArray = response.data.mentors;
    } 
    // Case 3: Paginated response (Spring Data format)
    else if (response.data.content && Array.isArray(response.data.content)) {
      mentorsArray = response.data.content;
    } 
    // Case 4: Object with mentor properties (single mentor)
    else if (typeof response.data === 'object') {
      // If it has mentor-like properties, it might be a single mentor
      if (response.data.firstName || response.data.email) {
        mentorsArray = [response.data];
      } else {
        // Try to find mentor arrays in the object
        const arrayProperties = Object.entries(response.data)
          .filter(([_, val]) => Array.isArray(val));
        
        if (arrayProperties.length > 0) {
          const [key, value] = arrayProperties[0];
          mentorsArray = value;
        }
      }
    }
  }
  
  // Ensure all mentors have id property (may be _id in MongoDB)
  mentorsArray = mentorsArray.map(mentor => {
    if (mentor._id && !mentor.id) {
      return { ...mentor, id: mentor._id };
    }
    return mentor;
  });
  
  return mentorsArray;
};

export const batchService = {
  // Get all batches
  getAllBatches: async () => {
    try {
      const response = await api.get(`/api/admin/batches?size=100`);
      
      // Handle paginated response format
      // If response has a content array (Spring Data pagination format), use that
      if (response.data && response.data.content && Array.isArray(response.data.content)) {
        return { 
          data: response.data.content,
          pagination: {
            totalElements: response.data.totalElements,
            totalPages: response.data.totalPages,
            currentPage: response.data.number,
            pageSize: response.data.size
          }
        };
      }
      
      // Process the response to ensure we have an array
      let batchesArray = [];
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          batchesArray = response.data;
        } else if (response.data.batches && Array.isArray(response.data.batches)) {
          batchesArray = response.data.batches;
        } else if (typeof response.data === 'object') {
          // If no array found, try to convert object to array if it has batch-like properties
          const keys = Object.keys(response.data);
          if (keys.length > 0) {
            // Check if this is a single batch object
            if (response.data.id || response.data._id || response.data.batchName) {
              batchesArray = [response.data];
            } else {
              // Check if values in the object are batch objects
              const potentialBatches = Object.values(response.data).filter(
                item => item && typeof item === 'object' && (item.id || item._id || item.batchName)
              );
              
              if (potentialBatches.length > 0) {
                batchesArray = potentialBatches;
              }
            }
          }
        }
      }
      
      return { data: batchesArray };
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new batch
  createBatch: async (batchData) => {
    try {
      const response = await api.post(`/api/admin/batches`, batchData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific batch by ID
  getBatchById: async (batchId) => {
    try {
      const token = localStorage.getItem('token');
      
      // First attempt
      try {
        const response = await api.get(`/api/admin/batches/${batchId}`);
        
        // Ensure we handle both id and _id properties
        if (response.data && !response.data.id && response.data._id) {
          response.data.id = response.data._id;
        }
        
        return response;
      } catch (firstError) {
        // If this was a 401 error, try to fix token and retry
        if (firstError.response?.status === 401) {
          // Try to fix token format
          if (token) {
            // Ensure clean token format (no Bearer prefix)
            if (token.startsWith('Bearer ')) {
              const cleanToken = token.replace('Bearer ', '');
              localStorage.setItem('token', cleanToken);
            }
            
            // Alternatively, add Bearer prefix if missing (for completeness)
            if (!token.startsWith('Bearer ') && token) {
              // Ensure Bearer prefix
            }
            
            // Retry with new axios instance to avoid interceptors
            try {
              
              // Create a one-time request config
              const retryConfig = {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                }
              };
              
              const retryResponse = await api.get(`/api/admin/batches/${batchId}`, retryConfig);
              
              // Ensure id property
              if (retryResponse.data && !retryResponse.data.id && retryResponse.data._id) {
                retryResponse.data.id = retryResponse.data._id;
              }
              
              return retryResponse;
            } catch (retryError) {
              throw retryError;
            }
          }
        }
        
        // Re-throw original error if unable to retry or not a 401
        throw firstError;
      }
    } catch (error) {
      // Error occurred
      throw error;
    }
  },
  
  // Get students in a batch
  getBatchStudents: async (batchId) => {
    try {
      const token = localStorage.getItem('token');
      
      // First attempt
      try {
        const response = await api.get(`/api/admin/batches/${batchId}/students?size=100`);
        
        // Process the response (rest of the function)
        let studentsArray = processStudentsResponse(response);
        return { data: studentsArray };
      } catch (firstError) {
        // If this was a 401 error, try to fix token and retry
        if (firstError.response?.status === 401) {
          // Try to fix token format
          if (token) {
            // Ensure clean token format (no Bearer prefix)
            if (token.startsWith('Bearer ')) {
              const cleanToken = token.replace('Bearer ', '');
              localStorage.setItem('token', cleanToken);
            }
            
            // Retry with fresh request
            try {
              // Create a one-time request config
              const retryConfig = {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                }
              };
              
              const retryResponse = await api.get(`/api/admin/batches/${batchId}/students?size=100`, retryConfig);
              
              // Process the response
              let studentsArray = processStudentsResponse(retryResponse);
              return { data: studentsArray };
            } catch (retryError) {
              throw retryError;
            }
          }
        }
        
        // Re-throw original error if unable to retry or not a 401
        throw firstError;
      }
    } catch (error) {
      throw error;
    }
  },
  
  // Get mentors in a batch
  getBatchMentors: async (batchId) => {
    try {
      const token = localStorage.getItem('token');
      
      // First attempt
      try {
        const response = await api.get(`/api/admin/batches/${batchId}/mentors?size=100`);
        
        // Process the response (rest of the function)
        let mentorsArray = processMentorsResponse(response);
        return { data: mentorsArray };
      } catch (firstError) {
        // If this was a 401 error, try to fix token and retry
        if (firstError.response?.status === 401) {
          // Try to fix token format
          if (token) {
            // Ensure clean token format (no Bearer prefix)
            if (token.startsWith('Bearer ')) {
              const cleanToken = token.replace('Bearer ', '');
              localStorage.setItem('token', cleanToken);
            }
            
            // Retry with fresh request
            try {
              
              // Create a one-time request config
              const retryConfig = {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                }
              };
              
              const retryResponse = await api.get(`/api/admin/batches/${batchId}/mentors?size=100`, retryConfig);
              
              // Process the response
              let mentorsArray = processMentorsResponse(retryResponse);
              return { data: mentorsArray };
            } catch (retryError) {
              throw retryError;
            }
          }
        }
        
        // Re-throw original error if unable to retry or not a 401
        throw firstError;
      }
    } catch (error) {
      throw error;
    }
  },
  
  // Assign students to a batch
  assignStudentsToBatch: async (batchId, studentIds) => {
    try {
      // First get current batch data
      const batchResponse = await api.get(`/api/admin/batches/${batchId}`);
      const batchData = batchResponse.data;
      
      // Add students to batch data
      if (!batchData.studentsAssigned) {
        batchData.studentsAssigned = [];
      }
      
      // Add new student IDs without duplicates
      studentIds.forEach(studentId => {
        if (!batchData.studentsAssigned.includes(studentId)) {
          batchData.studentsAssigned.push(studentId);
        }
      });
      
      // Use PUT to update the batch with new students list
      const response = await api.put(`/admin/batches/${batchId}`, batchData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Assign mentors to a batch
  assignMentorsToBatch: async (batchId, mentorIds) => {
    try {
      // First get current batch data
      const batchResponse = await api.get(`/admin/batches/${batchId}`);
      const batchData = batchResponse.data;
      
      // Add mentors to batch data
      if (!batchData.mentorsAssigned) {
        batchData.mentorsAssigned = [];
      }
      
      // Add new mentor IDs without duplicates
      mentorIds.forEach(mentorId => {
        if (!batchData.mentorsAssigned.includes(mentorId)) {
          batchData.mentorsAssigned.push(mentorId);
        }
      });
      
      // Use PUT to update the batch with new mentors list
      const response = await api.put(`/admin/batches/${batchId}`, batchData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a batch
  deleteBatch: async (batchId) => {
    try {
      const response = await api.delete(`/admin/batches/${batchId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update a batch
  updateBatch: async (batchId, batchData) => {
    try {
      const response = await api.put(`/admin/batches/${batchId}`, batchData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Remove a student from a batch
  removeStudentFromBatch: async (batchId, studentId) => {
    try {
      // First get current batch data
      const batchResponse = await api.get(`/admin/batches/${batchId}`);
      const batchData = batchResponse.data;
      
      // Remove student from studentsAssigned array
      if (batchData.studentsAssigned) {
        batchData.studentsAssigned = batchData.studentsAssigned.filter(id => id !== studentId);
      } else {
        // If studentsAssigned doesn't exist, create an empty array
        batchData.studentsAssigned = [];
      }
      
      // Use PUT to update the batch
      const response = await api.put(`/admin/batches/${batchId}`, batchData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Remove a mentor from a batch
  removeMentorFromBatch: async (batchId, mentorId) => {
    try {
      // First get current batch data
      const batchResponse = await api.get(`/admin/batches/${batchId}`);
      const batchData = batchResponse.data;
      
      // Remove mentor from mentorsAssigned array
      if (batchData.mentorsAssigned) {
        batchData.mentorsAssigned = batchData.mentorsAssigned.filter(id => id !== mentorId);
      } else {
        // If mentorsAssigned doesn't exist, create an empty array
        batchData.mentorsAssigned = [];
      }
      
      // Use PUT to update the batch
      const response = await api.put(`/admin/batches/${batchId}`, batchData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default batchService; 