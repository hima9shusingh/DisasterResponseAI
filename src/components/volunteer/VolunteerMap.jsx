import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createIcon = (emoji, color) => L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><span style="color:white; font-size: 14px;">${emoji}</span></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

export default function VolunteerMap({ incidentCoords, volunteerCoords }) {
  if (!incidentCoords) return null;

  const center = incidentCoords;

  return (
    <div className="w-full h-full min-h-[300px] rounded-2xl overflow-hidden border border-neutral-200 relative z-0">
      <MapContainer center={center} zoom={13} className="w-full h-full">
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        
        {volunteerCoords && (
          <Marker position={volunteerCoords} icon={createIcon('🏃', '#3b82f6')}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        <Marker position={incidentCoords} icon={createIcon('🚨', '#ef4444')}>
          <Popup>Incident Location</Popup>
        </Marker>

        {/* Dummy Hospital nearby */}
        <Marker position={[incidentCoords[0] + 0.01, incidentCoords[1] + 0.01]} icon={createIcon('🏥', '#16a34a')}>
          <Popup>Nearest Hospital</Popup>
        </Marker>

        {volunteerCoords && (
          <Polyline positions={[volunteerCoords, incidentCoords]} pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '5, 10' }} />
        )}
      </MapContainer>
    </div>
  );
}
