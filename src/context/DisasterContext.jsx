import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DisasterContext = createContext();

export const useDisaster = () => useContext(DisasterContext);

// Utility for creating coords
const generateCoords = () => ({ x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) });

const calculateDistance = (c1, c2) => {
  if (!c1 || !c2) return 999;
  return Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2)).toFixed(1);
};

// Priority Calculation Engine
const calculatePriority = (severity, peopleAffected, isEmergency = false) => {
  let severityScore = 1;
  const s = severity?.toLowerCase() || '';
  if (s === 'medium') severityScore = 2;
  if (s === 'high' || s === 'critical') severityScore = 3;

  let score = (severityScore * 20) + (peopleAffected || 0);
  if (isEmergency) score = Math.floor(score * 1.5); // Boost in emergency mode

  let label = 'Low';
  if (score >= 80) label = 'Critical';
  else if (score >= 50) label = 'High';
  else if (score >= 20) label = 'Medium';

  return { priorityScore: score, priorityLabel: label };
};

export const DisasterProvider = ({ children }) => {
  // Global States
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [systemToasts, setSystemToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setSystemToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setSystemToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const [incidents, setIncidents] = useState(() => {
    // We clear localStorage to avoid schema mismatches with older versions
    return [
      { id: 1, type: 'Fire', location: 'Downtown Hub', severity: 'High', status: 'Active', peopleAffected: 45, priorityScore: 105, priorityLabel: 'Critical', timestamp: new Date().toISOString(), coords: generateCoords(), timeline: [{stage: 'Created', time: new Date().toISOString()}, {stage: 'Assigned', time: new Date().toISOString()}] },
      { id: 2, type: 'Flood', location: 'Riverside District', severity: 'Medium', status: 'Pending', peopleAffected: 120, priorityScore: 160, priorityLabel: 'Critical', timestamp: new Date().toISOString(), coords: generateCoords(), timeline: [{stage: 'Created', time: new Date().toISOString()}] },
      { id: 3, type: 'Accident', location: 'Highway 101', severity: 'Low', status: 'Resolved', peopleAffected: 2, priorityScore: 22, priorityLabel: 'Medium', timestamp: new Date().toISOString(), coords: generateCoords(), timeline: [{stage: 'Created', time: new Date().toISOString()}, {stage: 'Resolved', time: new Date().toISOString()}] },
    ];
  });

  const [decisionLogs, setDecisionLogs] = useState(() => {
    return [{ id: Date.now(), time: new Date().toLocaleTimeString(), message: "System Initialized: Advanced Simulation Engine Active." }];
  });

  const [resources, setResources] = useState(() => {
    return [
      { id: 1, type: 'Ambulance', name: 'Unit A-01', status: 'On Duty', battery: 85, location: 'Downtown Hub', coords: generateCoords() },
      { id: 2, type: 'Rescue Team', name: 'Alpha Squad', status: 'Available', members: 8, location: 'Central Station', coords: generateCoords() },
      { id: 3, type: 'Supply Unit', name: 'Support-05', status: 'Available', capacity: '80%', location: 'Base Warehouse', coords: generateCoords() },
      { id: 4, type: 'Ambulance', name: 'Unit B-12', status: 'Maintenance', battery: 12, location: 'Repair Bay', coords: generateCoords() },
    ];
  });

  const [allocations, setAllocations] = useState(() => {
    return [
      { id: 1, incidentId: 1, resourceId: 1, timestamp: new Date().toISOString(), distance: 2.5 }
    ];
  });

  const [analytics, setAnalytics] = useState({ totalHandled: 3, totalResolved: 1, sumResponseTime: 12 });

  const addLog = useCallback((message) => {
    setDecisionLogs(prev => {
      const updated = [{ id: Date.now() + Math.random(), time: new Date().toLocaleTimeString(), message }, ...prev];
      return updated.slice(0, 50);
    });
  }, []);

  useEffect(() => {
    // Recalculate priorities whenever emergency mode changes
    setIncidents(prev => prev.map(inc => {
      const p = calculatePriority(inc.severity, inc.peopleAffected, emergencyMode);
      return { ...inc, priorityScore: p.priorityScore, priorityLabel: p.priorityLabel };
    }));
    if (emergencyMode) {
      addLog("EMERGENCY MODE ACTIVATED: Priority scoring increased.");
      addToast("Emergency Mode Activated", "error");
    } else {
      addLog("Emergency Mode Deactivated: Normal operations resumed.");
    }
  }, [emergencyMode]);



  const addIncidentTimelineStage = (inc, stage) => {
    return [...(inc.timeline || []), { stage, time: new Date().toISOString() }];
  };

  // Auto Allocate Logic & Rebalancing
  const autoAllocate = useCallback(() => {
    let currentResources = [...resources];
    let currentIncidents = [...incidents];
    let currentAllocations = [...allocations];
    let changesMade = false;

    // Get pending incidents sorted by priority
    const pendingIncidents = currentIncidents
      .filter(inc => inc.status === 'Pending')
      .sort((a, b) => b.priorityScore - a.priorityScore);

    pendingIncidents.forEach(incident => {
      // Find nearest available resource
      const availableResourcesList = currentResources.filter(res => res.status === 'Available');
      
      let targetResource = null;
      let minDistance = Infinity;

      if (availableResourcesList.length > 0) {
        // Distance based allocation
        availableResourcesList.forEach(res => {
          const dist = calculateDistance(incident.coords, res.coords);
          if (dist < minDistance) {
            minDistance = parseFloat(dist);
            targetResource = res;
          }
        });
      }

      // REBALANCING: Steal resource if critical and no available resources
      if (!targetResource && incident.priorityLabel === 'Critical') {
        const lowerPriorityActiveIncidents = currentIncidents.filter(inc2 => 
           (inc2.status === 'Assigned' || inc2.status === 'Active') && 
           inc2.priorityScore < incident.priorityScore - 30 // Threshold to steal
        );

        if (lowerPriorityActiveIncidents.length > 0) {
          const stolenIncident = lowerPriorityActiveIncidents[0]; // pick first we can steal from
          const allocToSteal = currentAllocations.find(a => a.incidentId === stolenIncident.id);
          if (allocToSteal) {
            targetResource = currentResources.find(r => r.id === allocToSteal.resourceId);
            minDistance = parseFloat(calculateDistance(incident.coords, targetResource.coords));
            
            // Revert stolen incident to pending
            const stolenIndex = currentIncidents.findIndex(i => i.id === stolenIncident.id);
            currentIncidents[stolenIndex] = { ...stolenIncident, status: 'Pending', timeline: addIncidentTimelineStage(stolenIncident, 'Re-queued') };
            currentAllocations = currentAllocations.filter(a => a.id !== allocToSteal.id);
            
            addLog(`Rebalancing: Resource ${targetResource.name} redirected from lower priority incident to ${incident.location}`);
            addToast(`Resource reallocated to critical incident`, 'info');
          }
        }
      }

      if (targetResource) {
        // Allocate it
        currentAllocations.push({
          id: Date.now() + Math.floor(Math.random() * 1000),
          incidentId: incident.id,
          resourceId: targetResource.id,
          timestamp: new Date().toISOString(),
          distance: minDistance
        });

        const resIndex = currentResources.findIndex(r => r.id === targetResource.id);
        currentResources[resIndex] = { ...targetResource, status: 'On Duty', coords: incident.coords }; // Update location
        
        const incidentIndex = currentIncidents.findIndex(inc => inc.id === incident.id);
        currentIncidents[incidentIndex] = { 
          ...currentIncidents[incidentIndex], 
          status: 'Assigned',
          timeline: addIncidentTimelineStage(currentIncidents[incidentIndex], 'Assigned')
        };
        
        addLog(`Nearest resource ${targetResource.name} assigned to ${incident.location} (Dist: ${minDistance}km)`);
        changesMade = true;
      } else {
        if (!incident.loggedWait) {
          addLog(`No resources available; routing incident at ${incident.location} to waiting queue`);
          const incidentIndex = currentIncidents.findIndex(inc => inc.id === incident.id);
          currentIncidents[incidentIndex] = { ...incident, loggedWait: true };
          changesMade = true;
        }
      }
    });

    if (changesMade) {
      setResources(currentResources);
      setIncidents(currentIncidents);
      setAllocations(currentAllocations);
    }
  }, [resources, incidents, allocations, addLog, addToast]);

  useEffect(() => {
    autoAllocate();
  }, [incidents.length, resources.filter(r => r.status === 'Available').length]);

  // Simulation Ticking Engine
  const tickSimulation = useCallback(() => {
    let resolvedIds = [];
    let currentIncidents = [...incidents];
    let changed = false;

    const resolveTimeThreshold = emergencyMode ? 6 : 15; // Faster in emergency mode

    currentIncidents = currentIncidents.map(inc => {
      if (inc.status === 'Active') {
        const age = inc.activeTime || 0;
        if (age >= resolveTimeThreshold) {
          resolvedIds.push({ id: inc.id, location: inc.location });
          changed = true;
          return { ...inc, status: 'Resolved', activeTime: age + 1, timeline: addIncidentTimelineStage(inc, 'Resolved') };
        }
        changed = true;
        return { ...inc, activeTime: age + 1 };
      }
      return inc;
    });

    if (resolvedIds.length > 0) {
      let currentResources = [...resources];
      resolvedIds.forEach(({ id, location }) => {
        addLog(`Incident resolved successfully at ${location}`);
        addToast(`Incident at ${location} resolved`, 'success');
        
        setAnalytics(prev => ({
           ...prev, 
           totalResolved: prev.totalResolved + 1,
           sumResponseTime: prev.sumResponseTime + resolveTimeThreshold
        }));

        const alloc = allocations.find(a => a.incidentId === id);
        if (alloc) {
           const allocIndex = currentResources.findIndex(r => r.id === alloc.resourceId);
           if (allocIndex !== -1) {
             currentResources[allocIndex] = { ...currentResources[allocIndex], status: 'Available' };
           }
        }
      });
      setResources(currentResources);
    }

    if (changed) {
      setIncidents(currentIncidents);
    }
  }, [incidents, resources, allocations, addLog, emergencyMode, addToast]);

  useEffect(() => {
    const timer = setInterval(() => tickSimulation(), 1000);
    return () => clearInterval(timer);
  }, [tickSimulation]);

  const addIncident = (incident) => {
    const coords = generateCoords();
    const { priorityScore, priorityLabel } = calculatePriority(incident.severity, incident.peopleAffected || 0, emergencyMode);
    const newIncident = {
      ...incident,
      id: Date.now(),
      status: 'Pending',
      priorityScore,
      priorityLabel,
      coords,
      timestamp: new Date().toISOString(),
      timeline: [{stage: 'Created', time: new Date().toISOString()}]
    };
    addLog(`${incident.severity} priority incident detected at ${incident.location}`);
    addToast('New incident broadcasted', 'warning');
    
    setAnalytics(prev => ({ ...prev, totalHandled: prev.totalHandled + 1 }));
    setIncidents(prev => [newIncident, ...prev]);
  };

  const updateIncidentStatus = (id, status) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return { ...inc, status, timeline: addIncidentTimelineStage(inc, status) };
      }
      return inc;
    }));
  };

  // Manual allocation override
  const allocateResource = (incidentId, resourceId) => {
    let currentAllocations = [...allocations];
    let currentResources = [...resources];
    let currentIncidents = [...incidents];
    
    // Check if resource is currently assigned somewhere else (Manual Override)
    const existingAllocIndex = currentAllocations.findIndex(a => a.resourceId === resourceId);
    if (existingAllocIndex !== -1) {
       const oldIncId = currentAllocations[existingAllocIndex].incidentId;
       currentAllocations.splice(existingAllocIndex, 1);
       const oldIncIdx = currentIncidents.findIndex(i => i.id === oldIncId);
       if(oldIncIdx !== -1) {
           currentIncidents[oldIncIdx] = { ...currentIncidents[oldIncIdx], status: 'Pending', timeline: addIncidentTimelineStage(currentIncidents[oldIncIdx], 'Re-queued') };
           addLog(`Manual Override: Resource taken from incident at ${currentIncidents[oldIncIdx].location}`);
       }
    }

    const incident = currentIncidents.find(i => i.id === incidentId);
    const resource = currentResources.find(r => r.id === resourceId);
    const distance = calculateDistance(incident.coords, resource.coords);

    const newAllocation = {
      id: Date.now(),
      incidentId,
      resourceId,
      timestamp: new Date().toISOString(),
      distance
    };

    setAllocations([...currentAllocations, newAllocation]);
    setResources(currentResources.map(res => res.id === resourceId ? { ...res, status: 'On Duty', coords: incident.coords } : res));
    setIncidents(currentIncidents.map(inc => inc.id === incidentId ? { ...inc, status: 'Assigned', timeline: addIncidentTimelineStage(inc, 'Assigned') } : inc));
    addToast('Manual deployment successful', 'success');
  };

  return (
    <DisasterContext.Provider value={{ 
      incidents, 
      resources, 
      allocations, 
      decisionLogs,
      emergencyMode,
      setEmergencyMode,
      systemToasts,
      analytics,
      addIncident, 
      updateIncidentStatus, 
      allocateResource 
    }}>
      {children}
    </DisasterContext.Provider>
  );
};
