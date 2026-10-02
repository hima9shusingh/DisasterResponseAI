import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { reliefCampService } from '../services/reliefCampService';
import { incidentService } from '../services/incidentService';
import { resourceService } from '../services/resourceService';
import { rescueTeamService } from '../services/rescueTeamService';
import { missionService } from '../services/missionService';
import { alertService } from '../services/alertService';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const GovernmentContext = createContext();

export const useGovernment = () => useContext(GovernmentContext);

export const GovernmentProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { socket } = useSocket();
  
  const [incidents, setIncidents] = useState([]);
  const [resources, setResources] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [kpis, setKpis] = useState([]);
  const [activityTimeline, setActivityTimeline] = useState([]);
  const [chartData, setChartData] = useState({ incidentTrend: [], responseStatus: [] });

  // Camps state
  const [camps, setCamps] = useState([]);
  const [campAlerts] = useState([]); // Mock fallback for sub-pages
  const [campResidents] = useState([]); // Mock fallback for sub-pages
  const [nearbyServices] = useState([]); // Mock fallback for sub-pages

  // Emergency Alerts state
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [alertKpis, setAlertKpis] = useState({ resolved: 0 });

  // Active assignments mapping: incidentId -> array of assignment objects
  const [assignments, setAssignments] = useState(() => ({
    'INC-1024': [
      { id: 'a1', resourceType: 'Rescue Boat', team: 'RT-042', units: 1, eta: '10 mins', priority: 'Critical', status: 'On Site', assignedTime: new Date(Date.now() - 45 * 60000).toISOString() }
    ],
    'INC-1025': [
      { id: 'a2', resourceType: 'Fire Brigade', team: 'FB-012', units: 2, eta: '5 mins', priority: 'High', status: 'En Route', assignedTime: new Date(Date.now() - 15 * 60000).toISOString() }
    ],
    'INC-1028': [
      { id: 'a3', resourceType: 'NDRF', team: 'RT-055', units: 1, eta: '25 mins', priority: 'High', status: 'On Site', assignedTime: new Date(Date.now() - 200 * 60000).toISOString() }
    ]
  }));

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'government')) return;
    try {
      const [incRes, resRes, teamRes, alertRes, campsRes] = await Promise.all([
        incidentService.getIncidents({ page: 1, limit: 10 }),
        resourceService.getResources({ page: 1, limit: 50 }),
        rescueTeamService.getRescueTeams({ page: 1, limit: 50 }),
        alertService.getAlerts({ limit: 100 }),
        reliefCampService.getCamps({ limit: 50 })
      ]);
      
      const fetchedIncidents = incRes.success ? (incRes.data.incidents || []) : [];
      const fetchedResources = resRes.success ? (resRes.data.resources || []) : [];
      const fetchedTeams = teamRes.success ? (teamRes.data.teams || []) : [];
      const fetchedAlerts = alertRes.success ? (alertRes.data || []) : [];
      const fetchedCamps = campsRes.success ? (campsRes.data.camps || []) : [];

      setIncidents(fetchedIncidents);
      setResources(fetchedResources);
      setTeams(fetchedTeams);
      setCamps(fetchedCamps);

      // Compute basic KPIs
      const activeIncidentsCount = fetchedIncidents.filter(i => i.status !== 'resolved').length;
      const criticalCount = fetchedIncidents.filter(i => i.severity === 'critical').length;
      const totalDeployed = fetchedResources.filter(r => r.status === 'deployed').length;
      const activeTeamsCount = fetchedTeams.filter(t => t.status === 'assigned' || t.status === 'deployed').length;

      setKpis([
        { id: '1', title: 'Active Incidents', value: activeIncidentsCount.toString(), change: '+0', trend: 'up' },
        { id: '2', title: 'Critical Status', value: criticalCount.toString(), change: '-0', trend: 'down' },
        { id: '3', title: 'Resources Deployed', value: totalDeployed.toString(), change: '+0', trend: 'up' },
        { id: '4', title: 'Active Rescue Teams', value: activeTeamsCount.toString(), change: '+0', trend: 'up' }
      ]);
      
      const responseStatusData = [
        { name: 'Pending', value: fetchedIncidents.filter(i => i.status === 'pending').length },
        { name: 'Active', value: fetchedIncidents.filter(i => i.status === 'active').length },
        { name: 'Resolved', value: fetchedIncidents.filter(i => i.status === 'resolved' || i.status === 'closed').length }
      ];
      
      // Basic mock trend for now since we don't have historical data in the response directly
      // Ideally this would be fetched from analytics API
      const trendData = [
        { name: 'Mon', incidents: 2 },
        { name: 'Tue', incidents: 5 },
        { name: 'Wed', incidents: 3 },
        { name: 'Thu', incidents: fetchedIncidents.length },
      ];

      setChartData({
        incidentTrend: trendData,
        responseStatus: responseStatusData
      });

      if (alertRes.success) {
        setEmergencyAlerts(fetchedAlerts);
        // Compute basic KPIs
        const resolved = alertRes.data.filter(a => a.status === 'resolved').length;
        setAlertKpis({ resolved });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsInitializing(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Setup Socket Listeners
  useEffect(() => {
    if (!socket || !isAuthenticated || (user?.role !== 'admin' && user?.role !== 'government')) return;

    const handleEvent = () => {
      fetchDashboardData();
    };

    socket.on('incident:created', handleEvent);
    socket.on('incident:updated', handleEvent);
    socket.on('resource:assigned', handleEvent);

    return () => {
      socket.off('incident:created', handleEvent);
      socket.off('incident:updated', handleEvent);
      socket.off('resource:assigned', handleEvent);
    };
  }, [socket, isAuthenticated, user, fetchDashboardData]);

  const updateIncidentStatus = useCallback(async (incidentId, newStatus) => {
    try {
      await incidentService.updateIncidentStatus(incidentId, newStatus);
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [fetchDashboardData]);

  const assignResource = useCallback(async (incidentId, resourceData) => {
    try {
      await resourceService.assignResource(resourceData.id, incidentId, resourceData.units);
      await fetchDashboardData();
      
      setActivityTimeline(prev => [
        { 
          id: Date.now().toString(), 
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
          text: `Resource assigned to ${incidentId}`, 
          status: 'info' 
        },
        ...prev
      ]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [fetchDashboardData]);

  const updateAssignmentStatus = useCallback((incidentId, assignmentId, newStatus) => {
    // Left for local state mock
  }, []);

  const addResource = useCallback(async (resourceData) => {
    try {
      await resourceService.createResource(resourceData);
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [fetchDashboardData]);

  const updateResourceStatus = useCallback(async (resourceId, newStatus) => {
    try {
      await resourceService.updateResource(resourceId, { status: newStatus });
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [fetchDashboardData]);

  const updateTeamStatus = useCallback(async (teamId, newStatus) => {
    try {
      await rescueTeamService.updateRescueTeam(teamId, { status: newStatus });
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [fetchDashboardData]);

  const assignTeam = useCallback(async (teamId, incidentId, payload) => {
    try {
      let location = {};
      setIncidents(prev => {
        const inc = prev.find(i => i._id === incidentId || i.id === incidentId);
        if (inc && inc.location) location = inc.location;
        return prev;
      });

      // assignRescueTeam assigns the team, but mission creation does this too.
      // In our design, mission created/activated is the primary flow.
      await missionService.createMission({
        incidentId,
        teamId,
        priority: payload?.priority || 'normal',
        instructions: `Respond to incident ${incidentId}`,
        location
      });
      
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [fetchDashboardData]);

  const addCamp = useCallback((campData) => {
    setCamps(prev => [
      {
        id: `RC-0${prev.length + 20}`, // simple id gen
        occupancyPct: 0,
        occupied: 0,
        availableBeds: campData.capacity,
        status: 'Active',
        inventory: {
          food: { stock: `${campData.initialFoodStock} Meals`, dailyUsage: '0 Meals', daysRemaining: 99, status: 'Good' },
          water: { stock: `${campData.initialWaterStock} L`, dailyUsage: '0 L', daysRemaining: 99, status: 'Good' },
          medicine: { stock: campData.initialMedicineStock, dailyUsage: 'Low', daysRemaining: 99, status: 'Good' },
          blankets: { stock: '100', dailyUsage: '0', daysRemaining: 99, status: 'Good' },
        },
        ...campData
      },
      ...prev
    ]);
  }, []);

  const updateCamp = useCallback((campId, campData) => {
    setCamps(prev => prev.map(camp => {
      if (camp.id === campId) {
        const capacity = parseInt(campData.capacity, 10);
        const occupied = parseInt(campData.occupied, 10);
        const availableBeds = Math.max(0, capacity - occupied);
        let occupancyPct = capacity > 0 ? Math.round((occupied / capacity) * 100) : 0;
        
        let status = campData.status || camp.status;
        if (status !== 'Temporarily Closed') {
          if (occupancyPct >= 100) status = 'Full';
          else if (occupancyPct >= 85) status = 'Near Capacity';
          else status = 'Active';
        }

        return { 
          ...camp, 
          ...campData,
          capacity,
          occupied,
          availableBeds,
          occupancyPct,
          status
        };
      }
      return camp;
    }));
  }, []);

  const createEmergencyAlert = useCallback(async (alertData) => {
    try {
      await alertService.createAlert(alertData);
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  }, [fetchDashboardData]);

  const updateEmergencyAlert = useCallback(async (alertId, updates) => {
    try {
      if (updates.status === 'active') {
        await alertService.activateAlert(alertId);
      } else if (updates.status === 'resolved') {
        await alertService.resolveAlert(alertId);
      } else {
        await alertService.updateAlert(alertId, updates);
      }
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  }, [fetchDashboardData]);

  const deleteEmergencyAlert = useCallback(async (alertId) => {
    try {
      await alertService.deleteAlert(alertId);
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  }, [fetchDashboardData]);

  return (
    <GovernmentContext.Provider value={{
      incidents,
      resources,
      teams,
      kpis,
      camps,
      campAlerts,
      campResidents,
      nearbyServices,
      activityTimeline,
      chartData,
      assignments,
      updateIncidentStatus,
      assignResource,
      updateAssignmentStatus,
      addResource,
      updateResourceStatus,
      updateTeamStatus,
      assignTeam,
      addCamp,
      updateCamp,
      emergencyAlerts,
      alertKpis,
      createEmergencyAlert,
      updateEmergencyAlert,
      isInitializing,
      fetchDashboardData,
      deleteEmergencyAlert
    }}>
      {children}
    </GovernmentContext.Provider>
  );
};
