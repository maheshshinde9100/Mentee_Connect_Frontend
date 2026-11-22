import api from './api';

const withId = (items = []) =>
  items.map((item) => (item && item._id && !item.id ? { ...item, id: item._id } : item));

export const batchService = {
  getAllBatches: async () => {
    const response = await api.get('/admin/batches', { params: { size: 100 } });
    const data = response.data;
    if (data && Array.isArray(data.content)) {
      return {
        data: withId(data.content),
        pagination: {
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          currentPage: data.number,
          pageSize: data.size,
        },
      };
    }
    return { data: withId(Array.isArray(data) ? data : []) };
  },

  createBatch: (batchData) => api.post('/admin/batches', batchData),

  getBatchById: async (batchId) => {
    const response = await api.get(`/admin/batches/${batchId}`);
    if (response.data && !response.data.id && response.data._id) {
      response.data.id = response.data._id;
    }
    return response;
  },

  getBatchStudents: async (batchId) => {
    const response = await api.get(`/admin/batches/${batchId}/students`);
    return { data: withId(Array.isArray(response.data) ? response.data : []) };
  },

  getBatchMentors: async (batchId) => {
    const response = await api.get(`/admin/batches/${batchId}/mentors`);
    return { data: withId(Array.isArray(response.data) ? response.data : []) };
  },

  assignStudentsToBatch: (batchId, studentIds) =>
    api.post('/admin/batches/assign-students', { batchId, studentIds }),

  assignMentorsToBatch: (batchId, mentorIds) =>
    api.post('/admin/batches/assign-mentor', { batchId, mentorIds }),

  updateBatch: (batchId, batchData) => api.put(`/admin/batches/${batchId}`, batchData),

  deleteBatch: (batchId) => api.delete(`/admin/batches/${batchId}`),

  removeStudentFromBatch: async (batchId, studentId) => {
    const { data: batch } = await batchService.getBatchById(batchId);
    const studentsAssigned = (batch.studentsAssigned || []).filter((id) => id !== studentId);
    return api.put(`/admin/batches/${batchId}`, {
      ...batch,
      studentsAssigned,
    });
  },

  removeMentorFromBatch: async (batchId, mentorId) => {
    const { data: batch } = await batchService.getBatchById(batchId);
    const mentorsAssigned = (batch.mentorsAssigned || []).filter((id) => id !== mentorId);
    return api.put(`/admin/batches/${batchId}`, {
      ...batch,
      mentorsAssigned,
    });
  },
};

export default batchService;
