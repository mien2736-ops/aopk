
import React, { useState, useEffect } from 'react';
import { LogOut, Calendar, Clock, MapPin, RefreshCw, Radio } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
  isSyncing: boolean;
  lastSynced: Date;
}

const Header: React.FC<HeaderProps> = ({ onLogout, isSyncing, lastSynced }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, offset: number) => {
    // UTC 시간을 구한 뒤 오프셋 적용
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const targetDate = new Date(utc + (3600000 * offset));
    return targetDate.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="bg-indigo-600 text-white p-5 rounded-b-[2.5rem] shadow-lg sticky top-0 z-20 transition-all">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">APPK 나트랑 여행</h1>
          <p className="text-indigo-100 text-[10px] flex items-center gap-1 mt-0.5 opacity-80 uppercase font-black tracking-widest">
            <Radio size={10} className={`${isSyncing ? 'animate-pulse text-emerald-400' : 'text-emerald-300'}`} /> 
            Firebase Cloud Live
            <span className="ml-1 opacity-60">· Sync: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <div className={`p-2 bg-indigo-500/30 rounded-full ${isSyncing ? 'animate-spin' : 'opacity-50'}`}>
            <RefreshCw size={14} />
          </div>
          <button 
            onClick={onLogout}
            className="p-2 bg-indigo-500/30 rounded-full hover:bg-indigo-500/50 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <p className="text-indigo-100 text-xs flex items-center gap-1 mb-4 opacity-90">
        <MapPin size={12} /> 멜리아 빈펄 리조트 (The Level)
      </p>

      <div className="flex gap-3">
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
          <Calendar size={14} className="opacity-70" />
          <span className="text-[11px] font-bold">3/20 - 3/23</span>
        </div>
        
        {/* Real-time Clocks */}
        <div className="flex-1 flex gap-2">
          <div className="flex-1 flex flex-col items-center justify-center bg-black/20 px-2 py-1 rounded-xl border border-white/5">
            <span className="text-[8px] opacity-60 font-bold uppercase">나트랑</span>
            <span className="text-[11px] font-black tracking-tighter">{formatTime(now, 7)}</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center bg-black/20 px-2 py-1 rounded-xl border border-white/5">
            <span className="text-[8px] opacity-60 font-bold uppercase">서울</span>
            <span className="text-[11px] font-black tracking-tighter">{formatTime(now, 9)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
