const http = require('http');

const request = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
};

(async () => {
  try {
    const email = `test${Date.now()}@example.com`;
    const registerData = JSON.stringify({ name: 'Test User', email, password: 'password123', role: 'citizen' });
    const registerRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': registerData.length
      }
    }, registerData);

    console.log('Register:', registerRes.status, registerRes.data);

    if (registerRes.data.success) {
      const token = registerRes.data.data.token;
      console.log('Token:', token);

      const meRes = await request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/auth/me',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Me:', meRes.status, meRes.data);
    }
  } catch (err) {
    console.error(err);
  }
})();
