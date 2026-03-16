
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Banknote, CreditCard, ChevronDown, ChevronLeft, Check, Calendar, User as UserIcon, Download, Share2, CloudUpload, CloudCheck } from 'lucide-react';
import { Expense, Category, Currency, User } from '../types';
import { VND_TO_KRW_RATE, GROUP_SIZE, EXPENSE_DATES, PAYERS } from '../constants';

interface ExpenseTabProps {
  expenses: Expense[];
  onUpdate: (newExpenses: Expense[]) => void;
  user: User;
}

const ExpenseTab: React.FC<ExpenseTabProps> = ({ expenses, onUpdate, user }) => {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(Category.FOOD);
  const [currency, setCurrency] = useState<Currency>(Currency.VND);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedPayer, setSelectedPayer] = useState<string | undefined>();

  const stats = useMemo(() => {
    const totalKRW = expenses.reduce((acc, exp) => {
      const val = exp.currency === Currency.VND ? exp.amount * VND_TO_KRW_RATE : exp.amount;
      return acc + val;
    }, 0);

    return {
      total: totalKRW,
      perPerson: totalKRW / GROUP_SIZE
    };
  }, [expenses]);

  const allGroupedExpenses = useMemo(() => {
    const groups: { date: string, items: Expense[] }[] = [];
    
    // 최신 날짜가 상단에 오도록 역순으로 처리
    [...EXPENSE_DATES].reverse().forEach(date => {
      const items = expenses
        .filter(exp => exp.expenseDate === date)
        .sort((a, b) => b.timestamp - a.timestamp); // 같은 날짜 내에서도 최신순 정렬
      
      if (items.length > 0) {
        groups.push({ date, items });
      }
    });

    // 날짜 미지정 항목들 (가장 하단 또는 상단? 보통 미지정은 최신으로 간주하거나 별도 처리)
    const noDateItems = expenses
      .filter(exp => !exp.expenseDate)
      .sort((a, b) => b.timestamp - a.timestamp);
      
    if (noDateItems.length > 0) {
      // 미지정 항목은 가장 상단에 배치 (방금 막 추가한 항목일 가능성이 높으므로)
      groups.unshift({ date: '미지정', items: noDateItems });
    }

    return groups;
  }, [expenses]);

  const exportToCSV = () => {
    if (expenses.length === 0) {
      alert("내보낼 지출 내역이 없습니다.");
      return;
    }

    const headers = ["날짜", "분류", "내용", "금액", "통화", "KRW 환산", "지출인", "등록자"];
    const rows = expenses.map(exp => {
      const krwValue = exp.currency === Currency.VND ? Math.round(exp.amount * VND_TO_KRW_RATE) : exp.amount;
      return [
        exp.expenseDate || '-',
        exp.category,
        exp.description,
        exp.amount,
        exp.currency,
        krwValue,
        exp.payer || '-',
        exp.createdBy
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `나트랑_정산내역_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const newExpense: any = {
      id: Math.random().toString(36).substr(2, 9),
      description,
      amount: parseFloat(amount.replace(/,/g, '')),
      currency,
      category,
      timestamp: Date.now(),
      createdBy: user.name
    };

    if (selectedDate) newExpense.expenseDate = selectedDate;
    if (selectedPayer) newExpense.payer = selectedPayer;

    onUpdate([newExpense as Expense, ...expenses]);
    
    setShowForm(false);
    setAmount('');
    setDescription('');
    setSelectedDate(undefined);
    setSelectedPayer(undefined);
  };

  const removeExpense = (id: string) => {
    if(confirm("이 지출 내역을 삭제할까요?")) {
      onUpdate(expenses.filter(e => e.id !== id));
    }
  };

  const formatMoney = (val: number, curr: Currency) => {
    if (curr === Currency.VND) {
      return val.toLocaleString() + ' đ';
    }
    return '₩ ' + Math.round(val).toLocaleString();
  };

  const categories = [
    { type: Category.FOOD, icon: '🍔', color: 'bg-orange-100 text-orange-600' },
    { type: Category.TRANSPORT, icon: '🚕', color: 'bg-blue-100 text-blue-600' },
    { type: Category.SHOPPING, icon: '🛍️', color: 'bg-pink-100 text-pink-600' },
    { type: Category.ALCOHOL, icon: '🍺', color: 'bg-red-100 text-red-600' },
    { type: Category.OTHER, icon: '✨', color: 'bg-slate-100 text-slate-600' },
    { type: Category.ACCOMMODATION, icon: '🏨', color: 'bg-purple-100 text-purple-600' },
  ];

  const ExpenseItem = ({ exp }: { exp: Expense }) => (
    <div key={exp.id} className="group bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 animate-fadeIn">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${
        categories.find(c => c.type === exp.category)?.color
      }`}>
        {categories.find(c => c.type === exp.category)?.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h5 className="font-bold text-slate-800 text-sm truncate pr-2">{exp.description}</h5>
            <div className="flex gap-2 items-center mt-0.5">
              {exp.payer && (
                <span className="text-indigo-500 text-[10px] font-bold flex items-center gap-0.5">
                  <UserIcon size={10} /> {exp.payer}
                </span>
              )}
              <span className="text-slate-400 text-[10px]">
                {new Date(exp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="font-bold text-slate-700 text-sm leading-none">{formatMoney(exp.amount, exp.currency)}</p>
              {exp.currency === Currency.VND && (
                <p className="text-[10px] text-slate-400 mt-1 font-medium">≈ ₩ {Math.round(exp.amount * VND_TO_KRW_RATE).toLocaleString()}</p>
              )}
            </div>
            <button 
              onClick={() => removeExpense(exp.id)}
              className="text-slate-200 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      {/* Summary Card */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider">정산 요약</h3>
          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">인원 {GROUP_SIZE}명</span>
        </div>
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <p className="text-slate-400 text-xs">총액</p>
              <p className="text-sm font-bold text-slate-600">₩ {Math.round(stats.total).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-indigo-500 text-xs font-bold mb-0.5">1인 부담금</p>
              <h2 className="text-2xl font-black text-indigo-600 leading-none">₩ {Math.round(stats.perPerson).toLocaleString()}</h2>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white p-3.5 rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">전체 지출 내역</h4>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors"
          >
            <Download size={12} />
            CSV 추출
          </button>
        </div>
        
        {expenses.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <Banknote className="mx-auto text-slate-200 mb-2" size={32} />
            <p className="text-xs text-slate-400">등록된 지출 내역이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-6">
            {allGroupedExpenses.map((group) => (
              <div key={group.date} className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-[1px] flex-1 bg-slate-100"></div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{group.date}</span>
                  <div className="h-[1px] flex-1 bg-slate-100"></div>
                </div>
                <div className="space-y-2">
                  {group.items.map((exp) => (
                    <ExpenseItem key={exp.id} exp={exp} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Form Drawer */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] p-6 pb-10 animate-slideUp max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div className="px-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">분류</label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.type}
                      type="button"
                      onClick={() => setCategory(cat.type)}
                      className={`min-w-[70px] py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${
                        category === cat.type 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                          : 'border-transparent bg-slate-50 text-slate-400'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="text-[9px] font-black whitespace-nowrap">{cat.type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount & Currency */}
              <div className="space-y-4 px-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-widest block">금액 (Amount)</label>
                  <div className="flex bg-slate-200 rounded-xl p-1 shadow-inner border border-slate-300 scale-110 origin-right">
                    <button
                      type="button"
                      onClick={() => setCurrency(Currency.VND)}
                      className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${currency === Currency.VND ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}
                    >VND</button>
                    <button
                      type="button"
                      onClick={() => setCurrency(Currency.KRW)}
                      className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${currency === Currency.KRW ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}
                    >KRW</button>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-3xl border-2 border-slate-200 shadow-inner">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="bg-transparent border-none w-full text-4xl font-black text-slate-800 focus:ring-0 p-0 placeholder:text-slate-200"
                    required
                  />
                  {currency === Currency.VND && amount && (
                    <p className="mt-2 text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">
                      ≈ ₩ {Math.round(parseFloat(amount) * VND_TO_KRW_RATE).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">내용</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="지출 내역 (예: 점심 식사)"
                  className="w-full bg-slate-50 p-4 rounded-2xl border-none text-slate-800 font-medium focus:ring-2 focus:ring-indigo-100 shadow-sm"
                  required
                />
              </div>

              <div className="px-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">날짜 (선택 사항)</label>
                <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
                  {EXPENSE_DATES.map(date => (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setSelectedDate(selectedDate === date ? undefined : date)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                        selectedDate === date 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                        : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">지출인 (선택 사항)</label>
                <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
                  {PAYERS.map(payer => (
                    <button
                      key={payer}
                      type="button"
                      onClick={() => setSelectedPayer(selectedPayer === payer ? undefined : payer)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                        selectedPayer === payer 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                        : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      {payer}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6 px-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
                >취소</button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <CloudUpload size={18} />
                  저장 및 동기화
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTab;
