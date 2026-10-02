export const mockAdminUsers = [
  { id: 'USR-101', name: 'John Doe', email: 'john@example.com', role: 'Citizen', location: 'Guwahati', status: 'Active', joinedDate: '2026-01-15', lastActive: '2026-08-08T10:00:00Z', stats: { reportsSubmitted: 3 } },
  { id: 'USR-202', name: 'Sarah Jenkins', email: 'sarah@globalrelief.org', role: 'NGO', location: 'Assam', status: 'Active', joinedDate: '2025-11-20', lastActive: '2026-08-08T14:30:00Z', stats: { missionsCompleted: 14 } },
  { id: 'USR-303', name: 'Dr. Anita Roy', email: 'anita.roy@med.org', role: 'Volunteer', location: 'Guwahati', status: 'Pending Verification', joinedDate: '2026-08-07', lastActive: '2026-08-07T09:15:00Z', stats: { missionsCompleted: 0 } },
  { id: 'USR-404', name: 'Rajesh Kumar', email: 'rajesh.gov@nic.in', role: 'Government', location: 'Dispur', status: 'Active', joinedDate: '2024-05-10', lastActive: '2026-08-08T16:45:00Z', stats: { incidentsManaged: 56 } },
  { id: 'USR-505', name: 'System Admin', email: 'admin@adrras.gov.in', role: 'Admin', location: 'Delhi Data Center', status: 'Active', joinedDate: '2024-01-01', lastActive: '2026-08-08T17:00:00Z', stats: { actionsTaken: 1205 } },
  { id: 'USR-606', name: 'Unknown User', email: 'spammer@fake.com', role: 'Citizen', location: 'Unknown', status: 'Suspended', joinedDate: '2026-08-01', lastActive: '2026-08-02T11:00:00Z', stats: { reportsSubmitted: 0 } },
];

export const mockRolesAndPermissions = [
  { role: 'Admin', permissions: { incidents: true, resources: true, camps: true, analytics: true, users: true, settings: true } },
  { role: 'Government', permissions: { incidents: true, resources: true, camps: true, analytics: true, users: false, settings: false } },
  { role: 'NGO', permissions: { incidents: false, resources: true, camps: true, analytics: true, users: false, settings: false } },
  { role: 'Volunteer', permissions: { incidents: false, resources: false, camps: false, analytics: false, users: false, settings: false } },
  { role: 'Citizen', permissions: { incidents: false, resources: false, camps: false, analytics: false, users: false, settings: false } },
];

export const mockAdminLogs = [
  { id: 'LOG-8801', timestamp: '2026-08-08T16:50:00Z', user: 'Rajesh Kumar', role: 'Government', action: 'Assign Resource', module: 'Resources', description: 'Assigned Ambulance AMB-001 to Sector 4 Incident.', status: 'Success' },
  { id: 'LOG-8802', timestamp: '2026-08-08T15:30:00Z', user: 'System Admin', role: 'Admin', action: 'Verify NGO', module: 'Users', description: 'Verified Global Relief Initiative (REG-2021-99042).', status: 'Success' },
  { id: 'LOG-8803', timestamp: '2026-08-08T14:15:00Z', user: 'John Doe', role: 'Citizen', action: 'Submit Report', module: 'Incidents', description: 'Submitted new emergency report (Flooding in Area).', status: 'Success' },
  { id: 'LOG-8804', timestamp: '2026-08-08T10:00:00Z', user: 'Unknown User', role: 'Citizen', action: 'Login Attempt', module: 'Auth', description: 'Failed login attempt (Invalid Password).', status: 'Failed' },
  { id: 'LOG-8805', timestamp: '2026-08-07T09:00:00Z', user: 'Dr. Anita Roy', role: 'Volunteer', action: 'Complete Mission', module: 'Missions', description: 'Completed Medical Support mission at RC-014.', status: 'Success' },
];

export const mockSystemHealth = [
  { service: 'Frontend Interface', status: 'Operational', latency: '45ms', uptime: '99.99%' },
  { service: 'Backend API Gateway', status: 'Demo Status - Operational', latency: '120ms', uptime: '99.95%' },
  { service: 'Primary Database', status: 'Demo Status - Operational', latency: '15ms', uptime: '99.99%' },
  { service: 'Notification Service', status: 'Demo Status - Warning', latency: '850ms', uptime: '98.50%' },
  { service: 'Map Integration Service', status: 'Demo Status - Operational', latency: '210ms', uptime: '99.90%' },
  { service: 'Weather Intelligence API', status: 'Demo Status - Operational', latency: '180ms', uptime: '99.85%' }
];

export const mockAdminNotifications = [
  { id: 'AN-1', type: 'Security', title: 'Suspicious Login Activity', message: 'Multiple failed login attempts detected for user USR-606.', time: '1 hour ago', read: false },
  { id: 'AN-2', type: 'System', title: 'Notification Service Delay', message: 'High latency detected in SMS delivery gateway.', time: '3 hours ago', read: false },
  { id: 'AN-3', type: 'NGO', title: 'New NGO Registration', message: 'ReliefWorks India has applied for verification.', time: '1 day ago', read: true }
];
