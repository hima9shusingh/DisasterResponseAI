export const emergencyContacts = [
  { name: 'National Emergency', number: '112', description: 'Universal emergency helpline' },
  { name: 'Police', number: '100', description: 'Law enforcement and immediate security threats' },
  { name: 'Fire', number: '101', description: 'Fire emergencies and rescue operations' },
  { name: 'Ambulance', number: '102', description: 'Medical emergencies and hospital transport' },
  { name: 'Disaster Management', number: '108', description: 'State-level disaster response force' },
];

export const emergencyGuides = [
  {
    id: 'flood',
    title: 'Flood',
    icon: 'Droplets',
    sections: {
      before: [
        'Build an emergency kit and make a family communications plan.',
        'Elevate the furnace, water heater, and electric panel if susceptible to flooding.',
        'Clear drains and gutters of debris.'
      ],
      during: [
        'Move to higher ground immediately.',
        'Avoid walking or driving through floodwater (6 inches of moving water can knock you down).',
        'Turn off utilities at the main switches or valves if instructed to do so.'
      ],
      after: [
        'Return home only when authorities indicate it is safe.',
        'Avoid driving through flooded areas and standing water.',
        'Photograph damage to your property for insurance purposes.'
      ],
      donts: [
        'Do not touch electrical equipment if you are wet or standing in water.',
        'Do not drink floodwater.'
      ]
    }
  },
  {
    id: 'fire',
    title: 'Fire',
    icon: 'Flame',
    sections: {
      before: [
        'Install smoke alarms on every level of your home.',
        'Test smoke alarms monthly and replace batteries yearly.',
        'Create and practice a fire escape plan with two ways out of every room.'
      ],
      during: [
        'Crawl low under any smoke to your exit.',
        'Before opening a door, feel the doorknob and door; if hot, leave the door closed and use your second way out.',
        'If your clothes catch fire: Stop, Drop, and Roll.'
      ],
      after: [
        'Do not re-enter the building until authorities say it is safe.',
        'Call emergency services if you haven\'t already.',
        'Seek medical help for burns or smoke inhalation.'
      ],
      donts: [
        'Do not use elevators during a fire.',
        'Do not go back inside for pets or belongings.'
      ]
    }
  },
  {
    id: 'earthquake',
    title: 'Earthquake',
    icon: 'Activity',
    sections: {
      before: [
        'Secure heavy items in your home like bookcases, refrigerators, and televisions.',
        'Store breakable items in low, closed cabinets.',
        'Identify safe places in each room (under sturdy furniture, against an interior wall away from windows).'
      ],
      during: [
        'Drop, Cover, and Hold On.',
        'If in bed, stay there and cover your head and neck with a pillow.',
        'If outdoors, move away from buildings, streetlights, and utility wires.'
      ],
      after: [
        'Check yourself and others for injuries. Provide first aid.',
        'Expect aftershocks.',
        'Listen to a battery-operated radio for emergency information.'
      ],
      donts: [
        'Do not use matches, lighters, or camp stoves in case of gas leaks.',
        'Do not use elevators.'
      ]
    }
  },
  {
    id: 'cyclone',
    title: 'Cyclone',
    icon: 'Wind',
    sections: {
      before: [
        'Know your local cyclone evacuation route.',
        'Board up windows or close storm shutters.',
        'Secure loose outdoor objects or bring them inside.'
      ],
      during: [
        'Stay indoors and away from windows and glass doors.',
        'Close all interior doors and secure external doors.',
        'Take refuge in a small interior room, closet, or hallway on the lowest level.'
      ],
      after: [
        'Stay indoors until official "all clear" is given (do not be fooled by the calm eye of the storm).',
        'Avoid downed power lines.',
        'Use flashlights instead of candles.'
      ],
      donts: [
        'Do not go outside during the calm eye of the cyclone.',
        'Do not use electrical appliances that have been wet.'
      ]
    }
  }
];

export const helpLocations = [
  {
    id: 'HOSP-01',
    name: 'Guwahati Medical College',
    type: 'Hospital',
    lat: 26.155,
    lng: 91.765,
    address: 'Bhangagarh, Guwahati, Assam',
    contact: '0361-2329388',
    status: 'Operational',
    distance: '2.4 km',
    details: { emergencyDept: '24/7 Active', bedsAvailable: 45, support: 'Trauma, Surgery, General' }
  },
  {
    id: 'HOSP-02',
    name: 'Apollo Hospitals',
    type: 'Hospital',
    lat: 26.140,
    lng: 91.790,
    address: 'Christian Basti, Guwahati',
    contact: '0361-2304000',
    status: 'Operational',
    distance: '3.1 km',
    details: { emergencyDept: '24/7 Active', bedsAvailable: 12, support: 'ICU, Trauma' }
  },
  {
    id: 'POL-01',
    name: 'Paltan Bazaar Police Station',
    type: 'Police',
    lat: 26.175,
    lng: 91.750,
    address: 'Paltan Bazaar, Guwahati',
    contact: '0361-2540137',
    status: 'Operational',
    distance: '1.2 km',
    details: { support: 'Emergency Response, Traffic Control' }
  },
  {
    id: 'FIRE-01',
    name: 'Dispur Fire Station',
    type: 'Fire',
    lat: 26.135,
    lng: 91.795,
    address: 'Dispur, Guwahati',
    contact: '101',
    status: 'Operational',
    distance: '4.5 km',
    details: { support: 'Fire Rescue, Heavy Equipment' }
  },
  {
    id: 'CAMP-01',
    name: 'Cotton College Relief Camp',
    type: 'Relief Camp',
    lat: 26.185,
    lng: 91.745,
    address: 'Panbazar, Guwahati',
    contact: 'Volunteer Coordinator',
    status: 'Accepting',
    distance: '1.8 km',
    details: { capacity: 500, occupied: 320, availableBeds: 180, food: 'Sufficient', water: 'Sufficient', medical: 'Basic First Aid' }
  }
];
