import React from 'react';
import { Filter, Layers } from 'lucide-react';
import { useMapData } from '../../context/MapContext';

export default function MapFilters() {
  const { 
    activeLayers, toggleLayer, 
    filterSeverity, setFilterSeverity, 
    filterType, setFilterType 
  } = useMapData();

  const layerOptions = [
    { id: 'incidents', label: 'Incidents' },
    { id: 'camps', label: 'Relief Camps' },
    { id: 'hospitals', label: 'Hospitals' },
    { id: 'police', label: 'Police Stations' },
    { id: 'fire', label: 'Fire Stations' },
    { id: 'zones', label: 'Risk Zones' },
  ];

  const severityOptions = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const typeOptions = ['All', 'Flood', 'Fire', 'Earthquake', 'Cyclone', 'Landslide', 'Building Collapse', 'Road Accident'];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-4 pointer-events-auto">
      <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Filter className="w-4 h-4" /> Filters
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Incident Type</label>
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            className="w-full text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-blue-400"
          >
            {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Severity</label>
          <select 
            value={filterSeverity} 
            onChange={e => setFilterSeverity(e.target.value)}
            className="w-full text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-blue-400"
          >
            {severityOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-neutral-100">
        <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4" /> Map Layers
        </h3>
        <div className="space-y-2">
          {layerOptions.map(layer => (
            <label key={layer.id} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={activeLayers[layer.id]} 
                onChange={() => toggleLayer(layer.id)}
                className="w-4 h-4 text-blue-600 rounded border-neutral-300 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-neutral-700 group-hover:text-blue-600 transition-colors">{layer.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
