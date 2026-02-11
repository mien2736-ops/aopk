
import React, { useState, useMemo } from 'react';
import { User, CheckCircle2, Circle, Plus, Trash2, Filter, RotateCcw, LayoutList } from 'lucide-react';
import { PrepItem, User as UserType } from '../types';
import { PAYERS, RECOMMENDED_PREP_ITEMS } from '../constants';

interface PrepTabProps {
  prepItems: PrepItem[];
  onUpdate: (items: PrepItem[]) => void;
  user: UserType;
}

const PrepTab: React.FC<PrepTabProps> = ({ prepItems, onUpdate, user }) => {
  const [activeFilter, setActiveFilter] = useState<string>('전체');
  const [newItemText, setNewItemText] = useState('');
  const [isCommonMode, setIsCommonMode] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  const filteredItems = useMemo(() => {
    if (activeFilter === '전체') return prepItems;
    return prepItems.filter(item => {
      // 1. '시스템'이 만든 개인 필수품은 모든 멤버의 개인탭에 노출
      if (!item.isCommon && item.createdBy === '시스템') return true;
      
      // 2. 담당자(assignedTo)가 지정된 경우, 해당 담당자의 탭에 노출
      if (item.assignedTo && item.assignedTo.includes(activeFilter)) return true;
      
      // 3. 담당자가 지정되지 않은 개인 물품은 생성자 본인의 탭에 노출
      if (!item.isCommon && (!item.assignedTo || item.assignedTo.length === 0)) {
        return item.createdBy === activeFilter;
      }
      
      return false;
    });
  }, [prepItems, activeFilter]);

  const toggleComplete = (id: string) => {
    onUpdate(prepItems.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const toggleAssignee = (name: string) => {
    setSelectedAssignees(prev => {
      if (prev.includes(name)) return prev.filter(n => n !== name);
      if (prev.length >= 6) return prev;
      return [...prev, name];
    });
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: PrepItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: newItemText.trim(),
      isCommon: isCommonMode,
      isCompleted: false,
      createdBy: user.name
    };

    // 공용/개인 상관없이 선택된 담당자가 있으면 추가
    if (selectedAssignees.length > 0) {
      newItem.assignedTo = selectedAssignees;
    } else if (!isCommonMode) {
      // 개인 물품인데 아무도 선택 안했으면 '나'를 담당자로 기본 지정
      newItem.assignedTo = [user.name];
    }

    onUpdate([...prepItems, newItem]);
    setNewItemText('');
    setSelectedAssignees([]);
  };

  const removeItem = (id: string) => {
    onUpdate(prepItems.filter(i => i.id !== id));
  };

  const resetToRecommended = () => {
    if (confirm('모든 데이터를 삭제하고 기본 리스트로 초기화할까요?')) {
      onUpdate(RECOMMENDED_PREP_ITEMS);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-20 bg-slate-50/50 min-h-full">
      {/* View Filter Grid */}
      <section className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-1.5 opacity-40">
            <Filter size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">View Member</span>
          </div>
          <button onClick={resetToRecommended} className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <RotateCcw size={10} /> 초기화
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => setActiveFilter('전체')}
            className={`py-2 rounded-lg text-[11px] font-bold transition-all border ${
              activeFilter === '전체' ? 'bg-slate-800 border-slate-800 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            전체리스트
          </button>
          {PAYERS.map(name => (
            <button
              key={name}
              onClick={() => setActiveFilter(name)}
              className={`py-2 rounded-lg text-[11px] font-bold transition-all border ${
                activeFilter === name ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      {/* Slim Add Form */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-sm">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="품목 추가 (예: 컵라면)"
            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-slate-200 font-medium"
          />
          <button
            onClick={addItem}
            className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 active:scale-95 transition-transform"
          >
            추가
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              <button
                onClick={() => setIsCommonMode(true)}
                className={`px-3.5 py-2 rounded-lg text-[10px] font-bold border transition-all ${
                  isCommonMode ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' : 'bg-white border-slate-100 text-slate-300'
                }`}
              >
                공용 물품
              </button>
              <button
                onClick={() => setIsCommonMode(false)}
                className={`px-3.5 py-2 rounded-lg text-[10px] font-bold border transition-all ${
                  !isCommonMode ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : 'bg-white border-slate-100 text-slate-300'
                }`}
              >
                개인 물품
              </button>
            </div>
            <span className="text-[10px] text-slate-400 font-bold">담당자 선택</span>
          </div>

          <div className="grid grid-cols-6 gap-1 animate-fadeIn">
            {PAYERS.map(name => {
              const isSelected = selectedAssignees.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleAssignee(name)}
                  className={`py-2 rounded-md text-[10px] font-bold border transition-all ${
                    isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Checklist Rendering */}
      <div className="space-y-6">
        {activeFilter === '전체' ? (
          <>
            <div className="space-y-2">
              <h3 className="text-[11px] font-black text-slate-400 px-1 uppercase tracking-wider flex items-center gap-2">
                <LayoutList size={12} /> 공용물품 리스트
              </h3>
              <div className="space-y-0.5 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                {prepItems.filter(i => i.isCommon).map(item => (
                  <MinimalListItem key={item.id} item={item} onToggle={toggleComplete} onRemove={removeItem} />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-[11px] font-black text-slate-400 px-1 uppercase tracking-wider flex items-center gap-2">
                <User size={12} /> 개인물품 리스트
              </h3>
              <div className="space-y-0.5 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                {prepItems.filter(i => !i.isCommon).map(item => (
                  <MinimalListItem key={item.id} item={item} onToggle={toggleComplete} onRemove={removeItem} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <h3 className="text-[11px] font-black text-indigo-500 px-1 uppercase tracking-wider flex items-center gap-2">
              <User size={12} /> {activeFilter}님의 체크리스트
            </h3>
            <div className="space-y-0.5 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              {filteredItems.map(item => (
                <MinimalListItem key={item.id} item={item} onToggle={toggleComplete} onRemove={removeItem} />
              ))}
              {filteredItems.length === 0 && (
                <div className="text-center py-12 bg-white">
                  <p className="text-[11px] text-slate-300 font-bold">체크할 항목이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface MinimalListItemProps {
  item: PrepItem;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

const MinimalListItem: React.FC<MinimalListItemProps> = ({ item, onToggle, onRemove }) => {
  return (
    <div 
      className={`group flex items-center gap-3 py-3 px-4 transition-all ${
        item.isCommon 
          ? 'bg-indigo-50/40 hover:bg-indigo-50/60' 
          : 'bg-white hover:bg-slate-50'
      } ${item.isCompleted ? 'opacity-40 grayscale-[0.5]' : ''}`}
    >
      <button 
        onClick={() => onToggle(item.id)}
        className={`shrink-0 transition-colors ${item.isCompleted ? 'text-indigo-500' : 'text-slate-200 hover:text-slate-300'}`}
      >
        {item.isCompleted ? <CheckCircle2 size={20} fill="currentColor" className="text-white" /> : <Circle size={20} />}
      </button>
      
      <div className="flex-1 min-w-0 flex items-center justify-between gap-2" onClick={() => onToggle(item.id)}>
        <p className={`text-[13px] font-medium leading-tight truncate ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>
          {item.text}
        </p>
        
        <div className="flex flex-wrap gap-1 shrink-0 justify-end">
          {item.assignedTo && item.assignedTo.map(name => (
            <span key={name} className="text-[9px] font-black text-indigo-500/80 bg-white/80 border border-indigo-100 px-1.5 py-0.5 rounded shadow-sm">
              {name}
            </span>
          ))}
          {!item.isCommon && item.createdBy !== '시스템' && (!item.assignedTo || item.assignedTo.length === 0) && (
            <span className="text-[9px] font-bold text-slate-300 bg-slate-50/80 px-1.5 py-0.5 rounded">
              {item.createdBy}
            </span>
          )}
          {!item.isCommon && item.createdBy === '시스템' && (
            <span className="text-[9px] font-black text-blue-400/80 bg-blue-50/80 border border-blue-100 px-1.5 py-0.5 rounded">
              필수
            </span>
          )}
        </div>
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
        className="p-1.5 text-slate-200 hover:text-rose-400 hover:bg-rose-50 rounded-lg transition-all sm:opacity-0 group-hover:opacity-100 ml-1"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default PrepTab;
