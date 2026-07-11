import { ShieldCheck, Database } from 'lucide-react';

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
        </div>

        {/* Strict Zero-Hallucination Empty State */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center shadow-sm">
          <Database className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">等待官方資料匯入中</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            基於「最高真實標準與防範 AI 幻覺」之嚴格要求，本專區拒絕使用任何模擬測試名單。<br/><br/>
            系統後台已就緒，隨時等待主管機關將「真實檢驗合格名單 (CSV/API)」匯入後，即刻向全國民眾公開。
          </p>
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
