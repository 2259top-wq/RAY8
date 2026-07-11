const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  try {
    await page.goto('https://2259top-wq.github.io/RAY8/', { waitUntil: 'networkidle0' });
    const content = await page.content();
    if (content.includes('原始污染追溯網')) {
      console.log('SUCCESS: Page rendered correctly!');
    } else {
      console.log('FAIL: Page did not render the app.');
      console.log(content.substring(0, 500));
    }
  } catch (err) {
    console.error('FAILED TO LOAD PAGE:', err);
  }
  
  await browser.close();
})();
