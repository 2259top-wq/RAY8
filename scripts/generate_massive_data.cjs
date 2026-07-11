const fs = require('fs');

const generateBusinesses = (prefix, count, cityPool) => {
  return Array.from({ length: count }, (_, i) => ({
    id: Math.floor(Math.random() * 1000000),
    name: `${prefix}加盟店 ${i + 1} 號`,
    city: cityPool[Math.floor(Math.random() * cityPool.length)]
  }));
};

const cities = ["台北市", "新北市", "桃園市", "台中市", "台南市", "高雄市", "彰化縣", "新竹市"];

const analysis = {
  totalBusinesses: 257,
  cityCounts: {
    "台北市": 85,
    "新北市": 60,
    "台中市": 52,
    "桃園市": 30,
    "高雄市": 20,
    "台南市": 10
  },
  productDetails: {
    "泰山 特級大豆沙拉油 18L": {
      count: 45,
      businesses: generateBusinesses("泰山", 45, cities)
    },
    "泰山 精選蔬菜油 3L": {
      count: 30,
      businesses: generateBusinesses("泰山", 30, cities)
    },
    "福壽 嚴選沙拉油 18L": {
      count: 60,
      businesses: generateBusinesses("福壽", 60, cities)
    },
    "福壽 健味香油 3L": {
      count: 22,
      businesses: generateBusinesses("福壽", 22, cities)
    },
    "福懋 益康大豆沙拉油 18KG": {
      count: 65,
      businesses: generateBusinesses("福懋", 65, cities)
    },
    "福懋 頂級烹調油 18L": {
      count: 35,
      businesses: generateBusinesses("福懋", 35, cities)
    }
  }
};

fs.writeFileSync('src/analysis_data.json', JSON.stringify(analysis, null, 2), 'utf8');
console.log('Massive analysis_data.json generated successfully in UTF-8!');
