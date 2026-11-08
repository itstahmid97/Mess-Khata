'use client';

import React from 'react';
import { 
  ShoppingCart, 
  UtensilsCrossed, 
  TrendingUp, 
  Home, 
  Wallet, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { MessCalculations } from '../types';
import { formatTaka, toBengaliNumber } from '../lib/helpers';

interface SummaryCardsProps {
  calc: MessCalculations;
  memberCount: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ calc, memberCount }) => {
  // Cash in hand = Total Deposits - Total Bazar (or total expenses paid)
  const cashInHand = calc.totalDeposits - calc.totalBazar;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {/* 1. Meal Rate */}
      <div className="col-span-2 sm:col-span-1 lg:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 text-white shadow-md shadow-emerald-700/10 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-3 -bottom-3 opacity-15">
          <TrendingUp className="w-24 h-24" />
        </div>
        <div>
          <div className="flex items-center justify-between text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>বর্তমান মিল রেট</span>
            <span className="bg-emerald-500/40 px-2 py-0.5 rounded text-[10px] text-white">লাইভ</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
            {formatTaka(calc.mealRate)}
          </div>
        </div>
        <p className="text-xs text-emerald-100 mt-3 font-medium">
          মোট বাজার ÷ মোট মিল = জনপ্রতি এক মিলের খরচ
        </p>
      </div>

      {/* 2. Total Bazar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors">
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
          <p className="text-[11px] text-gray-500 mt-1">চলতি মাসের খরচ</p>
        </div>
      </div>

      {/* 3. Total Meals */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500">মোট মিল সংখ্যা</span>
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl sm:text-2xl font-bold text-gray-900">
            {toBengaliNumber(calc.totalMeals)} <span className="text-sm font-normal text-gray-500">টি</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">{toBengaliNumber(memberCount)} জন মেম্বারের</p>
        </div>
      </div>

      {/* 4. Total Fixed Bills */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500">ভাড়া ও ইউটিলিটি</span>
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
            <Home className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl sm:text-2xl font-bold text-gray-900">
            {formatTaka(calc.totalFixedBills)}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">বাসা ও অন্যান্য খরচ</p>
        </div>
      </div>

      {/* 5. Total Deposits */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500">মোট জমা টাকা</span>
          <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl sm:text-2xl font-bold text-gray-900">
            {formatTaka(calc.totalDeposits)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold mt-1">
            <span className={cashInHand >= 0 ? 'text-emerald-600' : 'text-red-600'}>
              অবশিষ্ট: {formatTaka(cashInHand)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
