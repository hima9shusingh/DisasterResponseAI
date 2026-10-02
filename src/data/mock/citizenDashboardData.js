export const mockProfile = {
  id: 'CIT-99421',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '+1 555-0198',
  city: 'Riverdale',
  address: '42 Maple Street, Sector 4, Riverdale',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
};

export const mockEmergencyContacts = [
  { id: 'EC1', name: 'John Doe', relationship: 'Spouse', phone: '+1 555-0200', isPrimary: true },
  { id: 'EC2', name: 'Martha Smith', relationship: 'Mother', phone: '+1 555-0211', isPrimary: false }
];

export const mockMyReports = [
  {
    id: 'INC-2026-00124',
    type: 'Flood',
    location: '42 Maple Street, Sector 4, Riverdale',
    coords: [28.6139, 77.2090],
    severity: 'Critical',
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: 'Rescue In Progress', // Pending Verification, Verified, Resources Assigned, Rescue In Progress, Resolved
    assignedTeam: {
      id: 'RT-042',
      name: 'Flood Rescue Team 04',
      type: 'NDRF Boat Unit',
      members: 6,
      status: 'En Route',
      eta: '12 minutes',
      coords: [28.6100, 77.2000] // Nearby
    },
    peopleAffected: 4,
    description: 'Water has entered the ground floor. Cannot evacuate safely due to strong currents.',
    evidence: [
      { id: 'e1', type: 'image', url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=400' }
    ],
    timeline: [
      { id: 't1', stage: 'Report Submitted', time: new Date(Date.now() - 120 * 60000).toISOString(), completed: true },
      { id: 't2', stage: 'Incident Verified', time: new Date(Date.now() - 110 * 60000).toISOString(), completed: true },
      { id: 't3', stage: 'Resources Assigned', time: new Date(Date.now() - 90 * 60000).toISOString(), completed: true },
      { id: 't4', stage: 'Rescue Team En Route', time: new Date(Date.now() - 45 * 60000).toISOString(), completed: true },
      { id: 't5', stage: 'Rescue In Progress', time: null, completed: false },
      { id: 't6', stage: 'Resolved', time: null, completed: false }
    ]
  },
  {
    id: 'INC-2026-00089',
    type: 'Fire',
    location: '12 Oak Avenue, Riverdale',
    coords: [28.6250, 77.2150],
    severity: 'Medium',
    reportedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'Resolved',
    assignedTeam: null,
    peopleAffected: 0,
    description: 'Small electrical fire near the transformer. Safely evacuated.',
    evidence: [],
    timeline: [
      { id: 't1', stage: 'Report Submitted', time: new Date(Date.now() - 48 * 3600000).toISOString(), completed: true },
      { id: 't2', stage: 'Incident Verified', time: new Date(Date.now() - 47.5 * 3600000).toISOString(), completed: true },
      { id: 't3', stage: 'Resources Assigned', time: new Date(Date.now() - 47 * 3600000).toISOString(), completed: true },
      { id: 't4', stage: 'Rescue Team En Route', time: new Date(Date.now() - 46.5 * 3600000).toISOString(), completed: true },
      { id: 't5', stage: 'Rescue In Progress', time: new Date(Date.now() - 46 * 3600000).toISOString(), completed: true },
      { id: 't6', stage: 'Resolved', time: new Date(Date.now() - 45 * 3600000).toISOString(), completed: true }
    ]
  }
];

export const mockCitizenNotifications = [
  { id: 'N1', type: 'Response', title: 'Rescue Team En Route', message: 'Team RT-042 has been dispatched to your location. ETA: 12 minutes.', time: '45 mins ago', read: false, link: '/citizen/reports/INC-2026-00124' },
  { id: 'N2', type: 'Emergency', title: 'Heavy Rainfall Warning', message: 'Severe rainfall expected in Riverdale for the next 24 hours. Stay indoors.', time: '2 hours ago', read: false, link: null },
  { id: 'N3', type: 'Relief', title: 'Relief Camp Update', message: 'Camp RC-012 (Central High School) has 80 beds available.', time: '5 hours ago', read: true, link: null },
  { id: 'N4', type: 'System', title: 'Report Verified', message: 'Your emergency report INC-2026-00124 has been verified by command.', time: '1 hour 50 mins ago', read: true, link: '/citizen/reports/INC-2026-00124' },
];

export const mockSafetyStatus = {
  status: 'High Risk', // Safe, Caution, High Risk, Emergency
  reason: 'Severe flooding reported in your immediate vicinity (Sector 4).',
  lastUpdated: new Date().toISOString(),
};

export const mockCitizenWeather = {
  temperature: '26°C',
  condition: 'Heavy Rain',
  rain: '45mm/h',
  humidity: '88%',
  wind: '42 km/h',
  alert: 'Flood Warning Active'
};
