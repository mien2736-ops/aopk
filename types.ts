
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
  isCompleted: boolean;
  createdBy: string;
}

export type TabType = 'itinerary' | 'expenses' | 'games' | 'info' | 'prep';

export interface User {
  id: string;
  name: string;
}
