import React, { useState } from 'react';
import { CloudLightning, Droplets, Wind, ThermometerSun, Map as MapIcon, ChevronDown, ChevronUp } from 'lucide-react';

export default function WeatherMapPanel() {
  const [isOpen, setIsOpen] = useState(false);

  // Mock
  const weather = {
    temp: '26°C',
    condition: 'Heavy Rain',
    alert: 'Flood Warning Active'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden pointer-events-auto transition-all duration-300 w-64">
      <div 
        className="p-3 bg-blue-900 text-white flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <CloudLightning className="w-4 h-4 text-blue-300" />
          <span className="text-xs font-bold uppercase tracking-wider">Weather Overlay</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>
      
      {isOpen && (
        <div className="p-4 space-y-3 bg-blue-50/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-extrabold text-blue-900">{weather.temp}</span>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-[9px] font-bold uppercase rounded border border-red-200">
              {weather.alert}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-blue-800">
            <div className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-blue-500" /> 45mm/h</div>
            <div className="flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-blue-500" /> 42km/h</div>
          </div>
        </div>
      )}
    </div>
  );
}
