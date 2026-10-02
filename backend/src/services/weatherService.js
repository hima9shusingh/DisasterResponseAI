const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getWeatherData = async ({ city, lat, lon }) => {
  const cacheKey = `\${city || ''}-\${lat || ''}-\${lon || ''}`;
  const now = Date.now();

  // Check cache
  if (cache.has(cacheKey)) {
    const entry = cache.get(cacheKey);
    if (now - entry.timestamp < CACHE_TTL) {
      return { success: true, data: entry.data, cached: true };
    }
  }

  const apiKey = process.env.WEATHER_API_KEY;
  const baseUrl = process.env.WEATHER_API_URL;

  if (!apiKey || !baseUrl) {
    return { success: false, message: 'Weather service temporarily unavailable' };
  }

  try {
    // Construct URL based on common API patterns (e.g., OpenWeatherMap, WeatherAPI)
    const url = new URL(baseUrl);
    if (city) {
      url.searchParams.append('q', city);
    } else if (lat && lon) {
      // Some APIs use q=lat,lon while others use lat=...&lon=...
      // Add both styles to maximize compatibility for an informational mock
      url.searchParams.append('lat', lat);
      url.searchParams.append('lon', lon);
      url.searchParams.append('q', `\${lat},\${lon}`); 
    }
    
    // Add key in different formats to support various providers
    url.searchParams.append('appid', apiKey);
    url.searchParams.append('key', apiKey);

    // If it's OpenWeatherMap, we typically want metric
    url.searchParams.append('units', 'metric');

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.warn(`Weather API responded with \${response.status}`);
      return { success: false, message: 'Weather service temporarily unavailable' };
    }

    const rawData = await response.json();

    // Normalize response
    const normalizedData = {
      location: {
        city: rawData?.location?.name || rawData?.name || city || 'Unknown City',
        country: rawData?.location?.country || rawData?.sys?.country || 'Unknown Country'
      },
      temperature: rawData?.current?.temp_c || rawData?.main?.temp || 0,
      feelsLike: rawData?.current?.feelslike_c || rawData?.main?.feels_like || 0,
      humidity: rawData?.current?.humidity || rawData?.main?.humidity || 0,
      windSpeed: rawData?.current?.wind_kph || rawData?.wind?.speed || 0,
      rain: rawData?.current?.precip_mm || rawData?.rain?.['1h'] || 0,
      condition: rawData?.current?.condition?.text || rawData?.weather?.[0]?.description || 'Clear',
      visibility: rawData?.current?.vis_km || (rawData?.visibility ? rawData.visibility / 1000 : 10),
      timestamp: new Date().toISOString()
    };

    // Update cache
    cache.set(cacheKey, { timestamp: now, data: normalizedData });

    return { success: true, data: normalizedData, cached: false };

  } catch (error) {
    console.error('Weather API request failed:', error.message);
    return { success: false, message: 'Weather service temporarily unavailable' };
  }
};
