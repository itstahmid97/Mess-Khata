'use client';

import React, { useState } from 'react';
import { 
  Home, 
  Plus, 
  Trash2, 
  Edit3, 
  Wifi, 
  Zap, 
  Flame, 
  Users, 
  Shield, 
  Layers 
} from 'lucide-react';
import { MessData, FixedExpenseSegment } from '../types';
import { formatTaka, toBengaliNumber, generateId } from '../lib/helpers';

interface RentExpensesListProps {
  mess: MessData;
  isAdmin: boolean;
  onUpdateFixedExpenses: (segments: FixedExpenseSegment[]) => void;
  onOpenAdminModal: () => void;
}

export const RentExpensesList: React.FC<RentExpensesListProps> = ({
  mess,
  isAdmin,
  onUpdateFixedExpenses,
  onOpenAdminModal,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSegment, setEditingSegment] = useState<FixedExpenseSegment | null>(null);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const activeMembersCount = mess.members.filter((m) => m.active).length || 1;
  const totalBills = mess.fixedExpenses.reduce((sum, seg) => sum + (Number(seg.amount) || 0), 0);
  const perMemberShare = totalBills / activeMembersCount;

  const handleOpenAdd = () => {
    if (!isAdmin) {
      onOpenAdminModal();
      return;
    }
    setEditingSegment(null);
    setName('');
    setAmount('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (seg: FixedExpenseSegment) => {
    if (!isAdmin) {
      onOpenAdminModal();
      return;
    }
    setEditingSegment(seg);
    setName(seg.name);
    setAmount(seg.amount.toString());
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (!isAdmin) {
      onOpenAdminModal();
      return;
    }
    if (confirm('আপনি কি নিশ্চিতভাবে এই খরচের খাতটি মুছে ফেলতে চান?')) {
      const updated = mess.fixedExpenses.filter((s) => s.id !== id);
      onUpdateFixedExpenses(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      alert('সঠিক টাকার পরিমাণ দিন!');
      return;
    }
    if (!name.trim()) {
      alert('খরচের খাতের নাম দিন!');
      return;
    }

    if (editingSegment) {
      const updated = mess.fixedExpenses.map((s) =>
        s.id === editingSegment.id
          ? { ...s, name: name.trim(), amount: numAmount }
          : s
      );
      onUpdateFixedExpenses(updated);
    } else {
      const newSegment: FixedExpenseSegment = {
        id: generateId('rent_seg'),
        name: name.trim(),
        amount: numAmount,
        distributionType: 'equal',
      };
      onUpdateFixedExpenses([...mess.fixedExpenses, newSegment]);
    }

    setShowAddModal(false);
  };

  // Helper icons for categories
  const getCategoryIcon = (segName: string) => {
    const lower = segName.toLowerCase();
    if (lower.includes('wifi') || lower.includes('ওয়াইফাই') || lower.includes('নেট')) {
      return <Wifi className="w-5 h-5 text-indigo-600" />;
    }
    if (lower.includes('কারেন্ট') || lower.includes('বিদ্যুৎ') || lower.includes('electric')) {
      return <Zap className="w-5 h-5 text-amber-600" />;
    }
    if (lower.includes('গ্যাস') || lower.includes('gas') || lower.includes('সিলিন্ডার')) {
      return <Flame className="w-5 h-5 text-orange-600" />;
    }
    return <Home className="w-5 h-5 text-emerald-600" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div>
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-purple-600" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              বাসা ভাড়া ও ইউটিলিটি বিলের খাতসমূহ (Segments)
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            বাসা ভাড়া, ওয়াইফাই, বিদ্যুৎ, গ্যাস, বুয়া বিল ইত্যাদি ডায়নামিক খাত
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 px-3.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন খাতের বিল যোগ</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminModal}
              className="text-xs font-semibold text-gray-600 hover:text-purple-700 bg-gray-100 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>বিল পরিবর্তন করতে এডমিন লগইন</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Highlight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border-b border-purple-100">
        <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-xs">
          <div className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-1">
            মোট ভাড়া ও বিল খরচ
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-950 font-mono">
            {formatTaka(totalBills)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {toBengaliNumber(mess.fixedExpenses.length)} টি খাতের সর্বমোট সমষ্টি
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-xs">
          <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">
            জনপ্রতি ভাড়া ও বিলের অংশ (সমান ভাগে)
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-950 font-mono">
            {formatTaka(perMemberShare)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            সক্রিয় {toBengaliNumber(activeMembersCount)} জন মেম্বার দিয়ে বিভক্ত
          </div>
        </div>
      </div>

      {/* Segments Cards Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mess.fixedExpenses.length === 0 ? (
          <div className="col-span-full py-8 text-center text-gray-400">
            কোনো বিলের খাত তৈরি করা হয়নি। এডমিন প্যানেল থেকে খাত যুক্ত করুন।
          </div>
        ) : (
          mess.fixedExpenses.map((seg, idx) => {
            const segPerMember = seg.amount / activeMembersCount;

            return (
              <div
                key={seg.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition-all bg-white flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        {getCategoryIcon(seg.name)}
                      </div>
                      <span className="text-xs font-bold text-gray-400 font-mono">
                        #{toBengaliNumber(idx + 1)}
                      </span>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(seg)}
                          className="p-1 rounded text-gray-400 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                          title="এডিট করুন"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(seg.id)}
                          className="p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm sm:text-base mt-1">
                    {seg.name}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-baseline justify-between">
                  <div>
                    <div className="text-[11px] text-gray-500">মোট টাকা:</div>
                    <div className="text-lg font-black text-purple-900 font-mono">
                      {formatTaka(seg.amount)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-gray-500">জনপ্রতি:</div>
                    <div className="text-xs font-bold text-indigo-700 font-mono">
                      {formatTaka(segPerMember)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Segment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingSegment ? 'বিলের খাত পরিবর্তন করুন' : 'নতুন খাতের বিল যোগ করুন'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  খাত বা সেগমেন্টের নাম
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: বাসা ভাড়া, ওয়াইফাই বিল, খালা বিল..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  মোট টাকার পরিমাণ (৳)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="যেমন: ১৬০০০"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <div className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg">
                💡 এই বিলের মোট টাকা মেসের সকল সক্রিয় সদস্যদের মাঝে সমান ভাগে স্বয়ংক্রিয়ভাবে বণ্টন করা হবে।
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
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {editingSegment ? 'সংরক্ষণ করুন' : 'যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
