
import React, { useState, useEffect } from 'react';
import { LogOut, Clock, MapPin, RefreshCw, Radio, Timer } from 'lucide-react';

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
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const targetDate = new Date(utc + (3600000 * offset));
    return targetDate.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const calculateDDay = () => {
    const target = new Date('2026-03-20T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `D-${days}`;
    if (days === 0) return 'D-Day';
    return `Day ${Math.abs(days) + 1}`;
  };

  return (
    <div className="bg-indigo-600 text-white p-5 rounded-b-[2.5rem] shadow-lg sticky top-0 z-20 transition-all">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-xl font-black tracking-tight">APPK 나트랑여행 <span className="text-indigo-200 font-medium text-sm ml-1">(March 20~23)</span></h1>
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

      <div className="flex gap-2 items-center">
        {/* D-Day Badge - Consistent color, no pulse */}
        <div className="flex-none flex items-center gap-2 bg-indigo-500/40 px-4 py-2.5 rounded-xl border border-white/10 shadow-sm">
          <Timer size={16} className="text-white" />
          <span className="text-sm font-black tracking-tighter">{calculateDDay()}</span>
        </div>
        
        {/* Consolidated Real-time Clocks - Larger size to match D-Day */}
        <div className="flex-1 flex items-center justify-center gap-4 bg-black/20 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] opacity-70 font-bold uppercase tracking-tighter">나트랑</span>
            <span className="text-sm font-black tracking-tight">{formatTime(now, 7)}</span>
          </div>
          <div className="w-[1px] h-4 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] opacity-70 font-bold uppercase tracking-tighter">서울</span>
            <span className="text-sm font-black tracking-tight">{formatTime(now, 9)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
