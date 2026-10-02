import api from './api.js';

export const missionService = {
  createMission: async (data) => {
    const response = await api.post('/missions', data);
    return response.data;
  },

  getMissions: async (params) => {
    const response = await api.get('/missions', { params });
    return response.data;
  },

  getMyMissions: async (params) => {
    const response = await api.get('/missions/my', { params });
    return response.data;
  },

  getMissionById: async (id) => {
    const response = await api.get(`/missions/${id}`);
    return response.data;
  },

  acceptMission: async (id) => {
    const response = await api.patch(`/missions/${id}/accept`);
    return response.data;
  },

  startMission: async (id) => {
    const response = await api.patch(`/missions/${id}/start`);
    return response.data;
  },

  arriveAtSite: async (id) => {
    const response = await api.patch(`/missions/${id}/arrive`);
    return response.data;
  },

  startRescue: async (id) => {
    const response = await api.patch(`/missions/${id}/start-rescue`);
    return response.data;
  },

  updateMissionProgress: async (id, data) => {
    const response = await api.patch(`/missions/${id}/progress`, data);
    return response.data;
  },

  completeMission: async (id) => {
    const response = await api.patch(`/missions/${id}/complete`);
    return response.data;
  }
};
