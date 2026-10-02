const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Intercept network requests to log them
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.url().includes('/api/v1/auth/register')) {
      console.log('>> [REQUEST]', request.method(), request.url(), request.postData());
    }
    request.continue();
  });
  
  page.on('response', async response => {
    if (response.url().includes('/api/v1/auth/register')) {
      const text = await response.text();
      console.log('<< [RESPONSE]', response.status(), text);
    }
  });

  try {
    console.log('Navigating to register page...');
    await page.goto('http://localhost:5173/auth/register', { waitUntil: 'networkidle0' });
    
    console.log('Filling out form...');
    await page.type('input[name="name"]', 'Puppeteer Test');
    await page.type('input[name="email"]', 'puppeteer1@example.com');
    await page.type('input[name="password"]', 'Password123!');
    
    console.log('Clicking register button...');
    await page.click('button[type="submit"]');
    
    // Wait for a bit to see what happens
    await new Promise(r => setTimeout(r, 2000));
    
    // Check if there is an error message
    const errorText = await page.evaluate(() => {
      const el = document.querySelector('.error-message');
      return el ? el.innerText : null;
    });
    
    console.log('UI Error Message:', errorText);
    
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
})();
