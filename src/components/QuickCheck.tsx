import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import analysisData from '../analysis_data.json';

export default function QuickCheck() {
  const [query, setQuery] = useState('');

  // Re-use the same search index logic
  const searchIndex = useMemo(() => {
    const items: any[] = [];
    Object.entries(analysisData.productsByBrand).forEach(([, products]) => {
      products.forEach((p: any) => {
        p.businesses.forEach((b: any) => {
          items.push({
            name: b.name,
            tags: b.tags ? b.tags.join(' ') : '',
            product: p.name,
            endProductsRaw: b.endProducts || [],
            endProducts: b.endProducts ? b.endProducts.join(' ') : ''
          });
        });
      });
    });
    return items;
  }, []);

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const fuse = new Fuse(searchIndex, { keys: ['name', 'tags', 'product', 'endProducts'], threshold: 0.3 });
    const results = fuse.search(query);
    
    if (results.length === 0) return { isSafe: true };
    
    const badProducts = new Set<string>();
    const badCompanies = new Set<string>();
    
    results.forEach(r => {
      badCompanies.add(r.item.name);
      if (r.item.endProductsRaw && r.item.endProductsRaw.length > 0) {
        r.item.endProductsRaw.forEach((ep: string) => badProducts.add(ep));
      }
    });

    return {
      isSafe: false,
      companies: Array.from(badCompanies),
      products: Array.from(badProducts)
    };
  }, [query, searchIndex]);

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col items-center p-6 overflow-y-auto">
      <div className="w-full max-w-md mt-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-4">
            <ShieldCheck className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">民眾快查模式</h1>
          <p className="text-gray-500 font-medium">輸入您想確認的商品或店家名稱，立刻掃雷！</p>
        </div>

        <div className="relative mb-8 shadow-2xl rounded-2xl overflow-hidden">
          <input
            type="text"
            placeholder="例如：香鬆、排骨便當、聯華..."
            className="w-full text-xl py-5 pl-14 pr-6 border-0 focus:ring-4 focus:ring-blue-500 bg-white font-bold text-gray-800 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-5 top-5 w-7 h-7 text-gray-400" />
        </div>

        {query.trim() && searchResults && (
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
            {searchResults.isSafe ? (
              <div className="bg-green-50 border-2 border-green-500 rounded-3xl p-8 text-center shadow-lg">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-black text-green-700 mb-2">綠燈！安全通過</h2>
                <p className="text-green-600 font-medium text-lg">目前「未在」問題名單內，請安心購買。</p>
              </div>
            ) : (
              <div className="bg-red-50 border-2 border-red-500 rounded-3xl p-8 text-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-red-600 animate-pulse"></div>
                <AlertTriangle className="w-20 h-20 text-red-600 mx-auto mb-4 animate-bounce" />
                <h2 className="text-3xl font-black text-red-700 mb-2">🚨 紅燈！中標警報</h2>
                <p className="text-red-600 font-bold text-lg mb-6">您搜尋的項目已牽連問題油品！</p>
                
                <div className="bg-white rounded-xl p-4 text-left border border-red-200">
                  <h3 className="font-bold text-gray-800 mb-2 border-b pb-2">牽連業者：</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {searchResults.companies?.slice(0, 5).map(c => (
                      <span key={c} className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-bold">{c}</span>
                    ))}
                    {searchResults.companies && searchResults.companies.length > 5 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm">+{searchResults.companies.length - 5} 家</span>
                    )}
                  </div>

                  {searchResults.products && searchResults.products.length > 0 && (
                    <>
                      <h3 className="font-bold text-gray-800 mb-2 border-b pb-2">具體警示產品：</h3>
                      <ul className="text-sm text-red-600 font-bold space-y-1">
                        {searchResults.products.map(p => (
                          <li key={p}>• {p}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 text-center text-xs text-gray-400 font-medium pb-8">
          ⚠️ 本系統掃雷結果係依據政府最新公告之「問題廠商與產品清單」進行比對，一切真實食安資訊與裁罰名單，請務必以衛福部食藥署官方公告為準。
        </div>
      </div>
    </div>
  );
}
