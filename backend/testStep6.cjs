const http = require('http');

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
    const email = 'admin@adr.com';
    const password = 'password123';

    console.log(`\n--- Logging in as Admin: ${email} ---`);
    const loginData = JSON.stringify({ email, password });
    const loginRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginData) }
    }, loginData);
    
    if (loginRes.status !== 200) {
      console.error('Login failed.', loginRes.data);
      process.exit(1);
    }
    const token = loginRes.data.data.token;
    console.log('Token received.');

    // 1. Create Incident
    console.log(`\n--- Submitting incident ---`);
    const incidentData = JSON.stringify({
      disasterType: 'fire',
      description: 'A test fire in the area',
      severity: 'high',
      location: { latitude: 23.336, longitude: 85.257, city: 'Ranchi', state: 'Jharkhand' }
    });
    const incidentRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/incidents', method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(incidentData) }
    }, incidentData);
    console.log(`Incident status: ${incidentRes.status}`);
    const incidentId = incidentRes.data.data.incident._id;

    // 2. Create Resource
    console.log(`\n--- Creating Resource ---`);
    const resourceData = JSON.stringify({
      name: 'Ambulance Unit ' + Date.now(),
      type: 'ambulance',
      department: 'Health',
      totalUnits: 10,
      availableUnits: 10
    });
    const resRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/resources', method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(resourceData) }
    }, resourceData);
    console.log(`Resource status: ${resRes.status}`);
    const resourceId = resRes.data.data.resource._id;

    // 3. Allocate Resource
    console.log(`\n--- Allocating Resource ---`);
    const assignResData = JSON.stringify({ incidentId, quantity: 2 });
    const assignResReq = await request({
      hostname: 'localhost', port: 5000, path: `/api/v1/resources/${resourceId}/assign`, method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(assignResData) }
    }, assignResData);
    console.log(`Assign Resource status: ${assignResReq.status}`);
    console.log(`Assign Resource response (Avail/Depl):`, assignResReq.data.data.resource.availableUnits, assignResReq.data.data.resource.deployedUnits);

    // 4. Create Rescue Team
    console.log(`\n--- Creating Rescue Team ---`);
    const teamData = JSON.stringify({
      name: 'Alpha Team ' + Date.now(),
      type: 'medical_team'
    });
    const teamRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/rescue-teams', method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(teamData) }
    }, teamData);
    console.log(`Team status: ${teamRes.status}`);
    const teamId = teamRes.data.data.team._id;

    // 5. Create Mission (This tests the new backend flow)
    console.log(`\n--- Creating Mission ---`);
    const missionData = JSON.stringify({
      incidentId,
      teamId,
      location: { city: 'Ranchi', state: 'Jharkhand' },
      priority: 'critical'
    });
    const missionRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/missions', method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(missionData) }
    }, missionData);
    console.log(`Mission status: ${missionRes.status}`);
    console.log(`Mission response status field:`, missionRes.data.data?.mission?.status);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
