'use client';

import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Search, 
  ShoppingCart, 
  Eye, 
  TrendingUp, 
  Wallet,
  Sun,
  Moon,
  Users
} from 'lucide-react';
import { MessData, MessCalculations, MemberMealSummary } from '../types';
import { formatTaka, toBengaliNumber } from '../lib/helpers';

interface MealAccountViewProps {
  mess: MessData;
  calc: MessCalculations;
  onSelectMemberForDetail: (memberId: string) => void;
  loggedInMemberId?: string;
}

export const MealAccountView: React.FC<MealAccountViewProps> = ({
  mess,
  calc,
  onSelectMemberForDetail,
  loggedInMemberId,
}) => {
  const [search, setSearch] = useState('');

  const filteredSummaries = calc.memberMealSummaries.filter((s) =>
    s.member.name.toLowerCase().includes(search.toLowerCase()) ||
    s.member.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Meal Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Meal Rate Card */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 text-white shadow-md">
          <div className="flex items-center justify-between text-xs text-emerald-100 font-semibold mb-1">
            <span>বর্তমান মিল রেট</span>
            <span className="bg-emerald-500/40 px-2 py-0.5 rounded text-[10px]">লাইভ</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
            {formatTaka(calc.mealRate)}
          </div>
          <p className="text-[11px] text-emerald-100 mt-2">
            মোট বাজার ({formatTaka(calc.totalBazar)}) ÷ মোট মিল ({toBengaliNumber(calc.totalMeals)})
          </p>
        </div>

        {/* Total Bazar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">মোট বাজার খরচ</span>
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatTaka(calc.totalBazar)}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">{toBengaliNumber(mess.bazarEntries.length)} টি বাজার তালিকা</p>
          </div>
        </div>

        {/* Total Meals with Lunch & Dinner & Guest breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">মোট মিল সংখ্যা</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {toBengaliNumber(calc.totalMeals)} <span className="text-xs font-normal text-gray-500">টি</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2">
              <span>দুপুর: {toBengaliNumber(calc.totalLunch)}</span>
              <span>•</span>
              <span>রাত: {toBengaliNumber(calc.totalDinner)}</span>
              <span>•</span>
              <span>গেস্ট: {toBengaliNumber(calc.totalGuest)}</span>
            </p>
          </div>
        </div>

        {/* Total Meal Deposits */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">মিল বাবদ মোট জমা</span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-teal-700">
              {formatTaka(calc.totalMealDeposits)}
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              ফান্ড স্থিতি: {formatTaka(calc.totalMealDeposits - calc.totalBazar)}
            </p>
          </div>
        </div>
      </div>

      {/* Meal Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                সদস্যদের পৃথক মিল হিসাব খাতা (Meal Ledger)
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              এখানে শুধু খাবার ও মিলের হিসাব আলাদাভাবে দেখানো হচ্ছে (বাসা ভাড়ার হিসাব ছাড়া)
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
                <th className="py-3 px-3 sm:px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>দুপুর</span>
                  </div>
                </th>
                <th className="py-3 px-3 sm:px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>রাত</span>
                  </div>
                </th>
                <th className="py-3 px-3 sm:px-4 text-center">গেস্ট মিল</th>
                <th className="py-3 px-3 sm:px-4 text-center font-extrabold text-emerald-900">মোট মিল</th>
                <th className="py-3 px-3 sm:px-4 text-right">মিল খরচ ({formatTaka(calc.mealRate)})</th>
                <th className="py-3 px-3 sm:px-4 text-right">মিল বাবদ জমা</th>
                <th className="py-3 px-3 sm:px-4 text-right font-extrabold">মিল ব্যালেন্স</th>
                <th className="py-3 px-3 sm:px-4 text-center w-16">ভিউ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSummaries.map((s, idx) => {
                const isMyAccount = loggedInMemberId === s.member.id;
                const isRefund = s.mealBalance >= 0;

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

                    <td className="py-3.5 px-3 sm:px-4 text-center font-mono text-gray-700">
                      {toBengaliNumber(s.totalLunch)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-center font-mono text-gray-700">
                      {toBengaliNumber(s.totalDinner)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-center font-mono text-amber-700 font-semibold">
                      {s.totalGuest > 0 ? toBengaliNumber(s.totalGuest) : '-'}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-center font-mono font-black text-gray-900 bg-emerald-50/40">
                      {toBengaliNumber(s.totalMeals)} টি
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-semibold text-gray-800">
                      {formatTaka(s.mealCost)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-semibold text-teal-700">
                      {formatTaka(s.mealDeposited)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-right font-mono">
                      {isRefund ? (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          পাবে +{formatTaka(s.mealBalance)}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          দিতে হবে -{formatTaka(Math.abs(s.mealBalance))}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-center">
                      <button
                        onClick={() => onSelectMemberForDetail(s.member.id)}
                        className="p-1 rounded text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="দিনভিত্তিক বিস্তারিত মিল দেখুন"
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
                  সর্বমোট মিল
                </td>
                <td className="py-3 px-3 sm:px-4 text-center font-mono">{toBengaliNumber(calc.totalLunch)}</td>
                <td className="py-3 px-3 sm:px-4 text-center font-mono">{toBengaliNumber(calc.totalDinner)}</td>
                <td className="py-3 px-3 sm:px-4 text-center font-mono text-amber-700">{toBengaliNumber(calc.totalGuest)}</td>
                <td className="py-3 px-3 sm:px-4 text-center font-mono text-emerald-800 bg-emerald-100/50">
                  {toBengaliNumber(calc.totalMeals)} টি
                </td>
                <td className="py-3 px-3 sm:px-4 text-right font-mono text-emerald-900">
                  {formatTaka(calc.totalBazar)}
                </td>
                <td className="py-3 px-3 sm:px-4 text-right font-mono text-teal-800">
                  {formatTaka(calc.totalMealDeposits)}
                </td>
                <td className="py-3 px-3 sm:px-4 text-right font-mono text-xs">
                  <span className="text-emerald-700 font-bold">মোট ফেরত: +{formatTaka(calc.mealRefund)}</span>
                  <br />
                  <span className="text-rose-700 font-bold">মোট বকেয়া: -{formatTaka(calc.mealDue)}</span>
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
