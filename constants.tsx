
import React from 'react';
import { Category, DaySchedule, Currency } from './types';

export const VND_TO_KRW_RATE = 0.055;
export const GROUP_SIZE = 6;

export const EXPENSE_DATES = ['여행전', '3/20', '3/21', '3/22', '3/23', '3/24', '여행후'];
export const PAYERS = ['은별', '소연', '다현', '우현', '희진', '민영'];

export const INITIAL_ITINERARY: DaySchedule[] = [
  {
    id: 'day1',
    date: '3/20(금)',
    dayName: 'Friday',
    title: '도착 & 시내 맛보기',
    timeline: [
      { id: 't1-1', time: '03:45', description: '인천공항 집합' },
      { id: 't1-2', time: '06:15', description: '인천 출발 (VN441)' },
      { id: 't1-3', time: '09:20', description: '깜란 공항 도착' },
      { id: 't1-4', time: '오전', description: '리조트 짐 보관 -> 근처 마사지' },
      { id: 't1-5', time: '오후', description: '시내 이동(그랩) -> 담시장 -> 롯데마트 쇼핑' },
      { id: 't1-6', time: '16:30', description: '체크인 & 휴식' },
      { id: 't1-7', time: '17:00', description: '🍹 The Level 칵테일 아워 (무제한)' },
    ],
    resortProgram: [
      { id: 'rp1-1', time: '15:00 - 16:00', description: 'Mango show (Elyxr)' },
      { id: 'rp1-2', time: '16:30', description: 'Aqua Fit (메인 풀)' },
      { id: 'rp1-3', time: '16:45 - 17:45', description: 'Beach Sports Volley/football' },
    ]
  },
  {
    id: 'day2',
    date: '3/21(토)',
    dayName: 'Saturday',
    title: '오전 호핑 -> 리조트 휴식',
    timeline: [
      { id: 't2-1', time: '08:00', description: '🤿 호핑투어 픽업 (스노클링, 혼문섬/미니비치)' },
      { id: 't2-2', time: '14:00', description: '리조트 복귀 및 낮잠' },
      { id: 't2-3', time: '16:00', description: '☕ 애프터눈 티' },
      { id: 't2-4', time: '17:00', description: '🍸 칵테일 아워 (리조트 혜택)' },
      { id: 't2-5', time: '저녁', description: '리조트 내 식사 또는 배달' },
    ],
    resortProgram: [
      { id: 'rp2-1', time: '07:00 - 08:00', description: 'Yin Yoga & meditation' },
      { id: 'rp2-2', time: '07:30', description: 'Morning Jog' },
      { id: 'rp2-3', time: '09:45 - 10:30', description: 'Cardio Dance' },
      { id: 'rp2-4', time: '10:30 - 12:00', description: 'Cooking Class', isPaid: true, requiresBooking: true },
      { id: 'rp2-5', time: '11:00 - 12:00', description: 'Aqua volley' },
      { id: 'rp2-6', time: '14:15 - 15:00', description: 'Stretching' },
      { id: 'rp2-7', time: '15:00 - 16:00', description: 'Coffee tasting', isPaid: true, requiresBooking: true },
      { id: 'rp2-8', time: '16:00 - 17:30', description: 'Saturday Games (Adults/Family)' },
      { id: 'rp2-9', time: '19:00 - 20:00', description: 'Lantern wish (Elyxr)' },
    ]
  },
  {
    id: 'day3',
    date: '3/22(일)',
    dayName: 'Sunday',
    title: '시내 풀코스 (오후 출발)',
    timeline: [
      { id: 't3-1', time: '오전', description: '전용 풀장에서 휴식 & 늦잠' },
      { id: 't3-2', time: '13:00', description: '시내 이동 (점심: 씀모이 가든 등)' },
      { id: 't3-3', time: '15:00', description: '💆 단체 전신 마사지 (90분)' },
      { id: 't3-4', time: '17:30', description: '🔥 세일링 클럽 (Sailing Club) 파티 & 불쇼' },
      { id: 't3-5', time: '22:00', description: '리조트 복귀' },
    ],
    resortProgram: [
      { id: 'rp3-1', time: '07:00 - 08:00', description: 'Stretching' },
      { id: 'rp3-2', time: '07:30', description: 'Bike tour', requiresBooking: true },
      { id: 'rp3-3', time: '09:45 - 10:30', description: 'Cardio Box' },
      { id: 'rp3-4', time: '10:30 - 12:00', description: 'Non La Paint', isPaid: true, requiresBooking: true },
      { id: 'rp3-5', time: '11:00 - 12:00', description: 'Aqua volley' },
      { id: 'rp3-6', time: '14:00 - 14:45', description: 'Pilates' },
      { id: 'rp3-7', time: '15:00 - 16:00', description: 'Mango show (Elyxr)' },
      { id: 'rp3-8', time: '16:30', description: 'Aqua Fit' },
      { id: 'rp3-9', time: '16:45 - 17:45', description: 'Beach Sports' },
    ]
  },
  {
    id: 'day4',
    date: '3/23(월)',
    dayName: 'Monday',
    title: '체크아웃 & 귀국',
    timeline: [
      { id: 't4-1', time: '오전', description: '조식 & 마지막 수영' },
      { id: 't4-2', time: '12:00', description: '1차 체크아웃 (짐 맡김)' },
      { id: 't4-3', time: '14:00', description: '🍰 애프터눈 티 (라운지 이용)' },
      { id: 't4-4', time: '16:00', description: '레이트체크아웃 가능시 체크아웃' },
      { id: 't4-5', time: '17:00', description: '💆 마사지 이용 및 저녁식사' },
      { id: 't4-6', time: '18:30', description: '깜란공항 도착' },
      { id: 't4-7', time: '21:50', description: '✈️ 비행기 탑승 (VN440)' },
      { id: 't4-8', time: '04:25', description: '인천 도착 (3/24 화)' },
    ],
    resortProgram: [
      { id: 'rp4-1', time: '07:00 - 08:00', description: 'Hatha Yoga' },
      { id: 'rp4-2', time: '07:30', description: 'Bike tour', requiresBooking: true },
      { id: 'rp4-3', time: '09:45 - 10:30', description: 'Cardio Box' },
      { id: 'rp4-4', time: '10:30 - 12:00', description: 'Lantern craft', isPaid: true, requiresBooking: true },
      { id: 'rp4-5', time: '11:00 - 12:00', description: 'Aqua volley' },
      { id: 'rp4-6', time: '14:15 - 15:00', description: 'Stretching' },
      { id: 'rp4-7', time: '15:00 - 16:00', description: 'Mango show' },
    ]
  }
];

export const PHRASES = [
  { vietnamese: 'Đừng cho rau thơm', korean: '고수 빼주세요', pronunciation: '등 쪼 라우 텀', highlight: true },
  { vietnamese: 'Đắt quá', korean: '너무 비싸요', pronunciation: '닷 꽈' },
  { vietnamese: 'Xin chào', korean: '안녕하세요', pronunciation: '씬 짜오' },
  { vietnamese: 'Cảm ơn', korean: '감사합니다', pronunciation: '깜 언' },
  { vietnamese: 'Tính tiền', korean: '계산해주세요', pronunciation: '띤 띠엔' },
  { vietnamese: 'Nhà vệ sinh ở đâu?', korean: '화장실 어디에요?', pronunciation: '냐 베 신 어 더우?' },
];

export const CURRENCY_TIPS = [
  { value: '500,000 VND', color: '파란색', note: '약 27,500원', hex: '#2563eb' },
  { value: '20,000 VND', color: '파란색', note: '약 1,100원 (혼동주의!)', hex: '#60a5fa' },
  { value: '200,000 VND', color: '갈색/분홍', note: '약 11,000원', hex: '#b45309' },
  { value: '10,000 VND', color: '갈색/노랑', note: '약 550원 (혼동주의!)', hex: '#d97706' },
];
