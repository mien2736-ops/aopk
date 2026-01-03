
import React, { useState, useEffect, useCallback } from 'react';
import { TabType, Expense, User, DaySchedule } from './types';
import { INITIAL_ITINERARY, GROUP_SIZE } from './constants';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ItineraryTab from './tabs/ItineraryTab';
import ExpenseTab from './tabs/ExpenseTab';
import InfoTab from './tabs/InfoTab';
import { db, auth } from './firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  query, 
  orderBy, 
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [itinerary, setItinerary] = useState<DaySchedule[]>(INITIAL_ITINERARY);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  // 1. Firebase Auth & User Profile
  useEffect(() => {
    // Ensure the user is authenticated with Firebase for Firestore permissions
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Firebase Auth Error:", err);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setAuthReady(true);
        
        // Handle local user profile (display name only)
        const savedUser = localStorage.getItem('trip_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          const anonymousUser = { 
            id: firebaseUser.uid, 
            name: '익명' 
          };
          setUser(anonymousUser);
          localStorage.setItem('trip_user', JSON.stringify(anonymousUser));
        }
      }
    });

    initAuth();
    return () => unsubscribe();
  }, []);

  // 2. Real-time Firebase Sync: Expenses
  useEffect(() => {
    if (!authReady) return;

    const q = query(collection(db, "expenses"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenseData = snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firestore Timestamp to number if necessary to prevent rendering errors
        const timestamp = typeof data.timestamp === 'object' && data.timestamp.toMillis 
          ? data.timestamp.toMillis() 
          : (data.timestamp || Date.now());
          
        return {
          id: doc.id,
          ...data,
          timestamp
        } as Expense;
      });
      setExpenses(expenseData);
      setLoading(false);
    }, (error) => {
      console.error("Firebase Expense Sync Error:", error);
      // Don't set loading false here yet if we want to retry or show error UI
      if (error.code === 'permission-denied') {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [authReady]);

  // 3. Real-time Firebase Sync: Itinerary
  useEffect(() => {
    if (!authReady) return;

    const itineraryDoc = doc(db, "trips", "itinerary");
    
    const checkAndSeed = async () => {
      try {
        const docSnap = await getDoc(itineraryDoc);
        if (!docSnap.exists()) {
          await setDoc(itineraryDoc, { data: INITIAL_ITINERARY });
        }
      } catch (err) {
        console.error("Itinerary Seed Error:", err);
      }
    };
    checkAndSeed();

    const unsubscribe = onSnapshot(itineraryDoc, (docSnap) => {
      if (docSnap.exists()) {
        const rawData = docSnap.data().data;
        if (Array.isArray(rawData)) {
          setItinerary(rawData as DaySchedule[]);
        }
      }
    }, (error) => {
      console.error("Itinerary Sync Error:", error);
    });

    return () => unsubscribe();
  }, [authReady]);

  // Handle updates by comparing states and updating Firestore collections
  const handleUpdateExpenses = useCallback(async (newExpenses: Expense[]) => {
    if (!authReady) return;

    try {
      // Determine if it was a delete or add
      if (newExpenses.length < expenses.length) {
        const deleted = expenses.find(e => !newExpenses.find(ne => ne.id === e.id));
        if (deleted) {
          await deleteDoc(doc(db, "expenses", deleted.id));
        }
      } else if (newExpenses.length > expenses.length) {
        // Find newly added item (usually the first one in UI logic)
        const added = newExpenses.find(ne => !expenses.find(e => e.id === ne.id));
        if (added) {
          await setDoc(doc(db, "expenses", added.id), added);
        }
      }
    } catch (err) {
      console.error("Expense update error:", err);
      alert("지출 내역 업데이트에 실패했습니다. (권한 오류)");
    }
  }, [expenses, authReady]);

  const saveItinerary = useCallback(async (newItinerary: DaySchedule[]) => {
    if (!authReady) return;
    
    try {
      const itineraryDoc = doc(db, "trips", "itinerary");
      await setDoc(itineraryDoc, { data: newItinerary });
    } catch (err) {
      console.error("Itinerary update error:", err);
      alert("일정 업데이트에 실패했습니다.");
    }
  }, [authReady]);

  const handleLogout = () => {
    localStorage.removeItem('trip_user');
    window.location.reload();
  };

  if (!user || loading || !authReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">실시간 데이터 연결 중</h2>
            <p className="text-slate-400 text-sm">Nha Trang 여행 정보를 불러오고 있습니다...</p>
          </div>
          {/* Helpful message for permission issues */}
          <p className="text-[10px] text-slate-300 max-w-xs">
            연결이 오래 걸릴 경우 Firebase 보안 규칙이나 인터넷 설정을 확인해주세요.
          </p>
        </div>
      </div>
    );
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
            onUpdate={handleUpdateExpenses} 
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
