const fs = require('fs');

const rawText = fs.readFileSync('raw_ocr.txt', 'utf8');
const lines = rawText.split('\n');

const businesses = [];

// Parse lines like: "1 基隆市 蔡O彤 益康大豆沙拉油 18L"
// Note that some lines have multiple products separated by spaces, like:
// "45 新北市 瑔盛-油脂 金酥耐炸油-18L 環保鐵桶沙拉油-18Kg"
// "93 臺中市 高雄市 桃園市 美食家食材通路股份有限公司 益康大豆沙拉油 18L 沙拉油　18Ｌ(福壽) 健味香油　3L 沙拉油　18Ｌ(福壽)"

// Regex to match the starting ID and City
const lineRegex = /^(\d+)\s+([\u4e00-\u9fa5]+)\s+(.+)$/;

for (let line of lines) {
  line = line.trim();
  if (!line) continue;
  
  const match = line.match(lineRegex);
  if (match) {
    const id = parseInt(match[1], 10);
    const city = match[2];
    const rest = match[3];
    
    // Heuristic to split company name and products
    // Usually company ends with 公司, 商行, 企業社, 行, 店, 廠, 號, 倉, 營業所, or has no spaces.
    // We will just find the first token that doesn't look like a product, or we can just split by spaces and assume the first chunk is the company.
    // Wait, some companies have spaces, but looking at the data, most company names don't have spaces.
    // E.g., "蔡O彤 益康大豆沙拉油 18L" -> split by space: ["蔡O彤", "益康大豆沙拉油", "18L"]
    // "大買家股份有限公司大里國光分公司 益康大豆沙拉油 18L"
    // "美食家食材通路股份有限公司"
    
    // The easiest way is: the first space separates the company name from the products.
    // BUT what about "93 臺中市 高雄市 桃園市 美食家食材通路股份有限公司 ..."? The OCR merged lines!
    // If it starts with a number, it's a valid row. Let's just do a naive split.
    const parts = rest.split(/\s+/);
    
    let name = parts[0];
    let productsStr = parts.slice(1).join(' ');
    
    // Edge case for 93: "高雄市 桃園市 美食家食材通路股份有限公司"
    if (['高雄市', '桃園市', '臺南市', '新北市'].includes(name)) {
      // Find the actual company name
      let companyIndex = 1;
      while (['高雄市', '桃園市', '臺南市', '新北市', '臺中市'].includes(parts[companyIndex])) {
        companyIndex++;
      }
      name = parts[companyIndex];
      productsStr = parts.slice(companyIndex + 1).join(' ');
    }
    
    businesses.push({
      id,
      city,
      name,
      products: productsStr
    });
  }
}

fs.writeFileSync('businesses.json', JSON.stringify(businesses, null, 2));
console.log(`Successfully extracted ${businesses.length} businesses.`);
