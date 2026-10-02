import api from './api.js';

export const rescueTeamService = {
  createRescueTeam: async (data) => {
    const response = await api.post('/rescue-teams', data);
    return response.data;
  },

  getRescueTeams: async (params) => {
    const response = await api.get('/rescue-teams', { params });
    return response.data;
  },

  getRescueTeamById: async (id) => {
    const response = await api.get(`/rescue-teams/${id}`);
    return response.data;
  },

  updateRescueTeam: async (id, data) => {
    const response = await api.put(`/rescue-teams/${id}`, data);
    return response.data;
  },

  assignRescueTeam: async (id, incidentId) => {
    const response = await api.patch(`/rescue-teams/${id}/assign`, { incidentId });
    return response.data;
  },

  releaseRescueTeam: async (id) => {
    const response = await api.patch(`/rescue-teams/${id}/release`);
    return response.data;
  }
};
