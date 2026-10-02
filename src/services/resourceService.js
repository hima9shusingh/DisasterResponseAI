import api from './api.js';

export const resourceService = {
  createResource: async (data) => {
    const response = await api.post('/resources', data);
    return response.data;
  },

  getResources: async (params) => {
    const response = await api.get('/resources', { params });
    return response.data;
  },

  getResourceById: async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },

  updateResource: async (id, data) => {
    const response = await api.put(`/resources/${id}`, data);
    return response.data;
  },

  assignResource: async (id, incidentId, quantity) => {
    const response = await api.patch(`/resources/${id}/assign`, { incidentId, quantity });
    return response.data;
  },

  releaseResource: async (id) => {
    const response = await api.patch(`/resources/${id}/release`);
    return response.data;
  }
};
