
import React, { useState } from 'react';
import { PHRASES, CURRENCY_TIPS } from '../constants';
import { Languages, Banknote, AlertTriangle, StickyNote, Plus, ChevronLeft, Trash2, Save, Clock } from 'lucide-react';
import { Memo, User } from '../types';

interface InfoTabProps {
  memos: Memo[];
  onUpdateMemos: (newMemos: Memo[]) => void;
  user: User;
}

const InfoTab: React.FC<InfoTabProps> = ({ memos, onUpdateMemos, user }) => {
  const [detailMemo, setDetailMemo] = useState<Memo | null>(null);

  const addMemo = () => {
    const newMemo: Memo = {
      id: Math.random().toString(36).substr(2, 9),
      title: '새 메모',
      content: '',
      updatedAt: Date.now(),
      createdBy: user.name
    };
    onUpdateMemos([newMemo, ...memos]);
    setDetailMemo(newMemo);
  };

  const updateMemo = (id: string, updates: Partial<Memo>) => {
    const updated = memos.map(m => m.id === id ? { ...m, ...updates, updatedAt: Date.now() } : m);
    onUpdateMemos(updated);
  };

  const deleteMemo = (id: string) => {
    if (window.confirm('이 메모를 삭제하시겠습니까?')) {
      onUpdateMemos(memos.filter(m => m.id !== id));
      setDetailMemo(null);
    }
  };

  if (detailMemo) {
    return (
      <div className="fixed inset-0 bg-white z-[60] animate-fadeIn flex flex-col">
        <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0">
          <button 
            onClick={() => setDetailMemo(null)}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-600"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 px-4">
            <input 
              type="text"
              value={detailMemo.title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setDetailMemo(prev => prev ? { ...prev, title: newTitle } : null);
                updateMemo(detailMemo.id, { title: newTitle });
              }}
              className="w-full text-center font-bold text-slate-800 border-none focus:ring-0 p-0 text-sm"
              placeholder="제목 없음"
            />
          </div>
          <button 
            onClick={() => deleteMemo(detailMemo.id)}
            className="p-2 text-slate-300 hover:text-rose-500"
          >
            <Trash2 size={20} />
          </button>
        </div>
        
        <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
          <textarea
            value={detailMemo.content}
            onChange={(e) => {
              const newContent = e.target.value;
              setDetailMemo(prev => prev ? { ...prev, content: newContent } : null);
              updateMemo(detailMemo.id, { content: newContent });
            }}
            placeholder="여기에 자유롭게 메모를 남기세요..."
            className="w-full h-full bg-slate-50 border-none rounded-3xl p-6 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-100 resize-none leading-relaxed placeholder:text-slate-300"
          />
        </div>

        <div className="p-4 bg-indigo-50 border-t border-indigo-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold">
            <Clock size={12} />
            최종 수정: {new Date(detailMemo.updatedAt).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 font-black uppercase tracking-widest">
            <Save size={12} /> Auto Saved
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* 1. Notepad (Memo) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
              <StickyNote size={18} />
            </div>
            <h3 className="font-bold text-slate-800">잡다한 메모장</h3>
          </div>
          <button 
            onClick={addMemo}
            className="p-1.5 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 active:scale-90 transition-transform"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {memos.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
              <p className="text-xs text-slate-400 font-medium">작성된 메모가 없습니다.<br/>위의 + 버튼을 눌러 메모를 시작하세요!</p>
            </div>
          ) : (
            memos.map((memo) => (
              <button 
                key={memo.id}
                onClick={() => setDetailMemo(memo)}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-left hover:border-indigo-200 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800 truncate pr-4">{memo.title || '제목 없음'}</h4>
                  <span className="text-[9px] text-slate-400 font-bold shrink-0">{new Date(memo.updatedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                  {memo.content || '내용 없음'}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center text-[8px] font-black text-indigo-600">
                    {memo.createdBy.charAt(0)}
                  </div>
                  <span className="text-[9px] text-indigo-400 font-bold">{memo.createdBy}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      {/* 2. Currency Tips */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <Banknote size={18} />
          </div>
          <h3 className="font-bold text-slate-800">베트남 화폐 구분 팁</h3>
        </div>
        
        <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-4 shadow-sm">
          <div className="bg-amber-50 p-4 rounded-2xl flex gap-3 border border-amber-100">
            <AlertTriangle className="text-amber-600 shrink-0" size={20} />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              베트남 화폐는 단위가 크고 색상이 유사한 지폐가 많아 혼동하기 쉽습니다. <span className="underline decoration-amber-300 decoration-2">큰 지폐는 미리 따로 보관</span>하는 것이 좋습니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {CURRENCY_TIPS.map((tip, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: tip.hex }}></div>
                  <span className="text-[10px] font-bold text-slate-500">{tip.color}</span>
                </div>
                <p className="text-sm font-black text-slate-800">{tip.value}</p>
                <p className="text-[10px] text-indigo-600 font-bold mt-0.5">{tip.note}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">간편 환율 계산법</h4>
            <div className="bg-indigo-600 text-white p-4 rounded-2xl text-center">
              <p className="text-lg font-black">0 하나 빼고 나누기 2</p>
              <p className="text-[10px] opacity-80 mt-1">예: 100,000동 → 10,000 → 5,000원</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Essential Phrases */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
            <Languages size={18} />
          </div>
          <h3 className="font-bold text-slate-800">기초 베트남어</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {PHRASES.map((phrase, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-2xl border ${
                phrase.highlight 
                  ? 'bg-rose-50 border-rose-100 shadow-sm ring-1 ring-rose-200' 
                  : 'bg-white border-slate-100'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className={`text-sm font-bold ${phrase.highlight ? 'text-rose-600' : 'text-slate-400'}`}>
                  {phrase.korean}
                </p>
                {phrase.highlight && (
                  <span className="text-[10px] bg-rose-200 text-rose-700 px-2 py-0.5 rounded-full font-black uppercase">Most Needed</span>
                )}
              </div>
              <h4 className={`text-xl font-black ${phrase.highlight ? 'text-rose-700' : 'text-slate-800'}`}>
                {phrase.vietnamese}
              </h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">발음: {phrase.pronunciation}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InfoTab;
