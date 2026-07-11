const fs = require('fs');

const businesses = JSON.parse(fs.readFileSync('src/businesses.json', 'utf8'));

const nodes = [];
const links = [];

// Create supplier nodes
const suppliers = [
  { id: 'supplier_fwusow', name: '福壽實業', group: 'supplier', r: 30, color: '#f59e0b' },
  { id: 'supplier_taisun', name: '泰山企業', group: 'supplier', r: 30, color: '#3b82f6' },
  { id: 'supplier_formosa', name: '福懋油脂', group: 'supplier', r: 30, color: '#ef4444' }
];

nodes.push(...suppliers);

// Track products to avoid duplicate product nodes
const productMap = new Map();

businesses.forEach(b => {
  // Infer supplier from product name
  let supplierId = 'supplier_formosa'; // default guess
  if (b.products.includes('福壽')) supplierId = 'supplier_fwusow';
  if (b.products.includes('泰山')) supplierId = 'supplier_taisun';
  if (b.products.includes('益康')) supplierId = 'supplier_formosa';
  if (b.products.includes('健味')) supplierId = 'supplier_formosa'; // Formosa brand
  if (b.products.includes('金酥耐炸油') || b.products.includes('環保鐵桶沙拉油')) supplierId = 'supplier_formosa'; // Usually formosa
  if (b.products.includes('一級黃豆油')) supplierId = 'supplier_fwusow'; // Just guessing based on context, usually distributed

  // Create product node if not exists
  let productId = 'prod_' + Buffer.from(b.products).toString('base64').substring(0, 10);
  if (!productMap.has(b.products)) {
    productMap.set(b.products, productId);
    nodes.push({
      id: productId,
      name: b.products,
      group: 'product',
      supplier: supplierId,
      r: 15,
      color: '#10b981'
    });
    // Link supplier to product
    links.push({ source: supplierId, target: productId, value: 3 });
  } else {
    productId = productMap.get(b.products);
  }

  // Create downstream business node
  const bizId = `biz_${b.id}`;
  nodes.push({
    id: bizId,
    name: b.name,
    city: b.city,
    group: 'business',
    r: 8,
    color: '#a8a29e'
  });

  // Link product to business
  links.push({ source: productId, target: bizId, value: 1 });
});

fs.writeFileSync('src/graph_data.json', JSON.stringify({ nodes, links }, null, 2));
console.log('Graph data generated in src/graph_data.json');
