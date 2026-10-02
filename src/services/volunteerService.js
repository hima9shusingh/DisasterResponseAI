import api from './api.js';

export const volunteerService = {
  getProfile: async () => {
    const response = await api.get('/volunteers/me');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/volunteers/me/stats');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/volunteers/me', data);
    return response.data;
  },

  updateAvailability: async (availability) => {
    const response = await api.patch('/volunteers/me/availability', { availability });
    return response.data;
  }
};
