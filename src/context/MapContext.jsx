import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { incidentService } from '../services/incidentService';
import { reliefCampService } from '../services/reliefCampService';
import { useSocket } from './SocketContext';

const MapContext = createContext();

export const useMapData = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [camps, setCamps] = useState([]);
  const [services, setServices] = useState([]);
  const [zones, setZones] = useState([]);
  const { socket, isConnected } = useSocket();

  const [activeLayers, setActiveLayers] = useState({
    incidents: true,
    camps: true,
    hospitals: true,
    police: true,
    fire: true,
    zones: false
  });
  
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [incRes, campRes] = await Promise.all([
        incidentService.getIncidents({ limit: 100 }),
        reliefCampService.getCamps({ limit: 100 })
      ]);
      
      if (incRes.success) {
        // Map backend incidents to map format
        const mappedIncidents = incRes.data.incidents.map(inc => ({
          id: inc.incidentId,
          _id: inc._id,
          type: inc.disasterType,
          severity: inc.severity === 'critical' ? 'Critical' : inc.severity === 'high' ? 'High' : inc.severity === 'medium' ? 'Medium' : 'Low',
          coords: [inc.location?.latitude || 28.6139, inc.location?.longitude || 77.2090],
          location: inc.location?.city || 'Unknown',
          description: inc.description,
          status: inc.status
        }));
        setIncidents(mappedIncidents);
      }
      
      if (campRes.success) {
        // Map camps to map format
        const mappedCamps = campRes.data.camps.map(camp => ({
          id: camp.campId || camp._id,
          _id: camp._id,
          name: camp.name,
          coords: [camp.location?.latitude || 28.6, camp.location?.longitude || 77.2],
          status: camp.status === 'full' ? 'Full' : camp.status === 'near_capacity' ? 'Near Capacity' : 'Active',
          capacity: camp.capacity,
          occupied: camp.occupied
        }));
        setCamps(mappedCamps);
      }
    } catch (error) {
      console.error('Map data fetch failed:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!socket || !isConnected) return;
    
    const handleUpdate = () => fetchData();
    socket.on('incident:created', handleUpdate);
    socket.on('incident:updated', handleUpdate);

    return () => {
      socket.off('incident:created', handleUpdate);
      socket.off('incident:updated', handleUpdate);
    };
  }, [socket, isConnected, fetchData]);

  const toggleLayer = (layer) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const selectEntity = (type, data) => {
    setSelectedEntity({ type, data });
  };

  const clearSelection = () => setSelectedEntity(null);

  const filteredIncidents = incidents.filter(inc => {
    if (!activeLayers.incidents) return false;
    if (filterSeverity !== 'All' && inc.severity !== filterSeverity) return false;
    if (filterType !== 'All' && inc.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!inc.id.toLowerCase().includes(q) && !inc.location.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const filteredCamps = camps.filter(camp => {
    if (!activeLayers.camps) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!camp.name.toLowerCase().includes(q) && !camp.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const filteredServices = services.filter(srv => {
    if (srv.type === 'Hospital' && !activeLayers.hospitals) return false;
    if (srv.type === 'Police' && !activeLayers.police) return false;
    if (srv.type === 'Fire Station' && !activeLayers.fire) return false;
    return true;
  });

  return (
    <MapContext.Provider value={{
      incidents, camps, services, zones,
      activeLayers, filterSeverity, filterType, searchQuery, selectedEntity,
      setActiveLayers, setFilterSeverity, setFilterType, setSearchQuery,
      toggleLayer, selectEntity, clearSelection,
      filteredIncidents, filteredCamps, filteredServices
    }}>
      {children}
    </MapContext.Provider>
  );
};
