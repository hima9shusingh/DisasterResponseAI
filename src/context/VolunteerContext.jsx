import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { missionService } from '../services/missionService';
import { volunteerService } from '../services/volunteerService';
import { useSocket } from './SocketContext';

const VolunteerContext = createContext();

export const useVolunteer = () => useContext(VolunteerContext);

export const VolunteerProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { socket } = useSocket();
  
  const [profile, setProfile] = useState({});
  const [stats, setStats] = useState({
    missionsCompleted: 0,
    activeMissions: 0,
    peopleAssisted: 0,
    totalAssignedMissions: 0
  });
  const [isAvailable, setIsAvailable] = useState(true);
  const [missions, setMissions] = useState([]);
  const [notifications, setNotifications] = useState([]); // Or fetch from notification API if we had one
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'volunteer') return;
    try {
      const [profRes, statsRes, missionsRes] = await Promise.all([
        volunteerService.getProfile(),
        volunteerService.getStats(),
        missionService.getMyMissions({ limit: 50 })
      ]);
      
      if (profRes.success) {
        setProfile(profRes.data.user);
        setIsAvailable(profRes.data.user.availability === 'available');
      }
      if (statsRes.success) setStats(statsRes.data.stats);
      if (missionsRes.success) setMissions(missionsRes.data.missions);
    } catch (error) {
      console.error('Failed to fetch volunteer data', error);
    } finally {
      setIsInitializing(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Setup Socket Listeners
  useEffect(() => {
    if (!socket || !isAuthenticated || user?.role !== 'volunteer') return;

    const handleEvent = () => {
      fetchData();
    };

    const events = [
      'mission:created', 'mission:accepted', 'mission:started', 
      'mission:on_site', 'mission:rescue_started', 'mission:progress', 
      'mission:completed'
    ];

    events.forEach(ev => socket.on(ev, handleEvent));

    return () => {
      events.forEach(ev => socket.off(ev, handleEvent));
    };
  }, [socket, isAuthenticated, user, fetchData]);

  const toggleAvailability = useCallback(async () => {
    try {
      const newAvail = isAvailable ? 'unavailable' : 'available';
      await volunteerService.updateAvailability(newAvail);
      setIsAvailable(!isAvailable);
    } catch (err) {
      console.error(err);
    }
  }, [isAvailable]);

  const acceptMission = useCallback(async (missionId) => {
    try {
      await missionService.acceptMission(missionId);
      await fetchData();
    } catch (err) {
      throw err;
    }
  }, [fetchData]);

  const updateMissionStatus = useCallback(async (missionId, newStatus) => {
    try {
      if (newStatus === 'En Route') {
        await missionService.startMission(missionId);
      } else if (newStatus === 'On Site') {
        await missionService.arriveAtSite(missionId);
      } else if (newStatus === 'Rescue In Progress') {
        await missionService.startRescue(missionId);
      } else if (newStatus === 'Completed') {
        await missionService.completeMission(missionId);
      }
      await fetchData();
    } catch (err) {
      throw err;
    }
  }, [fetchData]);

  const updateRescueProgress = useCallback(async (missionId, rescuedCount, notes, remainingCount, progressPercent) => {
    try {
      await missionService.updateMissionProgress(missionId, {
        peopleRescued: rescuedCount,
        notes: notes,
        peopleRemaining: remainingCount,
        progress: progressPercent
      });
      await fetchData();
    } catch (err) {
      throw err;
    }
  }, [fetchData]);

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <VolunteerContext.Provider value={{
      profile,
      stats,
      isAvailable,
      toggleAvailability,
      missions,
      activeMission: missions.find(m => m.status !== 'completed' && m.status !== 'assigned'),
      availableMissions: missions.filter(m => m.status === 'assigned'),
      completedMissions: missions.filter(m => m.status === 'completed'),
      notifications,
      acceptMission,
      updateMissionStatus,
      updateRescueProgress,
      markNotificationRead,
      markAllNotificationsRead,
      isInitializing,
      fetchData
    }}>
      {children}
    </VolunteerContext.Provider>
  );
};
