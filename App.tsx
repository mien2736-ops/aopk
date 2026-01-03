
import React, { useState, useEffect, useCallback } from 'react';
import { TabType, Expense, User, DaySchedule } from './types';
import { INITIAL_ITINERARY, GROUP_SIZE } from './constants';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ItineraryTab from './tabs/ItineraryTab';
import ExpenseTab from './tabs/ExpenseTab';
import InfoTab from './tabs/InfoTab';
import Login from './components/Login';

// Simulate real-time sync with BroadcastChannel
const syncChannel = new BroadcastChannel('trip_sync_channel');

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [itinerary, setItinerary] = useState<DaySchedule[]>(INITIAL_ITINERARY);

  // Load from localStorage and handle auto-login
  useEffect(() => {
    const savedExpenses = localStorage.getItem('trip_expenses');
    const savedItinerary = localStorage.getItem('trip_itinerary');
    const savedUser = localStorage.getItem('trip_user');

    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedItinerary) setItinerary(JSON.parse(savedItinerary));
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Auto-login with an anonymous user to allow direct entry
      const anonymousUser = { id: 'anon-' + Math.random().toString(36).substr(2, 5), name: '익명' };
      setUser(anonymousUser);
      localStorage.setItem('trip_user', JSON.stringify(anonymousUser));
    }
  }, []);

  // Sync listener
  useEffect(() => {
    const handleSync = (event: MessageEvent) => {
      if (event.data.type === 'SYNC_EXPENSES') {
        setExpenses(event.data.payload);
      } else if (event.data.type === 'SYNC_ITINERARY') {
        setItinerary(event.data.payload);
      }
    };
    syncChannel.addEventListener('message', handleSync);
    return () => syncChannel.removeEventListener('message', handleSync);
  }, []);

  const saveExpenses = useCallback((newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem('trip_expenses', JSON.stringify(newExpenses));
    syncChannel.postMessage({ type: 'SYNC_EXPENSES', payload: newExpenses });
  }, []);

  const saveItinerary = useCallback((newItinerary: DaySchedule[]) => {
    setItinerary(newItinerary);
    localStorage.setItem('trip_itinerary', JSON.stringify(newItinerary));
    syncChannel.postMessage({ type: 'SYNC_ITINERARY', payload: newItinerary });
  }, []);

  const handleLogin = (name: string) => {
    const newUser = { id: Math.random().toString(36).substr(2, 9), name };
    setUser(newUser);
    localStorage.setItem('trip_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    // For "link entry" apps, logout might just reset to anonymous or clear and reload
    localStorage.removeItem('trip_user');
    window.location.reload();
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-pulse text-indigo-600 font-bold">로딩 중...</div>
    </div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-md mx-auto relative shadow-xl overflow-hidden">
      <Header onLogout={handleLogout} />
      
      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {activeTab === 'itinerary' && (
          <ItineraryTab 
            itinerary={itinerary} 
            onUpdate={saveItinerary} 
          />
        )}
        {activeTab === 'expenses' && (
          <ExpenseTab 
            expenses={expenses} 
            onUpdate={saveExpenses} 
            user={user}
          />
        )}
        {activeTab === 'info' && (
          <InfoTab />
        )}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
