export const mockWeatherLocations = [
  { id: 'L1', state: 'Assam', district: 'Kamrup Metropolitan', city: 'Guwahati', current: { temp: '28°C', feelsLike: '32°C', humidity: '85%', wind: '24 km/h', direction: 'SW', rain: '45 mm', visibility: '3 km', pressure: '1008 hPa', condition: 'Heavy Rain' } },
  { id: 'L2', state: 'Jharkhand', district: 'Ranchi', city: 'Ranchi', current: { temp: '33°C', feelsLike: '36°C', humidity: '60%', wind: '12 km/h', direction: 'SE', rain: '0 mm', visibility: '10 km', pressure: '1012 hPa', condition: 'Partly Cloudy' } },
  { id: 'L3', state: 'West Bengal', district: 'Kolkata', city: 'Kolkata', current: { temp: '31°C', feelsLike: '38°C', humidity: '78%', wind: '45 km/h', direction: 'S', rain: '12 mm', visibility: '5 km', pressure: '1005 hPa', condition: 'Thunderstorm' } },
];

export const mockForecast = [
  { day: 'Mon', date: 'Aug 09', temp: '27°C', rainProb: '90%', wind: '28 km/h', icon: 'Heavy Rain' },
  { day: 'Tue', date: 'Aug 10', temp: '28°C', rainProb: '85%', wind: '22 km/h', icon: 'Rain' },
  { day: 'Wed', date: 'Aug 11', temp: '30°C', rainProb: '40%', wind: '15 km/h', icon: 'Cloudy' },
  { day: 'Thu', date: 'Aug 12', temp: '32°C', rainProb: '10%', wind: '10 km/h', icon: 'Partly Cloudy' },
  { day: 'Fri', date: 'Aug 13', temp: '33°C', rainProb: '5%', wind: '8 km/h', icon: 'Sunny' },
  { day: 'Sat', date: 'Aug 14', temp: '32°C', rainProb: '20%', wind: '12 km/h', icon: 'Partly Cloudy' },
  { day: 'Sun', date: 'Aug 15', temp: '31°C', rainProb: '50%', wind: '18 km/h', icon: 'Rain' },
];

export const mockHourlyWeather = [
  { time: '00:00', temp: 26, rainProb: 80 },
  { time: '03:00', temp: 25, rainProb: 95 },
  { time: '06:00', temp: 25, rainProb: 90 },
  { time: '09:00', temp: 27, rainProb: 70 },
  { time: '12:00', temp: 29, rainProb: 40 },
  { time: '15:00', temp: 30, rainProb: 30 },
  { time: '18:00', temp: 28, rainProb: 50 },
  { time: '21:00', temp: 27, rainProb: 65 },
];

export const mockWeatherAlerts = [
  { id: 'WA-001', type: 'Heavy Rain Warning', severity: 'Critical', location: 'Guwahati, Assam', issued: '2 hours ago', duration: 'Next 24 hours', description: 'Continuous heavy rainfall expected. Localized flooding is highly likely.' },
  { id: 'WA-002', type: 'High Wind Alert', severity: 'Warning', location: 'Kolkata, West Bengal', issued: '5 hours ago', duration: 'Next 12 hours', description: 'Wind gusts up to 60km/h expected along the coastal areas.' },
];

export const mockRiskAssessment = [
  { category: 'Flood Risk', level: 'Critical', prob: '85%', reason: 'Heavy upstream rainfall and overflowing river banks.', updated: '10 mins ago' },
  { category: 'Landslide Risk', level: 'High', prob: '60%', reason: 'Saturated soil on steep gradients in northern sectors.', updated: '1 hr ago' },
  { category: 'Cyclone Risk', level: 'Low', prob: '5%', reason: 'No active cyclonic circulation nearby.', updated: '6 hrs ago' },
  { category: 'Fire Risk', level: 'Low', prob: '10%', reason: 'High humidity and continuous rain suppress fire risks.', updated: '12 hrs ago' },
  { category: 'Heat Risk', level: 'Low', prob: '2%', reason: 'Temperatures remain well below heatwave thresholds.', updated: '12 hrs ago' },
];
