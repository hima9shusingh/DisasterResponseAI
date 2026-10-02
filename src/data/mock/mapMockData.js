export const mapIncidents = [
  { id: 'INC-2026-001', type: 'Flood', coords: [28.61, 77.21], severity: 'Critical', status: 'Rescue In Progress', location: 'Sector 4, Central District', reportedAt: '2026-08-08T10:00:00Z', peopleAffected: 150, assignedTeam: 'RT-042', eta: 'On Site' },
  { id: 'INC-2026-002', type: 'Fire', coords: [28.62, 77.20], severity: 'High', status: 'Resources Assigned', location: 'Industrial Area Phase 1', reportedAt: '2026-08-08T11:30:00Z', peopleAffected: 45, assignedTeam: 'FB-012', eta: '5 mins' },
  { id: 'INC-2026-003', type: 'Building Collapse', coords: [28.63, 77.22], severity: 'Critical', status: 'Pending Verification', location: 'Old Market Square', reportedAt: '2026-08-08T14:15:00Z', peopleAffected: 200, assignedTeam: null, eta: null },
  { id: 'INC-2026-004', type: 'Road Accident', coords: [28.60, 77.23], severity: 'Medium', status: 'Resolved', location: 'Highway 42 Junction', reportedAt: '2026-08-08T09:00:00Z', peopleAffected: 4, assignedTeam: 'AMB-05', eta: null },
  { id: 'INC-2026-005', type: 'Landslide', coords: [28.65, 77.18], severity: 'High', status: 'Rescue In Progress', location: 'North Hills, Sector 9', reportedAt: '2026-08-08T08:45:00Z', peopleAffected: 80, assignedTeam: 'NDRF-Alpha', eta: 'On Site' },
  { id: 'INC-2026-006', type: 'Flood', coords: [28.615, 77.215], severity: 'High', status: 'Verified', location: 'Sector 5, Central District', reportedAt: '2026-08-08T10:15:00Z', peopleAffected: 60, assignedTeam: null, eta: null },
  { id: 'INC-2026-007', type: 'Flood', coords: [28.605, 77.205], severity: 'Medium', status: 'Verified', location: 'Sector 3, Central District', reportedAt: '2026-08-08T10:30:00Z', peopleAffected: 20, assignedTeam: null, eta: null },
];

export const mapCamps = [
  { id: 'RC-012', name: 'Central High School Camp', coords: [28.62, 77.23], status: 'Active', capacity: 1000, occupied: 650, availableBeds: 350, food: 'Good', water: 'Good', medical: 'Available' },
  { id: 'RC-013', name: 'North Stadium Shelter', coords: [28.66, 77.19], status: 'Near Capacity', capacity: 2000, occupied: 1850, availableBeds: 150, food: 'Moderate', water: 'Good', medical: 'Limited' },
  { id: 'RC-014', name: 'West Community Hall', coords: [28.60, 77.18], status: 'Full', capacity: 500, occupied: 500, availableBeds: 0, food: 'Critical', water: 'Low', medical: 'Critical' },
];

export const mapServices = [
  { id: 'HOS-1', type: 'Hospital', name: 'City General Hospital', coords: [28.625, 77.210], status: 'Operational', distance: '1.2 km', contact: '102' },
  { id: 'HOS-2', type: 'Hospital', name: 'North District Medical', coords: [28.655, 77.195], status: 'Overloaded', distance: '3.4 km', contact: '102' },
  { id: 'POL-1', type: 'Police', name: 'Central Police Station', coords: [28.618, 77.212], status: 'Operational', distance: '0.8 km', contact: '100' },
  { id: 'FIR-1', type: 'Fire Station', name: 'HQ Fire Station', coords: [28.622, 77.218], status: 'Operational', distance: '1.5 km', contact: '101' },
];

export const riskZones = [
  { id: 'Z-1', type: 'High Risk', name: 'Flood Zone A', center: [28.61, 77.21], radius: 1500, color: '#ef4444' }, // 1.5km
  { id: 'Z-2', type: 'Moderate Risk', name: 'Flood Warning Zone', center: [28.61, 77.21], radius: 3000, color: '#f97316' }, // 3km
];
