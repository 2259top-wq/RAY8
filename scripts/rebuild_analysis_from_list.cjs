const fs = require('fs');

const businesses = require('../src/businesses.json');

const productsByBrand = {
  "泰山企業": [],
  "福壽實業": [],
  "福懋油脂": []
};
// Map raw product strings to clean product names and identify their brand
const cleanProductName = (rawProduct) => {
  // 1. First, determine the generic clean name by stripping out sizes (e.g., -18L, 3L*6, 18KG, (新版))
  let cleanedName = rawProduct.replace(/[-*().\s\dLa-zA-Z入]/g, '').replace('新版', '').replace('塑桶', '').trim() || '油品';
  
  // Clean up some weird artifacts from OCR like "沙拉油泰山"
  cleanedName = cleanedName.replace('沙拉油泰山', '大豆沙拉油');
  
  // 2. Assign Brands based on explicit labels or known trademarks, but KEEP the cleaned product name!
  if (rawProduct.includes('泰山')) return { brand: '泰山企業', name: cleanedName };
  if (rawProduct.includes('福壽')) return { brand: '福壽實業', name: cleanedName };
  if (rawProduct.includes('益康')) return { brand: '福懋油脂', name: cleanedName };
  if (rawProduct.includes('金酥')) return { brand: '福懋油脂', name: cleanedName };
  if (rawProduct.includes('環保鐵桶')) return { brand: '福懋油脂', name: cleanedName };
  if (rawProduct.includes('健味香油')) return { brand: '福壽實業', name: cleanedName };
  
  // Generic products WITHOUT explicit brand labels must not be falsely attributed!
  if (rawProduct.includes('一級黃豆油')) return { brand: '未標示/其他廠牌', name: '一級黃豆油' };
  
  // Default fallback
  return { brand: '未標示/其他廠牌', name: rawProduct.replace(/[-*(\s\dLa-zA-Z]/g, '').trim() || '油品' };
};

const processedBrands = {};
let cityCounts = {};
let totalBusinesses = 0;

const categorizeBusiness = (name) => {
  const tags = [];
  if (name.includes('聯華食品') || name.includes('義美') || name.includes('餅')) tags.push('餅乾', '休閒食品', '零食', '糕點');
  if (name.includes('桂冠') || name.includes('老協珍') || name.includes('冷凍')) tags.push('冷凍食品', '調理包', '火鍋料');
  if (name.includes('廣達香') || name.includes('醬') || name.includes('調味')) tags.push('調味料', '罐頭', '醬料', '沙拉醬');
  if (name.includes('咖啡') || name.includes('麵包') || name.includes('布列德') || name.includes('路易莎') || name.includes('烘焙')) tags.push('烘焙', '麵包', '糕點', '飲料');
  if (name.includes('便當') || name.includes('快餐') || name.includes('燒臘') || name.includes('館') || name.includes('餐廳') || name.includes('餐飲')) tags.push('餐飲', '便當', '熟食', '小吃');
  if (name.includes('牛排') || name.includes('貴族世家')) tags.push('餐飲', '排餐', '牛排');
  if (name.includes('雜糧') || name.includes('商行') || name.includes('糧行') || name.includes('米店') || name.includes('油行') || name.includes('行')) tags.push('批發零售', '雜貨', '盤商');
  if (name.includes('家樂福') || name.includes('大買家')) tags.push('量販店', '大賣場', '通路', '超市');
  if (name.includes('飯店') || name.includes('酒店') || name.includes('晶華')) tags.push('飯店', '餐飲', '住宿');
  if (name.includes('海鮮') || name.includes('漁')) tags.push('海鮮', '水產');
  if (name.includes('肉品') || name.includes('肉脯') || name.includes('卜蜂')) tags.push('肉品', '加工肉品');
  if (name.includes('麵')) tags.push('麵食', '製麵');
  // fallback if empty
  if (tags.length === 0) tags.push('食品加工', '其他');
  return tags;
};

businesses.forEach(biz => {
  // Only keep businesses that sound like companies (not O)
  if (biz.name.includes('O')) return;
  
  const rawProducts = biz.products.split(' ');
  
  rawProducts.forEach(rawProd => {
    if (!rawProd.trim()) return;
    const { brand, name } = cleanProductName(rawProd);
    
    if (brand === '其他代工廠') return; // Skip if we can't identify

    if (!processedBrands[brand]) processedBrands[brand] = {};
    if (!processedBrands[brand][name]) processedBrands[brand][name] = { name: name, count: 0, businesses: [] };
    
    processedBrands[brand][name].count++;
    processedBrands[brand][name].businesses.push({
      id: biz.id,
      name: biz.name,
      city: biz.city,
      tags: categorizeBusiness(biz.name)
    });
    
    cityCounts[biz.city] = (cityCounts[biz.city] || 0) + 1;
    totalBusinesses++;
  });
});

Object.keys(processedBrands).forEach(brand => {
  productsByBrand[brand] = Object.values(processedBrands[brand]);
});

const analysis = {
  totalBusinesses,
  cityCounts,
  productsByBrand
};

fs.writeFileSync('src/analysis_data.json', JSON.stringify(analysis, null, 2), 'utf8');
console.log('Rebuilt analysis_data.json accurately from businesses.json without fake names!');
