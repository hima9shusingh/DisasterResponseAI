const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('FRONTEND CONSOLE:', msg.text()));
  
  await page.setRequestInterception(true);
  let postCount = 0;
  page.on('request', request => {
    if (request.url().includes('/api/v1/auth/register') && request.method() === 'POST') {
      postCount++;
      console.log('>> [REQUEST]', request.method(), request.url(), request.postData());
    }
    request.continue();
  });

  try {
    console.log('Navigating to register page...');
    await page.goto('http://localhost:5173/auth/register', { waitUntil: 'networkidle0' });
    
    console.log('Filling out form...');
    await page.type('input[name="name"]', 'Puppeteer Test 2');
    await page.type('input[name="email"]', 'puppeteer_single_click@example.com');
    await page.type('input[name="password"]', 'Password123!');
    
    console.log('Clicking register button (simulate double click)...');
    await page.click('button[type="submit"]', { clickCount: 1 });
    
    await new Promise(r => setTimeout(r, 2000));
    
    console.log(`Total POST requests sent: ${postCount}`);
    
    const errorText = await page.evaluate(() => {
      const el = document.querySelector('.error-message');
      return el ? el.innerText : null;
    });
    
    console.log('UI Error Message:', errorText);
    console.log('Current URL:', page.url());
    
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
})();
