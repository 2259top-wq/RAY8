const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (true) {
      console.log('PAGE LOG:', msg.text());
    }
  });
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  await browser.close();
  console.log('Puppeteer check complete.');
})();
