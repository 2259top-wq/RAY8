const fs = require('fs');

const businesses = require('../src/businesses.json');

const productsByBrand = {
  "泰山企業": [],
  "福壽實業": [],
  "福懋油脂": []
};

// Map raw product strings to clean product names and identify their brand
const cleanProductName = (rawProduct) => {
  if (rawProduct.includes('泰山')) return { brand: '泰山企業', name: '大豆沙拉油' };
  if (rawProduct.includes('福壽')) return { brand: '福壽實業', name: '大豆沙拉油' };
  if (rawProduct.includes('益康')) return { brand: '福懋油脂', name: '益康大豆沙拉油' };
  if (rawProduct.includes('金酥')) return { brand: '福懋油脂', name: '金酥耐炸油' };
  if (rawProduct.includes('環保鐵桶')) return { brand: '福懋油脂', name: '環保鐵桶沙拉油' };
  if (rawProduct.includes('健味香油')) return { brand: '福壽實業', name: '健味香油' };
  if (rawProduct.includes('一級黃豆油')) return { brand: '泰山企業', name: '一級黃豆油' };
  
  // Default fallback based on keywords if exact match isn't found
  return { brand: '其他代工廠', name: rawProduct.replace(/[-*(\s\dLa-zA-Z]/g, '').trim() || '油品' };
};

const processedBrands = {};
let cityCounts = {};
let totalBusinesses = 0;

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
      city: biz.city
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
