const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://2259top-wq.github.io/RAY8/', { waitUntil: 'networkidle0' });
    
    // Click the Law Assistant tab
    const tabs = await page.$$('button');
    for (let tab of tabs) {
      const text = await page.evaluate(el => el.textContent, tab);
      if (text && text.includes('法規 RAG 助理')) {
        await tab.click();
        break;
      }
    }
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Type query
    await page.type('input[type="text"]', '關幾年');
    await page.click('button[type="submit"]');
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Get the last bot message
    const botMessages = await page.$$('.bg-white.text-gray-800'); // Bot messages have this class
    if (botMessages.length > 0) {
      const lastMsg = botMessages[botMessages.length - 1];
      const text = await page.evaluate(el => el.textContent, lastMsg);
      console.log('BOT RESPONSE:', text);
      if (text.includes('找不到')) {
        console.log('FAIL: Bot could not find it.');
      } else {
        console.log('SUCCESS: Bot found it!');
      }
    } else {
      console.log('ERROR: No bot message found.');
    }
    
    await page.screenshot({ path: 'live-query-test.png' });
    
  } catch (err) {
    console.error('ERROR:', err);
  }
  
  await browser.close();
})();
