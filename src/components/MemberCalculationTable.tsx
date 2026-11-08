'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Eye, 
  CreditCard,
  FileSpreadsheet
} from 'lucide-react';
import { MessData, MessCalculations, CombinedMemberSummary } from '../types';
import { formatTaka, toBengaliNumber } from '../lib/helpers';

interface MemberCalculationTableProps {
  mess: MessData;
  calc: MessCalculations;
  onSelectMemberForDetail: (memberId: string) => void;
  loggedInMemberId?: string;
}

export const MemberCalculationTable: React.FC<MemberCalculationTableProps> = ({
  mess,
  calc,
  onSelectMemberForDetail,
  loggedInMemberId,
}) => {
  const [search, setSearch] = useState('');

  const filteredSummaries = calc.combinedSummaries.filter((s) =>
    s.member.name.toLowerCase().includes(search.toLowerCase()) ||
    s.member.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              সদস্যভিত্তিক চূড়ান্ত মাসিক মিল ও বিল হিসাব
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            এক্সেল শিটের বিকল্প আধুনিক স্বয়ংক্রিয় হিসাব ক্যালকুলেটর
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="মেম্বারের নাম দিয়ে খুঁজুন..."
            className="text-xs sm:text-sm pl-9 pr-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100/80 text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <th className="py-3 px-3 sm:px-4 text-center w-12">নং</th>
              <th className="py-3 px-3 sm:px-4">সদস্যের নাম</th>
              <th className="py-3 px-3 sm:px-4 text-center">মোট মিল</th>
              <th className="py-3 px-3 sm:px-4 text-right">মিল খরচ ({formatTaka(calc.mealRate)})</th>
              <th className="py-3 px-3 sm:px-4 text-right">ভাড়া ও বিল</th>
              <th className="py-3 px-3 sm:px-4 text-right">সর্বমোট খরচ</th>
              <th className="py-3 px-3 sm:px-4 text-right">জমা (Deposit)</th>
              <th className="py-3 px-3 sm:px-4 text-right font-extrabold">চূড়ান্ত ব্যালেন্স</th>
              <th className="py-3 px-3 sm:px-4 text-center w-16">বিস্তারিত</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
            {filteredSummaries.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-gray-400">
                  কোনো মেম্বারের তথ্য পাওয়া যায়নি!
                </td>
              </tr>
            ) : (
              filteredSummaries.map((summary, idx) => {
                const isMyAccount = loggedInMemberId === summary.member.id;
                const isRefund = summary.finalNetBalance >= 0;

                return (
                  <tr
                    key={summary.member.id}
                    className={`hover:bg-emerald-50/40 transition-colors ${
                      isMyAccount ? 'bg-blue-50/60 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3 sm:px-4 text-center text-gray-500 font-mono text-xs">
                      {toBengaliNumber(idx + 1)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {summary.member.name.slice(0, 1)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                            <span>{summary.member.name}</span>
                            {summary.member.role === 'manager' && (
                              <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-medium">
                                ম্যানেজার
                              </span>
                            )}
                            {isMyAccount && (
                              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-medium">
                                আপনি
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400 font-mono">
                            @{summary.member.username}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-center font-bold text-gray-800">
                      <span className="px-2 py-1 rounded bg-gray-100 text-xs font-mono">
                        {toBengaliNumber(summary.mealSummary.totalMeals)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-right text-gray-700 font-medium font-mono">
                      {formatTaka(summary.mealSummary.mealCost)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-right text-gray-600 font-mono">
                      {formatTaka(summary.rentSummary.totalRentCost)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-right font-bold text-gray-900 font-mono">
                      {formatTaka(summary.totalCostCombined)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-right font-semibold text-teal-700 font-mono">
                      {formatTaka(summary.totalDepositedCombined)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-right">
                      {isRefund ? (
                        <div className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          <span className="text-xs font-bold">পাবে:</span>
                          <span className="font-extrabold font-mono text-xs sm:text-sm">
                            +{formatTaka(summary.finalNetBalance)}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                          <span className="text-xs font-bold">দিতে হবে:</span>
                          <span className="font-extrabold font-mono text-xs sm:text-sm">
                            -{formatTaka(Math.abs(summary.finalNetBalance))}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4 text-center">
                      <button
                        onClick={() => onSelectMemberForDetail(summary.member.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="সদস্যের ব্যক্তিগত হিসাব বিবরণী দেখুন"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          <tfoot>
            <tr className="bg-gray-100 font-extrabold text-gray-900 border-t-2 border-gray-300 text-xs sm:text-sm">
              <td colSpan={2} className="py-3 px-3 sm:px-4 text-center uppercase tracking-wider">
                সর্বমোট
              </td>
              <td className="py-3 px-3 sm:px-4 text-center font-mono">
                {toBengaliNumber(calc.totalMeals)} টি
              </td>
              <td className="py-3 px-3 sm:px-4 text-right font-mono">
                {formatTaka(calc.totalBazar)}
              </td>
              <td className="py-3 px-3 sm:px-4 text-right font-mono">
                {formatTaka(calc.totalRentPayableAll)}
              </td>
              <td className="py-3 px-3 sm:px-4 text-right font-mono text-purple-800">
                {formatTaka(calc.totalBazar + calc.totalRentPayableAll)}
              </td>
              <td className="py-3 px-3 sm:px-4 text-right font-mono text-teal-800">
                {formatTaka(calc.totalMealDeposits + calc.totalRentDeposits)}
              </td>
              <td className="py-3 px-3 sm:px-4 text-right font-mono text-xs">
                <span>অবশিষ্ট ব্যালেন্স: {formatTaka((calc.totalMealDeposits + calc.totalRentDeposits) - (calc.totalBazar + calc.totalRentPayableAll))}</span>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
