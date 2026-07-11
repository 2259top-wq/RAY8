const fs = require('fs');

const generateBusinesses = (count, cityPool) => {
  const types = ['食品行', '企業社', '商行', '餐飲部', '烘培坊', '實業', '流通商', '貿易商'];
  const names = ['陳明', '林華', '黃強', '張芬', '李玲', '吳豪', '周慧', '王傑', '李大', '趙二'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: Math.floor(Math.random() * 1000000) + i,
    name: names[i % names.length] + types[i % types.length],
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
  productsByBrand: {
    "泰山企業": [
      { name: "特級大豆沙拉油 18L", count: 45, businesses: generateBusinesses(45, cities) },
      { name: "精選蔬菜油 3L", count: 30, businesses: generateBusinesses(30, cities) }
    ],
    "福壽實業": [
      { name: "嚴選沙拉油 18L", count: 60, businesses: generateBusinesses(60, cities) },
      { name: "健味香油 3L", count: 22, businesses: generateBusinesses(22, cities) }
    ],
    "福懋油脂": [
      { name: "益康大豆沙拉油 18KG", count: 65, businesses: generateBusinesses(65, cities) },
      { name: "頂級烹調油 18L", count: 35, businesses: generateBusinesses(35, cities) }
    ]
  }
};

fs.writeFileSync('src/analysis_data.json', JSON.stringify(analysis, null, 2), 'utf8');
console.log('Clean analysis_data.json generated successfully!');
