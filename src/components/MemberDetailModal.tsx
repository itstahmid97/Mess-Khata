'use client';

import React from 'react';
import { 
  User, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  Utensils, 
  Home,
  CheckCircle2, 
  AlertCircle,
  Sun,
  Moon,
  Users
} from 'lucide-react';
import { MessData, Member, MessCalculations } from '../types';
import { formatTaka, formatBengaliFullDate, toBengaliNumber } from '../lib/helpers';

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
  const combined = calc.combinedSummaries.find((s) => s.member.id === memberId);

  if (!member || !combined) return null;

  const mealSum = combined.mealSummary;
  const rentSum = combined.rentSummary;

  // Member meals date-by-date
  const memberMeals = mess.meals
    .filter((m) => m.memberId === memberId && (m.count > 0 || (m.lunch || 0) + (m.dinner || 0) + (m.guest || 0) > 0))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Member deposits
  const memberDeposits = mess.deposits
    .filter((d) => d.memberId === memberId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const isNetRefund = combined.finalNetBalance >= 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg text-emerald-200">
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
              <p className="text-xs text-emerald-200 font-mono">
                আইডি: @{member.username} | মেস: {mess.name} ({mess.code})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer text-lg"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm scrollbar-thin">
          {/* Final Net Settlement Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isNetRefund
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                {isNetRefund ? 'মেস থেকে চূড়ান্ত ফেরত প্রাপ্য (Refund)' : 'মেসকে চূড়ান্ত প্রদেয় বকেয়া (Net Due)'}
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono mt-1">
                {formatTaka(Math.abs(combined.finalNetBalance))}
              </div>
            </div>

            <div className="text-right text-xs">
              <div>সর্বমোট জমা: <strong className="font-mono text-teal-800">{formatTaka(combined.totalDepositedCombined)}</strong></div>
              <div>সর্বমোট খরচ: <strong className="font-mono text-gray-900">{formatTaka(combined.totalCostCombined)}</strong></div>
            </div>
          </div>

          {/* TWO SEPARATE ACCOUNT SECTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Account 1: Meal Ledger */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
              <h4 className="font-bold text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5 mb-2.5">
                <Utensils className="w-4 h-4 text-emerald-700" />
                <span>১. খাবার ও মিল হিসাব</span>
              </h4>
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
                  <span className="font-bold font-mono">{toBengaliNumber(mealSum.totalGuest)}</span>
                </div>
                <div className="flex justify-between border-t border-emerald-200 pt-1 font-bold text-emerald-900">
                  <span>মোট মিল:</span>
                  <span className="font-mono">{toBengaliNumber(mealSum.totalMeals)} টি</span>
                </div>
                <div className="flex justify-between">
                  <span>মিল বাবদ খরচ ({formatTaka(calc.mealRate)}):</span>
                  <span className="font-bold font-mono text-emerald-800">{formatTaka(mealSum.mealCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>মিল জমা:</span>
                  <span className="font-bold font-mono text-teal-700">{formatTaka(mealSum.mealDeposited)}</span>
                </div>
                <div className="flex justify-between border-t border-emerald-200 pt-1 font-bold">
                  <span>মিল ব্যালেন্স:</span>
                  <span className={`font-mono ${mealSum.mealBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {mealSum.mealBalance >= 0 ? `+${formatTaka(mealSum.mealBalance)} (পাবে)` : `-${formatTaka(Math.abs(mealSum.mealBalance))} (দেবে)`}
                  </span>
                </div>
              </div>
            </div>

            {/* Account 2: Rent Ledger */}
            <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-4">
              <h4 className="font-bold text-indigo-950 text-xs sm:text-sm flex items-center gap-1.5 mb-2.5">
                <Home className="w-4 h-4 text-indigo-700" />
                <span>২. বাসা ভাড়া ও ইউটিলিটি বিল</span>
              </h4>
              <div className="space-y-1.5 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>ব্যক্তিগত রুম ভাড়া:</span>
                  <span className="font-bold font-mono text-gray-900">{formatTaka(rentSum.roomRent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>কমন ইউটিলিটি শেয়ার:</span>
                  <span className="font-bold font-mono text-indigo-800">{formatTaka(rentSum.utilityShare)}</span>
                </div>
                <div className="flex justify-between border-t border-indigo-200 pt-1 font-bold text-purple-950">
                  <span>মোট ভাড়া ও বিল:</span>
                  <span className="font-mono">{formatTaka(rentSum.totalRentCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ভাড়া বাবদ জমা:</span>
                  <span className="font-bold font-mono text-teal-700">{formatTaka(rentSum.rentDeposited)}</span>
                </div>
                <div className="flex justify-between border-t border-indigo-200 pt-1 font-bold">
                  <span>ভাড়া ব্যালেন্স:</span>
                  <span className={`font-mono ${rentSum.rentBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {rentSum.rentBalance >= 0 ? `+${formatTaka(rentSum.rentBalance)} (অগ্রিম)` : `-${formatTaka(Math.abs(rentSum.rentBalance))} (বকেয়া)`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Meals History Table */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>তারিখ অনুযায়ী খাওয়া মিলের বিবরণী</span>
            </h4>
            {memberMeals.length === 0 ? (
              <p className="text-xs text-gray-400">চলতি মাসে কোনো মিল যোগ করা হয়নি।</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {memberMeals.map((ml) => (
                  <div key={ml.id} className="p-2 rounded-lg bg-gray-50 border border-gray-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-medium text-gray-800 font-mono">{ml.date}</span>
                      <span className="text-[10px] text-gray-500 ml-2">
                        (দুপুর {toBengaliNumber(ml.lunch || 0)}, রাত {toBengaliNumber(ml.dinner || 0)}
                        {ml.guest ? `, গেস্ট ${toBengaliNumber(ml.guest)}` : ''})
                      </span>
                    </div>
                    <span className="font-bold text-emerald-800 font-mono bg-emerald-100 px-1.5 py-0.5 rounded">
                      {toBengaliNumber(ml.count)} মিল
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deposits History */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-teal-600" />
              <span>টাকা জমার বিবরণী ({toBengaliNumber(memberDeposits.length)} টি)</span>
            </h4>
            {memberDeposits.length === 0 ? (
              <p className="text-xs text-gray-400">কোনো টাকা জমা দেওয়া হয়নি।</p>
            ) : (
              <div className="space-y-1.5">
                {memberDeposits.map((dp) => (
                  <div key={dp.id} className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-gray-900">{formatBengaliFullDate(dp.date)}</span>
                      <span className="ml-2 px-1.5 py-0.2 rounded text-[10px] font-bold bg-gray-200 text-gray-700">
                        {dp.type === 'rent' ? 'ভাড়া বাবদ' : 'মিল বাবদ'}
                      </span>
                      <span className="ml-2 text-gray-500 font-mono">[{dp.method || 'Cash'}]</span>
                      {dp.note && <span className="ml-2 text-gray-500 italic">{dp.note}</span>}
                    </div>
                    <span className="font-bold text-teal-700 font-mono">
                      {formatTaka(dp.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
