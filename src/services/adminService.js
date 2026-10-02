import api from './api.js';

export const adminService = {
  getUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUserStatus: async (id, isActive) => {
    const response = await api.patch(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getSystemStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  }
};
