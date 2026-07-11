import { useState } from 'react';
import NetworkGraph from './components/NetworkGraph';
import Dashboard from './components/Dashboard';
import LawAssistant from './components/LawAssistant';
import ZhonglianGraph from './components/ZhonglianGraph';
import QuickCheck from './components/QuickCheck';
import GreenList from './components/GreenList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('zhonglian');

  return (
    <div className="h-screen bg-[#f5f5f5] text-[#333] font-sans flex flex-col overflow-hidden">
      {/* Top Navigation - Akira Style */}
      <div className="w-full bg-white flex justify-center gap-1.5 p-2 shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex-wrap relative z-50 flex-shrink-0">
        <button
          onClick={() => setActiveTab('graph')}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md font-bold text-xs md:text-sm transition-all duration-200 ${
            activeTab === 'graph' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          原始污染追溯網
        </button>
        <button
          onClick={() => setActiveTab('zhonglian')}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md font-bold text-xs md:text-sm transition-all duration-200 ${
            activeTab === 'zhonglian' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          中聯油脂案專區
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md font-bold text-xs md:text-sm transition-all duration-200 ${
            activeTab === 'dashboard' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          數據總覽
        </button>
        <button
          onClick={() => setActiveTab('law')}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md font-bold text-xs md:text-sm transition-all duration-200 ${
            activeTab === 'law' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          法規 RAG 助理
        </button>
        <button
          onClick={() => setActiveTab('greenList')}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md font-bold text-xs md:text-sm transition-all duration-200 ${
            activeTab === 'greenList' 
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md' 
              : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
          }`}
        >
          🟢 安心白名單
        </button>
        <button
          onClick={() => setActiveTab('quickCheck')}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md font-bold text-xs md:text-sm transition-all duration-200 ${
            activeTab === 'quickCheck' 
              ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md' 
              : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
          }`}
        >
          📱 民眾掃雷快查
        </button>
        
        {/* Dedicated Search Routing Button */}
        <button
          onClick={() => setActiveTab('graph')}
          className="px-3 py-1.5 md:px-4 md:py-2 rounded-md font-bold text-xs md:text-sm transition-all duration-200 bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm border border-blue-200 flex items-center gap-1.5 animate-pulse"
        >
          🔍 進入 X光透視搜尋
        </button>
      </div>

      <main className="flex-1 relative overflow-auto custom-scrollbar">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'graph' && <NetworkGraph />}
        {activeTab === 'zhonglian' && <ZhonglianGraph />}
        {activeTab === 'law' && <LawAssistant />}
        {activeTab === 'quickCheck' && <QuickCheck />}
        {activeTab === 'greenList' && <GreenList />}
      </main>

      {/* Global Data Source & Legal Disclaimer Footer */}
      <div className="w-full bg-white border-t border-gray-200 px-6 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 flex flex-col md:flex-row justify-between items-center gap-2 flex-shrink-0">
        <div className="flex flex-col text-[11px] text-gray-500 font-medium w-full md:w-auto">
          <span className="font-bold text-gray-700 mb-1">📊 系統資料來源 (Data Sources) 與查證網址：</span>
          <div className="flex flex-col md:flex-row flex-wrap gap-x-4 gap-y-1">
            <a href="https://www.fda.gov.tw/TC/site.aspx?sid=4069" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">1. 衛福部食藥署 - 劣質豬油事件受波及廠商清單</a>
            <a href="https://www.mirrormedia.mg/" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">2. 鏡週刊 Mirror Media - 品牌與終端產品清單整理</a>
            <a href="https://www.cw.com.tw/" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">3. 天下雜誌 - 受害企業名單彙整與追蹤</a>
          </div>
        </div>
        <div className="text-[10px] text-red-500 font-bold bg-red-50 px-3 py-1.5 rounded-md border border-red-100 mt-2 md:mt-0 w-full md:w-auto text-center">
          ⚠️ 廠商與產品關聯為視覺化展示，一切裁罰與名單以政府最新公告為準。
        </div>
      </div>
    </div>
  );
}

export default App;
