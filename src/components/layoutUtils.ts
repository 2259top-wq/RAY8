import dagre from 'dagre';
import type { Node, Edge } from '@xyflow/react';
import { Position } from '@xyflow/react';

export const getCenterOutLayout = (
  centerNode: Node,
  leftNodes: Node[],
  leftEdges: Edge[],
  rightNodes: Node[],
  rightEdges: Edge[],
  productBizMap: Record<string, Node[]>
) => {
  const dagreRight = new dagre.graphlib.Graph();
  dagreRight.setDefaultEdgeLabel(() => ({}));
  // Increase ranksep to give nodes room to breathe, decrease nodesep for compact business dots
  dagreRight.setGraph({ rankdir: 'LR', nodesep: 20, ranksep: 250 });

  const dagreLeft = new dagre.graphlib.Graph();
  dagreLeft.setDefaultEdgeLabel(() => ({}));
  dagreLeft.setGraph({ rankdir: 'RL', nodesep: 20, ranksep: 250 });

  // Center node in both graphs
  dagreRight.setNode(centerNode.id, { width: 120, height: 120 });
  dagreLeft.setNode(centerNode.id, { width: 120, height: 120 });

  // Brands and Products
  rightNodes.forEach(n => {
    dagreRight.setNode(n.id, { width: n.type === 'brand' ? 100 : 150, height: 60 });
  });
  leftNodes.forEach(n => {
    dagreLeft.setNode(n.id, { width: n.type === 'brand' ? 100 : 150, height: 60 });
  });

  // Assign businesses to Left or Right based on their first product connection
  const bizSideMap: Record<string, 'left' | 'right'> = {};
  const uniqueBizNodes: Record<string, Node> = {};
  
  Object.entries(productBizMap).forEach(([pNodeId, bizNodes]) => {
    const isRight = rightNodes.some(n => n.id === pNodeId);
    const side = isRight ? 'right' : 'left';
    
    bizNodes.forEach(biz => {
      if (!uniqueBizNodes[biz.id]) {
        uniqueBizNodes[biz.id] = biz;
        bizSideMap[biz.id] = side;
        if (side === 'right') {
          dagreRight.setNode(biz.id, { width: 50, height: 50 });
        } else {
          dagreLeft.setNode(biz.id, { width: 50, height: 50 });
        }
      }
    });
  });

  // Add intra-side edges to Dagre
  rightEdges.forEach(e => {
    // Only add to dagre if BOTH source and target are in dagreRight
    // e.target could be a bizId
    if (e.target.startsWith('biz-')) {
      if (bizSideMap[e.target] === 'right') dagreRight.setEdge(e.source, e.target);
    } else {
      dagreRight.setEdge(e.source, e.target);
    }
  });

  leftEdges.forEach(e => {
    if (e.target.startsWith('biz-')) {
      if (bizSideMap[e.target] === 'left') dagreLeft.setEdge(e.source, e.target);
    } else {
      dagreLeft.setEdge(e.source, e.target);
    }
  });

  dagre.layout(dagreRight);
  dagre.layout(dagreLeft);

  const centerPosRight = dagreRight.node(centerNode.id);
  const centerPosLeft = dagreLeft.node(centerNode.id);

  const finalNodes: Node[] = [];

  finalNodes.push({
    ...centerNode,
    position: { x: 0, y: 0 },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  });

  // Extract all final nodes correctly positioned relative to Center(0,0)
  const processNodes = (nodes: Node[], dagreGraph: any, centerPos: any, isLeft: boolean) => {
    nodes.forEach(node => {
      const pos = dagreGraph.node(node.id);
      if (pos) {
        finalNodes.push({
          ...node,
          position: { x: pos.x - centerPos.x, y: pos.y - centerPos.y },
          targetPosition: isLeft ? Position.Right : Position.Left,
          sourcePosition: isLeft ? Position.Left : Position.Right,
        });
      }
    });
  };

  processNodes(rightNodes, dagreRight, centerPosRight, false);
  processNodes(leftNodes, dagreLeft, centerPosLeft, true);

  // Process unique business nodes
  Object.values(uniqueBizNodes).forEach(biz => {
    const isLeft = bizSideMap[biz.id] === 'left';
    const dagreGraph = isLeft ? dagreLeft : dagreRight;
    const centerPos = isLeft ? centerPosLeft : centerPosRight;
    
    const pos = dagreGraph.node(biz.id);
    if (pos) {
      finalNodes.push({
        ...biz,
        position: { x: pos.x - centerPos.x, y: pos.y - centerPos.y },
        targetPosition: isLeft ? Position.Right : Position.Left,
        sourcePosition: isLeft ? Position.Left : Position.Right,
      });
    }
  });

  return { nodes: finalNodes, edges: [...leftEdges, ...rightEdges] };
};
