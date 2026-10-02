import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function LocationCard({ coords, locationName }) {
  if (!coords) return null;

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-neutral-200 relative z-0">
      <MapContainer 
        center={coords} 
        zoom={14} 
        scrollWheelZoom={false}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords}>
          <Popup className="font-sans font-semibold text-sm">
            {locationName}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
