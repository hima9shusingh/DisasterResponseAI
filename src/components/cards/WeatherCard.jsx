import React from 'react';
import { CloudRain, Wind, Thermometer, Droplets, Eye, AlertTriangle } from 'lucide-react';

export default function WeatherCard({ weather }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-neutral-800">Weather Intelligence</h3>
          <p className="text-xs text-neutral-500 mt-0.5">Current Area Conditions</p>
        </div>
        <CloudRain className="w-8 h-8 text-blue-500 opacity-80" />
      </div>

      {weather.warning && (
        <div className="bg-orange-50 px-4 py-2 border-b border-orange-100 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-orange-800">{weather.warning}</p>
        </div>
      )}

      <div className="grid grid-cols-2 p-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-50 rounded-lg"><Thermometer className="w-4 h-4 text-neutral-600" /></div>
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-400">Temperature</p>
            <p className="text-sm font-semibold text-neutral-800">{weather.temperature}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-50 rounded-lg"><CloudRain className="w-4 h-4 text-neutral-600" /></div>
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-400">Rainfall</p>
            <p className="text-sm font-semibold text-neutral-800">{weather.rainfall}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-50 rounded-lg"><Wind className="w-4 h-4 text-neutral-600" /></div>
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-400">Wind Speed</p>
            <p className="text-sm font-semibold text-neutral-800">{weather.windSpeed}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-50 rounded-lg"><Droplets className="w-4 h-4 text-neutral-600" /></div>
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-400">Humidity</p>
            <p className="text-sm font-semibold text-neutral-800">{weather.humidity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
