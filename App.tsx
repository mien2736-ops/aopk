
import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, off } from 'firebase/database';
import { TabType, Expense, User, DaySchedule } from './types';
import { INITIAL_ITINERARY, TRIP_ID } from './constants';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ItineraryTab from './tabs/ItineraryTab';
import ExpenseTab from './tabs/ExpenseTab';
import InfoTab from './tabs/InfoTab';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF0j11UMATdPxHn7k3qMYTfSYpAz31464",
  authDomain: "aapk-b76b3.firebaseapp.com",
  projectId: "aapk-b76b3",
  storageBucket: "aapk-b76b3.firebasestorage.app",
  messagingSenderId: "111545315428",
  appId: "1:111545315428:web:56e33ad41e5b3ddf1a6f71",
  measurementId: "G-VF3M6DHX3G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [itinerary, setItinerary] = useState<DaySchedule[]>(INITIAL_ITINERARY);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. Handle User Session (Auto-login for link access)
  useEffect(() => {
    const savedUser = localStorage.getItem('trip_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      const anonymousUser = { id: 'anon-' + Math.random().toString(36).substr(2, 5), name: '익명' };
      setUser(anonymousUser);
      localStorage.setItem('trip_user', JSON.stringify(anonymousUser));
    }
  }, []);

  // 2. Real-time Database Synchronization
  useEffect(() => {
    if (!TRIP_ID) return;

    setIsSyncing(true);
    const tripRef = ref(db, `trips/${TRIP_ID}`);

    const unsubscribe = onValue(tripRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.expenses) {
          // Firebase might return an object for lists, convert to array if needed
          const expensesArray = Array.isArray(data.expenses) ? data.expenses : Object.values(data.expenses);
          setExpenses(expensesArray.reverse() as Expense[]);
        } else {
          setExpenses([]);
        }
        
        if (data.itinerary) {
          setItinerary(data.itinerary as DaySchedule[]);
        }
      } else {
        // First time initialization in Firebase
        set(tripRef, {
          itinerary: INITIAL_ITINERARY,
          expenses: [],
          updatedAt: Date.now()
        });
      }
      setLastSynced(new Date());
      setIsSyncing(false);
    }, (error) => {
      console.error("Firebase sync error:", error);
      setIsSyncing(false);
    });

    return () => off(tripRef);
  }, []);

  const saveExpenses = useCallback((newExpenses: Expense[]) => {
    // We reverse back for storage because we display newest first in UI
    const storageData = [...newExpenses].reverse();
    set(ref(db, `trips/${TRIP_ID}/expenses`), storageData);
    set(ref(db, `trips/${TRIP_ID}/updatedAt`), Date.now());
  }, []);

  const saveItinerary = useCallback((newItinerary: DaySchedule[]) => {
    set(ref(db, `trips/${TRIP_ID}/itinerary`), newItinerary);
    set(ref(db, `trips/${TRIP_ID}/updatedAt`), Date.now());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('trip_user');
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-indigo-600 font-bold flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          Firebase 연결 중...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-md mx-auto relative shadow-xl overflow-hidden">
      <Header 
        onLogout={handleLogout} 
        isSyncing={isSyncing} 
        lastSynced={lastSynced}
      />
      
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
