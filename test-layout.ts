import { getCenterOutLayout } from './src/components/layoutUtils';
import fs from 'fs';

const centerNode: any = { id: 'center', type: 'center' };
const leftNodes: any[] = [{ id: 'brand-l', type: 'brand' }, { id: 'prod-l', type: 'product' }];
const leftEdges: any[] = [{ source: 'center', target: 'brand-l' }, { source: 'brand-l', target: 'prod-l' }];
const rightNodes: any[] = [{ id: 'brand-r', type: 'brand' }, { id: 'prod-r', type: 'product' }];
const rightEdges: any[] = [{ source: 'center', target: 'brand-r' }, { source: 'brand-r', target: 'prod-r' }];

const productBizMap: any = {
  'prod-l': [{ id: 'biz-l1', type: 'business' }],
  'prod-r': [{ id: 'biz-r1', type: 'business' }]
};

try {
  const result = getCenterOutLayout(centerNode, leftNodes, leftEdges, rightNodes, rightEdges, productBizMap);
  const nanNodes = result.nodes.filter(n => isNaN(n.position.x) || isNaN(n.position.y));
  console.log("Total nodes:", result.nodes.length);
  console.log("NaN nodes:", nanNodes.length);
  if (nanNodes.length > 0) {
    console.log("Example NaN node:", nanNodes[0]);
  }
} catch (e) {
  console.error(e);
}
