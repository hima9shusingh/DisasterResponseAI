export const mockNotifications = [
  {
    id: 'NOTIF-1',
    type: 'Emergency',
    title: 'Severe Flood Warning',
    message: 'Water levels rising rapidly in Kamrup district. Immediate evacuation advised.',
    time: '2 mins ago',
    priority: 'Critical',
    read: false,
    relatedEntity: 'INC-9042'
  },
  {
    id: 'NOTIF-2',
    type: 'Mission',
    title: 'New Rescue Mission Assigned',
    message: 'You have been assigned to Mission RES-409 in Dispur area.',
    time: '1 hour ago',
    priority: 'High',
    read: false,
    relatedEntity: 'RES-409'
  },
  {
    id: 'NOTIF-3',
    type: 'System',
    title: 'Platform Maintenance',
    message: 'Scheduled downtime for database optimization on Sunday 2 AM.',
    time: '3 hours ago',
    priority: 'Low',
    read: true,
    relatedEntity: null
  },
  {
    id: 'NOTIF-4',
    type: 'Resource',
    title: 'Supply Delivery Confirmed',
    message: '500 Medical Kits have been successfully delivered to Cotton College Relief Camp.',
    time: '5 hours ago',
    priority: 'Medium',
    read: true,
    relatedEntity: 'CAMP-01'
  },
  {
    id: 'NOTIF-5',
    type: 'Incident',
    title: 'Fire Incident Contained',
    message: 'The commercial building fire in Paltan Bazaar has been fully contained.',
    time: '1 day ago',
    priority: 'High',
    read: true,
    relatedEntity: 'INC-8891'
  }
];

export const mockProfiles = {
  Citizen: {
    name: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    phone: '+91 98765 43210',
    location: 'Guwahati, Assam',
    joined: 'Jan 2026',
    status: 'Verified',
    emergencyContact: {
      name: 'Priya Sharma (Wife)',
      phone: '+91 98765 00000'
    },
    recentActivity: [
      { id: 1, action: 'Reported Fire Incident', time: '2 days ago' },
      { id: 2, action: 'Updated Profile Location', time: '1 week ago' },
      { id: 3, action: 'Viewed Flood Preparedness Guide', time: '2 weeks ago' }
    ]
  },
  Government: {
    name: 'Anita Das',
    email: 'anita.das@gov.in',
    phone: '+91 99999 88888',
    location: 'Assam State HQ',
    department: 'State Disaster Management Authority',
    badgeId: 'GOV-AS-992',
    joined: 'Mar 2024',
    status: 'Active Duty',
    recentActivity: [
      { id: 1, action: 'Dispatched Medical Unit to INC-9042', time: '1 hour ago' },
      { id: 2, action: 'Reviewed AI Damage Assessment', time: '3 hours ago' },
      { id: 3, action: 'Elevated Threat Level to Critical', time: '1 day ago' }
    ]
  },
  Volunteer: {
    name: 'Vikram Singh',
    email: 'vikram.rescue@example.com',
    phone: '+91 98765 11111',
    location: 'Guwahati North',
    skills: ['First Aid', 'Swimming', 'Heavy Driving'],
    joined: 'Feb 2025',
    status: 'Available',
    recentActivity: [
      { id: 1, action: 'Completed Mission RES-401', time: '2 days ago' },
      { id: 2, action: 'Logged 8 hours at Relief Camp 01', time: '1 week ago' }
    ]
  },
  NGO: {
    name: 'Asha Relief Foundation',
    email: 'ops@asharelief.org',
    phone: '+91 1800 555 1234',
    location: 'Pan India (HQ Delhi)',
    registrationNo: 'NGO-REG-2015-884',
    joined: 'Aug 2023',
    status: 'Operations Active',
    recentActivity: [
      { id: 1, action: 'Approved Supply Request REQ-99', time: '4 hours ago' },
      { id: 2, action: 'Dispatched 1000 Food Packets', time: '1 day ago' }
    ]
  },
  Admin: {
    name: 'System Administrator',
    email: 'admin@adrras.system',
    phone: '-',
    location: 'Central Servers',
    joined: 'Jan 2023',
    status: 'Superuser',
    recentActivity: [
      { id: 1, action: 'Approved new NGO registration', time: '2 hours ago' },
      { id: 2, action: 'Updated system security policies', time: '5 days ago' }
    ]
  }
};

export const mockSessions = [
  { id: 1, device: 'MacBook Pro 16"', browser: 'Chrome 122', location: 'Guwahati, India', lastActive: 'Current Session', isCurrent: true },
  { id: 2, device: 'iPhone 14 Pro', browser: 'Safari Mobile', location: 'Guwahati, India', lastActive: '2 hours ago', isCurrent: false },
  { id: 3, device: 'Windows Desktop', browser: 'Edge 120', location: 'New Delhi, India', lastActive: '3 days ago', isCurrent: false }
];
