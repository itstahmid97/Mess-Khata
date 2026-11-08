'use client';

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Calendar, 
  User, 
  Tag, 
  Shield 
} from 'lucide-react';
import { MessData, BazarEntry } from '../types';
import { formatTaka, formatBengaliFullDate, toBengaliNumber, generateId } from '../lib/helpers';

interface BazarListProps {
  mess: MessData;
  isAdmin: boolean;
  onUpdateBazar: (entries: BazarEntry[]) => void;
  onOpenAdminModal: () => void;
}

export const BazarList: React.FC<BazarListProps> = ({
  mess,
  isAdmin,
  onUpdateBazar,
  onOpenAdminModal,
}) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<BazarEntry | null>(null);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [memberId, setMemberId] = useState(mess.members[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState('');

  // Total bazar
  const totalBazar = mess.bazarEntries.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  // Filtered
  const filteredBazar = mess.bazarEntries.filter((b) => {
    const member = mess.members.find((m) => m.id === b.memberId);
    const memberName = member?.name || '';
    return (
      memberName.toLowerCase().includes(search.toLowerCase()) ||
      b.items.toLowerCase().includes(search.toLowerCase()) ||
      b.date.includes(search)
    );
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleOpenAdd = () => {
    if (!isAdmin) {
      onOpenAdminModal();
      return;
    }
    setEditingEntry(null);
    setDate(new Date().toISOString().slice(0, 10));
    setMemberId(mess.members[0]?.id || '');
    setAmount('');
    setItems('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (entry: BazarEntry) => {
    if (!isAdmin) {
      onOpenAdminModal();
      return;
    }
    setEditingEntry(entry);
    setDate(entry.date);
    setMemberId(entry.memberId);
    setAmount(entry.amount.toString());
    setItems(entry.items);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (!isAdmin) {
      onOpenAdminModal();
      return;
    }
    if (confirm('আপনি কি নিশ্চিতভাবে এই বাজার এন্ট্রিটি মুছে ফেলতে চান?')) {
      const updated = mess.bazarEntries.filter((b) => b.id !== id);
      onUpdateBazar(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('অনুগ্রহ করে সঠিক টাকার পরিমাণ দিন!');
      return;
    }
    if (!items.trim()) {
      alert('বাজারের ফর্দ বা আইটেম লিখুন!');
      return;
    }

    if (editingEntry) {
      const updated = mess.bazarEntries.map((b) =>
        b.id === editingEntry.id
          ? { ...b, date, memberId, amount: numAmount, items: items.trim() }
          : b
      );
      onUpdateBazar(updated);
    } else {
      const newEntry: BazarEntry = {
        id: generateId('bazar'),
        date,
        memberId,
        amount: numAmount,
        items: items.trim(),
      };
      onUpdateBazar([...mess.bazarEntries, newEntry]);
    }

    setShowAddModal(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              দৈনিক বাজার খরচের তালিকা
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            মোট বাজার: <strong className="text-emerald-700 font-bold">{formatTaka(totalBazar)}</strong> ({toBengaliNumber(mess.bazarEntries.length)} টি এন্ট্রি)
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="বাজারের আইটেম বা নাম খুঁজুন..."
              className="text-xs sm:text-sm pl-9 pr-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-56"
            />
          </div>

          {/* Add Bazar Button */}
          {isAdmin ? (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন বাজার যোগ</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminModal}
              className="text-xs font-semibold text-gray-600 hover:text-emerald-700 bg-gray-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">বাজার যোগ করতে এডমিন লগইন</span>
            </button>
          )}
        </div>
      </div>

      {/* Bazar Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100/80 text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <th className="py-3 px-3 sm:px-4 text-center w-12">নং</th>
              <th className="py-3 px-3 sm:px-4">তারিখ ও বার</th>
              <th className="py-3 px-3 sm:px-4">বাজারকারী (ক্রেতা)</th>
              <th className="py-3 px-3 sm:px-4">বাজারের জিনিসপত্র / ফর্দ</th>
              <th className="py-3 px-3 sm:px-4 text-right">টাকার পরিমাণ</th>
              {isAdmin && <th className="py-3 px-3 sm:px-4 text-center w-24">একশন</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBazar.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="py-8 text-center text-gray-400">
                  কোনো বাজার এন্ট্রি পাওয়া যায়নি!
                </td>
              </tr>
            ) : (
              filteredBazar.map((entry, idx) => {
                const member = mess.members.find((m) => m.id === entry.memberId);

                return (
                  <tr key={entry.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3 px-3 sm:px-4 text-center text-gray-400 font-mono text-xs">
                      {toBengaliNumber(idx + 1)}
                    </td>

                    <td className="py-3 px-3 sm:px-4 text-gray-800 font-medium whitespace-nowrap">
                      {formatBengaliFullDate(entry.date)}
                    </td>

                    <td className="py-3 px-3 sm:px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center">
                          {member?.name ? member.name.slice(0, 1) : '?'}
                        </div>
                        <span className="font-semibold text-gray-900">{member?.name || 'অজানা মেম্বার'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 sm:px-4 text-gray-700 max-w-xs sm:max-w-md">
                      <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs leading-relaxed inline-block">
                        {entry.items}
                      </span>
                    </td>

                    <td className="py-3 px-3 sm:px-4 text-right font-black text-emerald-800 font-mono text-sm sm:text-base">
                      {formatTaka(entry.amount)}
                    </td>

                    {isAdmin && (
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(entry)}
                            className="p-1 rounded text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Bazar Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingEntry ? 'বাজার এন্ট্রি পরিবর্তন করুন' : 'নতুন বাজার খরচ যোগ করুন'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  বাজারের তারিখ
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  কে বাজার করেছে?
                </label>
                <select
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {mess.members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.username})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  টাকার পরিমাণ (৳)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="যেমন: ১৫০০"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  বাজারের জিনিসপত্রের ফর্দ
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="যেমন: চাল ৫ কেজি, ডাল ১ কেজি, আলু ও পেঁয়াজ, ডিম ১ ডজন..."
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {editingEntry ? 'সংরক্ষণ করুন' : 'যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
