import api from './api.js';

export const ngoService = {
  getMyProfile: async () => {
    const response = await api.get('/ngos/me');
    return response.data;
  },

  updateMyProfile: async (data) => {
    const response = await api.put('/ngos/me', data);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/ngos/me/stats');
    return response.data;
  },

  getVolunteers: async (params) => {
    const response = await api.get('/ngos/volunteers', { params });
    return response.data;
  },

  getMyCamps: async (params) => {
    const response = await api.get('/ngos/camps', { params });
    return response.data;
  },

  assignVolunteer: async (campId, volunteerId) => {
    const response = await api.patch(`/ngos/camps/${campId}/assign-volunteer`, { volunteerId });
    return response.data;
  },

  removeVolunteer: async (campId, volunteerId) => {
    const response = await api.patch(`/ngos/camps/${campId}/remove-volunteer`, { volunteerId });
    return response.data;
  }
};
