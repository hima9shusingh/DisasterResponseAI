import api from './api.js';

export const aiAssessmentService = {
  createAssessment: async (data) => {
    const response = await api.post('/ai-assessments', data);
    return response.data;
  },

  getAssessments: async (params) => {
    const response = await api.get('/ai-assessments', { params });
    return response.data;
  },

  getAssessmentById: async (id) => {
    const response = await api.get(`/ai-assessments/${id}`);
    return response.data;
  },

  reviewAssessment: async (id, data) => {
    const response = await api.patch(`/ai-assessments/${id}/review`, data);
    return response.data;
  },

  deleteAssessment: async (id) => {
    const response = await api.delete(`/ai-assessments/${id}`);
    return response.data;
  }
};
