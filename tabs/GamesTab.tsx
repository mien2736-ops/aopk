
import React, { useState, useEffect } from 'react';
import { Dices, Users, UserPlus, Lightbulb, Send, Trash2, RotateCcw, Sparkles, HelpCircle, Gift, Bomb, Ghost } from 'lucide-react';
import { PAYERS } from '../constants';
import { GameIdea, User } from '../types';

interface GamesTabProps {
  gameIdeas: GameIdea[];
  onUpdateIdeas: (ideas: GameIdea[]) => void;
  user: User;
}

type GameMode = 'MENU' | 'TEAM_SPLIT' | 'PICK_N';

interface GameSlot {
  id: number;
  memberName?: string;
  role: string;
  revealed: boolean;
  color: string;
}

const GamesTab: React.FC<GamesTabProps> = ({ gameIdeas, onUpdateIdeas, user }) => {
  const [mode, setMode] = useState<GameMode>('MENU');
  const [newIdea, setNewIdea] = useState('');
  const [pickCount, setPickCount] = useState<number>(1);
  const [slots, setSlots] = useState<GameSlot[]>([]);
  const [isAllRevealed, setIsAllRevealed] = useState(false);

  // 게임 초기화: 팀 나누기
  const initTeamGame = (teamSize: 2 | 3) => {
    const shuffledMembers = [...PAYERS].sort(() => Math.random() - 0.5);
    const newSlots: GameSlot[] = [];
    
    if (teamSize === 3) {
      // 3:3 팀 나누기
      const roles = ['TEAM A', 'TEAM A', 'TEAM A', 'TEAM B', 'TEAM B', 'TEAM B'];
      const shuffledRoles = roles.sort(() => Math.random() - 0.5);
      shuffledMembers.forEach((name, i) => {
        newSlots.push({
          id: i,
          memberName: name,
          role: shuffledRoles[i],
          revealed: false,
          color: shuffledRoles[i] === 'TEAM A' ? 'bg-blue-500' : 'bg-rose-500'
        });
      });
    } else {
      // 2:2:2 팀 나누기
      const roles = ['RED', 'RED', 'BLUE', 'BLUE', 'GREEN', 'GREEN'];
      const shuffledRoles = roles.sort(() => Math.random() - 0.5);
      const colors = { RED: 'bg-red-500', BLUE: 'bg-blue-500', GREEN: 'bg-emerald-500' };
      shuffledMembers.forEach((name, i) => {
        newSlots.push({
          id: i,
          memberName: name,
          role: shuffledRoles[i],
          revealed: false,
          color: colors[shuffledRoles[i] as keyof typeof colors]
        });
      });
    }
    setSlots(newSlots);
    setIsAllRevealed(false);
    setMode('TEAM_SPLIT');
  };

  // 게임 초기화: N명 뽑기
  const initPickGame = () => {
    const shuffledMembers = [...PAYERS].sort(() => Math.random() - 0.5);
    const newSlots: GameSlot[] = [];
    const roles = new Array(6).fill('SAFE');
    for(let i=0; i<pickCount; i++) roles[i] = 'SELECTED';
    const shuffledRoles = roles.sort(() => Math.random() - 0.5);

    shuffledMembers.forEach((name, i) => {
      newSlots.push({
        id: i,
        memberName: name,
        role: shuffledRoles[i],
        revealed: false,
        color: shuffledRoles[i] === 'SELECTED' ? 'bg-amber-500' : 'bg-slate-400'
      });
    });
    setSlots(newSlots);
    setIsAllRevealed(false);
    setMode('PICK_N');
  };

  const handleSlotClick = (id: number) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, revealed: true } : s));
  };

  const revealAll = () => {
    setSlots(prev => prev.map(s => ({ ...s, revealed: true })));
    setIsAllRevealed(true);
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim()) return;
    const idea: GameIdea = {
      id: Math.random().toString(36).substr(2, 9),
      text: newIdea.trim(),
      createdBy: user.name,
      timestamp: Date.now()
    };
    onUpdateIdeas([...gameIdeas, idea]);
    setNewIdea('');
  };

  const removeIdea = (id: string) => {
    onUpdateIdeas(gameIdeas.filter(i => i.id !== id));
  };

  return (
    <div className="p-4 space-y-6">
      {mode === 'MENU' ? (
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
              <Dices size={18} />
            </div>
            <h3 className="font-bold text-slate-800">게임 모드 선택</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => initTeamGame(3)}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 active:scale-95 transition-all text-left"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <Users size={24} />
              </div>
              <div>
                <span className="block text-sm font-black text-slate-800">3:3 팀 나누기</span>
                <span className="text-[10px] text-slate-400 font-medium">카드를 뒤집어 블루/로즈 팀을 결정하세요</span>
              </div>
            </button>

            <button 
              onClick={() => initTeamGame(2)}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 active:scale-95 transition-all text-left"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                <Sparkles size={24} />
              </div>
              <div>
                <span className="block text-sm font-black text-slate-800">2:2:2 팀 나누기</span>
                <span className="text-[10px] text-slate-400 font-medium">세 개의 팀으로 공평하게 멤버를 나눕니다</span>
              </div>
            </button>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Ghost size={24} />
                </div>
                <div className="flex-1">
                  <span className="block text-sm font-black text-slate-800">N명 랜덤 뽑기</span>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3].map(n => (
                      <button
                        key={n}
                        onClick={() => setPickCount(n)}
                        className={`flex-1 py-1 rounded-lg text-xs font-black border transition-all ${pickCount === n ? 'bg-amber-500 border-amber-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                      >
                        {n}명
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={initPickGame}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-all"
              >
                당첨 게임 시작하기
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* 인터랙티브 게임 스테이지 */
        <section className="animate-fadeIn space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <button onClick={() => setMode('MENU')} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <RotateCcw size={20} />
            </button>
            <div className="text-center">
              <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest">
                {mode === 'TEAM_SPLIT' ? '팀 나누기 진행 중' : `${pickCount}명 뽑기 진행 중`}
              </h4>
              <p className="text-[10px] text-slate-400 font-bold">각자의 이름이 적힌 카드를 터치하세요!</p>
            </div>
            <button onClick={revealAll} className="p-2 text-indigo-500 font-black text-[10px] uppercase">모두 공개</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {slots.map((slot) => (
              <div 
                key={slot.id}
                onClick={() => !slot.revealed && handleSlotClick(slot.id)}
                className={`relative h-32 rounded-[2rem] cursor-pointer transition-all duration-500 perspective-1000 ${slot.revealed ? '[transform:rotateY(180deg)]' : ''}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* 카드 앞면 (이름 표시) */}
                <div className="absolute inset-0 bg-white border-2 border-indigo-100 shadow-md rounded-[2rem] flex flex-col items-center justify-center gap-2 [backface-visibility:hidden]">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400">
                    <HelpCircle size={20} />
                  </div>
                  <span className="text-sm font-black text-slate-700">{slot.memberName}</span>
                </div>

                {/* 카드 뒷면 (결과 표시) */}
                <div className={`absolute inset-0 ${slot.color} text-white shadow-xl rounded-[2rem] flex flex-col items-center justify-center gap-1 [backface-visibility:hidden] [transform:rotateY(180deg)] border-4 border-white/20`}>
                  {mode === 'PICK_N' ? (
                    slot.role === 'SELECTED' ? <Bomb size={24} className="animate-bounce" /> : <Gift size={24} />
                  ) : (
                    <Users size={24} />
                  )}
                  <span className="text-[10px] font-black tracking-widest opacity-80 uppercase">{slot.role}</span>
                  <span className="text-xs font-bold">{slot.memberName}</span>
                </div>
              </div>
            ))}
          </div>

          {isAllRevealed && (
            <div className="bg-indigo-600 text-white p-5 rounded-3xl shadow-xl animate-scaleIn text-center">
              <p className="text-xs font-bold opacity-80 mb-1">모든 결과가 확인되었습니다!</p>
              <h5 className="text-lg font-black tracking-tight">게임을 다시 하시겠습니까?</h5>
              <button 
                onClick={() => setMode('MENU')}
                className="mt-4 bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-black text-sm active:scale-95 transition-all"
              >
                처음으로 돌아가기
              </button>
            </div>
          )}
        </section>
      )}

      {/* 2. Brainstorming Memo Section */}
      <section className="space-y-4 pb-10">
        <div className="flex items-center gap-2 px-1">
          <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <Lightbulb size={18} />
          </div>
          <h3 className="font-bold text-slate-800">게임 아이디어 메모장</h3>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <form onSubmit={handleAddIdea} className="p-5 border-b border-slate-100 bg-slate-50/50 flex gap-3">
            <input
              type="text"
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              placeholder="여행 가서 할 게임 추천!"
              className="flex-1 bg-white border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100 shadow-sm font-medium"
            />
            <button 
              type="submit"
              className="bg-indigo-600 text-white p-3.5 rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              <Send size={20} />
            </button>
          </form>

          <div className="max-h-[400px] overflow-y-auto no-scrollbar p-2">
            {gameIdeas.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb size={24} className="text-slate-200" />
                </div>
                <p className="text-xs text-slate-400 font-bold leading-relaxed">
                  아직 올라온 아이디어가 없어요.<br/>
                  술자리 게임, 버스 안 게임 등을 제안해주세요!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {[...gameIdeas].reverse().map((idea) => (
                  <div key={idea.id} className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 group">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-slate-700 font-semibold leading-relaxed mb-2">
                          {idea.text}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-300 font-medium">
                            {new Date(idea.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeIdea(idea.id)}
                        className="text-slate-200 hover:text-rose-400 p-2 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default GamesTab;
