const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  try {
    await page.goto('https://2259top-wq.github.io/RAY8/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'live-screenshot.png' });
    console.log('Screenshot saved to live-screenshot.png');
  } catch (err) {
    console.error('FAILED TO LOAD PAGE:', err);
  }
  
  await browser.close();
})();
