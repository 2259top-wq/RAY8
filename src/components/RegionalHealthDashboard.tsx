import { useState } from 'react';
import { ShieldAlert, MapPin, Search, AlertTriangle } from 'lucide-react';

export default function RegionalHealthDashboard({ 
  regionName, 
  totalCount,
  dataSource,
  data,
  themeColor = 'orange' 
}: { 
  regionName: string, 
  totalCount: number,
  dataSource: string,
  data: any[],
  themeColor?: 'orange' | 'blue'
}) {
  const [query, setQuery] = useState('');

  const filteredData = data.filter(item => {
    const q = query.toLowerCase();
    const matchCompany = item.company.toLowerCase().includes(q);
    const matchBranch = item.branches.some((b: any) => 
      b.name.toLowerCase().includes(q) || 
      b.address.toLowerCase().includes(q) ||
      b.products.some((p: any) => p.name.toLowerCase().includes(q) || p.batch.toLowerCase().includes(q))
    );
    return matchCompany || matchBranch;
  });

  const colorStyles = themeColor === 'orange' ? {
    iconBg: 'bg-orange-100',
    iconText: 'text-orange-600',
    border: 'border-orange-500',
    badgeBg: 'bg-orange-50',
    badgeBorder: 'border-orange-200',
    badgeText: 'text-orange-800',
    cardHover: 'group-hover:border-orange-400 group-hover:shadow-orange-100'
  } : {
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    border: 'border-blue-500',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-800',
    cardHover: 'group-hover:border-blue-400 group-hover:shadow-blue-100'
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500 pb-24 h-full flex flex-col">
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-3 ${colorStyles.iconBg} rounded-xl`}>
              <ShieldAlert className={`w-8 h-8 ${colorStyles.iconText}`} />
            </div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">
              {regionName}衛生局專區
            </h1>
          </div>
          <p className="text-gray-500 font-medium ml-14">
            最新查獲下架油品與受波及下游業者名單 (共 {totalCount} 筆)
          </p>
        </div>

        {/* Source & Disclaimer Badge (User Requested) */}
        <div className={`${colorStyles.badgeBg} border ${colorStyles.badgeBorder} p-4 rounded-xl shadow-sm md:w-auto w-full`}>
          <div className={`text-xs ${colorStyles.iconText} font-bold mb-1 uppercase tracking-wider flex items-center`}>
            <AlertTriangle className="w-4 h-4 mr-1" />
            官方來源與免責聲明
          </div>
          <div className={`font-bold ${colorStyles.badgeText} text-sm mb-1`}>
            資料來源：<span className="text-gray-900">{dataSource}</span>
          </div>
          <div className="text-gray-500 text-xs font-medium mt-2 leading-relaxed max-w-sm">
            本專區資料 100% 來自地方政府官方公告截圖，供民眾避雷參考。若有異動，請依官方最新公告為準。
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative flex-shrink-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="輸入店家名稱、分店、地址、或產品批號查詢..."
          className={`w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-${themeColor}-500 shadow-sm transition-all`}
        />
      </div>

      {/* Results Nested Accordion / Grid */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShieldAlert className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-xl font-bold">查無符合的業者</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredData.map((companyGroup, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className={`bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-3`}>
                  <div className={`w-2 h-6 ${colorStyles.iconBg} rounded-full`}></div>
                  <h2 className="text-xl font-bold text-gray-800">{companyGroup.company}</h2>
                  <span className="text-sm font-medium text-gray-500 bg-gray-200 px-2.5 py-0.5 rounded-full">
                    {companyGroup.branches.length} 家分店
                  </span>
                </div>
                
                <div className="p-5 grid grid-cols-1 xl:grid-cols-2 gap-4 bg-gray-50/30">
                  {companyGroup.branches.filter((b: any) => 
                    query === '' || 
                    b.name.toLowerCase().includes(query.toLowerCase()) || 
                    b.address.toLowerCase().includes(query.toLowerCase()) ||
                    b.products.some((p: any) => p.name.toLowerCase().includes(query.toLowerCase()) || p.batch.toLowerCase().includes(query.toLowerCase())) ||
                    companyGroup.company.toLowerCase().includes(query.toLowerCase())
                  ).map((branch: any, bIdx: number) => (
                    <div key={bIdx} className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all group ${colorStyles.cardHover}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                          {branch.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 ml-6">{branch.address}</p>
                      
                      <div className="space-y-2">
                        {branch.products.map((product: any, pIdx: number) => (
                          <div key={pIdx} className="bg-red-50 border border-red-100 rounded p-3 text-sm flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div className="font-bold text-red-800">{product.name}</div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="bg-white text-red-600 px-2 py-1 rounded border border-red-200 shadow-sm font-mono">
                                批號: {product.batch}
                              </span>
                              <span className="bg-white text-gray-600 px-2 py-1 rounded border border-gray-200 shadow-sm">
                                效期: {product.expiry}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
