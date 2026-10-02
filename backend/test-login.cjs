

async function testLogin() {
  try {
    const res = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@test.com', password: 'password123' })
    });
    const data = await res.json();
    console.log('Login Response:', data);

    if (data.success) {
      const meRes = await fetch('http://localhost:5000/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${data.data.token}`
        }
      });
      const meData = await meRes.json();
      console.log('Me Response:', meData);
    }
  } catch (err) {
    console.error(err);
  }
}

testLogin();
