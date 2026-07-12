const fs = require('fs');
const path = require('path');

const rawData = fs.readFileSync(path.join(__dirname, 'taipei_raw.txt'), 'utf8');
const lines = rawData.split('\n').filter(l => l.trim() !== '');

const mergedMap = new Map();

lines.forEach(line => {
  const match = line.match(/^(\d+)\s+(.+?)\s+(\d+)\s+(臺北市.+)$/);
  if (!match) {
    console.log('Failed to parse:', line);
    return;
  }
  
  const [_, id, name, orderNum, address] = match;
  
  if (mergedMap.has(name)) {
    const existing = mergedMap.get(name);
    existing.orderNumbers.push(orderNum);
  } else {
    mergedMap.set(name, {
      name,
      address,
      orderNumbers: [orderNum]
    });
  }
});

const results = Array.from(mergedMap.values()).map((entry, idx) => ({
  id: String(idx + 1),
  clientName: entry.name,
  orderNumbers: entry.orderNumbers,
  address: entry.address,
  source: '南僑油脂公司 (大豆油產製品)'
}));

fs.writeFileSync(path.join(__dirname, '../src/taipei_health_data.json'), JSON.stringify(results, null, 2));
console.log(`Successfully merged into ${results.length} unique businesses.`);
