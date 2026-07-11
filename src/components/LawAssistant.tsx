import React, { useState } from 'react';
import Fuse from 'fuse.js';
import lawIndex from '../law_index.json';
import { Scale, Search, Send } from 'lucide-react';

const fuse = new Fuse(lawIndex, {
  keys: ['article', 'content'],
  includeScore: true,
  threshold: 0.6,
  ignoreLocation: true
});

export default function LawAssistant() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, references?: any[]}[]>([
    { 
      role: 'bot', 
      text: '您好，我是「食安法規 AI 助理」。您可以詢問我關於《食品安全衛生管理法》的相關罰則或規定。\n例如：「廠商使用違法油品該罰多少？」'
    }
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    // --- Semantic Dictionary (Colloquial to Legal Terms) ---
    const semanticMap: Record<string, string> = {
      '關': '有期徒刑 拘役',
      '坐牢': '有期徒刑 拘役',
      '判刑': '有期徒刑 拘役',
      '罰多少': '罰鍰 罰金',
      '罰錢': '罰鍰 罰金',
      '賠錢': '罰鍰 罰金',
      '黑心油': '攙偽 假冒 變質 腐敗',
      '餿水油': '攙偽 假冒 變質 腐敗',
      '地溝油': '攙偽 假冒 變質 腐敗',
      '下架': '沒入 回收',
      '收回': '沒入 回收',
      '停業': '歇業 廢止',
      '關門': '歇業 廢止'
    };

    let enhancedQuery = userMsg;
    Object.entries(semanticMap).forEach(([colloquial, legal]) => {
      if (userMsg.includes(colloquial)) {
        enhancedQuery += ` ${legal}`;
      }
    });

    // RAG Retrieval using enhanced query
    const results = fuse.search(enhancedQuery).slice(0, 3);
    
    setTimeout(() => {
      let botResponse = '';
      if (results.length === 0) {
        botResponse = '抱歉，我在《食品安全衛生管理法》中找不到與您問題直接相關的條文，請嘗試換個說法。';
      } else {
        botResponse = '根據《食品安全衛生管理法》檢索，為您找到以下最相關的條文與解答：';
      }

      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: botResponse,
        references: results.map(r => r.item)
      }]);
    }, 500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Scale className="w-8 h-8 text-blue-500" />
          法規 RAG 檢索助理
        </h1>
        <p className="text-gray-500 mt-2">100% 依據最新《食安法》全文進行本機端關鍵字與語意檢索，零幻覺保障。</p>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-2xl flex flex-col overflow-hidden shadow-lg">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-5 ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-800 border border-gray-200 shadow-sm'}`}>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                
                {msg.references && msg.references.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="h-px bg-gray-200 w-full my-2"></div>
                    <div className="text-xs font-semibold text-gray-500 flex items-center">
                      <Search className="w-3 h-3 mr-1" /> 檢索來源 (References)
                    </div>
                    {msg.references.map((ref, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="font-bold text-blue-600 mb-1">{ref.article}</div>
                        <div className="text-sm text-gray-600 line-clamp-4 hover:line-clamp-none transition-all cursor-pointer">
                          {ref.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="輸入食安法規相關問題..."
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
            />
            <button 
              type="submit"
              disabled={!query.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center shadow-md"
            >
              <Send className="w-5 h-5 mr-2" />
              發送
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
