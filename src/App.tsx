import { useState } from 'react';
import NetworkGraph from './components/NetworkGraph';
import Dashboard from './components/Dashboard';
import LawAssistant from './components/LawAssistant';
import ZhonglianGraph from './components/ZhonglianGraph';
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
      </div>

      <main className="h-[calc(100vh-72px)]">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'graph' && <NetworkGraph />}
        {activeTab === 'zhonglian' && <ZhonglianGraph />}
        {activeTab === 'law' && <LawAssistant />}
      </main>
    </div>
  );
}

export default App;
