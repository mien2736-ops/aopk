
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Clock, Star, AlertCircle } from 'lucide-react';
import { DaySchedule, Activity } from '../types';

interface ItineraryTabProps {
  itinerary: DaySchedule[];
  onUpdate: (newItinerary: DaySchedule[]) => void;
}

const ItineraryTab: React.FC<ItineraryTabProps> = ({ itinerary, onUpdate }) => {
  const [openDay, setOpenDay] = useState<string | null>('day1');
  const [openResortDays, setOpenResortDays] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState<string | null>(null); // 'timeline'
  const [activeDayId, setActiveDayId] = useState<string | null>(null);

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
                <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
                  {day.timeline.map((item) => (
                    <div key={item.id} className="group relative pl-6">
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-400 z-10"></div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 mb-0.5">{item.time}</p>
                          <p className="text-sm font-semibold text-slate-700 leading-snug">{item.description}</p>
                        </div>
                        <button onClick={() => removeActivity(day.id, 'timeline', item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 transition-opacity">
                          <Trash2 size={14} />
                        </button>
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
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 items-start">
        <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 space-y-1">
          <p className="font-bold">참고 안내</p>
          <p>• 💰 이모지는 예약 및 유료 프로그램입니다.</p>
          <p>• 📌 이모지는 예약 필수 프로그램입니다.</p>
          <p>• 일정을 길게 누르거나 마우스 오버 시 삭제 버튼이 나타납니다.</p>
        </div>
      </div>

      {/* Add Modal Placeholder */}
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
    </div>
  );
};

export default ItineraryTab;
