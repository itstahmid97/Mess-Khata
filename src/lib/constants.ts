import { MessData } from '../types';

export const APP_NAME = 'মেস খাতা';
export const APP_TAGLINE = 'স্মার্ট ও সহজ মেস-মিল ও বাসা ভাড়া হিসাব';
export const DEFAULT_ADMIN_PASSWORD = '@@Meal##1';
export const DEVELOPER_NAME = 'S.M. Tahmid Hasan Shahria';
export const DEVELOPER_FB = 'https://www.facebook.com/itstahmid';

export const BENGALI_DAYS = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার',
];

export const BENGALI_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

export const DEFAULT_SHARED_UTILITIES = [
  { id: 'u1', name: 'ওয়াইফাই বিল (WiFi Bill)', amount: 700, distributionType: 'equal' as const },
  { id: 'u2', name: 'খালা / রাঁধুনি বিল (Cook Salary)', amount: 3500, distributionType: 'equal' as const },
  { id: 'u3', name: 'গ্যাস সিলিন্ডার বিল (Gas Bill)', amount: 1400, distributionType: 'equal' as const },
  { id: 'u4', name: 'বিদ্যুৎ বিল (Electricity Bill)', amount: 1190, distributionType: 'equal' as const },
  { id: 'u5', name: 'ময়লা বিল (Trash Bill)', amount: 210, distributionType: 'equal' as const },
];

export const INITIAL_DEMO_MESS: MessData = {
  id: 'mess_shantinir_01',
  name: 'শান্তিনীড় মেস',
  code: 'SHANTI-101',
  adminPassword: DEFAULT_ADMIN_PASSWORD,
  managerName: 'নাহিদ হাসান',
  managerPhone: '01700000001',
  currentMonthKey: '2026-11',
  currentMonthName: 'নভেম্বর ২০২৬',
  updatedAt: new Date().toISOString(),
  members: [
    { id: 'm1', name: 'নাহিদ', phone: '01700000001', username: 'nahid', password: '123', roomRent: 4500, role: 'manager', active: true, joinedAt: '2026-11-01' },
    { id: 'm2', name: 'তাসিন', phone: '01700000002', username: 'tasin', password: '123', roomRent: 4200, role: 'member', active: true, joinedAt: '2026-11-01' },
    { id: 'm3', name: 'শাওন', phone: '01700000003', username: 'shawon', password: '123', roomRent: 4000, role: 'member', active: true, joinedAt: '2026-11-01' },
    { id: 'm4', name: 'সাফি', phone: '01700000004', username: 'safi', password: '123', roomRent: 3800, role: 'member', active: true, joinedAt: '2026-11-01' },
    { id: 'm5', name: 'নাফি', phone: '01700000005', username: 'nafi', password: '123', roomRent: 3500, role: 'member', active: true, joinedAt: '2026-11-01' },
    { id: 'm6', name: 'সাইফ', phone: '01700000006', username: 'saif', password: '123', roomRent: 3500, role: 'member', active: true, joinedAt: '2026-11-01' },
    { id: 'm7', name: 'চিত্রন', phone: '01700000007', username: 'chitran', password: '123', roomRent: 3200, role: 'member', active: true, joinedAt: '2026-11-01' },
  ],
  fixedExpenses: DEFAULT_SHARED_UTILITIES,
  // 100 total meals across 7 members for 7 days -> Bazar 7000 -> Meal Rate = 70.00
  meals: [
    // 2026-11-01
    { id: 'ml_1_1', date: '2026-11-01', memberId: 'm1', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_1_2', date: '2026-11-01', memberId: 'm2', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_1_3', date: '2026-11-01', memberId: 'm3', lunch: 1, dinner: 1, guest: 1, count: 3 }, // 1 guest meal
    { id: 'ml_1_4', date: '2026-11-01', memberId: 'm4', lunch: 0.5, dinner: 1, guest: 0, count: 1.5 },
    { id: 'ml_1_5', date: '2026-11-01', memberId: 'm5', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_1_6', date: '2026-11-01', memberId: 'm6', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_1_7', date: '2026-11-01', memberId: 'm7', lunch: 1, dinner: 1, guest: 0, count: 2 },

    // 2026-11-02
    { id: 'ml_2_1', date: '2026-11-02', memberId: 'm1', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_2_2', date: '2026-11-02', memberId: 'm2', lunch: 1, dinner: 1, guest: 0.25, count: 2.25 },
    { id: 'ml_2_3', date: '2026-11-02', memberId: 'm3', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_2_4', date: '2026-11-02', memberId: 'm4', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_2_5', date: '2026-11-02', memberId: 'm5', lunch: 0.5, dinner: 1, guest: 0, count: 1.5 },
    { id: 'ml_2_6', date: '2026-11-02', memberId: 'm6', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_2_7', date: '2026-11-02', memberId: 'm7', lunch: 1, dinner: 1, guest: 0, count: 2 },

    // 2026-11-03
    { id: 'ml_3_1', date: '2026-11-03', memberId: 'm1', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_3_2', date: '2026-11-03', memberId: 'm2', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_3_3', date: '2026-11-03', memberId: 'm3', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_3_4', date: '2026-11-03', memberId: 'm4', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_3_5', date: '2026-11-03', memberId: 'm5', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_3_6', date: '2026-11-03', memberId: 'm6', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_3_7', date: '2026-11-03', memberId: 'm7', lunch: 1, dinner: 1, guest: 0, count: 2 },

    // 2026-11-04
    { id: 'ml_4_1', date: '2026-11-04', memberId: 'm1', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_4_2', date: '2026-11-04', memberId: 'm2', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_4_3', date: '2026-11-04', memberId: 'm3', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_4_4', date: '2026-11-04', memberId: 'm4', lunch: 1, dinner: 1, guest: 0.5, count: 2.5 },
    { id: 'ml_4_5', date: '2026-11-04', memberId: 'm5', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_4_6', date: '2026-11-04', memberId: 'm6', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_4_7', date: '2026-11-04', memberId: 'm7', lunch: 1, dinner: 1, guest: 0, count: 2 },

    // 2026-11-05
    { id: 'ml_5_1', date: '2026-11-05', memberId: 'm1', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_5_2', date: '2026-11-05', memberId: 'm2', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_5_3', date: '2026-11-05', memberId: 'm3', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_5_4', date: '2026-11-05', memberId: 'm4', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_5_5', date: '2026-11-05', memberId: 'm5', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_5_6', date: '2026-11-05', memberId: 'm6', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_5_7', date: '2026-11-05', memberId: 'm7', lunch: 1, dinner: 1, guest: 0, count: 2 },

    // 2026-11-06
    { id: 'ml_6_1', date: '2026-11-06', memberId: 'm1', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_6_2', date: '2026-11-06', memberId: 'm2', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_6_3', date: '2026-11-06', memberId: 'm3', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_6_4', date: '2026-11-06', memberId: 'm4', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_6_5', date: '2026-11-06', memberId: 'm5', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_6_6', date: '2026-11-06', memberId: 'm6', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_6_7', date: '2026-11-06', memberId: 'm7', lunch: 1, dinner: 1, guest: 0, count: 2 },

    // 2026-11-07 (Adjusted so total meals = exactly 100)
    { id: 'ml_7_1', date: '2026-11-07', memberId: 'm1', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_7_2', date: '2026-11-07', memberId: 'm2', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_7_3', date: '2026-11-07', memberId: 'm3', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_7_4', date: '2026-11-07', memberId: 'm4', lunch: 1, dinner: 0.75, guest: 0, count: 1.75 },
    { id: 'ml_7_5', date: '2026-11-07', memberId: 'm5', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_7_6', date: '2026-11-07', memberId: 'm6', lunch: 1, dinner: 1, guest: 0, count: 2 },
    { id: 'ml_7_7', date: '2026-11-07', memberId: 'm7', lunch: 1, dinner: 1, guest: 0, count: 2 },
  ],
  // Total Bazar = 7,000 Tk -> 7000 / 100 = exactly 70.00 Meal Rate!
  bazarEntries: [
    { id: 'bz_1', date: '2026-11-01', memberId: 'm1', amount: 3500, items: 'মিনিকেট চাল ২৫ কেজি, সয়াবিন তেল ৫ লিটার, মসুর ডাল ২ কেজি' },
    { id: 'bz_2', date: '2026-11-03', memberId: 'm2', amount: 2100, items: 'মুরগি ৪ কেজি, আলু, পেঁয়াজ, কাঁচামরিচ, ধনেপাতা' },
    { id: 'bz_3', date: '2026-11-05', memberId: 'm3', amount: 1400, items: 'রুই মাছ ২.৫ কেজি, ডিম ৪ ডজন, সবজি' },
  ],
  deposits: [
    // Meal Deposits
    { id: 'dp_m1', date: '2026-11-01', memberId: 'm1', amount: 1500, type: 'meal', method: 'Cash', note: 'মিল বাবদ জমা' },
    { id: 'dp_m2', date: '2026-11-01', memberId: 'm2', amount: 1500, type: 'meal', method: 'bKash', note: 'মিল বাবদ জমা' },
    { id: 'dp_m3', date: '2026-11-01', memberId: 'm3', amount: 1500, type: 'meal', method: 'Nagad', note: 'মিল বাবদ জমা' },
    { id: 'dp_m4', date: '2026-11-01', memberId: 'm4', amount: 1500, type: 'meal', method: 'Cash', note: 'মিল বাবদ জমা' },
    { id: 'dp_m5', date: '2026-11-01', memberId: 'm5', amount: 1500, type: 'meal', method: 'bKash', note: 'মিল বাবদ জমা' },
    { id: 'dp_m6', date: '2026-11-01', memberId: 'm6', amount: 1500, type: 'meal', method: 'Cash', note: 'মিল বাবদ জমা' },
    { id: 'dp_m7', date: '2026-11-01', memberId: 'm7', amount: 1500, type: 'meal', method: 'Nagad', note: 'মিল বাবদ জমা' },

    // Rent & Utility Deposits
    { id: 'dp_r1', date: '2026-11-01', memberId: 'm1', amount: 5500, type: 'rent', method: 'Bank', note: 'রুম ভাড়া ৪৫০০ + বিল ১০০০' },
    { id: 'dp_r2', date: '2026-11-01', memberId: 'm2', amount: 5200, type: 'rent', method: 'bKash', note: 'রুম ভাড়া ৪২০০ + বিল ১০০০' },
    { id: 'dp_r3', date: '2026-11-01', memberId: 'm3', amount: 5000, type: 'rent', method: 'Nagad', note: 'রুম ভাড়া ৪০০০ + বিল ১০০০' },
    { id: 'dp_r4', date: '2026-11-01', memberId: 'm4', amount: 4800, type: 'rent', method: 'Cash', note: 'রুম ভাড়া ৩৮০০ + বিল ১০০০' },
    { id: 'dp_r5', date: '2026-11-01', memberId: 'm5', amount: 4500, type: 'rent', method: 'bKash', note: 'রুম ভাড়া ৩৫০০ + বিল ১০০০' },
    { id: 'dp_r6', date: '2026-11-01', memberId: 'm6', amount: 4500, type: 'rent', method: 'Cash', note: 'রুম ভাড়া ৩৫০০ + বিল ১০০০' },
    { id: 'dp_r7', date: '2026-11-01', memberId: 'm7', amount: 4200, type: 'rent', method: 'Nagad', note: 'রুম ভাড়া ৩২০০ + বিল ১০০০' },
  ],
  archives: []
};
