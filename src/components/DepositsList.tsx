'use client';

import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Calendar, 
  CreditCard, 
  User, 
  Shield 
} from 'lucide-react';
import { MessData, DepositEntry } from '../types';
import { formatTaka, formatBengaliFullDate, toBengaliNumber, generateId } from '../lib/helpers';

interface DepositsListProps {
  mess: MessData;
  isAdmin: boolean;
  onUpdateDeposits: (entries: DepositEntry[]) => void;
  onOpenAdminModal: () => void;
}

export const DepositsList: React.FC<DepositsListProps> = ({
  mess,
  isAdmin,
  onUpdateDeposits,
  onOpenAdminModal,
}) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DepositEntry | null>(null);

  // Form fields
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [memberId, setMemberId] = useState(mess.members[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [depositType, setDepositType] = useState<'meal' | 'rent'>('meal');
  const [method, setMethod] = useState('Cash');
  const [note, setNote] = useState('');

  const totalDeposits = mess.deposits.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const filteredDeposits = mess.deposits.filter((d) => {
    const member = mess.members.find((m) => m.id === d.memberId);
    const memberName = member?.name || '';
    return (
      memberName.toLowerCase().includes(search.toLowerCase()) ||
      (d.note && d.note.toLowerCase().includes(search.toLowerCase())) ||
      (d.method && d.method.toLowerCase().includes(search.toLowerCase())) ||
      (d.type && d.type.includes(search.toLowerCase())) ||
      d.date.includes(search)
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
    setDepositType('meal');
    setMethod('Cash');
    setNote('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (entry: DepositEntry) => {
    if (!isAdmin) {
      onOpenAdminModal();
      return;
    }
    setEditingEntry(entry);
    setDate(entry.date);
    setMemberId(entry.memberId);
    setAmount(entry.amount.toString());
    setDepositType(entry.type === 'rent' ? 'rent' : 'meal');
    setMethod(entry.method || 'Cash');
    setNote(entry.note || '');
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (!isAdmin) {
      onOpenAdminModal();
      return;
    }
    if (confirm('আপনি কি নিশ্চিতভাবে এই জমার রেকর্ড মুছে ফেলতে চান?')) {
      const updated = mess.deposits.filter((d) => d.id !== id);
      onUpdateDeposits(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('সঠিক জমার পরিমাণ লিখুন!');
      return;
    }

    if (editingEntry) {
      const updated = mess.deposits.map((d) =>
        d.id === editingEntry.id
          ? { ...d, date, memberId, amount: numAmount, type: depositType, method, note: note.trim() }
          : d
      );
      onUpdateDeposits(updated);
    } else {
      const newEntry: DepositEntry = {
        id: generateId('deposit'),
        date,
        memberId,
        amount: numAmount,
        type: depositType,
        method,
        note: note.trim(),
      };
      onUpdateDeposits([...mess.deposits, newEntry]);
    }

    setShowAddModal(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              মেম্বারদের টাকা জমা (Deposit) খাতা
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            মোট সংগৃহীত জমা: <strong className="text-emerald-700 font-bold">{formatTaka(totalDeposits)}</strong> ({toBengaliNumber(mess.deposits.length)} টি ট্রানজেকশন)
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
              placeholder="সদস্যের নাম বা মেথড খুঁজুন..."
              className="text-xs sm:text-sm pl-9 pr-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-56"
            />
          </div>

          {/* Add Button */}
          {isAdmin ? (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>টাকা জমা এন্ট্রি</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminModal}
              className="text-xs font-semibold text-gray-600 hover:text-emerald-700 bg-gray-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">টাকা জমা যুক্ত করতে এডমিন লগইন</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100/80 text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <th className="py-3 px-3 sm:px-4 text-center w-12">নং</th>
              <th className="py-3 px-3 sm:px-4">জমার তারিখ ও বার</th>
              <th className="py-3 px-3 sm:px-4">সদস্যের নাম</th>
              <th className="py-3 px-3 sm:px-4 text-center">খাত</th>
              <th className="py-3 px-3 sm:px-4">পেমেন্ট মেথড</th>
              <th className="py-3 px-3 sm:px-4">মন্তব্য / নোট</th>
              <th className="py-3 px-3 sm:px-4 text-right">জমার পরিমাণ</th>
              {isAdmin && <th className="py-3 px-3 sm:px-4 text-center w-24">একশন</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDeposits.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="py-8 text-center text-gray-400">
                  কোনো জমার তথ্য পাওয়া যায়নি!
                </td>
              </tr>
            ) : (
              filteredDeposits.map((entry, idx) => {
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
                        <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] flex items-center justify-center">
                          {member?.name ? member.name.slice(0, 1) : '?'}
                        </div>
                        <span className="font-semibold text-gray-900">{member?.name || 'অজানা মেম্বার'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 sm:px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        entry.type === 'rent'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {entry.type === 'rent' ? 'ভাড়া জমা' : 'মিল জমা'}
                      </span>
                    </td>

                    <td className="py-3 px-3 sm:px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        {entry.method || 'Cash'}
                      </span>
                    </td>

                    <td className="py-3 px-3 sm:px-4 text-gray-500">
                      {entry.note ? entry.note : '-'}
                    </td>

                    <td className="py-3 px-3 sm:px-4 text-right font-black text-teal-700 font-mono text-sm sm:text-base">
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

      {/* Add / Edit Deposit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingEntry ? 'টাকা জমার তথ্য পরিবর্তন করুন' : 'নতুন টাকা জমা (Deposit) এন্ট্রি'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  জমার তারিখ
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
                  কোন সদস্য টাকা জমা দিয়েছেন?
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
                  জমার খাত (Deposit Type)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDepositType('meal')}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      depositType === 'meal'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    🍽️ মিল বাবদ জমা
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositType('rent')}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      depositType === 'rent'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    🏠 বাসা ভাড়া বাবদ জমা
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  টাকার পরিমাণ (৳)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="যেমন: ৫০০০"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  পেমেন্ট মাধ্যম (Payment Method)
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Cash">ক্যাশ টাকা (Cash)</option>
                  <option value="bKash">বিকাশ (bKash)</option>
                  <option value="Nagad">নগদ (Nagad)</option>
                  <option value="Rocket">রকেট (Rocket)</option>
                  <option value="Bank">ব্যাংক ট্রান্সফার (Bank Transfer)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  নোট / মন্তব্য (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: নভেম্বর মাসের অগ্রিম জমা"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
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
                  {editingEntry ? 'সংরক্ষণ করুন' : 'জমা যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
