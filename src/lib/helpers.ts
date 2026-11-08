import { 
  MessData, 
  MessCalculations, 
  MemberMealSummary, 
  MemberRentSummary, 
  CombinedMemberSummary 
} from '../types';
import { BENGALI_DAYS, BENGALI_MONTHS } from './constants';

export function formatTaka(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '৳ ০.০০';
  return `৳ ${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNumber(num: number, decimals: number = 2): string {
  if (isNaN(num) || num === null || num === undefined) return '০';
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Convert English digits to Bengali digits
export function toBengaliNumber(num: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

// Get Bengali day name from Date string YYYY-MM-DD
export function getBengaliDayOfWeek(dateString: string): string {
  try {
    const parts = dateString.split('-');
    if (parts.length !== 3) return '';
    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return BENGALI_DAYS[date.getDay()] || '';
  } catch {
    return '';
  }
}

// Format full date in Bengali e.g. "০৫ নভেম্বর ২০২৬, বৃহস্পতিবার"
export function formatBengaliFullDate(dateString: string): string {
  try {
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parts[2];
    const dayOfWeek = getBengaliDayOfWeek(dateString);
    const monthName = BENGALI_MONTHS[monthIndex] || parts[1];
    return `${toBengaliNumber(day)} ${monthName} ${toBengaliNumber(year)}, ${dayOfWeek}`;
  } catch {
    return dateString;
  }
}

// Core Dual-Calculation Engine (Meal + Rent separated)
export function calculateMessTotals(mess: MessData): MessCalculations {
  const activeMembers = mess.members.filter((m) => m.active);
  const activeMemberCount = activeMembers.length > 0 ? activeMembers.length : 1;

  // ================= 1. MEAL CALCULATION =================
  let totalLunch = 0;
  let totalDinner = 0;
  let totalGuest = 0;
  let totalMeals = 0;

  mess.meals.forEach((m) => {
    const lunch = Number(m.lunch) || 0;
    const dinner = Number(m.dinner) || 0;
    const guest = Number(m.guest) || 0;
    const sum = lunch + dinner + guest || Number(m.count) || 0;

    totalLunch += lunch;
    totalDinner += dinner;
    totalGuest += guest;
    totalMeals += sum;
  });

  const totalBazar = mess.bazarEntries.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const mealRate = totalMeals > 0 ? totalBazar / totalMeals : 70; // fallback to 70 if 0

  let totalMealDeposits = 0;
  let mealDue = 0;
  let mealRefund = 0;

  const memberMealSummaries: MemberMealSummary[] = mess.members.map((member) => {
    let memberLunch = 0;
    let memberDinner = 0;
    let memberGuest = 0;

    mess.meals
      .filter((m) => m.memberId === member.id)
      .forEach((m) => {
        memberLunch += Number(m.lunch) || 0;
        memberDinner += Number(m.dinner) || 0;
        memberGuest += Number(m.guest) || 0;
      });

    const memberTotalMeals = memberLunch + memberDinner + memberGuest;
    const mealCost = memberTotalMeals * mealRate;

    // Deposits designated for meal
    const mealDeposited = mess.deposits
      .filter((d) => d.memberId === member.id && (d.type === 'meal' || !d.type))
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

    const mealBalance = mealDeposited - mealCost;

    totalMealDeposits += mealDeposited;
    if (mealBalance > 0) {
      mealRefund += mealBalance;
    } else {
      mealDue += Math.abs(mealBalance);
    }

    return {
      member,
      totalLunch: memberLunch,
      totalDinner: memberDinner,
      totalGuest: memberGuest,
      totalMeals: memberTotalMeals,
      mealCost,
      mealDeposited,
      mealBalance,
    };
  });

  // ================= 2. RENT & UTILITY CALCULATION =================
  // Shared Utilities (WiFi + Electricity + Gas + Maid + Trash)
  const totalSharedUtilities = mess.fixedExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const perMemberUtilityShare = totalSharedUtilities / activeMemberCount;

  let totalRoomRent = 0;
  let totalRentDeposits = 0;
  let rentDue = 0;
  let rentAdvance = 0;

  const memberRentSummaries: MemberRentSummary[] = mess.members.map((member) => {
    const roomRent = member.active ? (Number(member.roomRent) || 0) : 0;
    totalRoomRent += roomRent;

    const utilityShare = member.active ? perMemberUtilityShare : 0;
    const totalRentCost = roomRent + utilityShare;

    // Deposits designated for rent
    const rentDeposited = mess.deposits
      .filter((d) => d.memberId === member.id && d.type === 'rent')
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

    const rentBalance = rentDeposited - totalRentCost;

    totalRentDeposits += rentDeposited;
    if (rentBalance > 0) {
      rentAdvance += rentBalance;
    } else {
      rentDue += Math.abs(rentBalance);
    }

    return {
      member,
      roomRent,
      utilityShare,
      totalRentCost,
      rentDeposited,
      rentBalance,
    };
  });

  const totalRentPayableAll = totalRoomRent + totalSharedUtilities;

  // ================= 3. COMBINED SUMMARY =================
  const combinedSummaries: CombinedMemberSummary[] = mess.members.map((member) => {
    const mealSummary = memberMealSummaries.find((s) => s.member.id === member.id)!;
    const rentSummary = memberRentSummaries.find((s) => s.member.id === member.id)!;

    const totalCostCombined = mealSummary.mealCost + rentSummary.totalRentCost;
    const totalDepositedCombined = mealSummary.mealDeposited + rentSummary.rentDeposited;
    const finalNetBalance = totalDepositedCombined - totalCostCombined;

    return {
      member,
      mealSummary,
      rentSummary,
      totalCostCombined,
      totalDepositedCombined,
      finalNetBalance,
    };
  });

  return {
    totalMeals,
    totalLunch,
    totalDinner,
    totalGuest,
    totalBazar,
    mealRate,
    totalMealDeposits,
    mealDue,
    mealRefund,
    memberMealSummaries,

    totalRoomRent,
    totalSharedUtilities,
    totalFixedBills: totalSharedUtilities,
    totalRentPayableAll,
    totalRentDeposits,
    totalDeposits: totalMealDeposits + totalRentDeposits,
    rentDue,
    rentAdvance,
    memberRentSummaries,

    combinedSummaries,
    memberSummaries: combinedSummaries,
  };
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function getCurrentMonthKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getCurrentMonthNameBengali(): string {
  const d = new Date();
  const monthName = BENGALI_MONTHS[d.getMonth()];
  const yearBengali = toBengaliNumber(d.getFullYear());
  return `${monthName} ${yearBengali}`;
}
