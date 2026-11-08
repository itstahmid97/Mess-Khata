'use client';

import React from 'react';
import { 
  User, 
  Calendar, 
  CreditCard, 
  Utensils, 
  Home,
  CheckCircle2, 
  AlertCircle,
  Sun,
  Moon,
  Users,
  Printer
} from 'lucide-react';
import { MessData, Member, MessCalculations } from '../types';
import { formatTaka, formatBengaliFullDate, getBengaliDayOfWeek, toBengaliNumber } from '../lib/helpers';
import { printMemberSlip } from '../lib/pdfGenerator';

interface MemberDetailModalProps {
  memberId: string | null;
  onClose: () => void;
  mess: MessData;
  calc: MessCalculations;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  memberId,
  onClose,
  mess,
  calc,
}) => {
  if (!memberId) return null;

  const member = mess.members.find((m) => m.id === memberId);
  const mealSum = calc.memberMealSummaries.find((s) => s.member.id === memberId);
  const rentSum = calc.memberRentSummaries.find((s) => s.member.id === memberId);

  if (!member || !mealSum || !rentSum) return null;

  // Member meals date-by-date
  const memberMeals = mess.meals
    .filter((m) => m.memberId === memberId && (m.count > 0 || (m.lunch || 0) + (m.dinner || 0) + (m.guest || 0) > 0))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Member deposits separated
  const memberMealDeposits = mess.deposits
    .filter((d) => d.memberId === memberId && (d.type === 'meal' || d.type === 'general'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const memberRentDeposits = mess.deposits
    .filter((d) => d.memberId === memberId && d.type === 'rent')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const isMealRefund = mealSum.mealBalance >= 0;
  const isRentPaid = rentSum.rentBalance >= 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-lg text-emerald-300">
              {member.name.slice(0, 1)}
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>{member.name}</span>
                {member.role === 'manager' && (
                  <span className="text-[10px] bg-purple-500/50 text-purple-100 px-2 py-0.5 rounded font-medium">
                    ম্যানেজার
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                আইডি: @{member.username} | মেস: {mess.name} ({mess.code})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => printMemberSlip(mess, memberId, calc, 'meal')}
              className="p-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              title="মিল স্লিপ প্রিন্ট করুন"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">মিল স্লিপ</span>
            </button>

            <button
              onClick={() => printMemberSlip(mess, memberId, calc, 'rent')}
              className="p-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              title="ভাড়া স্লিপ প্রিন্ট করুন"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ভাড়া স্লিপ</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer text-lg ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm scrollbar-thin">
          {/* TWO SEPARATE ACCOUNT SECTIONS (NO COMBINED TOTALS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Account 1: Meal Ledger */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-emerald-700" />
                    <span>১. খাবার ও মিল হিসাব</span>
                  </h4>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    রেট: {formatTaka(calc.mealRate)}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span>দুপুর মিল:</span>
                    <span className="font-bold font-mono">{toBengaliNumber(mealSum.totalLunch)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>রাত মিল:</span>
                    <span className="font-bold font-mono">{toBengaliNumber(mealSum.totalDinner)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>গেস্ট মিল:</span>
                    <span className="font-bold font-mono text-amber-700">{toBengaliNumber(mealSum.totalGuest)}</span>
                  </div>
                  <div className="flex justify-between border-t border-emerald-200 pt-1 font-bold text-emerald-900">
                    <span>মোট মিল:</span>
                    <span className="font-mono">{toBengaliNumber(mealSum.totalMeals)} টি</span>
                  </div>
                  <div className="flex justify-between">
                    <span>মিল বাবদ খরচ:</span>
                    <span className="font-bold font-mono text-emerald-800">{formatTaka(mealSum.mealCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>মিল বাবদ জমা:</span>
                    <span className="font-bold font-mono text-teal-700">{formatTaka(mealSum.mealDeposited)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-emerald-200">
                <div className={`p-2 rounded-xl text-center font-bold text-xs ${
                  isMealRefund ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                }`}>
                  {isMealRefund 
                    ? `মিলের ফেরত পাবে: +${formatTaka(mealSum.mealBalance)}` 
                    : `মেসকে মিল বাবদ বকেয়া: -${formatTaka(Math.abs(mealSum.mealBalance))}`}
                </div>
              </div>
            </div>

            {/* Account 2: Rent Ledger */}
            <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-indigo-950 text-xs sm:text-sm flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-indigo-700" />
                    <span>২. বাসা ভাড়া ও ইউটিলিটি</span>
                  </h4>
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                    রুম ভাড়া
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span>নির্ধারিত রুম ভাড়া:</span>
                    <span className="font-bold font-mono text-gray-900">{formatTaka(rentSum.roomRent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ইউটিলিটি বিল শেয়ার:</span>
                    <span className="font-bold font-mono text-indigo-700">{formatTaka(rentSum.utilityShare)}</span>
                  </div>
                  <div className="flex justify-between border-t border-indigo-200 pt-1 font-bold text-indigo-950">
                    <span>মোট বাসা প্রদেয়:</span>
                    <span className="font-mono">{formatTaka(rentSum.totalRentCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ভাড়া বাবদ জমা:</span>
                    <span className="font-bold font-mono text-teal-700">{formatTaka(rentSum.rentDeposited)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-indigo-200">
                <div className={`p-2 rounded-xl text-center font-bold text-xs ${
                  isRentPaid ? 'bg-indigo-100 text-indigo-900' : 'bg-rose-100 text-rose-900'
                }`}>
                  {rentSum.rentBalance === 0 
                    ? 'বাসা ভাড়া সম্পূর্ণ পরিশোধিত' 
                    : isRentPaid 
                    ? `ভাড়া অগ্রিম জমা: +${formatTaka(rentSum.rentBalance)}` 
                    : `ভাড়া বকেয়া: -${formatTaka(Math.abs(rentSum.rentBalance))}`}
                </div>
              </div>
            </div>
          </div>

          {/* Date-by-date Meal History */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>তারিখ অনুযায়ী খাবারের বিবরণ ({toBengaliNumber(memberMeals.length)} দিন খাওয়া হয়েছে)</span>
              </span>
              <span className="text-xs text-emerald-700 font-bold">
                মোট মিল: {toBengaliNumber(mealSum.totalMeals)} টি
              </span>
            </h4>

            {memberMeals.length === 0 ? (
              <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-xl border border-gray-100">
                এই মাসে এখনও কোনো মিলের রেকর্ড নেই।
              </p>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-52 overflow-y-auto scrollbar-thin">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-gray-100 text-gray-700 font-semibold sticky top-0">
                    <tr>
                      <th className="py-2 px-3">তারিখ</th>
                      <th className="py-2 px-3 text-center">দুপুর</th>
                      <th className="py-2 px-3 text-center">রাত</th>
                      <th className="py-2 px-3 text-center">গেস্ট</th>
                      <th className="py-2 px-3 text-center font-bold">মোট মিল</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {memberMeals.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-800">
                          {formatBengaliFullDate(m.date)} ({getBengaliDayOfWeek(m.date)})
                        </td>
                        <td className="py-2 px-3 text-center font-mono">
                          {m.lunch > 0 ? toBengaliNumber(m.lunch) : '-'}
                        </td>
                        <td className="py-2 px-3 text-center font-mono">
                          {m.dinner > 0 ? toBengaliNumber(m.dinner) : '-'}
                        </td>
                        <td className="py-2 px-3 text-center font-mono text-amber-700">
                          {m.guest > 0 ? toBengaliNumber(m.guest) : '-'}
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-emerald-800 bg-emerald-50/40">
                          {toBengaliNumber(m.count)} টি
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Member's Deposits (Separated by Meal and Rent) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5 text-xs">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>মিলের জন্য জমা টাকা ({toBengaliNumber(memberMealDeposits.length)} টি)</span>
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto scrollbar-thin">
                {memberMealDeposits.map((d) => (
                  <div key={d.id} className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-gray-800">{formatBengaliFullDate(d.date)}</div>
                      <div className="text-[10px] text-gray-500">{d.method || 'নগদ'} {d.note ? `• ${d.note}` : ''}</div>
                    </div>
                    <div className="font-mono font-bold text-emerald-800">{formatTaka(d.amount)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5 text-xs">
                <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                <span>বাসা ভাড়ার জন্য জমা টাকা ({toBengaliNumber(memberRentDeposits.length)} টি)</span>
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto scrollbar-thin">
                {memberRentDeposits.map((d) => (
                  <div key={d.id} className="p-2 rounded-lg bg-indigo-50/50 border border-indigo-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-gray-800">{formatBengaliFullDate(d.date)}</div>
                      <div className="text-[10px] text-gray-500">{d.method || 'নগদ'} {d.note ? `• ${d.note}` : ''}</div>
                    </div>
                    <div className="font-mono font-bold text-indigo-800">{formatTaka(d.amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-gray-800 transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
