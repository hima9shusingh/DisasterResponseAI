import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const incidentIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-md flex items-center justify-center"><div class="w-2 h-2 bg-white rounded-full animate-ping"></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const teamIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div class="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

export default function CitizenMap({ incidentCoords, teamCoords }) {
  if (!incidentCoords) return null;

  return (
    <div className="relative h-full min-h-[300px] w-full rounded-xl overflow-hidden z-0 border border-neutral-200">
      <MapContainer 
        center={incidentCoords} 
        zoom={14} 
        scrollWheelZoom={false} 
        className="h-full w-full absolute inset-0"
        zoomControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <ZoomControl position="bottomright" />
        
        <Marker position={incidentCoords} icon={incidentIcon}>
          <Popup>Your reported location</Popup>
        </Marker>

        {teamCoords && (
          <Marker position={teamCoords} icon={teamIcon}>
            <Popup>Rescue Team Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
