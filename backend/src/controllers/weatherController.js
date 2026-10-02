import { getWeatherData } from '../services/weatherService.js';

export const getWeather = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide either a city or both lat and lon' 
      });
    }

    const result = await getWeatherData({ city, lat, lon });

    if (!result.success) {
      return res.status(503).json(result); // 503 Service Unavailable
    }

    res.status(200).json(result);
  } catch (error) {
    // We shouldn't hit this often because the service catches most things
    console.error('Weather controller error:', error.message);
    res.status(500).json({ success: false, message: 'Weather service temporarily unavailable' });
  }
};
