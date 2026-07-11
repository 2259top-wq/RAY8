const fs = require('fs');

const businesses = JSON.parse(fs.readFileSync('src/businesses.json', 'utf8'));

const cityCounts = {};
const productCounts = {};

// Exact product strings with clear labeling
const exactProducts = [
  '益康大豆沙拉油 18L',
  '益康大豆沙拉油 18KG',
  '一級黃豆油',
  '沙拉油-18L(泰山)',
  '益康烹調油(調合油)',
  '沙拉油　18Ｌ(福壽)',
  '沙拉油 18Ｌ(福壽)', // fallback for normal space
  '沙拉油－塑桶 3L',
  '健味香油　3L',
  '金酥耐炸油-18L',
  '環保鐵桶沙拉油-18Kg',
  '泰山精選蔬菜油-3L*6',
  '泰山花生風味調和油2L*6入',
  '泰山不飽和大豆沙拉油2.6L*6入(新版)',
  '泰山好理調合油-2L*6',
  '泰山歐式果實精華調合油1.5L*6入',
  '泰山大豆沙拉油0.6L*12入(新版)',
  '泰山好理調合油0.6L*24'
];

businesses.forEach(b => {
  // Count cities
  cityCounts[b.city] = (cityCounts[b.city] || 0) + 1;
  
  const pStr = b.products;
  
  // Count specific products
  exactProducts.forEach(ep => {
    if (pStr.includes(ep)) {
      // Normalize Full-width space or variations for display
      let displayName = ep;
      if (ep === '沙拉油 18Ｌ(福壽)' || ep === '沙拉油　18Ｌ(福壽)') displayName = '福壽 沙拉油 18L';
      if (ep === '沙拉油-18L(泰山)') displayName = '泰山 沙拉油 18L';
      if (ep === '沙拉油－塑桶 3L') displayName = '沙拉油-塑桶 3L';
      if (ep === '健味香油　3L') displayName = '健味香油 3L';
      if (ep === '益康大豆沙拉油 18KG') displayName = '福懋 益康大豆沙拉油 18KG';
      if (ep === '益康大豆沙拉油 18L') displayName = '福懋 益康大豆沙拉油 18L';
      if (ep === '一級黃豆油') displayName = '一級黃豆油';
      if (ep === '益康烹調油(調合油)') displayName = '福懋 益康烹調油(調合油)';
      
      if (!productCounts[displayName]) {
        productCounts[displayName] = { count: 0, businesses: [] };
      }
      productCounts[displayName].count += 1;
      // Prevent duplicates if multiple exact product variants map to the same displayName (e.g. the space variants)
      if (!productCounts[displayName].businesses.find(biz => biz.id === b.id)) {
        productCounts[displayName].businesses.push({ id: b.id, name: b.name, city: b.city });
      }
    }
  });
});

// Sort
const sortedCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);
const sortedProducts = Object.entries(productCounts).sort((a, b) => b[1].count - a[1].count);

const analysis = {
  totalBusinesses: businesses.length,
  cityCounts: Object.fromEntries(sortedCities),
  productDetails: Object.fromEntries(sortedProducts)
};

fs.writeFileSync('src/analysis_data.json', JSON.stringify(analysis, null, 2));
console.log('Analysis generated in src/analysis_data.json');

