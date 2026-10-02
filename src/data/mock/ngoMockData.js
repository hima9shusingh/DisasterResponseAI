export const mockNGOProfile = {
  id: 'NGO-8821',
  name: 'Global Relief Initiative',
  registrationId: 'REG-2021-99042',
  contactPerson: 'Sarah Jenkins',
  email: 'coordinator@globalrelief.org',
  phone: '+91 98765 00000',
  operatingRegions: ['Assam', 'West Bengal', 'Bihar'],
  missionStatement: 'Providing rapid response and sustainable recovery support to disaster-affected communities.',
  verificationStatus: 'Verified',
  stats: {
    activeReliefCamps: 14,
    peopleSupported: 12500,
    activeVolunteers: 240,
    openDistributionTasks: 8
  }
};

export const mockNGOInventory = [
  { id: 'INV-F01', item: 'Rice Packets', category: 'Food', quantity: 4500, unit: 'kg', camp: 'Central Warehouse', dailyConsumption: 300, status: 'Available', expiryDate: '2026-12-01', supplier: 'FoodCorp India' },
  { id: 'INV-W01', item: 'Bottled Water', category: 'Water', quantity: 1200, unit: 'liters', camp: 'RC-014', dailyConsumption: 400, status: 'Low', expiryDate: '2027-01-15', supplier: 'AquaSafe' },
  { id: 'INV-M01', item: 'Paracetamol 500mg', category: 'Medicines', quantity: 200, unit: 'strips', camp: 'RC-021', dailyConsumption: 50, status: 'Critical', expiryDate: '2025-10-01', supplier: 'MediLife' },
  { id: 'INV-B01', item: 'Thermal Blankets', category: 'Blankets', quantity: 3000, unit: 'units', camp: 'Central Warehouse', dailyConsumption: 0, status: 'Available', expiryDate: '-', supplier: 'TextileCo' },
  { id: 'INV-K01', item: 'Emergency Medical Kits', category: 'Emergency Kits', quantity: 45, unit: 'kits', camp: 'RC-014', dailyConsumption: 5, status: 'Low', expiryDate: '-', supplier: 'Red Cross' }
];

export const mockSupplyRequests = [
  { id: 'REQ-099', camp: 'RC-014 (Sector 4)', requestedItem: 'Bottled Water', quantity: 1000, priority: 'High', requestedAt: '2026-08-08T10:00:00Z', status: 'Pending', reason: 'Current stock depleting rapidly due to influx of evacuees.', requiredBy: '2026-08-09T10:00:00Z' },
  { id: 'REQ-100', camp: 'RC-021 (Old Market)', requestedItem: 'Paracetamol 500mg', quantity: 500, priority: 'Critical', requestedAt: '2026-08-08T12:30:00Z', status: 'Approved', reason: 'Fever outbreak reported in camp.', requiredBy: '2026-08-08T18:00:00Z' },
  { id: 'REQ-098', camp: 'RC-005 (North Wing)', requestedItem: 'Blankets', quantity: 200, priority: 'Normal', requestedAt: '2026-08-07T15:00:00Z', status: 'Delivered', reason: 'Night temperatures dropping.', requiredBy: '2026-08-10T10:00:00Z' }
];

export const mockDonations = [
  { id: 'DON-401', donor: 'Anonymous', type: 'Financial', amount: 500000, unit: 'INR', receivedDate: '2026-08-07', assignedCamp: '-', status: 'Pending' },
  { id: 'DON-402', donor: 'Local Traders Association', type: 'Food', amount: 2000, unit: 'kg (Rice)', receivedDate: '2026-08-08', assignedCamp: 'RC-014', status: 'Distributed' },
  { id: 'DON-403', donor: 'City Hospital Trust', type: 'Medicines', amount: 50, unit: 'Medical Kits', receivedDate: '2026-08-08', assignedCamp: 'RC-021', status: 'Assigned' }
];

export const mockNGOVolunteers = [
  { id: 'VOL-N01', name: 'Dr. Anita Roy', skills: ['Medical', 'Triage'], location: 'Guwahati', availability: 'Available', assignedCamp: '-', currentTask: '-', status: 'Available' },
  { id: 'VOL-N02', name: 'Ramesh Singh', skills: ['Logistics', 'Driving'], location: 'Guwahati', availability: 'Available', assignedCamp: 'RC-014', currentTask: 'Water Distribution', status: 'On Task' },
  { id: 'VOL-N03', name: 'Priya Patel', skills: ['Counseling'], location: 'Ranchi', availability: 'Available', assignedCamp: 'RC-021', currentTask: 'Psychosocial Support', status: 'Assigned' }
];

export const mockDistributionRecords = [
  { id: 'DIST-01', camp: 'RC-014', item: 'Food Packets', quantity: 1500, distributedTo: 1420, target: 2000, volunteerTeam: 'Team Alpha', time: '2026-08-08T14:00:00Z', status: 'In Progress' },
  { id: 'DIST-02', camp: 'RC-021', item: 'Medical Kits', quantity: 50, distributedTo: 50, target: 50, volunteerTeam: 'Medical Team 1', time: '2026-08-08T09:00:00Z', status: 'Completed' },
  { id: 'DIST-03', camp: 'RC-005', item: 'Blankets', quantity: 500, distributedTo: 0, target: 500, volunteerTeam: 'Team Bravo', time: '2026-08-09T08:00:00Z', status: 'Scheduled' }
];

export const mockNGONotifications = [
  { id: 'NGON-1', type: 'Supply', title: 'Low Stock Alert', message: 'Medicine inventory at RC-021 is critically low.', time: '1 hour ago', read: false },
  { id: 'NGON-2', type: 'Camp', title: 'New Supply Request', message: 'RC-014 has requested 1000 liters of bottled water.', time: '2 hours ago', read: false },
  { id: 'NGON-3', type: 'Volunteer', title: 'Team Arrived', message: 'Team Alpha has arrived at RC-014 for food distribution.', time: '4 hours ago', read: true }
];
