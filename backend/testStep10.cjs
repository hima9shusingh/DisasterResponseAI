const axios = require('axios');
const mongoose = require('mongoose');

const BASE_URL = 'http://localhost:5000/api/v1';

async function runTest() {
  console.log('=== STEP 10: SOS END-TO-END TEST ===\n');

  try {
    // 1. Citizen Register & Login
    console.log('--- CITIZEN LOGIN ---');
    const citizenEmail = `citizen_sos_${Date.now()}@test.com`;
    await axios.post(`${BASE_URL}/auth/register`, {
      name: 'SOS Citizen',
      email: citizenEmail,
      password: 'password123',
      role: 'citizen',
      phone: '9999999999'
    });

    const citizenLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: citizenEmail,
      password: 'password123'
    });
    const citizenToken = citizenLogin.data.data.token;
    console.log('Citizen Logged In Successfully.\n');

    // 2. Citizen creates SOS request with GPS
    console.log('--- CITIZEN CREATES SOS ---');
    const sosPayload = {
      emergencyType: 'general_emergency',
      description: 'E2E Test SOS Button Triggered',
      location: {
        latitude: 28.5355,
        longitude: 77.3910
      }
    };
    
    const sosRes = await axios.post(`${BASE_URL}/sos`, sosPayload, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    
    if (!sosRes.data.success) throw new Error('SOS creation failed');
    const sosId = sosRes.data.data.sos._id;
    const emergencyId = sosRes.data.data.sos.emergencyId;
    console.log(`SOS Created. DB ID: ${sosId}, Emergency ID: ${emergencyId}\n`);

    // 3. Admin Login
    console.log('--- ADMIN LOGIN ---');
    const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@adr.com',
      password: 'password123'
    });
    const adminToken = adminLogin.data.data.token;
    console.log('Admin Logged In Successfully.\n');

    // 4. Admin Fetches SOS Requests
    console.log('--- ADMIN FETCHES SOS ---');
    const fetchRes = await axios.get(`${BASE_URL}/sos`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    const fetchedSos = fetchRes.data.data.sosRequests.find(s => s._id === sosId);
    if (!fetchedSos) throw new Error('SOS not found in admin fetch');
    console.log(`SOS verified in Admin Console. Status: ${fetchedSos.status}`);
    console.log(`GPS Validated: Lat ${fetchedSos.location.latitude}, Lng ${fetchedSos.location.longitude}\n`);

    // 5. Admin updates status to ACKNOWLEDGED
    console.log('--- ADMIN ACKNOWLEDGES SOS ---');
    await axios.patch(`${BASE_URL}/sos/${sosId}/status`, { status: 'ACKNOWLEDGED' }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('SOS Acknowledged.\n');

    // 6. Admin Assigns Team & Creates Mission
    // 6. Admin Marks Responding
    console.log('--- ADMIN MARKS RESPONDING ---');
    await axios.patch(`${BASE_URL}/sos/${sosId}/status`, { status: 'RESPONDING' }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('SOS Marked as Responding.\n');

    
    // 7. Admin marks Resolved
    console.log('--- ADMIN MARKS RESOLVED ---');
    const resolveRes = await axios.patch(`${BASE_URL}/sos/${sosId}/status`, { status: 'RESOLVED' }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!resolveRes.data.data.sos.resolvedAt) throw new Error('Resolved timestamp not set!');
    console.log(`SOS Resolved Successfully at ${resolveRes.data.data.sos.resolvedAt}\n`);

    console.log('=== ALL SOS WORKFLOW TESTS PASSED ===');
    
  } catch (error) {
    console.error('TEST FAILED:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  } finally {
    mongoose.disconnect();
  }
}

runTest();
