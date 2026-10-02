export const mockVolunteerProfile = {
  id: 'VOL-8472',
  name: 'Arjun Das',
  email: 'arjun.das@example.com',
  phone: '+91 98765 43210',
  location: 'Guwahati, Assam',
  joinedDate: '2025-03-15',
  avatar: 'https://i.pravatar.cc/150?u=arjun',
  skills: ['First Aid', 'Swimming', 'Search & Rescue', 'Driving'],
  stats: {
    missionsCompleted: 24,
    peopleAssisted: 142,
    volunteerHours: 320,
    responseRating: 4.8
  }
};

export const mockCertifications = [
  { id: 'CERT-1', name: 'Advanced First Aid', issuedBy: 'Red Cross Society', issueDate: '2024-05-10', expiry: '2027-05-10', status: 'Valid' },
  { id: 'CERT-2', name: 'Water Rescue Operations', issuedBy: 'NDRF Training', issueDate: '2025-01-20', expiry: '2028-01-20', status: 'Valid' },
  { id: 'CERT-3', name: 'Disaster Psychosocial Support', issuedBy: 'NIDM', issueDate: '2023-11-05', expiry: '2025-11-05', status: 'Expiring Soon' }
];

export const mockVolunteerMissions = [
  {
    id: 'MSN-9901',
    incidentId: 'INC-2026-A1',
    disasterType: 'Flood',
    location: 'Sector 4, Riverside Area',
    severity: 'Critical',
    distance: '3.2 km',
    peopleAffected: 25,
    peopleRescued: 0,
    requiredTeam: 'Water Rescue',
    estimatedDuration: '4 Hours',
    reportedTime: '2026-08-08T18:00:00Z',
    status: 'Available',
    description: 'Families stranded on rooftops due to sudden river overflow. Swift water rescue required immediately.',
    instructions: 'Wear life jackets at all times. Avoid submerged power lines. Approach structures carefully due to weakened foundations.',
    coords: [28.61, 77.21],
    timeline: [
      { stage: 'Mission Assigned', time: '2026-08-08T18:00:00Z', active: true }
    ]
  },
  {
    id: 'MSN-9902',
    incidentId: 'INC-2026-B3',
    disasterType: 'Building Collapse',
    location: 'Old Market Square',
    severity: 'High',
    distance: '5.5 km',
    peopleAffected: 8,
    peopleRescued: 0,
    requiredTeam: 'Search & Rescue',
    estimatedDuration: '8 Hours',
    reportedTime: '2026-08-08T16:30:00Z',
    status: 'Available',
    description: 'Partial collapse of an old commercial structure. Suspected individuals trapped in the basement area.',
    instructions: 'Hard hats and dust masks mandatory. Wait for structural assessment before deep entry.',
    coords: [28.63, 77.22],
    timeline: [
      { stage: 'Mission Assigned', time: '2026-08-08T16:30:00Z', active: true }
    ]
  },
  {
    id: 'MSN-9850',
    incidentId: 'INC-2026-X9',
    disasterType: 'Fire',
    location: 'Industrial Estate Block C',
    severity: 'Medium',
    distance: '12 km',
    peopleAffected: 45,
    peopleRescued: 45,
    requiredTeam: 'Medical Assistance',
    estimatedDuration: '3 Hours',
    reportedTime: '2026-08-05T09:00:00Z',
    status: 'Completed',
    completedAt: '2026-08-05T12:30:00Z',
    description: 'Provide immediate triage and burn care to factory workers outside the exclusion zone.',
    coords: [28.55, 77.25]
  }
];

export const mockVolunteerNotifications = [
  { id: 'VN-1', type: 'System', title: 'Profile Approved', message: 'Your updated certifications have been verified.', time: '1 day ago', read: true },
  { id: 'VN-2', type: 'Mission', title: 'Urgent Dispatch Required', message: 'A critical flood rescue mission is available near your location.', time: '2 hours ago', read: false },
  { id: 'VN-3', type: 'Weather', title: 'Heavy Rainfall Warning', message: 'Expect severe waterlogging in your sector over the next 6 hours.', time: '5 hours ago', read: false }
];
