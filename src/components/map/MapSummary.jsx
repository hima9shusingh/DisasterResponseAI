import React from 'react';
import { Activity, Tent, Truck, ShieldAlert } from 'lucide-react';
import { useMapData } from '../../context/MapContext';

export default function MapSummary() {
  const { filteredIncidents, filteredCamps, services } = useMapData();

  const critical = filteredIncidents.filter(i => i.severity === 'Critical').length;
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-neutral-200 p-4 pointer-events-auto flex gap-4 overflow-x-auto hidden md:flex">
      <div className="flex items-center gap-3 pr-4 border-r border-neutral-200">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Activity className="w-5 h-5" /></div>
        <div>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Active Incidents</p>
          <p className="text-xl font-extrabold text-neutral-900">{filteredIncidents.length}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 pr-4 border-r border-neutral-200">
        <div className="p-2 bg-red-100 text-red-600 rounded-lg"><ShieldAlert className="w-5 h-5" /></div>
        <div>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Critical</p>
          <p className="text-xl font-extrabold text-neutral-900">{critical}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 pr-4 border-r border-neutral-200">
        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Tent className="w-5 h-5" /></div>
        <div>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Relief Camps</p>
          <p className="text-xl font-extrabold text-neutral-900">{filteredCamps.length}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Truck className="w-5 h-5" /></div>
        <div>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Services</p>
          <p className="text-xl font-extrabold text-neutral-900">{services.length}</p>
        </div>
      </div>
    </div>
  );
}
