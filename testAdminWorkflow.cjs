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
    console.log(`\n--- Logging in as Admin ---`);
    const loginData = JSON.stringify({ email: 'admin@adr.com', password: 'password123' });
    let loginRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginData) }
    }, loginData);

    if (loginRes.status !== 200) {
      console.log('Admin login failed, creating admin user...');
      const registerData = JSON.stringify({ name: 'Admin Test', email: 'admin@adr.com', password: 'password123', role: 'admin' });
      loginRes = await request({
        hostname: 'localhost', port: 5000, path: '/api/v1/auth/register', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(registerData) }
      }, registerData);
      
      // If we register, we need to force update role to admin in DB because register usually sets it to 'citizen' by default for security if not overridden.
      // Wait, register allows passing role? In my previous tests it did.
    }

    const token = loginRes.data.data.token;
    console.log(`Token received: ${token.substring(0, 15)}...`);

    // 1. Check Admin Dashboard Stats
    console.log(`\n--- Fetching Admin System Stats ---`);
    const statsRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/admin/stats', method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`Admin Stats Status: ${statsRes.status}`);
    console.log(`Total Incidents (DB): ${statsRes.data?.data?.system?.totalIncidents}`);

    // 1.5 Create Incident to ensure one exists
    console.log(`\n--- Creating a Test Incident ---`);
    const incidentData = JSON.stringify({
      disasterType: 'road_accident',
      severity: 'medium',
      description: 'Admin Test Road Accident',
      location: { 
        address: '999 Admin Test St',
        city: 'Admin City',
        district: 'Admin District',
        state: 'Admin State'
      },
      peopleAffected: 5
    });
    const createIncRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/incidents', method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(incidentData)
      }
    }, incidentData);
    console.log(`Created Incident Status: ${createIncRes.status}`);

    // 2. Fetch Incidents
    console.log(`\n--- Fetching Incidents List ---`);
    const incidentsRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/incidents?limit=5', method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`Incidents Fetch Status: ${incidentsRes.status}`);
    const firstIncident = incidentsRes.data?.data?.incidents[0];
    
    if (!firstIncident) {
      console.log('No incidents found to test with.');
      return;
    }
    
    const incidentId = firstIncident._id;
    console.log(`Selected Incident: ${firstIncident.incidentId} (${incidentId}) - Status: ${firstIncident.status}`);

    // 3. Update Incident Status
    console.log(`\n--- Updating Incident Status to 'verified' ---`);
    const updateData = JSON.stringify({ status: 'verified' });
    const updateRes = await request({
      hostname: 'localhost', port: 5000, path: `/api/v1/incidents/${incidentId}/status`, method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(updateData)
      }
    }, updateData);
    console.log(`Update Status Res: ${updateRes.status}`);
    console.log(`New Status: ${updateRes.data?.data?.incident?.status}`);

    // 4. Fetch Resources
    console.log(`\n--- Fetching Resources ---`);
    const resRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/resources', method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`Resources Fetch Status: ${resRes.status}`);
    
    let resourceToAssign = null;
    if (resRes.data?.data?.resources?.length > 0) {
      resourceToAssign = resRes.data.resources[0];
      
      console.log(`\n--- Assigning Resource to Incident ---`);
      const assignRes = await request({
        hostname: 'localhost', port: 5000, path: `/api/v1/resources/${resourceToAssign._id}/assign`, method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify({ incidentId }))
        }
      }, JSON.stringify({ incidentId }));
      console.log(`Assign Resource Status: ${assignRes.status}`);
    } else {
      console.log('No resources available to assign.');
    }

    console.log(`\n--- ALL ADMIN OPERATIONS COMPLETED ---`);

  } catch (err) {
    console.error(err);
  }
})();
