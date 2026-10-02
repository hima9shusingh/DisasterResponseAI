import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leafet default icon issue
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const createTeamIcon = (type) => {
  let color = '#3b82f6'; // Default Blue
  if (type.includes('Fire')) color = '#ef4444';
  else if (type.includes('Medical') || type.includes('Ambulance')) color = '#22c55e';
  else if (type.includes('Police')) color = '#1e3a8a';
  else if (type.includes('Rescue')) color = '#f97316';
  else if (type.includes('Volunteer')) color = '#a855f7';

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <path fill="#ffffff" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm-1 8H9v-2h2v2zm0-3H9V8h2v4zm3 3h-2v-2h2v2zm0-3h-2V8h2v4z"/>
    </svg>`;

  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: svgIcon,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

export default function ResourceMap({ teams }) {
  const center = [28.6139, 77.2090]; 

  return (
    <div className="relative h-full min-h-[400px] w-full rounded-xl overflow-hidden z-0">
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
        
        {teams.filter(t => t.coords).map((team) => (
          <Marker 
            key={team.id} 
            position={team.coords}
            icon={createTeamIcon(team.type)}
          >
            <Popup className="font-sans">
              <div className="min-w-[180px]">
                <h4 className="font-bold text-neutral-800 text-sm border-b border-neutral-100 pb-2 mb-2">{team.name}</h4>
                <div className="text-xs space-y-1 text-neutral-600">
                  <p><span className="font-semibold text-neutral-800">Type:</span> {team.type}</p>
                  <p><span className="font-semibold text-neutral-800">Status:</span> <span className="font-bold text-blue-600">{team.status}</span></p>
                  {team.mission && <p className="mt-2 text-neutral-500 italic">"{team.mission}"</p>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-neutral-200 text-xs font-semibold text-neutral-600 flex flex-col gap-2">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ef4444]" /> Fire Response</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#22c55e]" /> Medical</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#1e3a8a]" /> Police</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f97316]" /> Rescue/NDRF</div>
      </div>
    </div>
  );
}
