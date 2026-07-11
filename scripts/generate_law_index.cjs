const fs = require('fs');

const lawText = fs.readFileSync('food_safety_law.txt', 'utf8');

// The law text is structured as "第 X 條" followed by text.
const chunks = [];
const lines = lawText.split('\n');

let currentArticle = null;
let currentText = [];

// Simple parser for articles
for (const line of lines) {
  if (/^第\s*\d+(-\d+)?\s*條/.test(line.trim())) {
    if (currentArticle) {
      chunks.push({
        article: currentArticle,
        content: currentText.join('\n').trim()
      });
    }
    currentArticle = line.trim();
    currentText = [];
  } else if (!/^第\s*[一二三四五六七八九十]+\s*章/.test(line.trim())) {
    // Ignore chapter headers like "第 九 章 罰則"
    currentText.push(line.trim());
  }
}

if (currentArticle) {
  chunks.push({
    article: currentArticle,
    content: currentText.join('\n').trim()
  });
}

fs.writeFileSync('law_index.json', JSON.stringify(chunks, null, 2));
console.log(`Generated ${chunks.length} law chunks in law_index.json`);
