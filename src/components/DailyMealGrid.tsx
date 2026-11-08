'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus, 
  Utensils, 
  Check, 
  Clock, 
  User,
  Shield,
  Sun,
  Moon,
  Users
} from 'lucide-react';
import { MessData, Member, MealEntry } from '../types';
import { formatBengaliFullDate, getBengaliDayOfWeek, toBengaliNumber, generateId } from '../lib/helpers';

interface DailyMealGridProps {
  mess: MessData;
  isAdmin: boolean;
  onUpdateMeals: (updatedMeals: MealEntry[]) => void;
  onOpenAdminModal: () => void;
}

export const DailyMealGrid: React.FC<DailyMealGridProps> = ({
  mess,
  isAdmin,
  onUpdateMeals,
  onOpenAdminModal,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [viewMode, setViewMode] = useState<'day' | 'matrix'>('day');

  // Days in current month
  const activeMonthKey = mess.currentMonthKey || todayStr.slice(0, 7);
  const [yearStr, monthStr] = activeMonthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const daysInMonth = new Date(year, month, 0).getDate();

  const allDatesInMonth: string[] = Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, '0');
    return `${activeMonthKey}-${day}`;
  });

  const getMemberMeal = (memberId: string, date: string): MealEntry | undefined => {
    return mess.meals.find((m) => m.memberId === memberId && m.date === date);
  };

  const handleUpdateEntry = (
    memberId: string, 
    date: string, 
    fields: { lunch?: number; dinner?: number; guest?: number }
  ) => {
    if (!isAdmin) {
      onOpenAdminModal();
      return;
    }

    const existingIndex = mess.meals.findIndex((m) => m.memberId === memberId && m.date === date);
    const existing = existingIndex >= 0 ? mess.meals[existingIndex] : null;

    const newLunch = fields.lunch !== undefined ? Math.max(0, fields.lunch) : (existing?.lunch ?? 0);
    const newDinner = fields.dinner !== undefined ? Math.max(0, fields.dinner) : (existing?.dinner ?? 0);
    const newGuest = fields.guest !== undefined ? Math.max(0, fields.guest) : (existing?.guest ?? 0);
    const totalCount = parseFloat((newLunch + newDinner + newGuest).toFixed(2));

    let updated: MealEntry[];
    if (totalCount === 0) {
      // Remove if 0
      updated = mess.meals.filter((m) => !(m.memberId === memberId && m.date === date));
    } else if (existingIndex >= 0) {
      updated = [...mess.meals];
      updated[existingIndex] = {
        ...updated[existingIndex],
        lunch: newLunch,
        dinner: newDinner,
        guest: newGuest,
        count: totalCount,
      };
    } else {
      updated = [
        ...mess.meals,
        {
          id: generateId('meal'),
          date,
          memberId,
          lunch: newLunch,
          dinner: newDinner,
          guest: newGuest,
          count: totalCount,
        },
      ];
    }

    onUpdateMeals(updated);
  };

  // Day total
  const selectedDateEntries = mess.meals.filter((m) => m.date === selectedDate);
  const dayLunch = selectedDateEntries.reduce((sum, m) => sum + (Number(m.lunch) || 0), 0);
  const dayDinner = selectedDateEntries.reduce((sum, m) => sum + (Number(m.dinner) || 0), 0);
  const dayGuest = selectedDateEntries.reduce((sum, m) => sum + (Number(m.guest) || 0), 0);
  const dayTotal = dayLunch + dayDinner + dayGuest;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
        <div>
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              দৈনিক মিল খাতা (দুপুর, রাত ও গেস্ট মিল)
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            কে কোন দিন দুপুরে ও রাতে কয়টি এবং গেস্ট মিল কয়টি খেয়েছে তার সুনির্দিষ্ট হিসাব
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-gray-200 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              📅 দিনভিত্তিক এন্ট্রি
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'matrix' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              📊 পুরো মাসের ছক
            </button>
          </div>

          {!isAdmin && (
            <button
              onClick={onOpenAdminModal}
              className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>মিল এডিট করতে এডমিন লগইন</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode 1: Day by Day Focused View */}
      {viewMode === 'day' && (
        <div className="p-4 sm:p-6">
          {/* Date Selector Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <div className="text-sm sm:text-base font-bold text-emerald-950">
                  {formatBengaliFullDate(selectedDate)}
                </div>
                <div className="text-xs text-emerald-700 font-medium flex items-center gap-2 mt-0.5">
                  <span>মোট মিল: <strong className="text-emerald-950">{toBengaliNumber(dayTotal)}</strong> টি</span>
                  <span>•</span>
                  <span>দুপুর: {toBengaliNumber(dayLunch)}</span>
                  <span>•</span>
                  <span>রাত: {toBengaliNumber(dayDinner)}</span>
                  <span>•</span>
                  <span>গেস্ট: {toBengaliNumber(dayGuest)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-emerald-300 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Member Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {mess.members.map((member) => {
              const entry = getMemberMeal(member.id, selectedDate);
              const lunch = entry?.lunch ?? 0;
              const dinner = entry?.dinner ?? 0;
              const guest = entry?.guest ?? 0;
              const total = lunch + dinner + guest;

              return (
                <div
                  key={member.id}
                  className={`p-4 rounded-xl border transition-all ${
                    total > 0
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-gray-200 bg-gray-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                        {member.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono">
                          @{member.username}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black font-mono text-emerald-800">
                        {toBengaliNumber(total)}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">মিল</span>
                    </div>
                  </div>

                  {/* Lunch, Dinner, Guest inputs */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
                    {/* Lunch */}
                    <div className="bg-white p-2 rounded-lg border border-gray-200">
                      <div className="text-[11px] font-bold text-amber-600 flex items-center justify-center gap-0.5 mb-1">
                        <Sun className="w-3 h-3" />
                        <span>দুপুর</span>
                      </div>
                      {isAdmin ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            value={lunch}
                            onChange={(e) =>
                              handleUpdateEntry(member.id, selectedDate, {
                                lunch: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-14 text-center font-mono font-bold text-xs border border-gray-300 rounded py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      ) : (
                        <div className="font-mono font-bold text-gray-800 text-xs">
                          {toBengaliNumber(lunch)}
                        </div>
                      )}
                    </div>

                    {/* Dinner */}
                    <div className="bg-white p-2 rounded-lg border border-gray-200">
                      <div className="text-[11px] font-bold text-indigo-600 flex items-center justify-center gap-0.5 mb-1">
                        <Moon className="w-3 h-3" />
                        <span>রাত</span>
                      </div>
                      {isAdmin ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            value={dinner}
                            onChange={(e) =>
                              handleUpdateEntry(member.id, selectedDate, {
                                dinner: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-14 text-center font-mono font-bold text-xs border border-gray-300 rounded py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      ) : (
                        <div className="font-mono font-bold text-gray-800 text-xs">
                          {toBengaliNumber(dinner)}
                        </div>
                      )}
                    </div>

                    {/* Guest */}
                    <div className="bg-white p-2 rounded-lg border border-gray-200">
                      <div className="text-[11px] font-bold text-purple-600 flex items-center justify-center gap-0.5 mb-1">
                        <Users className="w-3 h-3" />
                        <span>গেস্ট</span>
                      </div>
                      {isAdmin ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            value={guest}
                            onChange={(e) =>
                              handleUpdateEntry(member.id, selectedDate, {
                                guest: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-14 text-center font-mono font-bold text-xs border border-gray-300 rounded py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      ) : (
                        <div className="font-mono font-bold text-gray-800 text-xs">
                          {toBengaliNumber(guest)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 1-Click Stepper Buttons for Admin */}
                  {isAdmin && (
                    <div className="flex items-center justify-between gap-1 pt-2.5 mt-2 border-t border-gray-100 text-[10px]">
                      <span className="text-gray-400">১-ক্লিক:</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            handleUpdateEntry(member.id, selectedDate, {
                              lunch: 1,
                              dinner: 1,
                            })
                          }
                          className="px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold cursor-pointer"
                          title="দুপুর ১ + রাত ১"
                        >
                          ২ মিল
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateEntry(member.id, selectedDate, {
                              guest: guest + 0.25,
                            })
                          }
                          className="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold cursor-pointer"
                          title="+০.২৫ গেস্ট মিল যোগ"
                        >
                          +০.২৫
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateEntry(member.id, selectedDate, {
                              guest: guest + 1,
                            })
                          }
                          className="px-1.5 py-0.5 rounded bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold cursor-pointer"
                          title="+১ গেস্ট মিল যোগ"
                        >
                          +১ গেস্ট
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateEntry(member.id, selectedDate, {
                              lunch: 0,
                              dinner: 0,
                              guest: 0,
                            })
                          }
                          className="px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold cursor-pointer"
                          title="মিল শূন্য"
                        >
                          ০
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: Matrix View */}
      {viewMode === 'matrix' && (
        <div className="overflow-x-auto max-h-[600px] scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-gray-100 z-10 border-b border-gray-300">
              <tr>
                <th className="py-2.5 px-3 font-bold text-gray-700 w-32 bg-gray-100">তারিখ ও বার</th>
                {mess.members.map((m) => (
                  <th key={m.id} className="py-2.5 px-2 font-bold text-gray-800 text-center min-w-[75px]">
                    {m.name}
                  </th>
                ))}
                <th className="py-2.5 px-3 font-bold text-emerald-800 text-center bg-emerald-50 min-w-[80px]">
                  দৈনিক মোট মিল
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allDatesInMonth.map((dateStr) => {
                const dayOfWeek = getBengaliDayOfWeek(dateStr);
                const dayNum = dateStr.split('-')[2];
                const isFriday = dayOfWeek === 'শুক্রবার';
                const isSelected = dateStr === selectedDate;

                const dayEntries = mess.meals.filter((m) => m.date === dateStr);
                const dayTotalCount = dayEntries.reduce((sum, m) => sum + (Number(m.count) || 0), 0);

                return (
                  <tr
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`hover:bg-emerald-50/50 transition-colors cursor-pointer ${
                      isSelected ? 'bg-emerald-50/80 font-semibold' : isFriday ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <td className="py-2 px-3 whitespace-nowrap text-gray-700 font-medium">
                      <span className="font-bold text-gray-900 font-mono">{toBengaliNumber(dayNum)} তারিখ</span>
                      <span className={`ml-1 text-[11px] ${isFriday ? 'text-amber-700 font-bold' : 'text-gray-500'}`}>
                        ({dayOfWeek})
                      </span>
                    </td>

                    {mess.members.map((member) => {
                      const entry = getMemberMeal(member.id, dateStr);
                      const totalCount = entry?.count ?? 0;

                      return (
                        <td key={member.id} className="py-2 px-2 text-center">
                          {totalCount > 0 ? (
                            <span className="inline-block px-2 py-0.5 rounded font-mono font-bold bg-emerald-100 text-emerald-800 text-xs">
                              {toBengaliNumber(totalCount)}
                            </span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-2 px-3 text-center font-bold font-mono text-emerald-700 bg-emerald-50/40">
                      {dayTotalCount > 0 ? `${toBengaliNumber(dayTotalCount)} টি` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
