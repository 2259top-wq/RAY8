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
    <div className="min-h-screen bg-[#f5f5f5] text-[#333] font-sans">
      {/* Top Navigation - Akira Style */}
      <div className="w-full bg-white flex justify-center gap-2 p-4 shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex-wrap relative z-50">
        <button
          onClick={() => setActiveTab('graph')}
          className={`px-6 py-2.5 rounded-md font-bold text-[0.95rem] transition-all duration-200 ${
            activeTab === 'graph' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          原始污染追溯網
        </button>
        <button
          onClick={() => setActiveTab('zhonglian')}
          className={`px-6 py-2.5 rounded-md font-bold text-[0.95rem] transition-all duration-200 ${
            activeTab === 'zhonglian' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          中聯油脂案專區
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-2.5 rounded-md font-bold text-[0.95rem] transition-all duration-200 ${
            activeTab === 'dashboard' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          數據總覽
        </button>
        <button
          onClick={() => setActiveTab('law')}
          className={`px-6 py-2.5 rounded-md font-bold text-[0.95rem] transition-all duration-200 ${
            activeTab === 'law' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          法規 RAG 助理
        </button>
        <button
          onClick={() => setActiveTab('greenList')}
          className={`px-6 py-2.5 rounded-md font-bold text-[0.95rem] transition-all duration-200 ${
            activeTab === 'greenList' 
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md' 
              : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
          }`}
        >
          🟢 安心白名單
        </button>
        <button
          onClick={() => setActiveTab('quickCheck')}
          className={`px-6 py-2.5 rounded-md font-bold text-[0.95rem] transition-all duration-200 ${
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
          className="ml-4 px-6 py-2.5 rounded-md font-bold text-[0.95rem] transition-all duration-200 bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm border border-blue-200 flex items-center gap-2 animate-pulse"
        >
          🔍 進入 X光透視搜尋
        </button>
      </div>

      <main className="h-[calc(100vh-72px)] relative">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'graph' && <NetworkGraph />}
        {activeTab === 'zhonglian' && <ZhonglianGraph />}
        {activeTab === 'law' && <LawAssistant />}
        {activeTab === 'quickCheck' && <QuickCheck />}
        {activeTab === 'greenList' && <GreenList />}
        
        {/* Legal Disclaimer */}
        <div className="absolute bottom-4 right-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-200 pointer-events-none z-50">
          <p className="text-xs text-gray-500 font-medium">⚠️ 廠商與產品關聯為視覺化展示，<span className="text-red-500 font-bold">一切以政府最新公告為準</span>。</p>
        </div>
      </main>
    </div>
  );
}

export default App;
