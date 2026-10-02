import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useMapData, MapProvider } from '../../context/MapContext';
import MapFilters from '../../components/map/MapFilters';
import MapSearch from '../../components/map/MapSearch';
import MapSummary from '../../components/map/MapSummary';
import MapDetailsPanel from '../../components/map/MapDetailsPanel';
import WeatherMapPanel from '../../components/map/WeatherMapPanel';
import MapLegend from '../../components/map/MapLegend';

// Setup default marker icons to avoid broken images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createIncidentIcon = (severity) => {
  const color = severity === 'Critical' ? '#ef4444' : severity === 'High' ? '#f97316' : severity === 'Medium' ? '#eab308' : '#22c55e';
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; transform: rotate(45deg); border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const createCampIcon = (status) => {
  const color = status === 'Full' ? '#ef4444' : status === 'Near Capacity' ? '#f97316' : '#16a34a';
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 4px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><span style="color:white; font-size: 14px;">🏕️</span></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const createServiceIcon = (type) => {
  let emoji = '🏥';
  if (type === 'Police') emoji = '🚓';
  if (type === 'Fire Station') emoji = '🚒';
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: white; border: 2px solid #2563eb; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 14px;">${emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

function MapContent() {
  const { 
    filteredIncidents, filteredCamps, filteredServices, zones, activeLayers,
    selectEntity, selectedEntity 
  } = useMapData();

  const mapCenter = [28.6139, 77.2090]; // New Delhi center

  return (
    <div className="relative w-full h-full bg-neutral-100 flex overflow-hidden">
      
      {/* Map Container */}
      <div className="flex-1 relative z-0 h-full">
        <MapContainer 
          center={mapCenter} 
          zoom={12} 
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <ZoomControl position="bottomright" />

          {/* Risk Zones */}
          {activeLayers.zones && zones.map(zone => (
            <Circle 
              key={zone.id}
              center={zone.center}
              radius={zone.radius}
              pathOptions={{ fillColor: zone.color, color: zone.color, fillOpacity: 0.2, weight: 2 }}
            >
              <Popup>
                <div className="font-bold text-sm">{zone.name}</div>
                <div className="text-xs text-neutral-500">{zone.type}</div>
              </Popup>
            </Circle>
          ))}

          {/* Clusters */}
          <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
            {filteredIncidents.map(inc => (
              <Marker 
                key={inc.id} 
                position={inc.coords}
                icon={createIncidentIcon(inc.severity)}
                eventHandlers={{ click: () => selectEntity('incident', inc) }}
              />
            ))}
            
            {filteredCamps.map(camp => (
              <Marker 
                key={camp.id} 
                position={camp.coords}
                icon={createCampIcon(camp.status)}
                eventHandlers={{ click: () => selectEntity('camp', camp) }}
              />
            ))}

            {filteredServices.map(srv => (
              <Marker 
                key={srv.id} 
                position={srv.coords}
                icon={createServiceIcon(srv.type)}
                eventHandlers={{ click: () => selectEntity('service', srv) }}
              />
            ))}
          </MarkerClusterGroup>
        </MapContainer>

        {/* Floating Overlays */}
        <div className="absolute top-4 left-4 z-[400] flex flex-col gap-4 w-72 pointer-events-none">
          <MapSearch />
          <MapFilters />
          <WeatherMapPanel />
        </div>

        <div className="absolute top-4 right-4 z-[400] pointer-events-none">
          <MapSummary />
        </div>

        <div className="absolute bottom-6 left-6 z-[400] pointer-events-none">
          <MapLegend />
        </div>

      </div>

      {/* Selected Entity Panel */}
      {selectedEntity && (
        <div className="absolute right-0 top-0 h-full z-[500] shadow-2xl transition-transform transform">
          <MapDetailsPanel />
        </div>
      )}
    </div>
  );
}

export default function DisasterMapPage() {
  return (
    <MapProvider>
      <MapContent />
    </MapProvider>
  );
}
