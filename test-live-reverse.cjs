const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  // Switch to graph tab
  const buttons = await page.$$('button');
  for (let btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text === '原始污染追溯網') {
      await btn.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Search for '香鬆'
  const inputs = await page.$$('input');
  for (let input of inputs) {
    await input.type('香鬆');
    break;
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: 'live-query-reverse.png' });
  console.log('SUCCESS: Page rendered correctly and screenshot saved!');
  await browser.close();
})();
