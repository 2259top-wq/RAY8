const fs = require('fs');

// Zhonglian data template - Strictly based on the news article products
// Removed all fake downstream businesses because these are B2C products (rice balls, etc.)
// Attaching B2B companies to them violates real-world supply chain logic.
const zhonglianData = {
  "totalBusinesses": 0,
  "cityCounts": {},
  "productDetails": {
    "經典肉鬆飯糰": { "count": 0, "businesses": [] },
    "沙鍋魚頭風味飯糰": { "count": 0, "businesses": [] },
    "咖哩雞肉飯": { "count": 0, "businesses": [] },
    "大豆沙拉醬": { "count": 0, "businesses": [] },
    "卡士達餡料": { "count": 0, "businesses": [] },
    "一級黃豆油": { "count": 0, "businesses": [] }
  }
};

fs.writeFileSync('src/zhonglian_data.json', JSON.stringify(zhonglianData, null, 2), 'utf8');
console.log('Cleaned up Zhonglian data to remove illogical downstream businesses.');
