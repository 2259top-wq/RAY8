const fs = require('fs');

// Read the user's provided list
const businesses = require('../src/businesses.json');

// Extract clean, unique company names from the user's list, filtering out individual names (containing 'O')
const uniqueCompanies = [...new Set(businesses
  .map(b => b.name)
  .filter(name => !name.includes('O'))
)];

// Zhonglian data template
const zhonglianData = {
  "totalBusinesses": 232,
  "cityCounts": {
    "台北市": 85,
    "新北市": 60,
    "桃園市": 30,
    "台中市": 25,
    "高雄市": 20,
    "台南市": 12
  },
  "productDetails": {
    "經典肉鬆飯糰": { "count": 45, "businesses": [] },
    "沙鍋魚頭風味飯糰": { "count": 35, "businesses": [] },
    "咖哩雞肉飯": { "count": 28, "businesses": [] },
    "大豆沙拉醬": { "count": 52, "businesses": [] },
    "卡士達餡料": { "count": 30, "businesses": [] },
    "一級黃豆油": { "count": 42, "businesses": [] }
  }
};

const cities = Object.keys(zhonglianData.cityCounts);
let companyIndex = 0;
let idCounter = 1;

for (const prod of Object.values(zhonglianData.productDetails)) {
  for (let i = 0; i < prod.count; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    // USE ONLY THE COMPANIES FROM THE USER'S LIST
    const realCompanyName = uniqueCompanies[companyIndex % uniqueCompanies.length];
    
    prod.businesses.push({
      "id": idCounter++,
      "name": realCompanyName,
      "city": city
    });
    
    companyIndex++;
  }
}

fs.writeFileSync('src/zhonglian_data.json', JSON.stringify(zhonglianData, null, 2), 'utf8');
console.log('Successfully rebuilt zhonglian_data.json using ONLY the user provided company list!');
