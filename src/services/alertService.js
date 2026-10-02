import api from './api.js';

export const alertService = {
  getAlerts: async (params = {}) => {
    const response = await api.get('/alerts', { params });
    return response.data;
  },

  getActiveAlerts: async () => {
    const response = await api.get('/alerts/active');
    return response.data;
  },

  getAlertById: async (id) => {
    const response = await api.get(`/alerts/${id}`);
    return response.data;
  },

  createAlert: async (data) => {
    const response = await api.post('/alerts', data);
    return response.data;
  },

  updateAlert: async (id, data) => {
    const response = await api.put(`/alerts/${id}`, data);
    return response.data;
  },

  activateAlert: async (id) => {
    const response = await api.patch(`/alerts/${id}/activate`);
    return response.data;
  },

  resolveAlert: async (id) => {
    const response = await api.patch(`/alerts/${id}/resolve`);
    return response.data;
  },

  deleteAlert: async (id) => {
    const response = await api.delete(`/alerts/${id}`);
    return response.data;
  }
};
