
import React from 'react';
import { Calendar, CreditCard, Info, Dices } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'itinerary', label: '일정표', icon: Calendar },
    { id: 'expenses', label: '정산', icon: CreditCard },
    { id: 'games', label: '게임하기', icon: Dices },
    { id: 'info', label: '여행정보', icon: Info },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 px-4 py-4 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${
              isActive ? 'text-indigo-600 scale-110' : 'text-slate-400'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[11px] font-bold ${isActive ? 'opacity-100' : 'opacity-70'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
