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

    const token = regRes.data.data.token;

    // 7. Submit test incident with EXACT SCHEMA FIELDS
    console.log(`\n--- Submitting incident ---`);
    const incidentData = JSON.stringify({
      disasterType: 'fire',
      severity: 'high',
      description: 'A massive test fire in the area',
      location: { 
        address: '123 Test St',
        city: 'Test City',
        district: 'Test District',
        state: 'Test State',
        pincode: '123456',
        latitude: 23.336,
        longitude: 85.257
      },
      peopleAffected: 50,
      contactNumber: '9999999999'
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
    console.log(`POST /incidents response:`, incidentRes.data);

  } catch (err) {
    console.error(err);
  }
})();
