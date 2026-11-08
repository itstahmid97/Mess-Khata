'use client';

import React, { useState } from 'react';
import { PlusCircle, Shield, Home, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { createNewMess } from '../lib/storage';
import { DEFAULT_ADMIN_PASSWORD } from '../lib/constants';
import { MessData } from '../types';

interface CreateMessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessCreated: (newMess: MessData) => void;
}

export const CreateMessModal: React.FC<CreateMessModalProps> = ({
  isOpen,
  onClose,
  onMessCreated,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState(DEFAULT_ADMIN_PASSWORD);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('মেসের একটি নাম দিন!');
      return;
    }

    try {
      const created = createNewMess(name.trim(), password.trim(), code.trim());
      onMessCreated(created);
      onClose();
      alert(`অভিনন্দন! "${created.name}" মেস তৈরি হয়েছে। মেস কোড: ${created.code}। এবার এডমিন প্যানেলে লগইন করে মেম্বারদের যুক্ত করুন।`);
    } catch (err) {
      setError('মেস তৈরি করতে ব্যর্থ হয়েছে!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer text-lg"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              নতুন মেস তৈরি করুন
            </h3>
            <p className="text-xs text-gray-500">
              আপনার নিজস্ব মেসের আলাদা এডমিন প্যানেল ও মেম্বার পোর্টাল সেটআপ
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              মেসের নাম (Mess Name)
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="যেমন: স্বপ্ননীড় মেস (ধানমন্ডি)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              মেস কোড / সংক্ষেপ আইডি (ঐচ্ছিক)
            </label>
            <input
              type="text"
              placeholder="যেমন: SWAPNO-101 (ফাঁকা রাখলে স্বয়ংক্রিয় তৈরি হবে)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ম্যানেজার এডমিন পাসওয়ার্ড
            </label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              ডিফল্ট হিসেবে <code className="font-mono font-bold text-emerald-800">@@Meal##1</code> রাখা হয়েছে, আপনি চাইলে এখনই পরিবর্তন করতে পারেন।
            </p>
          </div>

          <div className="text-[11px] text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            ✅ নতুন মেস তৈরি হলে আপনি এর ম্যানেজার হবেন এবং মেম্বারদের জন্য ইউজারনেম ও পাসওয়ার্ড তৈরি করে দিতে পারবেন।
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              মেস তৈরি সম্পন্ন করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
