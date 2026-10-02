import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createCampIcon = (status) => {
  let color = '#22c55e'; // Green for Active/Available
  if (status === 'Near Capacity') color = '#f97316'; // Orange
  else if (status === 'Full' || status === 'Temporarily Closed') color = '#ef4444'; // Red

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
      <path fill="${color}" stroke="#ffffff" stroke-width="2" d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.83l6 5.4V18H6v-6.77l6-5.4z"/>
      <path fill="${color}" d="M11 10h2v4h-2zm0 5h2v2h-2z"/>
    </svg>`;

  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: svgIcon,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

export default function CampMap({ camps }) {
  const center = [28.6139, 77.2090]; 

  return (
    <div className="relative h-full min-h-[400px] w-full rounded-xl overflow-hidden z-0 border border-neutral-200">
      <MapContainer 
        center={center} 
        zoom={12} 
        scrollWheelZoom={false} 
        className="h-full w-full absolute inset-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="bottomright" />
        
        {camps.filter(c => c.coords).map((camp) => (
          <Marker 
            key={camp.id} 
            position={camp.coords}
            icon={createCampIcon(camp.status)}
          >
            <Popup className="font-sans">
              <div className="min-w-[180px]">
                <h4 className="font-bold text-neutral-800 text-sm border-b border-neutral-100 pb-2 mb-2">{camp.name}</h4>
                <div className="text-xs space-y-1 text-neutral-600">
                  <p><span className="font-semibold text-neutral-800">Status:</span> {camp.status}</p>
                  <p><span className="font-semibold text-neutral-800">Occupancy:</span> {camp.occupancyPct}% ({camp.occupied}/{camp.capacity})</p>
                  <p><span className="font-semibold text-neutral-800">Food:</span> <span className={camp.inventory.food.status === 'Low' || camp.inventory.food.status === 'Critical' ? 'text-red-600 font-bold' : ''}>{camp.inventory.food.status}</span></p>
                  <p><span className="font-semibold text-neutral-800">Medical:</span> <span className={camp.medicalSupport.status !== 'Available' ? 'text-red-600 font-bold' : ''}>{camp.medicalSupport.status}</span></p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-neutral-200 text-xs font-semibold text-neutral-600 flex flex-col gap-2">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#22c55e]" /> Available / Active</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#f97316]" /> Near Capacity</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#ef4444]" /> Full / Closed</div>
      </div>
    </div>
  );
}
