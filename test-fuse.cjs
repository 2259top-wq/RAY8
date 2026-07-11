const Fuse = require('fuse.js');
const lawIndex = require('./src/law_index.json');

const fuse = new Fuse(lawIndex, {
  keys: ['article', 'content'],
  includeScore: true,
  threshold: 0.6,
  ignoreLocation: true
});

console.log("TEST 1: 關幾年");
console.log(fuse.search("關幾年").slice(0,1));

console.log("\nTEST 2: 關幾年 有期徒刑 拘役");
console.log(fuse.search("關幾年 有期徒刑 拘役").slice(0,1));

console.log("\nTEST 3: 有期徒刑 拘役");
console.log(fuse.search("有期徒刑 拘役").slice(0,1));

const fuseExt = new Fuse(lawIndex, {
  keys: ['article', 'content'],
  includeScore: true,
  threshold: 0.6,
  ignoreLocation: true,
  useExtendedSearch: true
});

console.log("\nTEST 4 (Ext): '有期徒刑 | '拘役");
console.log(fuseExt.search("'有期徒刑 | '拘役").slice(0,1));
