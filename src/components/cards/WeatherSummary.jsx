import React from 'react';
import { CloudLightning, Droplets, Wind, ThermometerSun } from 'lucide-react';

export default function WeatherSummary({ weather }) {
  if (!weather || !weather.condition) {
    return (
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-2xl p-6 shadow-sm border border-blue-800 text-white relative overflow-hidden flex items-center justify-center min-h-[150px]">
        <span className="text-blue-300 font-bold text-sm">Weather information unavailable</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-2xl p-6 shadow-sm border border-blue-800 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-white">
        <CloudLightning className="w-32 h-32" />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-sm font-bold text-blue-300 uppercase tracking-wider mb-1">Local Weather</h2>
            <p className="text-2xl font-extrabold">{weather.condition}</p>
          </div>
          <div className="text-right">
             <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
               {weather.alert}
             </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] text-blue-300 uppercase tracking-wider font-bold flex items-center gap-1.5 mb-1"><ThermometerSun className="w-3.5 h-3.5" /> Temp</p>
            <p className="font-bold text-lg">{weather.temperature}</p>
          </div>
          {/* <div>
            <p className="text-[10px] text-blue-300 uppercase tracking-wider font-bold flex items-center gap-1.5 mb-1"><Droplets className="w-3.5 h-3.5" /> Rainfall</p>
            <p className="font-bold text-lg">{weather.rain}</p>
          </div> */}
          <div>
            <p className="text-[10px] text-blue-300 uppercase tracking-wider font-bold flex items-center gap-1.5 mb-1"><Droplets className="w-3.5 h-3.5" /> Humidity</p>
            <p className="font-bold text-lg">{weather.humidity}</p>
          </div>
          <div>
            <p className="text-[10px] text-blue-300 uppercase tracking-wider font-bold flex items-center gap-1.5 mb-1"><Wind className="w-3.5 h-3.5" /> Wind</p>
            <p className="font-bold text-lg">{weather.wind}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
