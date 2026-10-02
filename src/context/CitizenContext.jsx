import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  mockProfile, 
  mockEmergencyContacts, 
  mockSafetyStatus,
  mockCitizenWeather
} from '../data/mock/citizenDashboardData';
import { incidentService } from '../services/incidentService';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const CitizenContext = createContext();

export const useCitizen = () => useContext(CitizenContext);

export const CitizenProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { socket } = useSocket();

  const [reports, setReports] = useState([]);
  
  const [safetyStatus] = useState(mockSafetyStatus);
  const [unreadCount] = useState(0); // This should normally come from a notifications context

  const fetchReports = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await incidentService.getMyIncidents();
      if (response.success) {
        setReports(response.data.incidents || []);
      }
    } catch (error) {
      console.error('Failed to fetch user reports:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Setup Socket Listeners
  useEffect(() => {
    if (!socket || !isAuthenticated || user?.role !== 'citizen') return;

    const handleEvent = () => {
      fetchReports();
    };

    socket.on('incident:created', handleEvent);
    socket.on('incident:updated', handleEvent);

    return () => {
      socket.off('incident:created', handleEvent);
      socket.off('incident:updated', handleEvent);
    };
  }, [socket, isAuthenticated, user, fetchReports]);

  const addReport = useCallback(async (reportData) => {
    await fetchReports();
  }, [fetchReports]);

  return (
      <CitizenContext.Provider value={{
      profile: user || {},
      contacts: user?.emergencyContacts || [],
      reports,
      safetyStatus,
      unreadCount,
      addReport
    }}>
      {children}
    </CitizenContext.Provider>
  );
};
