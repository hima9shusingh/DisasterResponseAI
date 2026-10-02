import api from './api.js';

export const supplyRequestService = {
  createSupplyRequest: async (data) => {
    const response = await api.post('/supply-requests', data);
    return response.data;
  },

  getSupplyRequests: async (params) => {
    const response = await api.get('/supply-requests', { params });
    return response.data;
  },

  getSupplyRequestById: async (id) => {
    const response = await api.get(`/supply-requests/${id}`);
    return response.data;
  },

  updateSupplyRequestStatus: async (id, status) => {
    const response = await api.patch(`/supply-requests/${id}/status`, { status });
    return response.data;
  }
};
