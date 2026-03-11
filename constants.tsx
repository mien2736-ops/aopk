
import React from 'react';
import { Category, DaySchedule, Currency, PrepItem } from './types';

export const VND_TO_KRW_RATE = 0.055;
export const GROUP_SIZE = 6;

// 실시간 공유를 위한 고유 트립 ID
export const TRIP_ID = 'AAPK_NHATRANG_2026_MASTER';
export const SYNC_INTERVAL = 5000; 

// 3/24 제외
export const EXPENSE_DATES = ['여행전', '3/20', '3/21', '3/22', '3/23', '여행후'];
export const PAYERS = ['은별', '소연', '다현', '우현', '희진', '민영'];

export const RECOMMENDED_PREP_ITEMS: PrepItem[] = [
  // 공용 물품
  { id: 'p-c1', text: '멀티콘센트 (멀티탭)', isCommon: true, isCompleted: false, createdBy: '시스템' },
  { id: 'p-c4', text: '일회용품 (수저, 젓가락, 컵, 접시)', isCommon: true, isCompleted: false, createdBy: '시스템' },
  { id: 'p-c5', text: '비상식량 (햇반, 김, 튜브고추장)', isCommon: true, isCompleted: false, createdBy: '시스템' },
  { id: 'p-c7', text: '주방세제 & 수세미', isCommon: true, isCompleted: false, createdBy: '시스템' },
  { id: 'p-c8', text: '세탁세제 (소량)', isCommon: true, isCompleted: false, createdBy: '시스템' },
  { id: 'p-c10', text: '물티슈 & 휴대용 티슈', isCommon: true, isCompleted: false, createdBy: '시스템' },

  // 개인 필수품 (시스템 생성 항목은 모든 멤버의 개인탭에 노출됨)
  { id: 'p-p1', text: '여권 & 여권 사본', isCommon: false, isCompleted: false, createdBy: '시스템' },
  { id: 'p-p2', text: '항공권 (E-ticket)', isCommon: false, isCompleted: false, createdBy: '시스템' },
  { id: 'p-p3', text: '신용카드 & 현금(트래블로그 등)', isCommon: false, isCompleted: false, createdBy: '시스템' },
  { id: 'p-p4', text: '유심 또는 로밍 신청', isCommon: false, isCompleted: false, createdBy: '시스템' },
  { id: 'p-p5', text: '호텔/투어 바우처 출력본', isCommon: false, isCompleted: false, createdBy: '시스템' },
  { id: 'p-p6', text: '보조배터리 & 충전 케이블', isCommon: false, isCompleted: false, createdBy: '시스템' },
  { id: 'p-p7', text: '개인 세면도구 (칫솔, 치약, 면도기)', isCommon: false, isCompleted: false, createdBy: '시스템' },
  { id: 'p-p8', text: '화장품 & 선크림', isCommon: false, isCompleted: false, createdBy: '시스템' },
  { id: 'p-p9', text: '속옷 & 양말 (여유있게)', isCommon: false, isCompleted: false, createdBy: '시스템' },
  { id: 'p-p10', text: '수영복 / 래쉬가드 / 방수팩', isCommon: false, isCompleted: false, createdBy: '시스템' },
  { id: 'p-p11', text: '아쿠아슈즈 또는 슬리퍼', isCommon: false, isCompleted: false, createdBy: '시스템' },
  { id: 'p-p12', text: '선글라스 & 모자', isCommon: false, isCompleted: false, createdBy: '시스템' },
  { id: 'p-p13', text: '잠옷 (편한 옷)', isCommon: false, isCompleted: false, createdBy: '시스템' },
  { id: 'p-p14', text: '목베개 & 안대 (비행기용)', isCommon: false, isCompleted: false, createdBy: '시스템' }
];

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
      { id: 'rp1-1', time: '15:00', description: '🥭 Mango Show (망고 쇼)', isPaid: true },
      { id: 'rp1-2', time: '15:30', description: '🤽‍♀️ Pool Game (수영장 게임)', requiresBooking: true },
      { id: 'rp1-3', time: '16:00', description: '🏓 Pickleball (피클볼)' },
      { id: 'rp1-4', time: '19:00', description: '🎬 Movie Night (영화 감상)', requiresBooking: true },
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
      { id: 'rp2-1', time: '07:00', description: '🧘‍♀️ Hatha Yoga (하타 요가)', requiresBooking: true },
      { id: 'rp2-2', time: '08:15', description: '🚲 Bike Tour (자전거 투어)', requiresBooking: true },
      { id: 'rp2-3', time: '09:15', description: '🤸‍♀️ Stretching (스트레칭)', requiresBooking: true },
      { id: 'rp2-4', time: '10:00', description: '🍳 Cooking Class (쿠킹 클래스)', isPaid: true },
      { id: 'rp2-5', time: '11:00', description: '🤽‍♂️ Pool Game (수영장 게임)', requiresBooking: true },
      { id: 'rp2-6', time: '12:00', description: '🐻 Mascot Dancing (마스코트 댄스)', requiresBooking: true },
      { id: 'rp2-7', time: '14:00', description: '🎨 Non La Painting (논라 모자 페인팅)', isPaid: true, requiresBooking: true },
      { id: 'rp2-8', time: '15:00', description: '☕️ Coffee Tasting (커피 테이스팅)', isPaid: true },
      { id: 'rp2-9', time: '15:30', description: '🏐 Beach Volleyball (비치발리볼)', requiresBooking: true },
      { id: 'rp2-10', time: '16:00', description: '🫧 Foam Pool Party (폼 풀 파티)', requiresBooking: true },
      { id: 'rp2-11', time: '18:00 & 19:00', description: '🎸 Live Music (라이브 음악)' },
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
      { id: 'rp3-1', time: '07:00', description: '🧘‍♂️ Meditation (명상)' },
      { id: 'rp3-2', time: '08:15', description: '💃 Vietnamese Dancing Class (베트남 댄스 클래스)', requiresBooking: true },
      { id: 'rp3-3', time: '09:15', description: '🌴 Coconut Leaf Craft (코코넛 잎 공예)', requiresBooking: true },
      { id: 'rp3-4', time: '10:00', description: '🎲 Mandarin Square Capturing (베트남 전통놀이)' },
      { id: 'rp3-5', time: '11:00', description: '💦 Aqua Gym (아쿠아 짐)', requiresBooking: true },
      { id: 'rp3-6', time: '11:45', description: '🎻 Guitar & Violin (기타 & 바이올린 연주)' },
      { id: 'rp3-7', time: '14:00', description: '🐟 Fish Feeding (물고기 먹이주기)', isPaid: true },
      { id: 'rp3-8', time: '15:00', description: '🥭 Mango Show (망고 쇼)', isPaid: true },
      { id: 'rp3-9', time: '15:30', description: '🏖️ Beach Game (비치 게임)' },
      { id: 'rp3-10', time: '16:00', description: '🏓 Pickleball (피클볼)' },
      { id: 'rp3-11', time: '19:00', description: '🏮 Floating Lantern Ceremony (소원 등 띄우기)', requiresBooking: true },
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
      { id: 'rp4-1', time: '07:00', description: '🧘‍♀️ Yoga (요가)', requiresBooking: true },
      { id: 'rp4-2', time: '08:15', description: '🏃‍♀️ Cardio (유산소 운동)', requiresBooking: true },
      { id: 'rp4-3', time: '09:15', description: '🌱 Seedling Program (모종 심기 체험)', requiresBooking: true },
      { id: 'rp4-4', time: '10:00', description: '🎯 Traditional Games (전통 놀이)', requiresBooking: true },
      { id: 'rp4-5', time: '11:00', description: '💃 Aqua Zumba (아쿠아 줌바)', requiresBooking: true },
      { id: 'rp4-6', time: '14:00', description: '🐟 Fish Feeding (물고기 먹이주기)', isPaid: true },
      { id: 'rp4-7', time: '15:00', description: '🥭 Mango Show (망고 쇼)', isPaid: true },
      { id: 'rp4-8', time: '15:30', description: '🏐 Beach Volleyball (비치발리볼)', requiresBooking: true },
      { id: 'rp4-9', time: '16:00', description: '🎳 Petanque (페탕크)' },
      { id: 'rp4-10', time: '19:00', description: '🎬 Movie Night (영화 감상)', requiresBooking: true },
    ]
  }
];

export const PHRASES = [
  { vietnamese: 'Đừng cho rau thơm', korean: '고수 빼주세요', pronunciation: '등 쪼 라우 텀', highlight: true },
  { vietnamese: 'Đắt quá', korean: '너무 비싸요', pronunciation: '닷 꽈' },
  { vietnamese: 'Xin chào', korean: '안녕하세요', pronunciation: '씬 짜오' },
  { vietnamese: 'Cảm ơn', korean: '감사합니다', pronunciation: '깜 언' },
  { vietnamese: 'Tính tiền', korean: '계산해주세요', pronunciation: '띤 띠엔' },
  { vietnamese: 'Nhà vệ sinh 어 더우?', korean: '화장실 어디에요?', pronunciation: '냐 베 신 어 더우?' },
];

export const CURRENCY_TIPS = [
  { value: '500,000 VND', color: '파란색', note: '약 27,500원', hex: '#2563eb' },
  { value: '20,000 VND', color: '파란색', note: '약 1,100원 (혼동주의!)', hex: '#60a5fa' },
  { value: '200,000 VND', color: '갈색/분홍', note: '약 11,000원', hex: '#b45309' },
  { value: '10,000 VND', color: '갈색/노랑', note: '약 550원 (혼동주의!)', hex: '#d97706' },
];
