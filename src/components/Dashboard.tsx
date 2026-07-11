import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import analysisData from '../zhonglian_data.json';
import { Map, Package, X, Building2 } from 'lucide-react';
import TaiwanHeatmap from './TaiwanHeatmap';

// Dynamically calculate cityCounts and productData from the real zhonglian_data.json
const cityCountsRaw: Record<string, number> = {};
const productDataRaw: any[] = [];
let totalBusinesses = 0;

Object.entries(analysisData.productDetails).forEach(([productName, details]) => {
  productDataRaw.push({
    name: productName,
    count: (details as any).count,
    businesses: (details as any).businesses
  });
  
  totalBusinesses += (details as any).count;
  
  (details as any).businesses.forEach((biz: any) => {
    const city = biz.city;
    if (!cityCountsRaw[city]) cityCountsRaw[city] = 0;
    cityCountsRaw[city]++;
  });
});

const cityData = Object.entries(cityCountsRaw)
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count);

const productData = productDataRaw.sort((a, b) => b.count - a.count);

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];

export default function Dashboard() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      
      {/* Hero Poster Section */}
      <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 group">
        <img 
          src="/hero_zh.png" 
          alt="NEXUS Data Analytics Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
        <div className="absolute inset-0 p-8 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg tracking-tight mb-2">
            食安數據總覽 <span className="text-emerald-400">NEXUS</span>
          </h1>
          <p className="text-slate-300 max-w-xl text-lg font-medium drop-shadow-md border-l-4 border-emerald-500 pl-4">
            根據衛福部公告，深度解析福懋、福壽及泰山油品之全台下游波及網路與災情統計。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Building2 className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">受影響總業者數</p>
              <h3 className="text-3xl font-bold text-slate-100">{totalBusinesses} 家</h3>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <Map className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">波及縣市總數</p>
              <h3 className="text-3xl font-bold text-slate-100">{Object.keys(cityCountsRaw).length} 縣市</h3>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Package className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">問題油品種類</p>
              <h3 className="text-3xl font-bold text-slate-100">{productData.length} 項</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Taiwan Geographic Impact Heatmap */}
      <TaiwanHeatmap cityCounts={cityCountsRaw} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-6 flex items-center">
            <Map className="w-5 h-5 mr-2 text-emerald-400" />
            各縣市受波及業者數量
          </h2>
          <div className="h-[600px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                <XAxis type="number" stroke="#475569" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} interval={0} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                  cursor={{fill: '#334155'}}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {cityData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none">
            <img src="/warning_zh.png" alt="Toxic Warning" className="w-full h-full object-cover object-left mask-image-gradient" />
          </div>
          <h2 className="text-lg font-semibold mb-6 flex items-center relative z-10">
            <Package className="w-5 h-5 mr-2 text-cyan-400" />
            問題油品流通數量 (點擊查看名單)
          </h2>
          <div className="h-80 overflow-y-auto pr-4 custom-scrollbar relative z-10">
            <div className="space-y-4">
              {productData.map((prod, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedProduct(prod)}
                  className="w-full text-left bg-slate-800/60 hover:bg-slate-700 p-4 rounded-lg border border-slate-600 flex justify-between items-center transition-colors cursor-pointer group"
                >
                  <span className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">{prod.name}</span>
                  <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-sm font-bold border border-rose-500/30">
                    {prod.count} 家採用
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Business Details */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setSelectedProduct(null)}
          ></div>
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 rounded-t-2xl">
              <div>
                <h3 className="text-2xl font-bold text-emerald-400">{selectedProduct.name}</h3>
                <p className="text-slate-400 text-sm mt-1">共 {selectedProduct.count} 家受影響業者名單</p>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedProduct.businesses.map((biz: any) => (
                  <div key={biz.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-start space-x-3 hover:border-slate-500 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300 font-mono text-xs font-bold">
                      #{biz.id}
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">{biz.name}</div>
                      <div className="text-sm text-slate-400 flex items-center mt-1">
                        <Map className="w-3 h-3 mr-1" /> {biz.city}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
