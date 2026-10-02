import { useState, useEffect, useCallback } from 'react';
import { weatherService } from '../services/weatherService';

// Cache in memory for simple SPA retention (5 mins)
let weatherCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export const useWeather = (defaultCity = 'Delhi') => {
  const [weather, setWeather] = useState(weatherCache);
  const [isLoading, setIsLoading] = useState(!weatherCache);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && weatherCache && (now - lastFetchTime < CACHE_DURATION)) {
      setWeather(weatherCache);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const mapWeather = (raw) => {
      if (!raw) return null;
      return {
        temp: `${Math.round(raw.temperature || 0)}°C`,
        temperature: `${Math.round(raw.temperature || 0)}°C`,
        condition: raw.condition || 'Clear',
        feelsLike: `${Math.round(raw.feelsLike || 0)}°C`,
        wind: `${Math.round(raw.windSpeed || 0)} km/h`,
        humidity: `${Math.round(raw.humidity || 0)}%`,
        rain: `${raw.rain || 0} mm`,
        visibility: `${raw.visibility || 10} km`,
        pressure: '1012 hPa', // Mock if unavailable
        alert: raw.rain > 10 || raw.windSpeed > 40 ? 'Weather Warning' : 'No Active Alerts'
      };
    };

    const fallbackToCity = async (city) => {
      try {
        const res = await weatherService.getWeatherByCity(city);
        if (res.success) {
          const mapped = mapWeather(res.data);
          weatherCache = mapped;
          lastFetchTime = Date.now();
          setWeather(mapped);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        console.error('Weather fallback error:', err);
        setError('Weather information is temporarily unavailable.');
      } finally {
        setIsLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await weatherService.getWeatherByCoordinates(latitude, longitude);
            if (res.success) {
              const mapped = mapWeather(res.data);
              weatherCache = mapped;
              lastFetchTime = Date.now();
              setWeather(mapped);
            } else {
              throw new Error('Failed to fetch by coords');
            }
          } catch (err) {
            console.warn('Coordinates fetch failed, falling back to default city.', err);
            await fallbackToCity(defaultCity);
          } finally {
            setIsLoading(false);
          }
        },
        (geoError) => {
          console.warn('Geolocation denied or failed. Using default city.', geoError);
          fallbackToCity(defaultCity);
        },
        { timeout: 10000 }
      );
    } else {
      fallbackToCity(defaultCity);
    }
  }, [defaultCity]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { weather, isLoading, error, refresh: () => fetchWeather(true) };
};
