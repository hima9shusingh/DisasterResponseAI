import api from './api.js';

export const analyticsService = {
  getDashboardAnalytics: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getIncidentTrend: async (period) => {
    const response = await api.get('/analytics/incidents/trend', { params: { period } });
    return response.data;
  },

  getRegionalAnalytics: async () => {
    const response = await api.get('/analytics/regions');
    return response.data;
  },

  getResourceUtilization: async () => {
    const response = await api.get('/analytics/resources/utilization');
    return response.data;
  },

  getMissionPerformance: async () => {
    const response = await api.get('/analytics/missions/performance');
    return response.data;
  },

  downloadIncidentReportCsv: async (period = '30d') => {
    const response = await api.get('/analytics/export/incidents', {
      params: { period },
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `incident_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
