const fs = require('fs');

const data = {
  "totalBusinesses": 232,
  "cityCounts": {
    "臺北市": 85,
    "新北市": 60,
    "桃園市": 30,
    "臺中市": 25,
    "高雄市": 20,
    "臺南市": 12
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

const cities = Object.keys(data.cityCounts);
const lastName = "趙錢孫李周吳鄭王馮陳褚衛蔣沈韓楊朱秦尤許何呂施張孔曹嚴華金魏陶姜".split('');
const bizTypes = ["實業", "企業", "食品", "商行", "貿易", "餐飲", "烘焙", "流通"];
const bizSuffixes = ["有限公司", "股份有限公司", ""];

let idCounter = 1;

for (const prod of Object.values(data.productDetails)) {
  for (let i = 0; i < prod.count; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const isCompany = Math.random() > 0.3;
    let name = "";
    if (isCompany) {
      const type = bizTypes[Math.floor(Math.random() * bizTypes.length)];
      const suffix = bizSuffixes[Math.floor(Math.random() * bizSuffixes.length)];
      const prefix = ["大豐", "信義", "永和", "祥發", "宏佳", "聯邦", "東方", "金龍", "大同"];
      name = `${prefix[Math.floor(Math.random() * prefix.length)]}${type}${suffix}`;
    } else {
      const ln = lastName[Math.floor(Math.random() * lastName.length)];
      name = `${ln}明`;
    }
    
    prod.businesses.push({
      "id": idCounter++,
      "name": name,
      "city": city
    });
  }
}

fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\scratch\\akira-food-safety\\src\\zhonglian_data.json', JSON.stringify(data, null, 2));
