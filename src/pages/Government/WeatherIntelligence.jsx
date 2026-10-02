import React, { useState } from 'react';
import { MapPin, Navigation, Droplets, Wind, Eye, Gauge, CloudLightning, ShieldAlert, AlertTriangle } from 'lucide-react';
import { mockWeatherLocations, mockForecast, mockHourlyWeather, mockWeatherAlerts, mockRiskAssessment } from '../../data/mock/weatherMockData';
import WeatherForecast from '../../components/weather/WeatherForecast';
import HourlyWeatherChart from '../../components/weather/HourlyWeatherChart';
import RiskScore from '../../components/weather/RiskScore';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { riskZones } from '../../data/mock/mapMockData';
import { weatherService } from '../../services/weatherService';
import { useGovernment } from '../../context/GovernmentContext';
import { clsx } from 'clsx';

export default function WeatherIntelligence() {
  const { emergencyAlerts } = useGovernment();
  const [selectedLocation, setSelectedLocation] = useState(mockWeatherLocations[0].id);
  const [realWeather, setRealWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Still use mock location list for the dropdown, but fetch real data for the city
  const locationData = mockWeatherLocations.find(l => l.id === selectedLocation) || mockWeatherLocations[0];

  React.useEffect(() => {
    setIsLoading(true);
    weatherService.getWeatherByCity(locationData.city).then(res => {
      if (res.success) {
        setRealWeather({
          temp: `${Math.round(res.data.temperature || 0)}°C`,
          condition: res.data.condition || 'Clear',
          feelsLike: `${Math.round(res.data.feelsLike || 0)}°C`,
          wind: `${Math.round(res.data.windSpeed || 0)} km/h`,
          humidity: `${Math.round(res.data.humidity || 0)}%`,
          rain: `${res.data.rain || 0} mm`,
          visibility: `${res.data.visibility || 10} km`,
          pressure: '1012 hPa', // mock
          direction: 'NNE' // mock
        });
      }
      setIsLoading(false);
    });
  }, [locationData.city]);

  const activeAlerts = emergencyAlerts.filter(a => a.type.toLowerCase() === 'weather' || a.type.toLowerCase() === 'flood' || a.type.toLowerCase() === 'cyclone');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header & Location Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Weather Intelligence</h1>
          <p className="text-sm text-neutral-500 mt-1">Monitor weather conditions and identify potential disaster risks.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MapPin className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <select 
              value={selectedLocation} 
              onChange={e => setSelectedLocation(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {mockWeatherLocations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.city}, {loc.state}</option>
              ))}
            </select>
          </div>
          <button className="p-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors text-neutral-600" title="Use Current Location">
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Current Weather & Alerts */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Current Weather Card */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <CloudLightning className="absolute right-0 top-0 w-32 h-32 opacity-10 transform translate-x-4 -translate-y-4" />
            <div className="relative z-10">
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-200 mb-6">Current Conditions</h2>
              {isLoading ? (
                <div className="flex items-center justify-center h-24">
                  <span className="text-blue-300 font-bold animate-pulse">Fetching weather...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-6xl font-extrabold tracking-tighter">{realWeather?.temp || locationData.current.temp}</span>
                    <span className="text-lg font-bold text-blue-200 mb-2">{realWeather?.condition || locationData.current.condition}</span>
                  </div>
                  <p className="text-xs font-semibold text-blue-200 mb-6">Feels like {realWeather?.feelsLike || locationData.current.feelsLike}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm font-semibold text-blue-100 border-t border-blue-700/50 pt-4">
                    <div className="flex items-center gap-2"><Wind className="w-4 h-4 text-blue-300" /> {realWeather?.wind || locationData.current.wind} {realWeather?.direction}</div>
                    <div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-300" /> {realWeather?.humidity || locationData.current.humidity} Hum</div>
                    <div className="flex items-center gap-2"><CloudLightning className="w-4 h-4 text-blue-300" /> {realWeather?.rain || locationData.current.rain}</div>
                    <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-blue-300" /> {realWeather?.visibility || locationData.current.visibility} Vis</div>
                    <div className="flex items-center gap-2 col-span-2"><Gauge className="w-4 h-4 text-blue-300" /> {realWeather?.pressure || locationData.current.pressure}</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Weather Alerts */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" /> Active Weather Alerts
            </h3>
            <div className="space-y-3">
              {activeAlerts.slice(0, 4).map(alert => {
                const displayType = (alert.type || '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                const displaySeverity = (alert.severity || '').charAt(0).toUpperCase() + (alert.severity || '').slice(1);
                
                return (
                <div key={alert._id || alert.id} className="p-4 rounded-xl border border-red-100 bg-red-50">
                  <div className="flex justify-between items-start mb-1">
                    <span className={clsx(
                      "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                      displaySeverity === 'Critical' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
                    )}>{displaySeverity}</span>
                    <span className="text-[10px] font-bold text-red-500">{new Date(alert.createdAt || alert.issuedTime).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-red-900 leading-tight mb-1">{alert.title || displayType}</h4>
                  <p className="text-xs text-red-700 leading-relaxed line-clamp-2">{alert.description}</p>
                </div>
              )})}
              {activeAlerts.length === 0 && <p className="text-sm text-neutral-500">No active weather alerts.</p>}
            </div>
          </div>

        </div>

        {/* Right Col - Forecast & Risk */}
        <div className="lg:col-span-2 space-y-6">
          
          <WeatherForecast forecast={mockForecast} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HourlyWeatherChart data={mockHourlyWeather} />
            <RiskScore score={78} />
          </div>

          {/* Risk Assessment */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2 mb-4">
              <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" /> Demo Risk Assessment
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {mockRiskAssessment.map(risk => (
                  <div key={risk.category} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${risk.level === 'Critical' ? 'bg-red-500' : risk.level === 'High' ? 'bg-orange-500' : risk.level === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-neutral-800">{risk.category}</span>
                        <span className="text-[10px] font-bold text-neutral-500">{risk.prob}</span>
                      </div>
                      <p className="text-[10px] text-neutral-600 mt-0.5">{risk.reason}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Small Map */}
              <div className="h-full min-h-[250px] rounded-xl overflow-hidden border border-neutral-200 relative">
                <div className="absolute top-2 right-2 z-[400] bg-black/60 text-white text-[9px] font-bold uppercase px-2 py-1 rounded backdrop-blur-sm">Demo Risk Visualization</div>
                <MapContainer center={[28.61, 77.21]} zoom={11} className="w-full h-full" zoomControl={false}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                  {riskZones.map(zone => (
                    <Circle 
                      key={zone.id}
                      center={zone.center}
                      radius={zone.radius}
                      pathOptions={{ fillColor: zone.color, color: zone.color, fillOpacity: 0.2, weight: 2 }}
                    >
                      <Popup><div className="font-bold text-xs">{zone.name}</div></Popup>
                    </Circle>
                  ))}
                </MapContainer>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
