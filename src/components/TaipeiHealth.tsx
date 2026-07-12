import React, { useState } from 'react';
import { ShieldAlert, MapPin, FileText, Search } from 'lucide-react';
import taipeiData from '../taipei_health_data.json';

export default function TaipeiHealth() {
  const [query, setQuery] = useState('');

  const filteredData = taipeiData.filter(item => 
    item.clientName.toLowerCase().includes(query.toLowerCase()) ||
    item.address.toLowerCase().includes(query.toLowerCase()) ||
    item.orderNumbers.some(num => num.includes(query))
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500 pb-24 h-full flex flex-col">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-100 rounded-xl">
              <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">
              臺北市政府衛生局專區
            </h1>
          </div>
          <p className="text-gray-500 font-medium ml-14">
            最新查獲下架油品與受波及下游業者名單 (共 {taipeiData.length} 家)
          </p>
        </div>

        {/* Source Warning Badge */}
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl shadow-sm md:w-auto w-full">
          <div className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-wider">⚠️ 污染源追溯公告</div>
          <div className="text-orange-800 font-bold flex items-center">
            來源：<span className="text-red-600 ml-1 text-lg">南僑油脂公司</span>
          </div>
          <div className="text-orange-600 text-sm font-medium mt-1">
            受影響品項：大豆油產製品
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
          placeholder="輸入店家名稱、地址、或出貨單號查詢..."
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm transition-all"
        />
      </div>

      {/* Results Grid */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShieldAlert className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-xl font-bold">查無符合的業者</p>
            <p className="text-sm mt-2">請嘗試其他關鍵字</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500 group-hover:w-2 transition-all"></div>
                
                <h3 className="font-bold text-lg text-gray-800 mb-3 pl-2 line-clamp-1 group-hover:text-red-600 transition-colors">
                  {item.clientName}
                </h3>
                
                <div className="flex items-start gap-2 text-gray-600 mb-3 pl-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-gray-400" />
                  <span className="text-sm">{item.address}</span>
                </div>

                <div className="pl-2 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-500">涉案出貨單號 ({item.orderNumbers.length} 筆)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.orderNumbers.map((num, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-mono border border-gray-200">
                        #{num}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
