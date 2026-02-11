
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Clock, Star, AlertCircle, ChevronLeft, Save, Edit3, MessageSquareText } from 'lucide-react';
import { DaySchedule, Activity } from '../types';

interface ItineraryTabProps {
  itinerary: DaySchedule[];
  onUpdate: (newItinerary: DaySchedule[]) => void;
}

const ItineraryTab: React.FC<ItineraryTabProps> = ({ itinerary, onUpdate }) => {
  const [openDay, setOpenDay] = useState<string | null>('day1');
  const [openResortDays, setOpenResortDays] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<{ dayId: string, activity: Activity } | null>(null);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<{ dayId: string, activity: Activity } | null>(null);

  const toggleDay = (id: string) => {
    setOpenDay(openDay === id ? null : id);
  };

  const toggleResortAccordion = (dayId: string) => {
    setOpenResortDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  const removeActivity = (dayId: string, type: 'timeline' | 'resort', activityId: string) => {
    const updated = itinerary.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          [type === 'timeline' ? 'timeline' : 'resortProgram']: 
            (day[type === 'timeline' ? 'timeline' : 'resortProgram'] || []).filter(a => a.id !== activityId)
        };
      }
      return day;
    });
    onUpdate(updated);
  };

  const updateActivity = (dayId: string, activityId: string, updates: Partial<Activity>) => {
    const updated = itinerary.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          timeline: day.timeline.map(a => a.id === activityId ? { ...a, ...updates } : a)
        };
      }
      return day;
    });
    onUpdate(updated);
  };

  const addActivity = (dayId: string, type: 'timeline' | 'resort', desc: string, time: string) => {
    const updated = itinerary.map(day => {
      if (day.id === dayId) {
        const newActivity: Activity = {
          id: Math.random().toString(36).substr(2, 9),
          time,
          description: desc
        };
        return {
          ...day,
          [type === 'timeline' ? 'timeline' : 'resortProgram']: 
            [...(day[type === 'timeline' ? 'timeline' : 'resortProgram'] || []), newActivity].sort((a,b) => a.time.localeCompare(b.time))
        };
      }
      return day;
    });
    onUpdate(updated);
    setShowAddModal(null);
  };

  // 상세 메모 서브 페이지 컴포넌트
  if (detailView) {
    return (
      <div className="fixed inset-0 bg-white z-[60] animate-fadeIn flex flex-col">
        <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0">
          <button 
            onClick={() => setDetailView(null)}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-600"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1">Activity Detail</h3>
            <p className="text-sm font-bold text-slate-800 leading-none">{detailView.activity.description}</p>
          </div>
          <div className="w-10"></div> {/* Spacer for symmetry */}
        </div>
        
        <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={12} /> 시간 정보
            </label>
            <p className="text-lg font-black text-slate-800">{detailView.activity.time}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-indigo-500 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquareText size={12} /> 상세 메모 및 링크
              </label>
            </div>
            <textarea
              value={detailView.activity.notes || ''}
              onChange={(e) => {
                const newNotes = e.target.value;
                setDetailView(prev => prev ? { ...prev, activity: { ...prev.activity, notes: newNotes } } : null);
                updateActivity(detailView.dayId, detailView.activity.id, { notes: newNotes });
              }}
              placeholder="여기에 담시장 시세표, 블로그 링크, 준비물 등 상세한 내용을 기록하세요..."
              className="w-full h-80 bg-slate-50 border-none rounded-3xl p-6 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-100 resize-none leading-relaxed placeholder:text-slate-300"
            />
          </div>

          <div className="p-4 bg-indigo-50 rounded-2xl flex gap-3 items-start border border-indigo-100/50">
            <Save size={18} className="text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-indigo-800 leading-tight">
              메모는 입력하는 즉시 <strong>실시간으로 자동 저장</strong>되며, 다른 멤버들과 공유됩니다.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {itinerary.map((day) => (
        <div key={day.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleDay(day.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 text-indigo-700 w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold">
                <span className="text-[10px] leading-tight opacity-70 uppercase">{day.dayName.substr(0, 3)}</span>
                <span className="text-base leading-tight">{day.date.split('(')[0]}</span>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800">{day.title}</h3>
                <p className="text-xs text-slate-500">{day.timeline.length}개의 일정</p>
              </div>
            </div>
            {openDay === day.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
          </button>

          {openDay === day.id && (
            <div className="px-4 pb-4 animate-fadeIn">
              {/* Resort Programs Section with its own Accordion */}
              {day.resortProgram && day.resortProgram.length > 0 && (
                <div className="mb-6 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 overflow-hidden">
                  <button 
                    onClick={() => toggleResortAccordion(day.id)}
                    className="w-full flex justify-between items-center p-3 text-left"
                  >
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                      <Star size={14} fill="currentColor" /> 리조트 액티비티 ({day.resortProgram.length})
                    </h4>
                    {openResortDays[day.id] ? <ChevronUp size={16} className="text-indigo-400" /> : <ChevronDown size={16} className="text-indigo-400" />}
                  </button>
                  
                  {openResortDays[day.id] && (
                    <div className="px-3 pb-3 space-y-2 animate-fadeIn">
                      {day.resortProgram.map((item) => (
                        <div key={item.id} className="group flex items-start justify-between bg-white/80 p-2.5 rounded-lg border border-indigo-100/30 shadow-sm">
                          <div className="flex items-start gap-3">
                            <span className="text-[10px] font-bold text-indigo-500 mt-1 whitespace-nowrap">{item.time}</span>
                            <div>
                              <p className="text-sm font-medium text-slate-700">
                                {item.description}
                                {item.isPaid && <span className="ml-1 text-orange-500" title="유료">💰</span>}
                                {item.requiresBooking && <span className="ml-1 text-red-500" title="예약필수">📌</span>}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Timeline Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 ml-1">
                    <Clock size={14} /> 메인 타임라인
                  </h4>
                  <button 
                    onClick={() => { setActiveDayId(day.id); setShowAddModal('timeline'); }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
                  {day.timeline.map((item) => (
                    <div key={item.id} className="group relative pl-8">
                      {/* Clickable Bullet Point */}
                      <button 
                        onClick={() => setDetailView({ dayId: day.id, activity: item })}
                        className={`absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white border-2 transition-all flex items-center justify-center z-10 active:scale-90 shadow-sm ${
                          item.notes ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-slate-300 hover:border-indigo-400'
                        }`}
                      >
                        {item.notes ? (
                          <MessageSquareText size={10} className="text-indigo-600 animate-pulse" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-400"></div>
                        )}
                      </button>

                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0" onClick={() => setEditingActivity({ dayId: day.id, activity: item })}>
                          <p className="text-[10px] font-black text-slate-400 mb-0.5 uppercase tracking-tighter flex items-center gap-1.5">
                            {item.time}
                            {item.notes && <span className="text-[9px] text-indigo-500 lowercase bg-indigo-50 px-1 rounded">detail page available</span>}
                          </p>
                          <p className="text-sm font-bold text-slate-700 leading-snug truncate group-hover:text-indigo-600 transition-colors">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setEditingActivity({ dayId: day.id, activity: item })}
                            className="p-1.5 text-slate-300 hover:text-indigo-500 transition-colors"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            onClick={() => removeActivity(day.id, 'timeline', item.id)} 
                            className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Basic instructions */}
      <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex gap-3 items-start">
        <AlertCircle size={20} className="text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-600 space-y-1">
          <p className="font-bold text-indigo-700">일정 사용 팁</p>
          <p>• 왼쪽 <strong>동그란 불렛</strong>을 누르면 상세 메모(시세표 등)를 남길 수 있는 서브 페이지로 이동합니다.</p>
          <p>• 텍스트를 누르면 시간이나 내용을 바로 수정할 수 있습니다.</p>
          <p>• 메모가 있는 일정은 불렛이 파란색으로 표시됩니다.</p>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-xs p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold mb-4">{showAddModal === 'timeline' ? '메인 일정' : '리조트 프로그램'} 추가</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const time = (form.elements.namedItem('time') as HTMLInputElement).value;
              const desc = (form.elements.namedItem('desc') as HTMLInputElement).value;
              if (activeDayId) addActivity(activeDayId, showAddModal as 'timeline' | 'resort', desc, time);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">시간</label>
                  <input name="time" type="text" placeholder="예: 09:00" required className="w-full bg-slate-100 p-3 rounded-xl border-none text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">내용</label>
                  <input name="desc" type="text" placeholder="활동 내용을 입력하세요" required className="w-full bg-slate-100 p-3 rounded-xl border-none text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(null)} className="flex-1 py-3 text-slate-500 font-bold text-sm">취소</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm">추가하기</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingActivity && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-xs p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold mb-4">일정 수정</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const time = (form.elements.namedItem('time') as HTMLInputElement).value;
              const desc = (form.elements.namedItem('desc') as HTMLInputElement).value;
              updateActivity(editingActivity.dayId, editingActivity.activity.id, { time, description: desc });
              setEditingActivity(null);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">시간</label>
                  <input 
                    name="time" 
                    type="text" 
                    defaultValue={editingActivity.activity.time} 
                    required 
                    className="w-full bg-slate-100 p-3 rounded-xl border-none text-sm outline-none focus:ring-2 focus:ring-indigo-100" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">내용</label>
                  <input 
                    name="desc" 
                    type="text" 
                    defaultValue={editingActivity.activity.description} 
                    required 
                    className="w-full bg-slate-100 p-3 rounded-xl border-none text-sm outline-none focus:ring-2 focus:ring-indigo-100" 
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setEditingActivity(null)} className="flex-1 py-3 text-slate-500 font-bold text-sm">취소</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm">저장하기</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryTab;
