export interface Member {
  id: string;
  name: string; // nahid, tasin, shawon, safi, nafi, saif, chitran
  phone?: string;
  username: string; // Login ID set by admin (e.g. nahid, tasin)
  password?: string; // Login password (default '123')
  roomRent: number; // Individual room rent for this member (ঘর ভাড়া একেকজনের একেকরকম)
  role: 'member' | 'manager';
  active: boolean;
  joinedAt: string;
}

export interface MealEntry {
  id: string;
  date: string; // YYYY-MM-DD
  memberId: string;
  lunch: number; // দুপুর (e.g. 0, 0.25, 0.5, 1, 1.25)
  dinner: number; // রাত (e.g. 0, 0.25, 0.5, 1, 1.25)
  guest: number; // গেস্ট মিল (e.g. 0, 0.25, 0.5, 1)
  count: number; // lunch + dinner + guest
  note?: string;
}

export interface BazarEntry {
  id: string;
  date: string; // YYYY-MM-DD
  memberId: string;
  amount: number;
  items: string;
}

export interface DepositEntry {
  id: string;
  date: string; // YYYY-MM-DD
  memberId: string;
  amount: number;
  type: 'meal' | 'rent' | 'general'; // মিল জমা নাকি বাসা ভাড়া জমা
  method?: string; // Cash, bKash, Nagad, Bank
  note?: string;
}

export interface FixedExpenseSegment {
  id: string;
  name: string; // e.g. "ওয়াইফাই বিল", "বিদ্যুৎ বিল", "গ্যাস সিলিন্ডার", "খালা/বুয়া বিল", "ময়লা বিল"
  amount: number;
  distributionType: 'equal' | 'custom';
}

export interface MonthArchive {
  id: string;
  monthKey: string;
  monthNameBengali: string;
  closedAt: string;
  totalBazar: number;
  totalMeals: number;
  mealRate: number;
  totalFixedBills: number;
  totalRoomRent: number;
  membersSummary: {
    memberId: string;
    memberName: string;
    totalMeals: number;
    mealCost: number;
    mealDeposited: number;
    mealBalance: number;
    roomRent: number;
    utilityShare: number;
    totalRentPayable: number;
    rentDeposited: number;
    rentBalance: number;
    finalNetBalance: number; // positive = refund, negative = due
  }[];
  bazarEntries: BazarEntry[];
  fixedExpenses: FixedExpenseSegment[];
}

export interface MessData {
  id: string;
  name: string; // e.g. "শান্তিনীড় মেস"
  code: string; // Unique Mess ID / Code (e.g. "SHANTI-101")
  adminPassword: string; // default: @@Meal##1
  managerName?: string;
  managerPhone?: string;
  currentMonthKey: string;
  currentMonthName: string;
  members: Member[];
  meals: MealEntry[];
  bazarEntries: BazarEntry[];
  deposits: DepositEntry[];
  fixedExpenses: FixedExpenseSegment[]; // Shared utilities (wifi, gas, etc.)
  archives: MonthArchive[];
  updatedAt: string;
}

export interface MemberMealSummary {
  member: Member;
  totalLunch: number;
  totalDinner: number;
  totalGuest: number;
  totalMeals: number;
  mealCost: number;
  mealDeposited: number;
  mealBalance: number; // positive = পাবে, negative = দিতে হবে
}

export interface MemberRentSummary {
  member: Member;
  roomRent: number; // Individual room rent
  utilityShare: number; // Equal share of WiFi, Maid, Gas, Electricity, Trash
  totalRentCost: number; // roomRent + utilityShare
  rentDeposited: number;
  rentBalance: number; // positive = অগ্রিম জমা, negative = বকেয়া
}

export interface CombinedMemberSummary {
  member: Member;
  mealSummary: MemberMealSummary;
  rentSummary: MemberRentSummary;
  totalCostCombined: number; // mealCost + totalRentCost
  totalDepositedCombined: number; // mealDeposited + rentDeposited
  finalNetBalance: number; // totalDepositedCombined - totalCostCombined
}

export type MemberSummary = CombinedMemberSummary;

export interface MessCalculations {
  // Meal Side
  totalMeals: number;
  totalLunch: number;
  totalDinner: number;
  totalGuest: number;
  totalBazar: number;
  mealRate: number;
  totalMealDeposits: number;
  mealDue: number;
  mealRefund: number;
  memberMealSummaries: MemberMealSummary[];

  // Rent Side
  totalRoomRent: number;
  totalSharedUtilities: number;
  totalFixedBills: number; // alias
  totalRentPayableAll: number; // roomRent + utilities
  totalRentDeposits: number;
  totalDeposits: number; // totalMealDeposits + totalRentDeposits
  rentDue: number;
  rentAdvance: number;
  memberRentSummaries: MemberRentSummary[];

  // Combined
  combinedSummaries: CombinedMemberSummary[];
  memberSummaries: CombinedMemberSummary[];
}

export interface UserSession {
  messId: string;
  role: 'manager' | 'member';
  memberId?: string;
  username: string;
  name: string;
}
