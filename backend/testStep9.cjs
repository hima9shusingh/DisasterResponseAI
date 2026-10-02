const http = require('http');
require('dotenv').config({ path: './.env' });

const request = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null }));
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
};

(async () => {
  try {
    const timestamp = Date.now();
    const citizenEmail = `citizen_gps_${timestamp}@example.com`;
    const password = 'password123';

    // 1. CITIZEN REGISTRATION
    console.log(`\n=== 1. CITIZEN REGISTRATION ===`);
    const regRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/auth/register', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({ name: 'GPS Citizen', email: citizenEmail, password, role: 'citizen' }));
    
    if (regRes.status !== 201) throw new Error('Citizen registration failed');
    const citizenToken = regRes.data.data.token;
    console.log('Citizen registered and logged in.');

    // 2. CREATE EMERGENCY INCIDENT WITH GPS
    console.log(`\n=== 2. CREATE INCIDENT WITH GPS COORDS ===`);
    const incidentPayload = JSON.stringify({
      disasterType: 'earthquake',
      description: 'Major earthquake, building collapse',
      severity: 'critical',
      location: { 
        city: 'Testville', 
        state: 'TestState', 
        address: 'Main St',
        latitude: 28.5355,
        longitude: 77.3910
      },
      peopleAffected: 50
    });
    
    const incRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/incidents', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${citizenToken}` }
    }, incidentPayload);
    
    if (incRes.status !== 201) throw new Error('Incident creation failed');
    const incidentId = incRes.data.data.incident._id;
    console.log(`Incident Created Successfully. ID: ${incidentId}`);

    // Wait 1-2 seconds for risk assessment
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 3. ADMIN FETCHES INCIDENTS TO POPULATE MAP
    console.log(`\n=== 3. ADMIN FETCHES ACTIVE INCIDENTS FOR MAP ===`);
    const adminEmail = 'admin@adr.com';
    const adminLoginRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({ email: adminEmail, password }));
    
    const adminToken = adminLoginRes.data.data.token;
    console.log('Admin logged in.');

    const incidentsRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/incidents?limit=100', method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    const mapIncidents = incidentsRes.data.data.incidents;
    const testIncident = mapIncidents.find(inc => inc._id === incidentId);
    if (!testIncident) throw new Error('Incident missing from map API payload.');

    console.log(`Incident GPS Validated: Lat ${testIncident.location.latitude}, Lng ${testIncident.location.longitude}`);
    if (testIncident.location.latitude !== 28.5355 || testIncident.location.longitude !== 77.3910) {
      throw new Error('Coordinates mismatch.');
    }

    console.log(`\nALL GPS / MAP TESTS COMPLETED SUCCESSFULLY`);
    process.exit(0);

  } catch (error) {
    console.error('Test Failed:', error);
    process.exit(1);
  }
})();
