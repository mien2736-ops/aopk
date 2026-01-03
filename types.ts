
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

export type TabType = 'itinerary' | 'expenses' | 'info';

export interface User {
  id: string;
  name: string;
}
