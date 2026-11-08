'use client';

import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Wifi, 
  Edit3, 
  Layers, 
  Wallet, 
  Zap, 
  Flame, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { MessData, MessCalculations, MemberRentSummary } from '../types';
import { formatTaka, toBengaliNumber } from '../lib/helpers';

interface RentAccountViewProps {
  mess: MessData;
  calc: MessCalculations;
  isAdmin: boolean;
  onUpdateMemberRoomRent: (memberId: string, newRent: number) => void;
  loggedInMemberId?: string;
}

export const RentAccountView: React.FC<RentAccountViewProps> = ({
  mess,
  calc,
  isAdmin,
  onUpdateMemberRoomRent,
  loggedInMemberId,
}) => {
  const [search, setSearch] = useState('');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [newRentAmount, setNewRentAmount] = useState<string>('');

  const filteredSummaries = calc.memberRentSummaries.filter((s) =>
    s.member.name.toLowerCase().includes(search.toLowerCase()) ||
    s.member.username.toLowerCase().includes(search.toLowerCase())
  );

  const activeMembersCount = mess.members.filter((m) => m.active).length || 1;
  const perMemberUtility = calc.totalSharedUtilities / activeMembersCount;

  const handleStartEdit = (memberId: string, currentRent: number) => {
    setEditingMemberId(memberId);
    setNewRentAmount(currentRent.toString());
  };

  const handleSaveRoomRent = (memberId: string) => {
    const parsed = parseFloat(newRentAmount);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateMemberRoomRent(memberId, parsed);
    }
    setEditingMemberId(null);
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base">
              পৃথক বাসা ভাড়া ও ইউটিলিটি হিসাব (Rent & Utility Ledger)
            </h3>
            <p className="text-xs text-indigo-800 mt-0.5">
              রুম অনুযায়ী <strong>সবার রুম ভাড়া আলাদা</strong>, তবে ওয়াইফাই, বুয়া ও গ্যাস বিল সবার মাঝে <strong>সমান ভাগে</strong> বণ্টন করা হয়।
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold bg-white text-indigo-900 px-3 py-1.5 rounded-lg border border-indigo-200 self-start sm:self-auto">
          জনপ্রতি ইউটিলিটি শেয়ার: <span className="font-bold font-mono">{formatTaka(perMemberUtility)}</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500">মোট রুম ভাড়া</span>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2 font-mono">
            {formatTaka(calc.totalRoomRent)}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">{toBengaliNumber(activeMembersCount)} জন মেম্বারের যোগফল</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500">ইউটিলিটি বিল (কমন)</span>
          <div className="text-xl sm:text-2xl font-bold text-indigo-700 mt-2 font-mono">
            {formatTaka(calc.totalSharedUtilities)}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">ওয়াইফাই, খালা, গ্যাস, কারেন্ট</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500">সর্বমোট ভাড়া ও বিল</span>
          <div className="text-xl sm:text-2xl font-bold text-purple-900 mt-2 font-mono">
            {formatTaka(calc.totalRentPayableAll)}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">রুম ভাড়া + কমন ইউটিলিটি</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500">ভাড়া বাবদ মোট সংগৃহীত</span>
          <div className="text-xl sm:text-2xl font-bold text-teal-700 mt-2 font-mono">
            {formatTaka(calc.totalRentDeposits)}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            অবশিষ্ট বকেয়া: {formatTaka(calc.rentDue)}
          </p>
        </div>
      </div>

      {/* Rent Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>🏠 মেম্বারভিত্তিক বাসা ভাড়া ও ইউটিলিটি তালিকা</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              কার রুমের ভাড়া কত এবং কে কত পরিশোধ করেছেন তার আলাদা হিসাব
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="মেম্বার খুঁজুন..."
              className="text-xs sm:text-sm pl-9 pr-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-100 text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                <th className="py-3 px-3 sm:px-4 text-center w-12">নং</th>
                <th className="py-3 px-3 sm:px-4">সদস্যের নাম</th>
                <th className="py-3 px-3 sm:px-4 text-right">ব্যক্তিগত রুম ভাড়া (Room Rent)</th>
                <th className="py-3 px-3 sm:px-4 text-right">ইউটিলিটি বিল শেয়ার</th>
                <th className="py-3 px-3 sm:px-4 text-right font-extrabold text-purple-950">মোট প্রদেয় ভাড়া</th>
                <th className="py-3 px-3 sm:px-4 text-right font-semibold text-teal-800">ভাড়া বাবদ জমা</th>
                <th className="py-3 px-3 sm:px-4 text-right font-extrabold">ভাড়া ব্যালেন্স</th>
                {isAdmin && <th className="py-3 px-3 sm:px-4 text-center w-20">রুম ভাড়া এডিট</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSummaries.map((s, idx) => {
                const isMyAccount = loggedInMemberId === s.member.id;
                const isPaidInFull = s.rentBalance >= 0;

                return (
                  <tr
                    key={s.member.id}
                    className={`hover:bg-indigo-50/40 transition-colors ${
                      isMyAccount ? 'bg-blue-50/70 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3 sm:px-4 text-center text-gray-400 font-mono text-xs">
                      {toBengaliNumber(idx + 1)}
                    </td>

                    <td className="py-3.5 px-3 sm:px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-xs">
                          {s.member.name.slice(0, 1)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-1">
                            <span>{s.member.name}</span>
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

                    {/* Room Rent */}
                    <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-bold text-gray-900">
                      {editingMemberId === s.member.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            autoFocus
                            value={newRentAmount}
                            onChange={(e) => setNewRentAmount(e.target.value)}
                            className="w-20 px-1.5 py-0.5 text-right border border-indigo-400 rounded font-mono text-xs"
                          />
                          <button
                            onClick={() => handleSaveRoomRent(s.member.id)}
                            className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded cursor-pointer"
                          >
                            সেভ
                          </button>
                        </div>
                      ) : (
                        formatTaka(s.roomRent)
                      )}
                    </td>

                    {/* Utility Share */}
                    <td className="py-3.5 px-3 sm:px-4 text-right font-mono text-indigo-700">
                      {formatTaka(s.utilityShare)}
                    </td>

                    {/* Total Rent Cost */}
                    <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-black text-purple-950 bg-purple-50/30">
                      {formatTaka(s.totalRentCost)}
                    </td>

                    {/* Rent Deposited */}
                    <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-bold text-teal-700">
                      {formatTaka(s.rentDeposited)}
                    </td>

                    {/* Balance */}
                    <td className="py-3.5 px-3 sm:px-4 text-right font-mono">
                      {isPaidInFull ? (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {s.rentBalance === 0 ? 'পরিশোধিত (০.০০)' : `অগ্রিম +${formatTaka(s.rentBalance)}`}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          বকেয়া -{formatTaka(Math.abs(s.rentBalance))}
                        </span>
                      )}
                    </td>

                    {isAdmin && (
                      <td className="py-3.5 px-3 sm:px-4 text-center">
                        <button
                          onClick={() => handleStartEdit(s.member.id, s.roomRent)}
                          className="p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="এই মেম্বারের রুম ভাড়া পরিবর্তন করুন"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-extrabold text-gray-900 border-t-2 border-gray-300">
                <td colSpan={2} className="py-3 px-3 sm:px-4 text-center">
                  সর্বমোট ভাড়া ও বিল
                </td>
                <td className="py-3 px-3 sm:px-4 text-right font-mono text-gray-900">
                  {formatTaka(calc.totalRoomRent)}
                </td>
                <td className="py-3 px-3 sm:px-4 text-right font-mono text-indigo-700">
                  {formatTaka(calc.totalSharedUtilities)}
                </td>
                <td className="py-3 px-3 sm:px-4 text-right font-mono text-purple-950 bg-purple-100/50">
                  {formatTaka(calc.totalRentPayableAll)}
                </td>
                <td className="py-3 px-3 sm:px-4 text-right font-mono text-teal-800">
                  {formatTaka(calc.totalRentDeposits)}
                </td>
                <td className="py-3 px-3 sm:px-4 text-right font-mono text-xs">
                  <span className="text-emerald-700 font-bold">অগ্রিম জমা: +{formatTaka(calc.rentAdvance)}</span>
                  <br />
                  <span className="text-rose-700 font-bold">মোট বকেয়া: -{formatTaka(calc.rentDue)}</span>
                </td>
                {isAdmin && <td></td>}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
