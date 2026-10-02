export const mockAnalyticsIncidents = {
  total: 450,
  resolved: 380,
  active: 70,
  peopleAssisted: 12500,
  averageResponseTime: '18 mins',
  resourcesDeployed: 124,
  rescueMissions: 85,
  reliefCampsActive: 12
};

export const mockIncidentTrends = [
  { name: 'Week 1', reported: 45, verified: 40, resolved: 35 },
  { name: 'Week 2', reported: 60, verified: 55, resolved: 40 },
  { name: 'Week 3', reported: 120, verified: 110, resolved: 80 },
  { name: 'Week 4', reported: 90, verified: 85, resolved: 100 },
];

export const mockDisasterDistribution = [
  { name: 'Flood', value: 45, color: '#3b82f6' },
  { name: 'Fire', value: 25, color: '#f97316' },
  { name: 'Earthquake', value: 10, color: '#8b5cf6' },
  { name: 'Cyclone', value: 15, color: '#06b6d4' },
  { name: 'Landslide', value: 5, color: '#a8a29e' },
];

export const mockResponseTimes = [
  { name: 'Mon', avgTime: 22 },
  { name: 'Tue', avgTime: 18 },
  { name: 'Wed', avgTime: 24 },
  { name: 'Thu', avgTime: 15 },
  { name: 'Fri', avgTime: 19 },
  { name: 'Sat', avgTime: 14 },
  { name: 'Sun', avgTime: 16 },
];

export const mockResourceUtilization = [
  { name: 'Ambulance', available: 12, deployed: 45, busy: 18 },
  { name: 'Fire Brigade', available: 5, deployed: 20, busy: 10 },
  { name: 'Medical Teams', available: 8, deployed: 35, busy: 5 },
  { name: 'Rescue Boats', available: 20, deployed: 15, busy: 2 },
  { name: 'Volunteers', available: 150, deployed: 400, busy: 0 },
];

export const mockRegionalAnalytics = [
  { id: 'REG-1', region: 'Kamrup Metropolitan', incidents: 145, critical: 12, affected: 4500, assisted: 4100, responseTime: '14m', resolutionRate: '88%' },
  { id: 'REG-2', region: 'Dibrugarh', incidents: 85, critical: 5, affected: 2100, assisted: 1950, responseTime: '19m', resolutionRate: '92%' },
  { id: 'REG-3', region: 'Silchar', incidents: 110, critical: 18, affected: 5200, assisted: 4800, responseTime: '22m', resolutionRate: '81%' },
  { id: 'REG-4', region: 'Jorhat', incidents: 65, critical: 2, affected: 1100, assisted: 1100, responseTime: '16m', resolutionRate: '95%' },
];

export const mockRiskAreas = [
  { area: 'Brahmaputra Riverside', riskType: 'Flood', incidentCount: 42, risk: 'Critical', activeCases: 14 },
  { area: 'Guwahati Industrial Estate', riskType: 'Fire/Chemical', incidentCount: 12, risk: 'High', activeCases: 2 },
  { area: 'Shillong Highway', riskType: 'Landslide', incidentCount: 28, risk: 'High', activeCases: 5 },
  { area: 'Central Market', riskType: 'Building Collapse', incidentCount: 4, risk: 'Moderate', activeCases: 0 },
];

export const mockAnalyticsInsights = [
  "Flood incidents increased by 18% compared with the previous period.",
  "Average response time improved by 9% due to rapid ambulance dispatch.",
  "Medical resources are currently operating at 85% utilization.",
  "Three relief camps in Kamrup Metropolitan are approaching 90% capacity."
];
