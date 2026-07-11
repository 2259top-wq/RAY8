import dagre from 'dagre';

const getGridDimensions = (numBiz) => {
  const cellW = 120;
  const cellH = 90;
  if (numBiz === 0) return { cols: 1, rows: 1, cellW, cellH, width: 0, height: 0 };
  const cols = Math.min(6, Math.ceil(Math.sqrt(numBiz)));
  const rows = Math.ceil(numBiz / cols);
  return { cols, rows, cellW, cellH, width: cols * cellW, height: rows * cellH };
};

const centerNode = { id: 'center', type: 'center' };
const rightNodes = [{ id: 'brand-r', type: 'brand' }, { id: 'prod-r', type: 'product' }];
const rightEdges = [{ source: 'center', target: 'brand-r' }, { source: 'brand-r', target: 'prod-r' }];

const productBizMap = {
  'prod-r': [{ id: 'biz-r1', type: 'business' }]
};

const dagreRight = new dagre.graphlib.Graph();
dagreRight.setDefaultEdgeLabel(() => ({}));
dagreRight.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 180 });

dagreRight.setNode(centerNode.id, { width: 120, height: 120 });
rightNodes.forEach(n => {
  if (n.type === 'brand') {
    dagreRight.setNode(n.id, { width: 100, height: 100 });
  } else if (n.type === 'product') {
    const bizList = productBizMap[n.id] || [];
    const grid = getGridDimensions(bizList.length);
    dagreRight.setNode(n.id, { width: 120 + grid.width, height: Math.max(100, grid.height) });
  }
});
rightEdges.forEach(e => {
  if (!e.target.startsWith('biz-')) {
    dagreRight.setEdge(e.source, e.target);
  }
});

dagre.layout(dagreRight);

const centerPosRight = dagreRight.node(centerNode.id);
console.log("CenterPosRight:", centerPosRight);

rightNodes.forEach(node => {
  const pos = dagreRight.node(node.id);
  console.log("Node:", node.id, pos);
  
  if (node.type === 'product') {
    const bizList = productBizMap[node.id] || [];
    const grid = getGridDimensions(bizList.length);
    const prodX = (pos.x - centerPosRight.x) - grid.width / 2;
    const prodY = pos.y - centerPosRight.y;
    console.log("Product Layout:", { prodX, prodY, grid });
  }
});
