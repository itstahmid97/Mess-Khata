'use client';

import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Eye, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { MessData, MessCalculations } from '../types';
import { formatTaka, toBengaliNumber } from '../lib/helpers';

interface CombinedOverviewProps {
  mess: MessData;
  calc: MessCalculations;
  onSelectMemberForDetail: (memberId: string) => void;
  loggedInMemberId?: string;
  onNavigateToMeal: () => void;
  onNavigateToRent: () => void;
}

export const CombinedOverview: React.FC<CombinedOverviewProps> = ({
  mess,
  calc,
  onSelectMemberForDetail,
  loggedInMemberId,
  onNavigateToMeal,
  onNavigateToRent,
}) => {
  const [search, setSearch] = useState('');

  const filteredSummaries = calc.combinedSummaries.filter((s) =>
    s.member.name.toLowerCase().includes(search.toLowerCase()) ||
    s.member.username.toLowerCase().includes(search.toLowerCase())
  );

  const grandTotalCost = calc.totalBazar + calc.totalRentPayableAll;
  const grandTotalDeposited = calc.totalMealDeposits + calc.totalRentDeposits;

  return (
    <div className="space-y-6">
      {/* Dual Account Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Meal Account summary card */}
        <div 
          onClick={onNavigateToMeal}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md cursor-pointer hover:scale-[1.01] transition-transform group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              হিসাব খাত ১: খাবার ও মিল
            </span>
            <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded text-white flex items-center gap-1 group-hover:bg-white group-hover:text-emerald-800 transition-colors">
              <span>মিল লেজার দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="text-xs text-emerald-100">বর্তমান মিল রেট:</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono mt-0.5">
                {formatTaka(calc.mealRate)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-100">মোট খাবার মিল:</div>
              <div className="text-xl sm:text-2xl font-bold font-mono">
                {toBengaliNumber(calc.totalMeals)} টি
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-500/40 text-xs text-emerald-100 flex justify-between">
            <span>মোট বাজার: {formatTaka(calc.totalBazar)}</span>
            <span>জমা: {formatTaka(calc.totalMealDeposits)}</span>
          </div>
        </div>

        {/* Rent & Utility Account summary card */}
        <div 
          onClick={onNavigateToRent}
          className="p-5 rounded-2xl bg-gradient-to-br from-indigo-700 to-purple-800 text-white shadow-md cursor-pointer hover:scale-[1.01] transition-transform group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              হিসাব খাত ২: বাসা ভাড়া ও ইউটিলিটি বিল
            </span>
            <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded text-white flex items-center gap-1 group-hover:bg-white group-hover:text-indigo-900 transition-colors">
              <span>ভাড়া লেজার দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="text-xs text-indigo-200">সর্বমোট ভাড়া ও বিল:</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono mt-0.5">
                {formatTaka(calc.totalRentPayableAll)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-indigo-200">কমন ইউটিলিটি শেয়ার:</div>
              <div className="text-xl sm:text-2xl font-bold font-mono">
                {formatTaka(calc.totalSharedUtilities / (mess.members.length || 1))}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-indigo-500/40 text-xs text-indigo-200 flex justify-between">
            <span>রুম ভাড়া: {formatTaka(calc.totalRoomRent)}</span>
            <span>ভাড়া জমা: {formatTaka(calc.totalRentDeposits)}</span>
          </div>
        </div>
      </div>

      {/* Master Combined Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                এক নজরে সদস্যভিত্তিক সমন্বিত সমাপনী হিসাব (Final Settlement)
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              মিল খরচ + বাসা ভাড়া একত্রিত করে চূড়ান্ত পাওনা বা বকেয়া নিরূপণ
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="মেম্বার খুঁজুন..."
              className="text-xs sm:text-sm pl-9 pr-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-100 text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                <th className="py-3 px-3 sm:px-4 text-center w-12">নং</th>
                <th className="py-3 px-3 sm:px-4">সদস্যের নাম</th>
                <th className="py-3 px-3 sm:px-4 text-center">মোট মিল</th>
                <th className="py-3 px-3 sm:px-4 text-right">১. মিল খরচ</th>
                <th className="py-3 px-3 sm:px-4 text-right">২. বাসা ভাড়া ও বিল</th>
                <th className="py-3 px-3 sm:px-4 text-right font-extrabold text-gray-900 bg-gray-200/50">
                  সর্বমোট খরচ (১+২)
                </th>
                <th className="py-3 px-3 sm:px-4 text-right font-bold text-teal-800">
                  সর্বমোট জমা
                </th>
                <th className="py-3 px-3 sm:px-4 text-right font-extrabold">চূড়ান্ত নিট ব্যালেন্স</th>
                <th className="py-3 px-3 sm:px-4 text-center w-16">রশিদ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSummaries.map((s, idx) => {
                const isMyAccount = loggedInMemberId === s.member.id;
                const isRefund = s.finalNetBalance >= 0;

                return (
                  <tr
                    key={s.member.id}
                    className={`hover:bg-emerald-50/40 transition-colors ${
                      isMyAccount ? 'bg-blue-50/70 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3 sm:px-4 text-center text-gray-400 font-mono text-xs">
                      {toBengaliNumber(idx + 1)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {s.member.name.slice(0, 1)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-1">
                            <span>{s.member.name}</span>
                            {s.member.role === 'manager' && (
                              <span className="text-[10px] bg-purple-100 text-purple-700 px-1 rounded font-medium">
                                ম্যানেজার
                              </span>
                            )}
                            {isMyAccount && (
                              <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded font-medium">
                                আপনি
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">@{s.member.username}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-center font-mono font-bold text-gray-800">
                      {toBengaliNumber(s.mealSummary.totalMeals)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-right font-mono text-emerald-800">
                      {formatTaka(s.mealSummary.mealCost)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-right font-mono text-indigo-800">
                      {formatTaka(s.rentSummary.totalRentCost)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-black text-gray-950 bg-gray-50/60">
                      {formatTaka(s.totalCostCombined)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-bold text-teal-700">
                      {formatTaka(s.totalDepositedCombined)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-right font-mono">
                      {isRefund ? (
                        <div className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <span className="text-xs font-bold">পাবে:</span>
                          <span className="font-black text-xs sm:text-sm">
                            +{formatTaka(s.finalNetBalance)}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <span className="text-xs font-bold">দিতে হবে:</span>
                          <span className="font-black text-xs sm:text-sm">
                            -{formatTaka(Math.abs(s.finalNetBalance))}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-center">
                      <button
                        onClick={() => onSelectMemberForDetail(s.member.id)}
                        className="p-1 rounded text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="সদস্যের ব্যক্তিগত হিসাব বিবরণী"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-extrabold text-gray-900 border-t-2 border-gray-300">
                <td colSpan={2} className="py-3 px-3 sm:px-4 text-center">
                  সর্বমোট সমষ্টি
                </td>
                <td className="py-3 px-3 sm:px-4 text-center font-mono">
                  {toBengaliNumber(calc.totalMeals)} টি
                </td>
                <td className="py-3 px-3 sm:px-4 text-right font-mono text-emerald-900">
                  {formatTaka(calc.totalBazar)}
                </td>
                <td className="py-3 px-3 sm:px-4 text-right font-mono text-indigo-900">
                  {formatTaka(calc.totalRentPayableAll)}
                </td>
                <td className="py-3 px-3 sm:px-4 text-right font-mono text-gray-950 bg-gray-200/50">
                  {formatTaka(grandTotalCost)}
                </td>
                <td className="py-3 px-3 sm:px-4 text-right font-mono text-teal-800">
                  {formatTaka(grandTotalDeposited)}
                </td>
                <td className="py-3 px-3 sm:px-4 text-right font-mono text-xs">
                  <span>অবশিষ্ট ব্যালেন্স: {formatTaka(grandTotalDeposited - grandTotalCost)}</span>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
