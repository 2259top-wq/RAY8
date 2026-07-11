import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  Background
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CenterNode, BrandNode, ProductNode, BusinessNode, GroupBgNode } from './CustomNodes';
import { getCenterOutLayout } from './layoutUtils';
import analysisData from '../zhonglian_data.json';

const nodeTypes = {
  center: CenterNode,
  brand: BrandNode,
  product: ProductNode,
  business: BusinessNode,
  groupBg: GroupBgNode
};

const brands = [
  { id: 'brand-711', label: '統一企業', keyword: '飯糰', color: '#4CAF50', side: 'left' },
  { id: 'brand-curry', label: '聯華食品', keyword: '咖哩', color: '#8BC34A', side: 'left' },
  { id: 'brand-sauce', label: '桂冠實業', keyword: '沙拉醬', color: '#2196F3', side: 'right' },
  { id: 'brand-baking', label: '義美食品', keyword: '餡料', color: '#03A9F4', side: 'right' },
  { id: 'brand-other', label: '其他代工廠', keyword: '油', color: '#FF9800', side: 'right' }
];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [expandedProducts, setExpandedProducts] = useState<string[]>(
    Object.keys(analysisData.productDetails).map(name => `prod-${name}`)
  );
  const [activeBrand, setActiveBrand] = useState<string>('ALL');
  const [renderError, setRenderError] = useState<string | null>(null);
  const { fitView } = useReactFlow();

  const buildGraph = useCallback(() => {
    try {
      setRenderError(null);
      const leftNodes: Node[] = [];
      const leftEdges: Edge[] = [];
      const rightNodes: Node[] = [];
      const rightEdges: Edge[] = [];
      const productBizMap: Record<string, Node[]> = {};

      const centerNode: Node = {
        id: 'center-root',
        type: 'center',
        data: { label: '中聯油脂\n問題大豆沙拉油', color: '#607D8B' },
        position: { x: 0, y: 0 }
      };

      const visibleBrands = activeBrand === 'ALL' 
        ? brands 
        : brands.filter(b => b.label === activeBrand);

      visibleBrands.forEach(brand => {
        const isLeft = brand.side === 'left';
        const nList = isLeft ? leftNodes : rightNodes;
        const eList = isLeft ? leftEdges : rightEdges;

        nList.push({
          id: brand.id,
          type: 'brand',
          data: { label: brand.label, color: brand.color },
          position: { x: 0, y: 0 }
        });

        eList.push({
          id: `edge-center-${brand.id}`,
          source: centerNode.id,
          target: brand.id,
          type: 'default',
          style: { stroke: '#999', strokeWidth: 2, strokeDasharray: '5,5' }
        });
      });

      Object.entries(analysisData.productDetails).forEach(([prodName, details]) => {
        let matchedBrand = brands.find(b => prodName.includes(b.keyword));
        if (!matchedBrand) matchedBrand = brands.find(b => b.id === 'brand-other')!;

        if (activeBrand !== 'ALL' && matchedBrand.label !== activeBrand) return;

        const isLeft = matchedBrand.side === 'left';
        const nList = isLeft ? leftNodes : rightNodes;
        const eList = isLeft ? leftEdges : rightEdges;
        const prodId = `prod-${prodName}`;
        const isExpanded = expandedProducts.includes(prodId);

        nList.push({
          id: prodId,
          type: 'product',
          data: {
            label: prodName,
            color: matchedBrand.color,
            onToggleExpand: () => {
              setExpandedProducts(prev => 
                prev.includes(prodId) ? prev.filter(id => id !== prodId) : [...prev, prodId]
              );
            }
          },
          position: { x: 0, y: 0 }
        });

        eList.push({
          id: `edge-${matchedBrand.id}-${prodId}`,
          source: matchedBrand.id,
          target: prodId,
          type: 'default',
          style: { stroke: '#999', strokeWidth: 2, strokeDasharray: '5,5' }
        });

        if (isExpanded) {
          productBizMap[prodId] = [];
          (details as any).businesses.forEach((biz: any) => {
            const bizId = `biz-${prodId}-${biz.id}`;
            productBizMap[prodId].push({
              id: bizId,
              type: 'business',
              data: { label: biz.name },
              position: { x: 0, y: 0 }
            });

            eList.push({
              id: `edge-${prodId}-${bizId}`,
              source: prodId,
              target: bizId,
              type: 'default',
              style: { stroke: '#ddd', strokeWidth: 1 }
            });
          });
        }
      });

      const layouted = getCenterOutLayout(centerNode, leftNodes, leftEdges, rightNodes, rightEdges, productBizMap);
      
      const finalNodes = [...layouted.nodes];
      
      if (activeBrand === 'ALL' || activeBrand === '統一超商鮮食') {
        const leftsideNodes = finalNodes.filter(n => leftNodes.find(ln => ln.id === n.id) || n.id.startsWith('biz-prod-阜杭') || n.id.startsWith('biz-prod-林聰明') || n.id.startsWith('biz-prod-佛蒙特'));
        const xs = leftsideNodes.map(n => n.position.x).filter(x => !isNaN(x));
        const ys = leftsideNodes.map(n => n.position.y).filter(y => !isNaN(y));
        if (xs.length > 0 && ys.length > 0) {
          const minX = Math.min(...xs) - 60;
          const maxX = Math.max(...xs) + 60;
          const minY = Math.min(...ys) - 60;
          const maxY = Math.max(...ys) + 60;
          finalNodes.unshift({
            id: 'bg-left',
            type: 'groupBg',
            data: { label: '統一企業/聯華食品 (左路)', color: '#4CAF50', textColor: '#2E7D32', width: maxX - minX, height: maxY - minY },
            position: { x: minX, y: minY },
            draggable: false,
            selectable: false,
            focusable: false,
            zIndex: -1
          });
        }
      }

      if (activeBrand === 'ALL' || activeBrand === '義美食品') {
        const rightsideNodes = finalNodes.filter(n => rightNodes.find(rn => rn.id === n.id) || n.id.startsWith('biz-prod-卡士達') || n.id.startsWith('biz-prod-大豆') || n.id.startsWith('biz-prod-一級'));
        const xs = rightsideNodes.map(n => n.position.x).filter(x => !isNaN(x));
        const ys = rightsideNodes.map(n => n.position.y).filter(y => !isNaN(y));
        if (xs.length > 0 && ys.length > 0) {
          const minX = Math.min(...xs) - 60;
          const maxX = Math.max(...xs) + 60;
          const minY = Math.min(...ys) - 60;
          const maxY = Math.max(...ys) + 60;
          finalNodes.unshift({
            id: 'bg-right',
            type: 'groupBg',
            data: { label: '義美食品/桂冠實業 (右路)', color: '#2196F3', textColor: '#1565C0', width: maxX - minX, height: maxY - minY },
            position: { x: minX, y: minY },
            draggable: false,
            selectable: false,
            focusable: false,
            zIndex: -1
          });
        }
      }

      setNodes(finalNodes);
      setEdges(layouted.edges);
      console.log('Nodes:', finalNodes);
      setTimeout(() => fitView({ padding: 0.2, minZoom: 0.1 }), 100);
    } catch (err: any) {
      setRenderError(err.message || String(err));
    }
  }, [expandedProducts, activeBrand, setNodes, setEdges, fitView]);

  useEffect(() => {
    buildGraph();
  }, [buildGraph]);

  return (
    <div className="flex flex-col h-full bg-[#f5f5f5] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Arial,sans-serif]">
      {/* Secondary Navigation - Akira Pill Style */}
      <div className="w-full bg-transparent flex justify-center gap-3 p-4 flex-wrap z-10 relative mt-2">
        <button
          onClick={() => { setActiveBrand('ALL'); }}
          className={`px-5 py-2.5 border-none rounded-full text-[0.95rem] font-bold cursor-pointer text-white transition-all duration-300 shadow-md hover:-translate-y-1 ${
            activeBrand === 'ALL' ? 'opacity-100 ring-4 ring-white ring-offset-2 ring-offset-[#607D8B] scale-105' : 'opacity-90 hover:opacity-100'
          }`}
          style={{ backgroundColor: '#607D8B' }}
        >
          全部顯示
        </button>
        {brands.map(brand => (
          <button
            key={brand.id}
            onClick={() => { setActiveBrand(brand.label); }}
            className={`px-5 py-2.5 border-none rounded-full text-[0.95rem] font-bold cursor-pointer text-white transition-all duration-300 shadow-md hover:-translate-y-1 ${
              activeBrand === brand.label ? 'opacity-100 ring-4 ring-white ring-offset-2 scale-105' : 'opacity-90 hover:opacity-100'
            }`}
            style={{ backgroundColor: brand.color, '--tw-ring-offset-color': brand.color } as any}
          >
            {brand.label}
          </button>
        ))}
        <button
          onClick={() => fitView({ padding: 0.2, minZoom: 0.1, duration: 500 })}
          className="px-5 py-2.5 border-none rounded-full text-[0.95rem] font-bold cursor-pointer text-white transition-all duration-300 shadow-md hover:-translate-y-1 opacity-90 hover:opacity-100"
          style={{ backgroundColor: '#9C27B0' }}
        >
          重設視角
        </button>
      </div>

      <div className="flex-1 w-full relative">
        {renderError && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-red-100 text-red-900 p-8 font-bold text-xl">
            系統發生錯誤: {renderError}
          </div>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2, minZoom: 0.1, maxZoom: 1.2 }}
          minZoom={0.05}
          maxZoom={2}
          className="bg-[#f5f5f5]"
        >
          <Background />
          <Controls className="bg-white border-none shadow-[0_2px_8px_rgba(0,0,0,0.1)] rounded-lg fill-[#333]" />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function ZhonglianGraph() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
