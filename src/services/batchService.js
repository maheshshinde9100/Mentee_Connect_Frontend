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
      console.log('Response data is a direct array of mentors');
      mentorsArray = response.data;
    } 
    // Case 2: Nested mentors array
    else if (response.data.mentors && Array.isArray(response.data.mentors)) {
      console.log('Found mentors array in response.data.mentors');
      mentorsArray = response.data.mentors;
    } 
    // Case 3: Paginated response (Spring Data format)
    else if (response.data.content && Array.isArray(response.data.content)) {
      console.log('Found paginated mentors in content array');
      mentorsArray = response.data.content;
      
      // Log pagination info
      if (response.data.totalElements !== undefined) {
        console.log('Pagination info:', {
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          currentPage: response.data.number,
          pageSize: response.data.size
        });
      }
    } 
    // Case 4: Object with mentor properties (single mentor)
    else if (typeof response.data === 'object') {
      // If it has mentor-like properties, it might be a single mentor
      if (response.data.firstName || response.data.email) {
        console.log('Found single mentor object');
        mentorsArray = [response.data];
      } else {
        // Try to find mentor arrays in the object
        const arrayProperties = Object.entries(response.data)
          .filter(([_, val]) => Array.isArray(val));
        
        if (arrayProperties.length > 0) {
          const [key, value] = arrayProperties[0];
          console.log(`Found array in response.data.${key}`);
          mentorsArray = value;
        } else {
          console.warn('Could not find mentor array in response');
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
      console.log('Fetching all batches...');
      
      const response = await api.get(`/api/admin/batches?size=100`);
      console.log('Batches API response:', response.data);
      
      // Handle paginated response format
      // If response has a content array (Spring Data pagination format), use that
      if (response.data && response.data.content && Array.isArray(response.data.content)) {
        console.log('Found paginated response with content array:', response.data.content);
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
      
      console.log('Processed batches array in service:', batchesArray);
      return { data: batchesArray };
    } catch (error) {
      console.error('Error in getAllBatches:', error.response?.status, error.message);
      throw error;
    }
  },
  
  // Create a new batch
  createBatch: async (batchData) => {
    try {
      console.log('Creating batch with data:', batchData);
      
      const response = await api.post(`/api/admin/batches`, batchData);
      console.log('Batch created successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error in createBatch:', error.response?.status, error.message);
      throw error;
    }
  },
  
  // Get a specific batch by ID
  getBatchById: async (batchId) => {
    try {
      console.log(`Fetching batch with ID: ${batchId}`);
      
      // Check token status
      const token = localStorage.getItem('token');
      console.log('Current token status for batch fetch:', { 
        exists: !!token, 
        length: token ? token.length : 0,
        preview: token ? token.substring(0, 15) + '...' : 'none' 
      });
      
      // First attempt
      try {
        const response = await api.get(`/api/admin/batches/${batchId}`);
        console.log('Batch fetched successfully:', response.data);
        
        // Ensure we handle both id and _id properties
        if (response.data && !response.data.id && response.data._id) {
          response.data.id = response.data._id;
        }
        
        return response;
      } catch (firstError) {
        // Log first attempt error
        console.error(`First batch fetch attempt failed for ID ${batchId}:`, firstError);
        
        // If this was a 401 error, try to fix token and retry
        if (firstError.response?.status === 401) {
          console.log('Authentication error on first attempt, trying to fix token...');
          
          // Try to fix token format
          if (token) {
            // Ensure clean token format (no Bearer prefix)
            if (token.startsWith('Bearer ')) {
              const cleanToken = token.replace('Bearer ', '');
              localStorage.setItem('token', cleanToken);
              console.log('Fixed token format by removing Bearer prefix');
            }
            
            // Alternatively, add Bearer prefix if missing (for completeness)
            if (!token.startsWith('Bearer ') && token) {
              console.log('Ensuring Authorization header has Bearer prefix');
            }
            
            // Retry with new axios instance to avoid interceptors
            try {
              console.log('Retrying batch fetch with fresh request...');
              
              // Create a one-time request config
              const retryConfig = {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                }
              };
              
              const retryResponse = await api.get(`/api/admin/batches/${batchId}`, retryConfig);
              console.log('Retry successful after token fix:', retryResponse.data);
              
              // Ensure id property
              if (retryResponse.data && !retryResponse.data.id && retryResponse.data._id) {
                retryResponse.data.id = retryResponse.data._id;
              }
              
              return retryResponse;
            } catch (retryError) {
              console.error('Retry also failed:', retryError);
              throw retryError;
            }
          }
        }
        
        // Re-throw original error if unable to retry or not a 401
        throw firstError;
      }
    } catch (error) {
      console.error(`Error in getBatchById(${batchId}):`, error.response?.status, error.message);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw error;
    }
  },
  
  // Get students in a batch
  getBatchStudents: async (batchId) => {
    try {
      console.log(`Fetching students for batch ID: ${batchId}`);
      
      // Check token status
      const token = localStorage.getItem('token');
      console.log('Current token status for batch students fetch:', { 
        exists: !!token, 
        length: token ? token.length : 0,
        preview: token ? token.substring(0, 15) + '...' : 'none' 
      });
      
      // First attempt
      try {
        const response = await api.get(`/api/admin/batches/${batchId}/students?size=100`);
        console.log('Batch students API response:', response.data);
        
        // Process the response (rest of the function)
        let studentsArray = processStudentsResponse(response);
        console.log('Processed students array:', studentsArray);
        return { data: studentsArray };
      } catch (firstError) {
        // Log first attempt error
        console.error(`First batch students fetch attempt failed for ID ${batchId}:`, firstError);
        
        // If this was a 401 error, try to fix token and retry
        if (firstError.response?.status === 401) {
          console.log('Authentication error on first attempt, trying to fix token...');
          
          // Try to fix token format
          if (token) {
            // Ensure clean token format (no Bearer prefix)
            if (token.startsWith('Bearer ')) {
              const cleanToken = token.replace('Bearer ', '');
              localStorage.setItem('token', cleanToken);
              console.log('Fixed token format by removing Bearer prefix');
            }
            
            // Retry with fresh request
            try {
              console.log('Retrying batch students fetch with fresh request...');
              
              // Create a one-time request config
              const retryConfig = {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                }
              };
              
              const retryResponse = await api.get(`/api/admin/batches/${batchId}/students?size=100`, retryConfig);
              console.log('Retry successful after token fix:', retryResponse.data);
              
              // Process the response
              let studentsArray = processStudentsResponse(retryResponse);
              console.log('Processed students array after retry:', studentsArray);
              return { data: studentsArray };
            } catch (retryError) {
              console.error('Retry also failed:', retryError);
              throw retryError;
            }
          }
        }
        
        // Re-throw original error if unable to retry or not a 401
        throw firstError;
      }
    } catch (error) {
      console.error(`Error in getBatchStudents(${batchId}):`, error.response?.status, error.message);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw error;
    }
  },
  
  // Get mentors in a batch
  getBatchMentors: async (batchId) => {
    try {
      console.log(`Fetching mentors for batch ID: ${batchId}`);
      
      // Check token status
      const token = localStorage.getItem('token');
      console.log('Current token status for batch mentors fetch:', { 
        exists: !!token, 
        length: token ? token.length : 0,
        preview: token ? token.substring(0, 15) + '...' : 'none' 
      });
      
      // First attempt
      try {
        const response = await api.get(`/api/admin/batches/${batchId}/mentors?size=100`);
        console.log('Batch mentors API response:', response.data);
        
        // Process the response (rest of the function)
        let mentorsArray = processMentorsResponse(response);
        console.log('Processed mentors array:', mentorsArray);
        return { data: mentorsArray };
      } catch (firstError) {
        // Log first attempt error
        console.error(`First batch mentors fetch attempt failed for ID ${batchId}:`, firstError);
        
        // If this was a 401 error, try to fix token and retry
        if (firstError.response?.status === 401) {
          console.log('Authentication error on first attempt, trying to fix token...');
          
          // Try to fix token format
          if (token) {
            // Ensure clean token format (no Bearer prefix)
            if (token.startsWith('Bearer ')) {
              const cleanToken = token.replace('Bearer ', '');
              localStorage.setItem('token', cleanToken);
              console.log('Fixed token format by removing Bearer prefix');
            }
            
            // Retry with fresh request
            try {
              console.log('Retrying batch mentors fetch with fresh request...');
              
              // Create a one-time request config
              const retryConfig = {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                }
              };
              
              const retryResponse = await api.get(`/api/admin/batches/${batchId}/mentors?size=100`, retryConfig);
              console.log('Retry successful after token fix:', retryResponse.data);
              
              // Process the response
              let mentorsArray = processMentorsResponse(retryResponse);
              console.log('Processed mentors array after retry:', mentorsArray);
              return { data: mentorsArray };
            } catch (retryError) {
              console.error('Retry also failed:', retryError);
              throw retryError;
            }
          }
        }
        
        // Re-throw original error if unable to retry or not a 401
        throw firstError;
      }
    } catch (error) {
      console.error(`Error in getBatchMentors(${batchId}):`, error.response?.status, error.message);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw error;
    }
  },
  
  // Assign students to a batch
  assignStudentsToBatch: async (batchId, studentIds) => {
    try {
      console.log(`Assigning students ${JSON.stringify(studentIds)} to batch ${batchId}`);
      
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
      
      console.log('Updating batch with updated students:', batchData);
      
      // Use PUT to update the batch with new students list
      const response = await api.put(`/api/admin/batches/${batchId}`, batchData);
      console.log('Students assigned successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error in assignStudentsToBatch:', error.response?.status, error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      throw error;
    }
  },
  
  // Assign mentors to a batch
  assignMentorsToBatch: async (batchId, mentorIds) => {
    try {
      console.log(`Assigning mentors ${JSON.stringify(mentorIds)} to batch ${batchId}`);
      
      // First get current batch data
      const batchResponse = await api.get(`/api/admin/batches/${batchId}`);
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
      
      console.log('Updating batch with updated mentors:', batchData);
      
      // Use PUT to update the batch with new mentors list
      const response = await api.put(`/api/admin/batches/${batchId}`, batchData);
      console.log('Mentors assigned successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error in assignMentorsToBatch:', error.response?.status, error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      throw error;
    }
  },
  
  // Delete a batch
  deleteBatch: async (batchId) => {
    try {
      console.log(`Deleting batch with ID: ${batchId}`);
      
      const response = await api.delete(`/api/admin/batches/${batchId}`);
      console.log('Batch deleted successfully');
      return response;
    } catch (error) {
      console.error(`Error in deleteBatch(${batchId}):`, error.response?.status, error.message);
      throw error;
    }
  },
  
  // Update a batch
  updateBatch: async (batchId, batchData) => {
    try {
      console.log(`Updating batch ${batchId} with data:`, batchData);
      
      const response = await api.put(`/api/admin/batches/${batchId}`, batchData);
      console.log('Batch updated successfully');
      return response;
    } catch (error) {
      console.error(`Error in updateBatch(${batchId}):`, error.response?.status, error.message);
      throw error;
    }
  },
  
  // Remove a student from a batch
  removeStudentFromBatch: async (batchId, studentId) => {
    try {
      console.log(`Removing student ${studentId} from batch ${batchId}`);
      
      // First get current batch data
      const batchResponse = await api.get(`/api/admin/batches/${batchId}`);
      const batchData = batchResponse.data;
      
      // Remove student from studentsAssigned array
      if (batchData.studentsAssigned) {
        batchData.studentsAssigned = batchData.studentsAssigned.filter(id => id !== studentId);
      }
      
      console.log('Updating batch with student removed:', batchData);
      
      // Use PUT to update the batch
      const response = await api.put(`/api/admin/batches/${batchId}`, batchData);
      console.log('Student removed successfully:', response.data);
      return response;
    } catch (error) {
      console.error(`Error in removeStudentFromBatch(${batchId}, ${studentId}):`, error.response?.status, error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      throw error;
    }
  },
  
  // Remove a mentor from a batch
  removeMentorFromBatch: async (batchId, mentorId) => {
    try {
      console.log(`Removing mentor ${mentorId} from batch ${batchId}`);
      
      // First get current batch data
      const batchResponse = await api.get(`/api/admin/batches/${batchId}`);
      const batchData = batchResponse.data;
      
      // Remove mentor from mentorsAssigned array
      if (batchData.mentorsAssigned) {
        batchData.mentorsAssigned = batchData.mentorsAssigned.filter(id => id !== mentorId);
      }
      
      console.log('Updating batch with mentor removed:', batchData);
      
      // Use PUT to update the batch
      const response = await api.put(`/api/admin/batches/${batchId}`, batchData);
      console.log('Mentor removed successfully:', response.data);
      return response;
    } catch (error) {
      console.error(`Error in removeMentorFromBatch(${batchId}, ${mentorId}):`, error.response?.status, error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      throw error;
    }
  }
};

export default batchService; 