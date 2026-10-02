import api from './api.js';

export const reliefCampService = {
  getCamps: async (params) => {
    const response = await api.get('/relief-camps', { params });
    return response.data;
  },

  getCampById: async (id) => {
    const response = await api.get(`/relief-camps/${id}`);
    return response.data;
  },

  createCamp: async (data) => {
    const response = await api.post('/relief-camps', data);
    return response.data;
  },

  updateCamp: async (id, data) => {
    const response = await api.put(`/relief-camps/${id}`, data);
    return response.data;
  },

  updateOccupancy: async (id, occupied) => {
    const response = await api.patch(`/relief-camps/${id}/occupancy`, { occupied });
    return response.data;
  },

  updateInventory: async (id, data) => {
    const response = await api.patch(`/relief-camps/${id}/inventory`, data);
    return response.data;
  },

  deleteCamp: async (id) => {
    const response = await api.delete(`/relief-camps/${id}`);
    return response.data;
  }
};
