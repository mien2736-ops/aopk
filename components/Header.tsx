
import React from 'react';
import { LogOut, Calendar, Users, MapPin } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <div className="bg-indigo-600 text-white p-5 rounded-b-[2.5rem] shadow-lg sticky top-0 z-20">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AOPK 나트랑 여행</h1>
          <p className="text-indigo-100 text-sm flex items-center gap-1 mt-1 opacity-90">
            <MapPin size={14} /> 멜리아 빈펄 리조트 (The Level)
          </p>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 bg-indigo-500/30 rounded-full hover:bg-indigo-500/50 transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>

      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-2 bg-indigo-500/30 px-3 py-1.5 rounded-xl border border-indigo-400/20">
          <Calendar size={16} />
          <span className="text-sm font-medium">3/20 - 3/23</span>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/30 px-3 py-1.5 rounded-xl border border-indigo-400/20">
          <Users size={16} />
          <span className="text-sm font-medium">6인 단체</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
