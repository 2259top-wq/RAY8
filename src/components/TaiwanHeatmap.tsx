import { useMemo } from 'react';
import { Map, AlertTriangle } from 'lucide-react';

const REGIONS = [
  {
    name: '北部地區',
    cities: ['基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '宜蘭縣']
  },
  {
    name: '中部地區',
    cities: ['苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣']
  },
  {
    name: '南部地區',
    cities: ['嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣']
  },
  {
    name: '東部與離島',
    cities: ['花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣']
  }
];

export default function TaiwanHeatmap({ cityCounts }: { cityCounts: Record<string, number> }) {
  
  // Find max count to calculate color intensity
  const maxCount = useMemo(() => {
    let max = 1;
    Object.values(cityCounts).forEach(c => {
      if (c > max) max = c;
    });
    return max;
  }, [cityCounts]);

  const getColor = (count: number) => {
    if (!count || count === 0) return 'bg-gray-50 border-gray-200 text-gray-400';
    
    const ratio = count / maxCount;
    if (ratio > 0.75) return 'bg-red-600 border-red-700 text-white shadow-red-200 shadow-lg scale-105 z-10';
    if (ratio > 0.4) return 'bg-red-500 border-red-600 text-white shadow-md';
    if (ratio > 0.1) return 'bg-red-400 border-red-500 text-white';
    return 'bg-red-100 border-red-200 text-red-800';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
        <div className="p-3 bg-red-100 rounded-xl">
          <Map className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-800">全台災情熱區分佈地圖</h2>
          <p className="text-sm text-gray-500 font-medium">各縣市受害廠商數量與嚴重程度指標</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {REGIONS.map(region => (
          <div key={region.name} className="flex flex-col gap-3">
            <h3 className="font-bold text-gray-800 text-center bg-gray-100 py-2 rounded-lg">{region.name}</h3>
            <div className="flex flex-col gap-2">
              {region.cities.map(city => {
                const count = cityCounts[city] || 0;
                return (
                  <div 
                    key={city}
                    className={`flex justify-between items-center px-4 py-3 rounded-xl border transition-all duration-300 ${getColor(count)}`}
                  >
                    <span className="font-bold">{city}</span>
                    <div className="flex items-center gap-2">
                      {count > (maxCount * 0.75) && <AlertTriangle className="w-4 h-4 animate-pulse" />}
                      <span className="font-black text-lg">{count} <span className="text-xs font-normal opacity-80">家</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
