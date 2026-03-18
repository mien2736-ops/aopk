
export enum Category {
  ACCOMMODATION = '숙박',
  TRANSPORT = '교통',
  FOOD = '식음료',
  SHOPPING = '쇼핑',
  ALCOHOL = '음주',
  OTHER = '기타'
}

export enum Currency {
  VND = 'VND',
  KRW = 'KRW'
}

export interface Expense {
  id: string;
  description: string;
  category: Category;
  amount: number;
  currency: Currency;
  timestamp: number;
  createdBy: string;
  expenseDate?: string;
  payer?: string;
}

export interface Activity {
  id: string;
  time: string;
  description: string;
  isPaid?: boolean;
  requiresBooking?: boolean;
  notes?: string; // 상세 메모 필드 추가
}

export interface DaySchedule {
  id: string;
  date: string;
  dayName: string;
  title: string;
  timeline: Activity[];
  resortProgram?: Activity[];
}

export interface GameIdea {
  id: string;
  text: string;
  createdBy: string;
  timestamp: number;
}

export interface PrepItem {
  id: string;
  text: string;
  isCommon: boolean;
  assignedTo?: string[]; // 다중 담당자 지원을 위해 배열로 변경
  isCompleted: boolean; // 공용 물품의 전체 완료 상태 (담당자가 체크 시 true)
  completedBy?: string[]; // 개인별 완료 상태를 추적하기 위한 사용자 이름 배열
  createdBy: string;
}

export interface Memo {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  createdBy: string;
}

export type TabType = 'itinerary' | 'expenses' | 'games' | 'info' | 'prep';

export interface User {
  id: string;
  name: string;
}
