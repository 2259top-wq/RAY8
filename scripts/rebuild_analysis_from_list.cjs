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
