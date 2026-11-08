'use client';

import React, { useState } from 'react';
import { 
  Archive, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Clock, 
  TrendingUp,
  FolderArchive
} from 'lucide-react';
import { MessData, MonthArchive } from '../types';
import { formatTaka, formatBengaliFullDate, toBengaliNumber } from '../lib/helpers';
import { printArchiveReport } from '../lib/pdfGenerator';

interface ArchiveViewerProps {
  mess: MessData;
}

export const ArchiveViewer: React.FC<ArchiveViewerProps> = ({ mess }) => {
  const archives = mess.archives || [];
  const [selectedArchiveId, setSelectedArchiveId] = useState<string>(
    archives.length > 0 ? archives[0].id : ''
  );

  const activeArchive = archives.find((a) => a.id === selectedArchiveId) || archives[0];

  if (archives.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <FolderArchive className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          কোনো পূর্ববর্তী মাসের সংরক্ষিত রেকর্ড (আর্কাইভ) নেই
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
          বর্তমান মাস সম্পন্ন হলে এডমিন প্যানেল থেকে <strong>&quot;নতুন মাস শুরু ও আর্কাইভ&quot;</strong> বাটনে ক্লিক করলেই পূর্ববর্তী মাসের হিসাব এখানে স্থায়ীভাবে সংরক্ষিত হয়ে যাবে।
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div>
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-blue-600" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              পূর্ববর্তী মাসের আর্কাইভ রেকর্ড (মাসিক ইতিহাস)
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            অটো-রিসেট হওয়া অতীতের সকল মাসের চূড়ান্ত ব্যালেন্স ও মিল রেট
          </p>
        </div>

        {/* Month Selector Dropdown & PDF */}
        <div className="flex items-center gap-2">
          <select
            value={selectedArchiveId}
            onChange={(e) => setSelectedArchiveId(e.target.value)}
            className="text-xs sm:text-sm font-semibold bg-white border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {archives.map((arch) => (
              <option key={arch.id} value={arch.id}>
                📁 {arch.monthNameBengali} ({arch.monthKey})
              </option>
            ))}
          </select>

          {activeArchive && (
            <button
              onClick={() => printArchiveReport(activeArchive, mess.name)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>পিডিএফ রিপোর্ট</span>
            </button>
          )}
        </div>
      </div>

      {activeArchive && (
        <div className="p-4 sm:p-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white shadow-xs">
              <div className="text-xs font-semibold text-blue-100">চূড়ান্ত মিল রেট</div>
              <div className="text-2xl sm:text-3xl font-black mt-1">
                {formatTaka(activeArchive.mealRate)}
              </div>
              <div className="text-[11px] text-blue-200 mt-1">{activeArchive.monthNameBengali}</div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-xs font-semibold text-gray-500">মোট বাজার খরচ</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {formatTaka(activeArchive.totalBazar)}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">সর্বমোট কেনাকাটা</div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-xs font-semibold text-gray-500">মোট মিল সংখ্যা</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {toBengaliNumber(activeArchive.totalMeals)} টি
              </div>
              <div className="text-[11px] text-gray-400 mt-1">খাবার সংখ্যা</div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-xs font-semibold text-gray-500">ভাড়া ও বিল খরচ</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {formatTaka(activeArchive.totalFixedBills)}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">ইউটিলিটি ও বাসা</div>
            </div>
          </div>

          {/* Archived Members Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-100 text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  <th className="py-2.5 px-3 text-center w-12">নং</th>
                  <th className="py-2.5 px-3">সদস্যের নাম</th>
                  <th className="py-2.5 px-3 text-center">মোট মিল</th>
                  <th className="py-2.5 px-3 text-right">মিল খরচ</th>
                  <th className="py-2.5 px-3 text-right">ভাড়া/বিল</th>
                  <th className="py-2.5 px-3 text-right">মোট খরচ</th>
                  <th className="py-2.5 px-3 text-right">জমা (Deposit)</th>
                  <th className="py-2.5 px-3 text-right font-extrabold">চূড়ান্ত ব্যালেন্স</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeArchive.membersSummary.map((m: any, idx: number) => {
                  const netBalance = m.finalNetBalance !== undefined ? m.finalNetBalance : (m.balance ?? 0);
                  const isRefund = netBalance >= 0;
                  const totalCost = m.totalCost !== undefined ? m.totalCost : ((m.mealCost || 0) + (m.totalRentPayable || m.fixedShare || 0));
                  const totalDep = m.totalDeposited !== undefined ? m.totalDeposited : ((m.mealDeposited || 0) + (m.rentDeposited || 0));
                  const rentAndBill = m.totalRentPayable !== undefined ? m.totalRentPayable : (m.fixedShare || 0);

                  return (
                    <tr key={m.memberId || idx} className="hover:bg-gray-50">
                      <td className="py-3 px-3 text-center text-gray-400 font-mono text-xs">
                        {toBengaliNumber(idx + 1)}
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        {m.memberName}
                      </td>
                      <td className="py-3 px-3 text-center font-bold font-mono">
                        {toBengaliNumber(m.totalMeals)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-gray-700">
                        {formatTaka(m.mealCost)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-gray-600">
                        {formatTaka(rentAndBill)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">
                        {formatTaka(totalCost)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-blue-700">
                        {formatTaka(totalDep)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {isRefund ? (
                          <span className="text-emerald-700 font-bold font-mono">
                            পাবে (+{formatTaka(netBalance)})
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold font-mono">
                            দিতে হবে (-{formatTaka(Math.abs(netBalance))})
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-xs text-gray-400 flex items-center justify-between">
            <span>মাস সম্পন্ন ও আর্কাইভ তারিখ: {formatBengaliFullDate(activeArchive.closedAt.slice(0, 10))}</span>
            <span>মেস: {mess.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};
