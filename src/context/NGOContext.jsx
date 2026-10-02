import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ngoService } from '../services/ngoService';
import { reliefCampService } from '../services/reliefCampService';
import { supplyRequestService } from '../services/supplyRequestService';
import { useSocket } from './SocketContext';

const NGOContext = createContext();

export const useNGO = () => useContext(NGOContext);

export const NGOProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { socket } = useSocket();

  const [profile, setProfile] = useState({});
  const [stats, setStats] = useState({
    managedCamps: 0,
    activeCamps: 0,
    assignedVolunteers: 0,
    peopleSupported: 0,
    pendingSupplyRequests: 0,
    approvedRequests: 0,
    deliveredRequests: 0
  });
  
  const [camps, setCamps] = useState([]);
  const [requests, setRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'ngo') return;
    try {
      setIsInitializing(true);
      const [profRes, statsRes, campsRes, reqsRes, volRes] = await Promise.all([
        ngoService.getMyProfile(),
        ngoService.getStats(),
        ngoService.getMyCamps({ limit: 50 }),
        supplyRequestService.getSupplyRequests({ limit: 50 }),
        ngoService.getVolunteers({ limit: 50 })
      ]);

      if (profRes.success) setProfile(profRes.data.user);
      if (statsRes.success) setStats(statsRes.data.stats);
      if (campsRes.success) setCamps(campsRes.data.camps);
      if (reqsRes.success) setRequests(reqsRes.data.requests);
      if (volRes.success) setVolunteers(volRes.data.volunteers);
    } catch (error) {
      console.error('Failed to fetch NGO data', error);
    } finally {
      setIsInitializing(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Setup Socket Listeners
  useEffect(() => {
    if (!socket || !isAuthenticated || user?.role !== 'ngo') return;

    const handleEvent = () => {
      fetchData();
    };

    const events = [
      'camp:occupancy_updated', 'camp:inventory_updated',
      'supply-request:created', 'supply-request:updated'
    ];

    events.forEach(ev => socket.on(ev, handleEvent));

    return () => {
      events.forEach(ev => socket.off(ev, handleEvent));
    };
  }, [socket, isAuthenticated, user, fetchData]);

  // Inventory & Camp Actions
  const updateCampOccupancy = useCallback(async (campId, occupied) => {
    try {
      await reliefCampService.updateOccupancy(campId, occupied);
      await fetchData();
    } catch (err) {
      throw err;
    }
  }, [fetchData]);

  const updateCampInventory = useCallback(async (campId, item, quantity, operation) => {
    try {
      await reliefCampService.updateInventory(campId, { item, quantity, operation });
      await fetchData();
    } catch (err) {
      throw err;
    }
  }, [fetchData]);

  // Supply Request Actions
  const addSupplyRequest = useCallback(async (reqData) => {
    try {
      await supplyRequestService.createSupplyRequest(reqData);
      await fetchData();
    } catch (err) {
      throw err;
    }
  }, [fetchData]);

  const updateRequestStatus = useCallback(async (id, status) => {
    try {
      await supplyRequestService.updateSupplyRequestStatus(id, status);
      await fetchData();
    } catch (err) {
      throw err;
    }
  }, [fetchData]);

  // Volunteer Actions
  const assignVolunteerToCamp = useCallback(async (campId, volunteerId) => {
    try {
      await ngoService.assignVolunteer(campId, volunteerId);
      await fetchData();
    } catch (err) {
      throw err;
    }
  }, [fetchData]);

  const removeVolunteerAssignment = useCallback(async (campId, volunteerId) => {
    try {
      await ngoService.removeVolunteer(campId, volunteerId);
      await fetchData();
    } catch (err) {
      throw err;
    }
  }, [fetchData]);

  // Notifications
  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <NGOContext.Provider value={{
      profile,
      stats,
      camps,
      requests,
      volunteers,
      notifications,
      updateCampOccupancy,
      updateCampInventory,
      addSupplyRequest,
      updateRequestStatus,
      assignVolunteerToCamp,
      removeVolunteerAssignment,
      markNotificationRead,
      markAllNotificationsRead,
      isInitializing,
      fetchData
    }}>
      {children}
    </NGOContext.Provider>
  );
};
