import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapLegend from './MapLegend';
import MarkerClusterGroup from 'react-leaflet-cluster';

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

import { useNavigate } from 'react-router-dom';

const createCustomIcon = (severity, riskLevel) => {
  let color = '#22c55e'; // Low
  if (severity === 'critical' || riskLevel === 'CRITICAL') color = '#ef4444';
  else if (severity === 'high' || riskLevel === 'HIGH') color = '#f97316';
  else if (severity === 'medium' || riskLevel === 'MEDIUM') color = '#eab308';

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="${color}" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>`;

  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: svgIcon,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

export default function LiveIncidentMap({ incidents }) {
  const navigate = useNavigate();

  // Center roughly in New Delhi for default/fallback
  const center = [28.6139, 77.2090]; 

  // Valid incidents only (must have coordinates)
  const validIncidents = incidents.filter(inc => inc.location?.latitude && inc.location?.longitude);

  return (
    <div className="relative h-[450px] w-full rounded-xl overflow-hidden border border-neutral-200 z-0">
      <MapContainer 
        center={validIncidents.length > 0 ? [validIncidents[0].location.latitude, validIncidents[0].location.longitude] : center} 
        zoom={validIncidents.length > 0 ? 10 : 5} 
        scrollWheelZoom={false} 
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-grayscale"
        />
        <ZoomControl position="topright" />
        
        <MarkerClusterGroup>
          {validIncidents.map((incident) => (
            <Marker 
              key={incident._id || incident.id} 
              position={[incident.location.latitude, incident.location.longitude]}
              icon={createCustomIcon(incident.severity, incident.riskLevel)}
            >
              <Popup className="incident-popup">
                <div className="font-sans min-w-[200px]">
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-neutral-100">
                    <span className="font-bold text-sm text-neutral-800 capitalize">{incident.disasterType?.replace('_', ' ') || incident.type}</span>
                    <span className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">{incident.incidentId || incident.id}</span>
                  </div>
                  <div className="text-xs space-y-1 text-neutral-600">
                    <p><span className="font-semibold">Severity:</span> <span className="capitalize">{incident.severity}</span></p>
                    {incident.riskLevel && <p><span className="font-semibold">Risk:</span> <span className="capitalize">{incident.riskLevel}</span></p>}
                    <p><span className="font-semibold">Location:</span> {incident.location?.city || incident.location?.address || 'Unknown'}</p>
                    <p><span className="font-semibold">Status:</span> <span className="capitalize">{incident.status?.replace('_', ' ')}</span></p>
                    <p><span className="font-semibold">Reported:</span> {new Date(incident.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (incident.isSOS) {
                        navigate('/admin/sos');
                      } else {
                        navigate(`/government/incidents/${incident._id || incident.id}`);
                      }
                    }}
                    className="mt-3 w-full bg-blue-600 text-white text-xs font-semibold py-1.5 rounded transition-colors hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      <MapLegend />

      <style jsx global>{`
        .map-tiles-grayscale {
          filter: grayscale(80%) sepia(5%) opacity(0.9);
        }
        .incident-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        .incident-popup .leaflet-popup-content {
          margin: 12px 14px;
        }
      `}</style>
    </div>
  );
}
