
import React from 'react';
import { PHRASES, CURRENCY_TIPS } from '../constants';
import { Languages, Banknote, AlertTriangle } from 'lucide-react';

const InfoTab: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Essential Phrases */}
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

      {/* Currency Tips */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <Banknote size={18} />
          </div>
          <h3 className="font-bold text-slate-800">베트남 화폐 구분 팁</h3>
        </div>
        
        <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-4">
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
    </div>
  );
};

export default InfoTab;
