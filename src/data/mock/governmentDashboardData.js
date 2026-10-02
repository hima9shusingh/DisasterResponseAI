export const mockKpis = [
  { id: 'k1', title: 'Active Incidents', value: '124', icon: 'AlertTriangle', change: '+12%', isPositive: false },
  { id: 'k2', title: 'Critical Incidents', value: '18', icon: 'Flame', change: '+2', isPositive: false },
  { id: 'k3', title: 'Rescue Operations', value: '47', icon: 'LifeBuoy', change: '+5%', isPositive: true },
  { id: 'k4', title: 'Resources Deployed', value: '286', icon: 'Truck', change: '+15%', isPositive: true },
  { id: 'k5', title: 'Relief Camps', value: '63', icon: 'Tent', change: '0%', isPositive: true },
  { id: 'k6', title: 'People Assisted', value: '18,540', icon: 'Users', change: '+840', isPositive: true },
];

export const mockIncidents = [
  {
    id: 'INC-1024',
    type: 'Flood',
    location: 'Riverdale District, Sector 4',
    district: 'Riverdale',
    state: 'North State',
    coords: [28.6139, 77.2090],
    severity: 'Critical',
    peopleAffected: 1500,
    reportedTime: '2 hours ago',
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'Rescue In Progress',
    team: 'RT-042',
    contactNumber: '+1 555-0198',
    reporterName: 'John Doe',
    description: 'Heavy rainfall has caused the river to overflow, trapping several families in Sector 4. Immediate boat rescue required.',
    evidence: [
      { id: 'e1', type: 'image', url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=400' },
      { id: 'e2', type: 'video', url: 'https://images.unsplash.com/photo-1460595304381-8077b9ce1d34?auto=format&fit=crop&q=80&w=400' }
    ],
    timeline: [
      { id: 't1', stage: 'Pending Verification', time: new Date(Date.now() - 120 * 60000).toISOString(), actor: 'System', action: 'Incident Reported' },
      { id: 't2', stage: 'Verified', time: new Date(Date.now() - 110 * 60000).toISOString(), actor: 'CMD-994', action: 'Incident Verified' },
      { id: 't3', stage: 'Resources Assigned', time: new Date(Date.now() - 90 * 60000).toISOString(), actor: 'CMD-994', action: 'Assigned RT-042' },
      { id: 't4', stage: 'Rescue In Progress', time: new Date(Date.now() - 45 * 60000).toISOString(), actor: 'RT-042', action: 'Rescue Started' }
    ]
  },
  {
    id: 'INC-1025',
    type: 'Fire',
    location: 'Industrial Park, Block C',
    district: 'Westside',
    state: 'North State',
    coords: [28.6250, 77.2150],
    severity: 'High',
    peopleAffected: 300,
    reportedTime: '4 hours ago',
    reportedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'Resources Assigned',
    team: 'FB-012',
    contactNumber: '+1 555-0211',
    reporterName: 'Security Desk',
    description: 'Chemical fire outbreak in warehouse C. Toxic fumes reported. Evacuation of nearby blocks required.',
    evidence: [
      { id: 'e3', type: 'image', url: 'https://images.unsplash.com/photo-1602844287823-39d67fbabeb5?auto=format&fit=crop&q=80&w=400' }
    ],
    timeline: [
      { id: 't1', stage: 'Pending Verification', time: new Date(Date.now() - 240 * 60000).toISOString(), actor: 'System', action: 'Incident Reported' },
      { id: 't2', stage: 'Verified', time: new Date(Date.now() - 230 * 60000).toISOString(), actor: 'CMD-994', action: 'Incident Verified' },
      { id: 't3', stage: 'Resources Assigned', time: new Date(Date.now() - 180 * 60000).toISOString(), actor: 'CMD-994', action: 'Assigned FB-012' }
    ]
  },
  {
    id: 'INC-1026',
    type: 'Earthquake',
    location: 'Mountain View, North Ridge',
    district: 'North Ridge',
    state: 'Highland State',
    coords: [28.6000, 77.1900],
    severity: 'Critical',
    peopleAffected: 4200,
    reportedTime: '1 day ago',
    reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'Verified',
    team: 'Multiple',
    contactNumber: '+1 555-0844',
    reporterName: 'Seismic Alert System',
    description: 'Magnitude 6.2 earthquake. Multiple building collapses reported. Power grid offline.',
    evidence: [],
    timeline: [
      { id: 't1', stage: 'Pending Verification', time: new Date(Date.now() - 24 * 3600000).toISOString(), actor: 'System', action: 'Incident Reported' },
      { id: 't2', stage: 'Verified', time: new Date(Date.now() - 23.5 * 3600000).toISOString(), actor: 'CMD-994', action: 'Incident Verified' }
    ]
  }
];

export const mockAlerts = [
  { id: 'A1', type: 'FLASH FLOOD WARNING', message: 'High-risk flood zone detected in Riverdale.', severity: 'critical', time: '10 mins ago' },
  { id: 'A2', type: 'CYCLONE ALERT', message: 'Strong winds expected near Coastal Area.', severity: 'warning', time: '1 hour ago' },
  { id: 'A3', type: 'ROAD CLOSURE', message: 'Hillside Highway blocked due to landslide.', severity: 'info', time: '3 hours ago' },
  { id: 'A4', type: 'MEDICAL SHORTAGE', message: 'Camp RC-012 requires additional medical supplies.', severity: 'warning', time: '4 hours ago' }
];

export const mockResources = [
  { id: 'RES-001', type: 'Ambulance', department: 'Health Dept', location: 'City Hospital', available: 24, deployed: 18, total: 42, busy: 0, status: 'Available', contactPerson: 'Dr. Sarah Lee', contactNumber: '+1 555-0101' },
  { id: 'RES-002', type: 'Fire Brigade', department: 'Fire Dept', location: 'Station 4', available: 8, deployed: 22, total: 30, busy: 0, status: 'Partially Available', contactPerson: 'Chief Miller', contactNumber: '+1 555-0102' },
  { id: 'RES-003', type: 'Police Units', department: 'City Police', location: 'Central Precinct', available: 45, deployed: 105, total: 150, busy: 0, status: 'Deployed', contactPerson: 'Officer Davis', contactNumber: '+1 555-0103' },
];

export const mockRescueTeams = [
  { id: 'T1', name: 'RT-042', type: 'Rescue Boat', department: 'Coast Guard', location: 'Riverdale District', coords: [28.6139, 77.2090], members: 12, leader: 'Lt. Harris', contact: '+1 555-0201', mission: 'Evacuating stranded families', assignedIncident: 'INC-1024', status: 'On Mission' },
  { id: 'T2', name: 'FB-012', type: 'Fire Brigade', department: 'Fire Dept', location: 'Industrial Park', coords: [28.6250, 77.2150], members: 8, leader: 'Capt. Morgan', contact: '+1 555-0202', mission: 'Containing chemical fire', assignedIncident: 'INC-1025', status: 'On Mission' },
];

export const mockWeather = {
  temperature: '28°C',
  rainfall: '45mm/h',
  humidity: '85%',
  windSpeed: '42 km/h',
  visibility: '1.2 km',
  warning: 'Heavy Rain Alert: Expected rainfall may affect low-lying areas.'
};

export const mockTimeline = [
  { id: 't1', time: '10:42 PM', text: 'Rescue Team RT-042 assigned to INC-1024', status: 'success' },
  { id: 't2', time: '10:36 PM', text: 'New critical flood incident reported in Riverdale', status: 'critical' },
  { id: 't3', time: '10:21 PM', text: 'Ambulance AMB-18 deployed to Sector 4', status: 'info' },
  { id: 't4', time: '10:04 PM', text: 'Relief Camp Community Center reached 84% capacity', status: 'warning' },
  { id: 't5', time: '09:45 PM', text: 'Daily situation report generated', status: 'success' },
];

export const mockChartData = {
  incidentTrend: [
    { name: 'Mon', incidents: 40 },
    { name: 'Tue', incidents: 30 },
    { name: 'Wed', incidents: 45 },
    { name: 'Thu', incidents: 80 },
    { name: 'Fri', incidents: 124 },
    { name: 'Sat', incidents: 110 },
    { name: 'Sun', incidents: 95 },
  ],
  responseStatus: [
    { name: 'Pending', value: 18 },
    { name: 'Assigned', value: 42 },
    { name: 'In Progress', value: 65 },
    { name: 'Resolved', value: 120 },
  ]
};

export const mockResourceAlerts = [
  { id: 'RA1', severity: 'Critical', message: 'Low Ambulance Availability', location: 'City Hospital', time: '10 mins ago' },
  { id: 'RA2', severity: 'Warning', message: 'Medical Supply Shortage', location: 'Camp RC-012', time: '1 hour ago' },
];

export const mockUtilizationData = {
  deploymentByType: [
    { name: 'Ambulance', deployed: 18, available: 24 },
    { name: 'Fire', deployed: 22, available: 8 },
    { name: 'Police', deployed: 105, available: 45 },
  ],
};

/* --- NEW RELIEF CAMP DATA --- */

export const mockReliefCamps = [
  { 
    id: 'RC-012', 
    name: 'Central High School', 
    address: '142 Education Lane, Downtown',
    district: 'Riverdale',
    state: 'North State',
    location: 'Downtown',
    coords: [28.6120, 77.2000], 
    capacity: 1000, 
    occupied: 920,
    availableBeds: 80,
    occupancyPct: 92,
    contactPerson: 'Principal Skinner',
    contactNumber: '+1 555-8901',
    status: 'Near Capacity', // Active, Near Capacity, Full, Temporarily Closed
    inventory: {
      food: { stock: '1,200 Meals', dailyUsage: '920 Meals', daysRemaining: 1.3, status: 'Low' },
      water: { stock: '4,500 L', dailyUsage: '2,760 L', daysRemaining: 1.6, status: 'Low' },
      medicine: { stock: 'Good', dailyUsage: 'Stable', daysRemaining: 5, status: 'Good' },
      blankets: { stock: '800', dailyUsage: '50', daysRemaining: 16, status: 'Moderate' },
    },
    medicalSupport: {
      doctors: 4,
      nurses: 12,
      volunteers: 20,
      ambulances: 1,
      beds: 50,
      status: 'Available' // Available, Limited, Critical
    }
  },
  { 
    id: 'RC-014', 
    name: 'Community Center', 
    address: '55 Park Ave, West End',
    district: 'Westside',
    state: 'North State',
    location: 'West End', 
    coords: [28.6250, 77.1950], 
    capacity: 500, 
    occupied: 500,
    availableBeds: 0,
    occupancyPct: 100,
    contactPerson: 'Mayor Quimby',
    contactNumber: '+1 555-8902',
    status: 'Full',
    inventory: {
      food: { stock: '3,000 Meals', dailyUsage: '500 Meals', daysRemaining: 6, status: 'Good' },
      water: { stock: '5,000 L', dailyUsage: '1,500 L', daysRemaining: 3.3, status: 'Moderate' },
      medicine: { stock: 'Critical', dailyUsage: 'High', daysRemaining: 1, status: 'Critical' },
      blankets: { stock: '500', dailyUsage: '0', daysRemaining: 30, status: 'Good' },
    },
    medicalSupport: {
      doctors: 1,
      nurses: 3,
      volunteers: 5,
      ambulances: 0,
      beds: 10,
      status: 'Critical'
    }
  },
  { 
    id: 'RC-021', 
    name: 'Sports Arena', 
    address: 'Arena Blvd, North District',
    district: 'North Ridge',
    state: 'Highland State',
    location: 'North District', 
    coords: [28.6400, 77.2100], 
    capacity: 2500, 
    occupied: 1200, 
    availableBeds: 1300,
    occupancyPct: 48,
    contactPerson: 'Coach Carter',
    contactNumber: '+1 555-8903',
    status: 'Active',
    inventory: {
      food: { stock: '10,000 Meals', dailyUsage: '1,200 Meals', daysRemaining: 8.3, status: 'Good' },
      water: { stock: '20,000 L', dailyUsage: '3,600 L', daysRemaining: 5.5, status: 'Good' },
      medicine: { stock: 'Good', dailyUsage: 'Low', daysRemaining: 14, status: 'Good' },
      blankets: { stock: '2,000', dailyUsage: '100', daysRemaining: 20, status: 'Good' },
    },
    medicalSupport: {
      doctors: 10,
      nurses: 25,
      volunteers: 50,
      ambulances: 3,
      beds: 100,
      status: 'Available'
    }
  }
];

export const mockCampAlerts = [
  { id: 'CA1', severity: 'Warning', camp: 'RC-012', message: 'Water supply expected to run low in 1.6 days.', time: '30 mins ago' },
  { id: 'CA2', severity: 'Critical', camp: 'RC-014', message: 'Medical inventory critically low.', time: '1 hour ago' },
  { id: 'CA3', severity: 'Info', camp: 'RC-021', message: 'Requires additional volunteers for registration desk.', time: '3 hours ago' }
];

export const mockCampResidents = [
  { id: 'RES-9901', name: 'A*** S***', ageGroup: 'Adult', familySize: 4, registrationTime: '2026-08-07T14:30:00Z', medicalReq: 'None', status: 'Sheltered' },
  { id: 'RES-9902', name: 'M*** D***', ageGroup: 'Senior', familySize: 1, registrationTime: '2026-08-07T15:45:00Z', medicalReq: 'Diabetic Medication', status: 'Under Observation' },
  { id: 'RES-9903', name: 'J*** L***', ageGroup: 'Child', familySize: 3, registrationTime: '2026-08-08T09:15:00Z', medicalReq: 'None', status: 'Sheltered' },
  { id: 'RES-9904', name: 'R*** P***', ageGroup: 'Adult', familySize: 2, registrationTime: '2026-08-08T11:20:00Z', medicalReq: 'First Aid (Minor cuts)', status: 'Treated' },
];

export const mockNearbyServices = [
  { id: 'NS1', type: 'Hospital', name: 'City General Hospital', distance: '1.2 km', contact: '+1 555-1001', status: 'Operational' },
  { id: 'NS2', type: 'Police', name: 'Precinct 44', distance: '2.5 km', contact: '+1 555-1002', status: 'Operational' },
  { id: 'NS3', type: 'Fire Station', name: 'Engine 9', distance: '3.0 km', contact: '+1 555-1003', status: 'Busy' },
  { id: 'NS4', type: 'Ambulance', name: 'Metro EMT Base', distance: '1.8 km', contact: '+1 555-1004', status: 'Operational' }
];
