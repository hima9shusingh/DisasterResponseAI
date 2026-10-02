export const mockAIAssessments = [
  { 
    id: 'AI-2026-00421', 
    incidentId: 'INC-9042', 
    disasterType: 'Flood', 
    location: 'Kamrup Metropolitan, Assam', 
    severity: 'Critical', 
    confidence: 92, 
    riskScore: 87, 
    createdAt: '2026-08-08T09:15:00Z', 
    status: 'Analyzed',
    reviewer: null,
    reviewedAt: null
  },
  { 
    id: 'AI-2026-00420', 
    incidentId: 'INC-9041', 
    disasterType: 'Fire', 
    location: 'Bhangagarh, Guwahati', 
    severity: 'High', 
    confidence: 88, 
    riskScore: 75, 
    createdAt: '2026-08-07T14:30:00Z', 
    status: 'Reviewed',
    reviewer: 'Officer Sharma',
    reviewedAt: '2026-08-07T15:00:00Z',
    reviewStatus: 'Confirmed'
  },
  { 
    id: 'AI-2026-00419', 
    incidentId: 'INC-9038', 
    disasterType: 'Landslide', 
    location: 'Shillong Highway', 
    severity: 'Critical', 
    confidence: 95, 
    riskScore: 92, 
    createdAt: '2026-08-06T11:45:00Z', 
    status: 'Archived',
    reviewer: 'Officer Das',
    reviewedAt: '2026-08-06T12:30:00Z',
    reviewStatus: 'Confirmed'
  },
  { 
    id: 'AI-2026-00418', 
    incidentId: 'INC-9035', 
    disasterType: 'Building Damage', 
    location: 'Central Market', 
    severity: 'Medium', 
    confidence: 72, 
    riskScore: 45, 
    createdAt: '2026-08-05T08:20:00Z', 
    status: 'Reviewed',
    reviewer: 'Officer Sharma',
    reviewedAt: '2026-08-05T10:00:00Z',
    reviewStatus: 'Needs Review'
  }
];

export const mockDamageCategories = [
  { name: 'Buildings', impact: 'High Impact', percentage: 75 },
  { name: 'Roads', impact: 'Severe Impact', percentage: 90 },
  { name: 'Vehicles', impact: 'Moderate Impact', percentage: 40 },
  { name: 'Infrastructure', impact: 'High Impact', percentage: 80 },
  { name: 'People at Risk', impact: 'Critical', percentage: 95 },
];

export const mockAIRecommendations = [
  'Deploy emergency rescue boat teams immediately.',
  'Prioritize medical resources for potential waterborne diseases.',
  'Move affected residents to Cotton College Relief Camp.',
  'Inspect main bridge infrastructure for structural integrity.',
  'Monitor upstream water levels for secondary hazard risks.'
];

export const mockAIAnalytics = {
  severityDistribution: [
    { name: 'Critical', count: 45, color: '#dc2626' },
    { name: 'High', count: 85, color: '#ea580c' },
    { name: 'Medium', count: 120, color: '#ca8a04' },
    { name: 'Low', count: 50, color: '#16a34a' },
  ],
  assessmentsOverTime: [
    { name: 'Mon', count: 24 },
    { name: 'Tue', count: 35 },
    { name: 'Wed', count: 42 },
    { name: 'Thu', count: 88 },
    { name: 'Fri', count: 65 },
    { name: 'Sat', count: 30 },
    { name: 'Sun', count: 15 },
  ]
};
