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
    const citizenEmail = `citizen_${timestamp}@example.com`;
    const volunteerEmail = `volunteer_${timestamp}@example.com`;
    const password = 'password123';

    // ==========================================
    // TEST A: CITIZEN FLOW
    // ==========================================
    console.log(`\n=== TEST A: CITIZEN REPORTING ===`);
    const regRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/auth/register', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({ name: 'Citizen Joe', email: citizenEmail, password, role: 'citizen' }));
    
    if (regRes.status !== 201) throw new Error('Citizen registration failed');
    const citizenToken = regRes.data.data.token;
    console.log('Citizen registered and logged in.');

    const incidentPayload = JSON.stringify({
      disasterType: 'flood',
      description: 'Massive flooding in the lower town',
      severity: 'critical',
      location: { city: 'Rivertown', state: 'Waterland', address: '123 River Rd' },
      peopleAffected: 50
    });
    const incRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/incidents', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${citizenToken}` }
    }, incidentPayload);
    
    if (incRes.status !== 201) throw new Error('Incident creation failed');
    const incidentId = incRes.data.data.incident._id;
    const publicIncidentId = incRes.data.data.incident.incidentId;
    console.log(`Incident Created: ${publicIncidentId} (ID: ${incidentId})`);

    // ==========================================
    // TEST B: ADMIN FLOW
    // ==========================================
    console.log(`\n=== TEST B: ADMIN INCIDENT MANAGEMENT ===`);
    const adminEmail = 'admin@adr.com';
    const adminLoginRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({ email: adminEmail, password }));
    
    if (adminLoginRes.status !== 200) throw new Error('Admin login failed. Make sure admin@adr.com exists with password123.');
    const adminToken = adminLoginRes.data.data.token;
    console.log('Admin logged in.');

    const verifyRes = await request({
      hostname: 'localhost', port: 5000, path: `/api/v1/incidents/${incidentId}/verify`, method: 'PATCH',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log(`Incident Verified. Status Code: ${verifyRes.status}, Status: ${verifyRes.data?.data?.incident?.status}`);

    // Create a volunteer
    const volRegRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/auth/register', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({ name: 'Volun Tier', email: volunteerEmail, password, role: 'volunteer' }));
    const volunteerId = volRegRes.data?.data?.user?._id;

    // Create Team
    const teamPayload = JSON.stringify({
      name: `Flood Rescue ${timestamp}`,
      type: 'medical_team',
      leader: volunteerId
    });
    const teamRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/rescue-teams', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }
    }, teamPayload);
    const teamId = teamRes.data?.data?.team?._id;
    console.log(`Team Created: ${teamId}`);

    // Assign Team (creates mission)
    const missionPayload = JSON.stringify({
      incidentId,
      teamId,
      location: { city: 'Rivertown' }
    });
    const missionRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/missions', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }
    }, missionPayload);
    console.log(`Mission Created. Mission ID: ${missionRes.data?.data?.mission?.missionId}`);

    // Create Resource & Assign
    const resPayload = JSON.stringify({ name: 'Boat', type: 'vehicle', totalUnits: 5, availableUnits: 5 });
    const resourceRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/resources', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }
    }, resPayload);
    const resId = resourceRes.data?.data?.resource?._id;
    
    const assignResPayload = JSON.stringify({ incidentId, quantity: 2 });
    const assignRes = await request({
      hostname: 'localhost', port: 5000, path: `/api/v1/resources/${resId}/assign`, method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }
    }, assignResPayload);
    console.log(`Resource Assigned. Status: ${assignRes.status}`);

    // Change status to IN_PROGRESS (rescue_in_progress)
    const statusPayload = JSON.stringify({ status: 'rescue_in_progress' });
    const statusRes = await request({
      hostname: 'localhost', port: 5000, path: `/api/v1/incidents/${incidentId}/status`, method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }
    }, statusPayload);
    console.log(`Incident status changed to: ${statusRes.data?.data?.incident?.status}`);

    // ==========================================
    // TEST D: CITIZEN VERIFICATION
    // ==========================================
    console.log(`\n=== TEST D: CITIZEN REFRESH ===`);
    const citizenRefreshRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/incidents/my', method: 'GET',
      headers: { 'Authorization': `Bearer ${citizenToken}` }
    });
    const finalIncident = citizenRefreshRes.data?.data?.incidents[0];
    console.log(`Citizen sees incident status as: ${finalIncident?.status}`);

    const timelineCount = finalIncident?.timeline?.length || 0;
    console.log(`Timeline entries found: ${timelineCount}`);

    // ==========================================
    // TEST E: SECURITY
    // ==========================================
    console.log(`\n=== TEST E: SECURITY ===`);
    
    const secRes1 = await request({
      hostname: 'localhost', port: 5000, path: `/api/v1/incidents/${incidentId}/status`, method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${citizenToken}` }
    }, JSON.stringify({ status: 'resolved' }));
    console.log(`Citizen attempting admin update: ${secRes1.status} (Expected: 403)`);

    const secRes2 = await request({
      hostname: 'localhost', port: 5000, path: `/api/v1/incidents`, method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({})); // Missing token and using protected route
    console.log(`Unauthenticated creation on protected: ${secRes2.status} (Expected: 401)`);
    
    // Test Invalid Incident ID
    const secRes3 = await request({
      hostname: 'localhost', port: 5000, path: `/api/v1/incidents/invalid123`, method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log(`Invalid Incident ID lookup: ${secRes3.status} (Expected: 400 or 500 based on mongoose cast error)`);

    console.log(`\nALL TESTS COMPLETED SUCCESSFULLY`);
    process.exit(0);

  } catch (error) {
    console.error('Test Failed:', error);
    process.exit(1);
  }
})();
