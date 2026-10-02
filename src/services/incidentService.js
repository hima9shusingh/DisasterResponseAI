import api from './api.js';

export const incidentService = {
  createIncident: async (incidentData) => {
    const response = await api.post('/incidents', incidentData);
    return response.data;
  },

  uploadEvidence: async (id, formData) => {
    const response = await api.post(`/incidents/${id}/evidence`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getMyIncidents: async (params) => {
    const response = await api.get('/incidents/my', { params });
    return response.data;
  },

  getIncidentById: async (id) => {
    const response = await api.get(`/incidents/${id}`);
    return response.data;
  },

  updateIncident: async (id, data) => {
    const response = await api.put(`/incidents/${id}`, data);
    return response.data;
  },

  updateIncidentStatus: async (id, status) => {
    const response = await api.patch(`/incidents/${id}/status`, { status });
    return response.data;
  },

  verifyIncident: async (id) => {
    const response = await api.patch(`/incidents/${id}/verify`);
    return response.data;
  },

  getIncidents: async (params) => {
    const response = await api.get('/incidents', { params });
    return response.data;
  }
};
