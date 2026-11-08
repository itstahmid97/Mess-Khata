'use client';

import React from 'react';
import { 
  UtensilsCrossed, 
  Home, 
  Calendar, 
  Wallet, 
  Sun, 
  Moon, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Wifi,
  Flame,
  Zap
} from 'lucide-react';
import { MessData, Member, MessCalculations } from '../types';
import { formatTaka, formatBengaliFullDate, getBengaliDayOfWeek, toBengaliNumber } from '../lib/helpers';
import { printMealReport, printRentReport, printMemberSlip } from '../lib/pdfGenerator';

interface PersonalAccountViewProps {
  memberId: string;
  mess: MessData;
  calc: MessCalculations;
  onSwitchToMessView: () => void;
}

export const PersonalAccountView: React.FC<PersonalAccountViewProps> = ({
  memberId,
  mess,
  calc,
  onSwitchToMessView,
}) => {
  const member = mess.members.find((m) => m.id === memberId);
  const mealSummary = calc.memberMealSummaries.find((s) => s.member.id === memberId);
  const rentSummary = calc.memberRentSummaries.find((s) => s.member.id === memberId);

  if (!member || !mealSummary || !rentSummary) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-200">
        <p className="text-gray-500">মেম্বার তথ্য পাওয়া যায়নি।</p>
      </div>
    );
  }

  // Days in current active month
  const todayStr = new Date().toISOString().slice(0, 10);
  const activeMonthKey = mess.currentMonthKey || todayStr.slice(0, 7);
  const [yearStr, monthStr] = activeMonthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const daysInMonth = new Date(year, month, 0).getDate();

  // Daily meals of this member
  const memberMealsMap = new Map<string, { lunch: number; dinner: number; guest: number; count: number; note?: string }>();
  mess.meals
    .filter((m) => m.memberId === memberId)
    .forEach((m) => {
      memberMealsMap.set(m.date, {
        lunch: m.lunch || 0,
        dinner: m.dinner || 0,
        guest: m.guest || 0,
        count: m.count || ((m.lunch || 0) + (m.dinner || 0) + (m.guest || 0)),
        note: m.note,
      });
    });

  // Daily meal rows for current month
  const dailyMealRows = Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, '0');
    const dateStr = `${activeMonthKey}-${day}`;
    const meal = memberMealsMap.get(dateStr) || { lunch: 0, dinner: 0, guest: 0, count: 0 };
    return {
      date: dateStr,
      dayNumber: i + 1,
      dayName: getBengaliDayOfWeek(dateStr),
      ...meal,
    };
  });

  // Deposits of this member
  const mealDeposits = mess.deposits
    .filter((d) => d.memberId === memberId && (d.type === 'meal' || d.type === 'general'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const rentDeposits = mess.deposits
    .filter((d) => d.memberId === memberId && d.type === 'rent')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const isMealRefund = mealSummary.mealBalance >= 0;
  const isRentPaid = rentSummary.rentBalance >= 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Banner with Switch to Mess View */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-500/20">
            {member.name.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ব্যক্তিগত হিসাব খাতা
              </span>
              <span className="text-xs text-slate-400">মেস: {mess.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1 text-white flex items-center gap-2">
              <span>{member.name}</span>
              {member.role === 'manager' && (
                <span className="text-xs bg-purple-600/60 text-purple-200 px-2 py-0.5 rounded-md font-semibold">
                  ম্যানেজার
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5 font-mono">
              ইউজার আইডি: @{member.username} | চলতি মাস: {mess.currentMonthName}
            </p>
          </div>
        </div>

        {/* View Switcher Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onSwitchToMessView}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold transition-all border border-white/10 cursor-pointer shadow-sm hover:scale-[1.02]"
            title="মেসের সকল সদস্যদের মিল ও ভাড়ার সার্বিক তালিকা দেখুন"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>👥 মেসের সবার হিসাব দেখুন</span>
          </button>

          <button
            onClick={() => printMemberSlip(mess, memberId, calc, 'meal')}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
            title="আমার মিল হিসাবের স্লিপ প্রিন্ট করুন"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>মিল স্লিপ</span>
          </button>

          <button
            onClick={() => printMemberSlip(mess, memberId, calc, 'rent')}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
            title="আমার বাসা ভাড়া স্লিপ প্রিন্ট করুন"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>ভাড়া স্লিপ</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: সম্পুর্ণ পৃথক মিল হিসাব (MEAL ACCOUNT)        */}
      {/* ========================================================= */}
      <section className="bg-white rounded-3xl border border-emerald-200/80 shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                <span>১. আমার মিলের হিসাব (Meal Account)</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  মিল রেট: {formatTaka(calc.mealRate)}
                </span>
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                তারিখ ও বার অনুযায়ী খাবার, মোট মিল খরচ, জমা ও পাওনার পৃথক হিসাব
              </p>
            </div>
          </div>

          {/* Meal Status Badge */}
          <div>
            {isMealRefund ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>মিলের টাকা ফেরত প্রাপ্য: +{formatTaka(mealSummary.mealBalance)}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-100 text-rose-800 border border-rose-200 text-xs sm:text-sm font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>মেসকে মিল বাবদ প্রদেয়: -{formatTaka(Math.abs(mealSummary.mealBalance))}</span>
              </div>
            )}
          </div>
        </div>

        {/* Meal Stat Cards */}
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100">
              <span className="text-xs font-semibold text-emerald-800">আমার মোট মিল</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
                {toBengaliNumber(mealSummary.totalMeals)} <span className="text-xs font-normal text-emerald-700">টি</span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-1 flex flex-wrap items-center gap-1.5">
                <span>দুপুর: {toBengaliNumber(mealSummary.totalLunch)}</span>
                <span>•</span>
                <span>রাত: {toBengaliNumber(mealSummary.totalDinner)}</span>
                {mealSummary.totalGuest > 0 && (
                  <>
                    <span>•</span>
                    <span>গেস্ট: {toBengaliNumber(mealSummary.totalGuest)}</span>
                  </>
                )}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">চলতি মিল রেট</span>
              <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 font-mono">
                {formatTaka(calc.mealRate)}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                মোট বাজার ÷ মোট মিল
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">আমার মিল খরচ</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-800 mt-1 font-mono">
                {formatTaka(mealSummary.mealCost)}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                {toBengaliNumber(mealSummary.totalMeals)} মিল × {formatTaka(calc.mealRate)}
              </p>
            </div>

            <div className="bg-teal-50/60 rounded-2xl p-4 border border-teal-100">
              <span className="text-xs font-semibold text-teal-800">মিল বাবদ আমার জমা</span>
              <div className="text-2xl sm:text-3xl font-black text-teal-950 mt-1 font-mono">
                {formatTaka(mealSummary.mealDeposited)}
              </div>
              <p className="text-[11px] text-teal-700 mt-1">
                {toBengaliNumber(mealDeposits.length)} টি জমার এন্ট্রি
              </p>
            </div>
          </div>

          {/* Date-by-date Daily Meals Table */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>তারিখ ও বার অনুযায়ী আমার দৈনিক মিল তালিকা</span>
              </h3>
              <span className="text-[11px] text-gray-500">
                মোট {toBengaliNumber(daysInMonth)} দিনের সম্পূর্ণ বিবরণ
              </span>
            </div>

            <div className="overflow-x-auto max-h-80 scrollbar-thin">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead className="sticky top-0 bg-gray-100 text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-12">তারিখ</th>
                    <th className="py-2.5 px-3">বার</th>
                    <th className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Sun className="w-3 h-3 text-amber-500" />
                        <span>দুপুর</span>
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Moon className="w-3 h-3 text-indigo-500" />
                        <span>রাত</span>
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-center">গেস্ট মিল</th>
                    <th className="py-2.5 px-3 text-center font-bold text-emerald-900 bg-emerald-50">মোট মিল</th>
                    <th className="py-2.5 px-3 text-right">মিলের মূল্য ({formatTaka(calc.mealRate)})</th>
                    <th className="py-2.5 px-3 text-center">অবস্থা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dailyMealRows.map((r) => {
                    const hasMeal = r.count > 0;
                    const isToday = r.date === todayStr;

                    return (
                      <tr
                        key={r.date}
                        className={`transition-colors ${
                          isToday
                            ? 'bg-amber-50 font-semibold'
                            : hasMeal
                            ? 'hover:bg-emerald-50/40'
                            : 'text-gray-400 bg-gray-50/20'
                        }`}
                      >
                        <td className="py-2 px-3 text-center font-mono font-bold text-gray-800">
                          {toBengaliNumber(r.dayNumber)}
                        </td>
                        <td className="py-2 px-3 text-gray-700">
                          {r.dayName} {isToday && <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold ml-1">আজ</span>}
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-medium">
                          {r.lunch > 0 ? toBengaliNumber(r.lunch) : '-'}
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-medium">
                          {r.dinner > 0 ? toBengaliNumber(r.dinner) : '-'}
                        </td>
                        <td className="py-2 px-3 text-center font-mono text-amber-700 font-semibold">
                          {r.guest > 0 ? toBengaliNumber(r.guest) : '-'}
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-black text-emerald-900 bg-emerald-50/50">
                          {hasMeal ? `${toBengaliNumber(r.count)} টি` : '০'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-gray-800">
                          {hasMeal ? formatTaka(r.count * calc.mealRate) : '-'}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {hasMeal ? (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              খাওয়া হয়েছে
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400">মিল বন্ধ</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Member's Meal Deposits List */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-teal-600" />
              <span>মিল বাবদ আমার জমা দেওয়ার রেকর্ড ({toBengaliNumber(mealDeposits.length)} টি)</span>
            </h4>
            {mealDeposits.length === 0 ? (
              <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-xl border border-gray-100">
                এই মাসে এখনও মিল বাবদ কোনো টাকা জমা রেকর্ড করা হয়নি।
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {mealDeposits.map((d) => (
                  <div key={d.id} className="p-3 rounded-xl border border-teal-100 bg-teal-50/40 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-gray-800">
                        {formatBengaliFullDate(d.date)}
                      </div>
                      <div className="text-[11px] text-teal-700">
                        {d.method || 'নগদ'} {d.note ? `• ${d.note}` : ''}
                      </div>
                    </div>
                    <div className="text-sm font-black text-teal-900 font-mono">
                      {formatTaka(d.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: সম্পুর্ণ পৃথক বাসা ভাড়া ও ইউটিলিটি বিল হিসাব   */}
      {/* ========================================================= */}
      <section className="bg-white rounded-3xl border border-indigo-200/80 shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-50 via-blue-50/50 to-white border-b border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-700/20">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                <span>২. আমার বাসা ভাড়া ও ইউটিলিটি বিল (Rent Ledger)</span>
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                নির্দিষ্ট রুম ভাড়া ও মেসের কমন ইউটিলিটি বিলের সমান বণ্টনের পৃথক হিসাব
              </p>
            </div>
          </div>

          {/* Rent Status Badge */}
          <div>
            {isRentPaid ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs sm:text-sm font-bold">
                <CheckCircle2 className="w-4 h-4 text-indigo-700" />
                <span>
                  {rentSummary.rentBalance === 0 
                    ? 'বাসা ভাড়া সম্পূর্ণ পরিশোধিত' 
                    : `ভাড়া অগ্রিম জমা আছে: +${formatTaka(rentSummary.rentBalance)}`}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 text-xs sm:text-sm font-bold">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>বাসা ভাড়া বকেয়া রয়েছে: -{formatTaka(Math.abs(rentSummary.rentBalance))}</span>
              </div>
            )}
          </div>
        </div>

        {/* Rent Stat Cards */}
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-indigo-50/60 rounded-2xl p-4 border border-indigo-100">
              <span className="text-xs font-semibold text-indigo-800">আমার রুমের ভাড়া</span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-950 mt-1 font-mono">
                {formatTaka(rentSummary.roomRent)}
              </div>
              <p className="text-[11px] text-indigo-700 mt-1">
                রুম অনুযায়ী আপনার নির্ধারিত ভাড়া
              </p>
            </div>

            <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100">
              <span className="text-xs font-semibold text-blue-800">ইউটিলিটি বিল শেয়ার</span>
              <div className="text-2xl sm:text-3xl font-black text-blue-950 mt-1 font-mono">
                {formatTaka(rentSummary.utilityShare)}
              </div>
              <p className="text-[11px] text-blue-700 mt-1">
                ওয়াইফাই, বুয়া, গ্যাস, কারেন্ট, ময়লা
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">মোট বাসা প্রদেয়</span>
              <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 font-mono">
                {formatTaka(rentSummary.totalRentCost)}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                রুম ভাড়া ({formatTaka(rentSummary.roomRent)}) + বিল ({formatTaka(rentSummary.utilityShare)})
              </p>
            </div>

            <div className="bg-teal-50/60 rounded-2xl p-4 border border-teal-100">
              <span className="text-xs font-semibold text-teal-800">ভাড়া বাবদ আমার জমা</span>
              <div className="text-2xl sm:text-3xl font-black text-teal-950 mt-1 font-mono">
                {formatTaka(rentSummary.rentDeposited)}
              </div>
              <p className="text-[11px] text-teal-700 mt-1">
                {toBengaliNumber(rentDeposits.length)} টি জমার এন্ট্রি
              </p>
            </div>
          </div>

          {/* Breakdown of Shared Utility Bills */}
          <div className="rounded-2xl border border-gray-200 p-4 sm:p-5 bg-gray-50/50 mb-6">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-indigo-600" />
                <span>মেসের মাসিক কমন ইউটিলিটি বিলের বিবরণ (সবার মাঝে সমবণ্টন)</span>
              </span>
              <span className="text-xs font-mono font-bold text-indigo-800">
                মোট বিল: {formatTaka(calc.totalSharedUtilities)}
              </span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {mess.fixedExpenses.map((f) => (
                <div key={f.id} className="bg-white p-3 rounded-xl border border-gray-200 text-center shadow-2xs">
                  <div className="text-[11px] text-gray-500 font-medium truncate">{f.name}</div>
                  <div className="text-sm sm:text-base font-bold text-gray-900 font-mono mt-1">
                    {formatTaka(f.amount)}
                  </div>
                  <div className="text-[10px] text-indigo-700 mt-0.5">
                    মাথাপিছু: {formatTaka(f.amount / (mess.members.length || 1))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Member's Rent Deposits List */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-indigo-600" />
              <span>বাসা ভাড়া বাবদ আমার দেওয়া জমার রশিদ ({toBengaliNumber(rentDeposits.length)} টি)</span>
            </h4>
            {rentDeposits.length === 0 ? (
              <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-xl border border-gray-100">
                এই মাসে এখনও বাসা ভাড়া বাবদ কোনো টাকা জমা রেকর্ড করা হয়নি।
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {rentDeposits.map((d) => (
                  <div key={d.id} className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/40 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-gray-800">
                        {formatBengaliFullDate(d.date)}
                      </div>
                      <div className="text-[11px] text-indigo-700">
                        {d.method || 'নগদ'} {d.note ? `• ${d.note}` : ''}
                      </div>
                    </div>
                    <div className="text-sm font-black text-indigo-900 font-mono">
                      {formatTaka(d.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
