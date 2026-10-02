import api from './api.js';

export const weatherService = {
  getWeatherByCity: async (city) => {
    const response = await api.get('/weather', { params: { city } });
    return response.data;
  },
  
  getWeatherByCoordinates: async (lat, lon) => {
    const response = await api.get('/weather', { params: { lat, lon } });
    return response.data;
  }
};
