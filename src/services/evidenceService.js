import api from './api.js';

export const evidenceService = {
  uploadEvidence: async (incidentId, formData) => {
    const response = await api.post(`/incidents/${incidentId}/evidence`, formData);
    return response.data;
  },

  getEvidence: async (incidentId) => {
    const response = await api.get(`/incidents/${incidentId}/evidence`);
    return response.data;
  },

  deleteEvidence: async (incidentId, evidenceId) => {
    const response = await api.delete(`/incidents/${incidentId}/evidence/${evidenceId}`);
    return response.data;
  }
};
