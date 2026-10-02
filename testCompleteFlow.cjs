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
    const email = `test_citizen_${Date.now()}@example.com`;
    const password = 'password123';

    // 1. Register new citizen
    console.log(`\n--- Registering new citizen: ${email} ---`);
    const registerData = JSON.stringify({ name: 'Citizen Test', email, password, role: 'citizen' });
    const regRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/auth/register', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(registerData) }
    }, registerData);
    console.log(`Register status: ${regRes.status}`);

    // 2. Login
    console.log(`\n--- Logging in ---`);
    const loginData = JSON.stringify({ email, password });
    const loginRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginData) }
    }, loginData);
    console.log(`Login status: ${loginRes.status}`);
    
    if (loginRes.status !== 200) {
      console.error('Login failed, stopping test.');
      return;
    }

    const token = loginRes.data.data.token;
    console.log('Token received successfully.');

    // 3. Check /auth/me
    console.log(`\n--- Checking /auth/me ---`);
    const meRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/auth/me', method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`/auth/me status: ${meRes.status}`);

    // 4. Check notifications
    console.log(`\n--- Checking /notifications ---`);
    const notifRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/notifications', method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`/notifications status: ${notifRes.status}`);

    // 5. Check notifications unread-count
    console.log(`\n--- Checking /notifications/unread-count ---`);
    const unreadRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/notifications/unread-count', method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`/notifications/unread-count status: ${unreadRes.status}`);

    // 6. Check alerts active
    console.log(`\n--- Checking /alerts/active ---`);
    const alertsRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/alerts/active', method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`/alerts/active status: ${alertsRes.status}`);

    // 7. Submit test incident
    console.log(`\n--- Submitting incident ---`);
    const incidentData = JSON.stringify({
      title: 'Test Fire Incident',
      type: 'fire',
      description: 'A test fire in the area',
      location: { type: 'Point', coordinates: [85.257, 23.336] },
      address: '123 Test St'
    });
    const incidentRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/v1/incidents', method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(incidentData)
      }
    }, incidentData);
    console.log(`POST /incidents status: ${incidentRes.status}`);
    console.log(`POST response:`, incidentRes.data);

  } catch (err) {
    console.error(err);
  }
})();
