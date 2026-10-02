import React from 'react';
import { Cloud, CloudLightning, CloudRain, Sun, Wind } from 'lucide-react';

export default function WeatherForecast({ forecast }) {
  const getIcon = (iconName) => {
    switch(iconName) {
      case 'Heavy Rain': return <CloudLightning className="w-6 h-6 text-blue-500" />;
      case 'Rain': return <CloudRain className="w-6 h-6 text-blue-400" />;
      case 'Cloudy': return <Cloud className="w-6 h-6 text-neutral-400" />;
      case 'Partly Cloudy': return <Cloud className="w-6 h-6 text-yellow-500" />;
      case 'Sunny': return <Sun className="w-6 h-6 text-yellow-400" />;
      default: return <Sun className="w-6 h-6 text-yellow-400" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">7-Day Forecast</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
        {forecast.map((day, idx) => (
          <div key={idx} className="snap-start shrink-0 w-24 p-4 rounded-xl border border-neutral-100 bg-neutral-50 flex flex-col items-center justify-center gap-2 hover:border-blue-200 transition-colors">
            <span className="text-xs font-bold text-neutral-500">{day.day}</span>
            <span className="text-[10px] text-neutral-400">{day.date}</span>
            <div className="my-1">{getIcon(day.icon)}</div>
            <span className="text-sm font-extrabold text-neutral-800">{day.temp}</span>
            <span className="text-[10px] font-semibold text-blue-500">{day.rainProb} Rain</span>
          </div>
        ))}
      </div>
    </div>
  );
}
