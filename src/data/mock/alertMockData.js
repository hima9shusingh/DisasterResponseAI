export const mockEmergencyAlerts = [
  {
    id: 'ALT-2026-001',
    title: 'CRITICAL FLOOD WARNING',
    type: 'Flood',
    severity: 'Critical',
    location: 'Guwahati, Assam',
    description: 'Brahmaputra river water level has crossed the danger mark. Severe flooding expected in low-lying areas of Kamrup Metropolitan district over the next 12 hours.',
    instructions: '1. Move immediately to higher ground.\n2. Do not attempt to cross flooded roads.\n3. Gather emergency supplies and vital documents.\n4. Follow evacuation orders from local authorities.',
    issuedTime: '2026-08-08T20:30:00Z',
    startTime: '2026-08-08T21:00:00Z',
    endTime: '2026-08-09T09:00:00Z',
    status: 'Active'
  },
  {
    id: 'ALT-2026-002',
    title: 'High Wind Advisory',
    type: 'Weather',
    severity: 'Warning',
    location: 'Kolkata Coastal Areas',
    description: 'Strong winds reaching 50-60 km/h are expected along the coastal belt. Risk of uprooted trees and minor structural damage.',
    instructions: '1. Secure loose objects outdoors.\n2. Avoid parking under old trees.\n3. Fishermen are advised not to venture into the sea.',
    issuedTime: '2026-08-08T18:00:00Z',
    startTime: '2026-08-09T06:00:00Z',
    endTime: '2026-08-09T18:00:00Z',
    status: 'Scheduled'
  },
  {
    id: 'ALT-2026-003',
    title: 'Heatwave Alert',
    type: 'Weather',
    severity: 'Watch',
    location: 'Ranchi, Jharkhand',
    description: 'Temperatures expected to exceed 42°C for the next 3 days.',
    instructions: 'Stay hydrated. Avoid direct sunlight between 11 AM and 3 PM.',
    issuedTime: '2026-08-01T10:00:00Z',
    startTime: '2026-08-01T12:00:00Z',
    endTime: '2026-08-04T18:00:00Z',
    status: 'Resolved'
  }
];

export const mockAlertKpis = {
  active: 1,
  critical: 1,
  scheduled: 1,
  resolved: 15
};
