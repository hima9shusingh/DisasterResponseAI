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
    const loginData = JSON.stringify({ email: 'test@example.com', password: 'password123' });
    const loginRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    }, loginData);

    console.log('Login:', loginRes.status, loginRes.data);

    if (loginRes.data.success) {
      const token = loginRes.data.data.token;
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
