import { useCallback, useEffect, useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { toPng } from 'html-to-image';
import { Search, X, Camera, AlertTriangle } from 'lucide-react';
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
import analysisData from '../analysis_data.json';

const nodeTypes = {
  center: CenterNode,
  brand: BrandNode,
  product: ProductNode,
  business: BusinessNode,
  groupBg: GroupBgNode
};

const brands = [
  { id: 'brand-fomosa', label: '福懋油脂', keyword: '福懋', color: '#FF9800', side: 'right' },
  { id: 'brand-fwusow', label: '福壽實業', keyword: '福壽', color: '#2196F3', side: 'right' },
  { id: 'brand-taisun', label: '泰山企業', keyword: '泰山', color: '#4CAF50', side: 'left' }
];

const quickFilters = [
  { label: '🍪 餅乾零食', query: '餅乾' },
  { label: '🥟 冷凍食品', query: '冷凍' },
  { label: '🧂 調味料', query: '調味' },
  { label: '☕ 烘焙咖啡', query: '烘焙' },
  { label: '🍱 餐飲便當', query: '餐飲' },
  { label: '🛒 量販超市', query: '大賣場' }
];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [expandedProducts, setExpandedProducts] = useState<string[]>(
    Object.values(analysisData.productsByBrand).flatMap(products => products.map(p => `prod-${p.name}`))
  );
  const [activeBrand, setActiveBrand] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const { fitView } = useReactFlow();

  const searchIndex = useMemo(() => {
    const items: any[] = [];
    Object.entries(analysisData.productsByBrand).forEach(([brandLabel, products]) => {
      products.forEach(p => {
        p.businesses.forEach((b: any) => {
          items.push({
            bizId: `biz-${b.id}`,
            prodId: `prod-${p.name}`,
            brandLabel: brandLabel,
            name: b.name,
            tags: b.tags ? b.tags.join(' ') : '',
            product: p.name
          });
        });
      });
    });
    return items;
  }, []);

  const searchStats = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const fuse = new Fuse(searchIndex, { keys: ['name', 'tags', 'product', 'brandLabel'], threshold: 0.4, ignoreLocation: true });
    const results = fuse.search(searchQuery);
    const bizIds = new Set(results.map(r => r.item.bizId));
    const prodIds = new Set(results.map(r => r.item.prodId));
    return { bizCount: bizIds.size, prodCount: prodIds.size };
  }, [searchQuery, searchIndex]);

  const downloadImage = () => {
    const flowElement = document.querySelector('.react-flow') as HTMLElement;
    if (!flowElement) return;
    toPng(flowElement, { backgroundColor: '#f5f5f5', quality: 1, pixelRatio: 2 }).then((dataUrl) => {
      const a = document.createElement('a');
      a.setAttribute('download', `食安追溯報告-${searchQuery || '全覽'}.png`);
      a.setAttribute('href', dataUrl);
      a.click();
    });
  };

  const buildGraph = useCallback(() => {
    const fuse = new Fuse(searchIndex, {
      keys: ['name', 'tags', 'product', 'brandLabel'],
      threshold: 0.4,
      ignoreLocation: true
    });

    let matchedBizIds = new Set<string>();
    let matchedProdIds = new Set<string>();
    let matchedBrandLabels = new Set<string>();
    const isSearching = searchQuery.trim().length > 0;

    if (isSearching) {
      const results = fuse.search(searchQuery);
      results.forEach(r => {
        matchedBizIds.add(r.item.bizId);
        matchedProdIds.add(r.item.prodId);
        matchedBrandLabels.add(r.item.brandLabel);
      });
    }

    const getOpacity = (id: string, type: 'biz' | 'prod' | 'brand' | 'brandLabel') => {
      if (!isSearching) return 1;
      if (type === 'biz' && matchedBizIds.has(id)) return 1;
      if (type === 'prod' && matchedProdIds.has(id)) return 1;
      if (type === 'brandLabel' && matchedBrandLabels.has(id)) return 1;
      return 0.1;
    };

    const leftNodes: Node[] = [];
    const leftEdges: Edge[] = [];
    const rightNodes: Node[] = [];
    const rightEdges: Edge[] = [];
    const productBizMap: Record<string, Node[]> = {};

    const centerNode: Node = {
      id: 'center-root',
      type: 'center',
      data: { label: '問題油品追溯', color: '#607D8B' },
      position: { x: 0, y: 0 }
    };

    brands.forEach((brand, idx) => {
      if (activeBrand !== 'ALL' && activeBrand !== brand.label) return;

      const yOffset = (idx - 1) * 200;
      const bNode: Node = {
        id: brand.id,
        type: 'brand',
        data: { label: brand.label, color: brand.color },
        position: { x: 0, y: yOffset },
        style: { opacity: getOpacity(brand.label, 'brandLabel'), transition: 'opacity 0.3s' }
      };

      const bEdge: Edge = {
        id: `e-center-${brand.id}`,
        source: 'center-root',
        target: brand.id,
        animated: true,
        style: { stroke: brand.color, strokeWidth: 2, strokeDasharray: '5,5', opacity: getOpacity(brand.label, 'brandLabel'), transition: 'opacity 0.3s' }
      };

      if (brand.side === 'left') {
        leftNodes.push(bNode);
        leftEdges.push(bEdge);
      } else {
        rightNodes.push(bNode);
        rightEdges.push(bEdge);
      }

      const brandProducts = analysisData.productsByBrand[brand.label as keyof typeof analysisData.productsByBrand] || [];
      
      brandProducts.forEach((productDetails) => {
        const prodName = productDetails.name;
        const pNodeId = `prod-${prodName}`;
        const pNode: Node = {
          id: pNodeId,
          type: 'product',
          data: { 
            label: prodName, 
            color: brand.color,
            isExpanded: expandedProducts.includes(pNodeId),
            onToggle: () => {
              setExpandedProducts(prev => 
                prev.includes(pNodeId) ? prev.filter(id => id !== pNodeId) : [...prev, pNodeId]
              );
            }
          },
          position: { x: 0, y: 0 },
          style: { opacity: getOpacity(pNodeId, 'prod'), transition: 'opacity 0.3s' }
        };

        const pEdge: Edge = {
          id: `e-${brand.id}-${pNodeId}`,
          source: brand.id,
          target: pNodeId,
          animated: true,
          style: { stroke: brand.color, strokeWidth: 1.5, strokeDasharray: '3,3', opacity: getOpacity(pNodeId, 'prod'), transition: 'opacity 0.3s' }
        };

        if (brand.side === 'left') {
          leftNodes.push(pNode);
          leftEdges.push(pEdge);
        } else {
          rightNodes.push(pNode);
          rightEdges.push(pEdge);
        }

        if (expandedProducts.includes(pNodeId)) {
          productBizMap[pNodeId] = [];
          const processedBizIds = new Set<number>();
          
          productDetails.businesses.forEach((biz: { id: number; name: string; city: string }) => {
            if (processedBizIds.has(biz.id)) return;
            processedBizIds.add(biz.id);

            const bizId = `biz-${biz.id}`;
            const bizNode: Node = {
              id: bizId,
              type: 'business',
              data: { label: biz.name, color: brand.color },
              position: { x: 0, y: 0 },
              style: { opacity: getOpacity(bizId, 'biz'), transition: 'opacity 0.3s' }
            };
            productBizMap[pNodeId].push(bizNode);

            const bizEdge: Edge = {
              id: `e-${pNodeId}-${bizId}`,
              source: pNodeId,
              target: bizId,
              animated: false,
              style: { stroke: brand.color, strokeWidth: 1, opacity: isSearching ? getOpacity(bizId, 'biz') : 0.5, transition: 'opacity 0.3s' }
            };

            // Edges and nodes are collected; layoutUtils will deduplicate the nodes globally
            if (brand.side === 'left') {
              leftNodes.push(bizNode);
              leftEdges.push(bizEdge);
            } else {
              rightNodes.push(bizNode);
              rightEdges.push(bizEdge);
            }
          });
        }
      });
    });

    const layouted = getCenterOutLayout(
      centerNode,
      leftNodes,
      leftEdges,
      rightNodes,
      rightEdges,
      productBizMap
    );

    const bgNodes: Node[] = [];
    ['left', 'right'].forEach(side => {
      const bNodes = layouted.nodes.filter(n => n.type === 'brand' && brands.find(b => b.id === n.id)?.side === side);
      if (bNodes.length === 0) return;

      const pNodes = layouted.nodes.filter(n => n.type === 'product' && 
        bNodes.some(b => layouted.edges.find(e => e.source === b.id && e.target === n.id))
      );
      const bizNodes = layouted.nodes.filter(n => n.type === 'business' &&
        pNodes.some(p => layouted.edges.find(e => e.source === p.id && e.target === n.id))
      );

      const allSideNodes = [...bNodes, ...pNodes, ...bizNodes];
      if (allSideNodes.length === 0) return;

      const xs = allSideNodes.map(n => n.position.x);
      const ys = allSideNodes.map(n => n.position.y);
      const minX = Math.min(...xs) - 80;
      const maxX = Math.max(...xs) + 120;
      const minY = Math.min(...ys) - 80;
      const maxY = Math.max(...ys) + 120;

      bgNodes.push({
        id: `bg-${side}`,
        type: 'groupBg',
        position: { x: minX, y: minY },
        data: { 
          width: maxX - minX, 
          height: maxY - minY,
          label: side === 'left' ? '泰山企業' : '福壽、福懋',
          color: side === 'left' ? '#4CAF50' : '#2196F3'
        },
        draggable: false,
        selectable: false,
        focusable: false,
        zIndex: -1,
        style: { width: maxX - minX, height: maxY - minY }
      });
    });

    const finalNodes = [...bgNodes, ...layouted.nodes];
    setNodes([
      { id: 'center-root', type: 'center', data: { label: '問題油品追溯', color: '#607D8B' }, position: { x: 0, y: 0 } },
      ...finalNodes
    ]);
    setEdges(layouted.edges);

    setTimeout(() => {
      fitView({ padding: 0.2, duration: 800 });
    }, 100);

  }, [expandedProducts, activeBrand, searchQuery, searchIndex, fitView, setNodes, setEdges]);

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
        <button
          onClick={() => { setActiveBrand('泰山企業'); }}
          className={`px-5 py-2.5 border-none rounded-full text-[0.95rem] font-bold cursor-pointer text-white transition-all duration-300 shadow-md hover:-translate-y-1 ${
            activeBrand === '泰山企業' ? 'opacity-100 ring-4 ring-white ring-offset-2 ring-offset-[#4CAF50] scale-105' : 'opacity-90 hover:opacity-100'
          }`}
          style={{ backgroundColor: '#4CAF50' }}
        >
          泰山企業
        </button>
        <button
          onClick={() => { setActiveBrand('福壽實業'); }}
          className={`px-5 py-2.5 border-none rounded-full text-[0.95rem] font-bold cursor-pointer text-white transition-all duration-300 shadow-md hover:-translate-y-1 ${
            activeBrand === '福壽實業' ? 'opacity-100 ring-4 ring-white ring-offset-2 ring-offset-[#2196F3] scale-105' : 'opacity-90 hover:opacity-100'
          }`}
          style={{ backgroundColor: '#2196F3' }}
        >
          福壽實業
        </button>
        <button
          onClick={() => { setActiveBrand('福懋油脂'); }}
          className={`px-5 py-2.5 border-none rounded-full text-[0.95rem] font-bold cursor-pointer text-white transition-all duration-300 shadow-md hover:-translate-y-1 ${
            activeBrand === '福懋油脂' ? 'opacity-100 ring-4 ring-white ring-offset-2 ring-offset-[#FF9800] scale-105' : 'opacity-90 hover:opacity-100'
          }`}
          style={{ backgroundColor: '#FF9800' }}
        >
          福懋油脂
        </button>
        <button
          onClick={() => fitView({ padding: 0.2, minZoom: 0.1, duration: 500 })}
          className="px-5 py-2.5 border-none rounded-full text-[0.95rem] font-bold cursor-pointer text-white transition-all duration-300 shadow-md hover:-translate-y-1 opacity-90 hover:opacity-100"
          style={{ backgroundColor: '#9C27B0' }}
        >
          重設視角
        </button>
      </div>

      {/* Floating Search Bar & Dashboard */}
      <div className="absolute top-8 right-8 z-10 flex flex-col gap-3 pointer-events-none items-end">
        {/* Search Input */}
        <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-gray-200 flex items-center pointer-events-auto transition-all focus-within:ring-2 focus-within:ring-blue-500 w-[340px]">
          <Search className="w-5 h-5 text-gray-400 ml-2 mr-2" />
          <input
            type="text"
            placeholder="X光透視：搜尋「餅乾」或「便當」..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 font-medium py-1.5"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-1.5 justify-end w-[340px] pointer-events-auto">
          {quickFilters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => setSearchQuery(filter.query)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                searchQuery === filter.query
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Impact Summary Dashboard */}
        {searchQuery.trim().length > 0 && searchStats && (
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-red-100 pointer-events-auto w-[340px] mt-2 animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-gray-800 text-sm">X光透視 災情統計</h3>
            </div>
            <div className="flex justify-between bg-red-50 p-3 rounded-xl border border-red-100">
              <div className="flex flex-col items-center flex-1 border-r border-red-200">
                <span className="text-xs text-red-600 font-bold mb-1">受害業者</span>
                <span className="text-2xl font-black text-red-700">{searchStats.bizCount} <span className="text-xs font-medium text-red-500">家</span></span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs text-red-600 font-bold mb-1">牽連油品</span>
                <span className="text-2xl font-black text-red-700">{searchStats.prodCount} <span className="text-xs font-medium text-red-500">項</span></span>
              </div>
            </div>
            <button 
              onClick={downloadImage}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-xl text-xs font-bold transition-colors shadow-md"
            >
              <Camera className="w-4 h-4" />
              📥 匯出當前畫面 (PNG)
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 w-full relative">
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

export default function NetworkGraph() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
