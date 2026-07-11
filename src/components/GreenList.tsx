import { CheckCircle2, ShieldCheck, Award, FileCheck, AlertTriangle } from 'lucide-react';

const safeCompanies = [
  {
    name: '統一超商 (7-11)',
    status: '全品項未採購',
    certificate: 'SGS 檢驗合格',
    date: '2026/07/10',
    description: '經內部清查與第三方公證單位確認，全台門市販售之鮮食、便當、關東煮等，均未採購清單中之問題油品。',
  },
  {
    name: '全家便利商店',
    status: '自主送驗合格',
    certificate: 'FDA 認證實驗室',
    date: '2026/07/09',
    description: '秉持最高食安標準，所有熱食與烘焙產品皆採用通過 ISO22000 認證之安全供應鏈。',
  },
  {
    name: '鼎泰豐',
    status: '專用油品證明',
    certificate: '進口履歷確認',
    date: '2026/07/11',
    description: '本店全面使用原裝進口之高級植物油與自榨豬油，絕無混充市售疑慮油品，請消費者安心享用。',
  },
  {
    name: '麥當勞 (台灣)',
    status: '全球標準檢驗',
    certificate: '食品安全溯源',
    date: '2026/07/10',
    description: '所有炸油均落實每日測量與定期更換，且供應商均非本次事件之涉案廠商。',
  }
];

export default function GreenList() {
  return (
    <div className="w-full h-full bg-[#f8fcf8] overflow-y-auto p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4">
            <ShieldCheck className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-4">安心白名單專區</h1>
          <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto mb-6">
            危機時刻，政府與您站在一起。以下列出經主動清查、送驗合格，且確認「未採購」問題油品之優良示範大廠。
          </p>
          
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 text-left max-w-3xl mx-auto mb-8 shadow-sm">
            <h4 className="font-bold text-red-700 flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5" /> 系統建置聲明與免責條款
            </h4>
            <p className="text-sm text-red-600 font-medium">
              本頁面目前顯示之廠商（如統一超商、鼎泰豐等）為**「系統介面展示用之虛擬範例資料」**。本系統做為架構展示，尚未介接衛福部食藥署即時 API。實務上線時，本區塊將由主管機關每日匯入官方核定之合格清單。**一切真實食安資訊，請務必以政府官方最新公告為準！**
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safeCompanies.map((company, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-green-100 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  {company.name}
                </h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                  {company.status}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6 min-h-[48px]">
                {company.description}
              </p>
              
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  <Award className="w-4 h-4" />
                  {company.certificate}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <FileCheck className="w-4 h-4" />
                  {company.date}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <p className="text-blue-800 font-medium">
            💡 企業申請加入白名單：請備妥第三方檢驗報告與進貨憑證，透過政府食安專線進行快速通關審核。
          </p>
        </div>
      </div>
    </div>
  );
}
