'use client';

import React, { useState } from 'react';
import { User, Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { MessData, Member } from '../types';

interface MemberLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  mess: MessData;
  onSuccessLogin: (member: Member) => void;
}

export const MemberLoginModal: React.FC<MemberLoginModalProps> = ({
  isOpen,
  onClose,
  mess,
  onSuccessLogin,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim().toLowerCase();
    const found = mess.members.find(
      (m) => m.username.toLowerCase() === cleanUser
    );

    if (!found) {
      setError('এই ইউজারনেম দিয়ে কোনো মেম্বার পাওয়া যায়নি! অনুগ্রহ করে আপনার মেস ম্যানেজারের সাথে যোগাযোগ করুন।');
      return;
    }

    // Default member password is '123' if not set
    const memberPass = found.password || '123';
    if (password.trim() !== memberPass) {
      setError('ভুল পাসওয়ার্ড! (ডিফল্ট পাসওয়ার্ড: 123 বা আপনার এডমিন নির্ধারিত পাসওয়ার্ড)');
      return;
    }

    onSuccessLogin(found);
    setUsername('');
    setPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer text-lg"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              মেম্বার পোর্টাল লগইন
            </h3>
            <p className="text-xs text-gray-500">
              মেস: <strong className="text-gray-800">{mess.name}</strong>
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
              ইউজারনেম / লগইন আইডি (Login ID)
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="যেমন: tanvir বা rakib"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              পাসওয়ার্ড (Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="আপনার পাসওয়ার্ড লিখুন..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            ℹ️ মেম্বারদের ডিফল্ট পাসওয়ার্ড: <code className="font-mono font-bold text-blue-700">123</code> (আপনার মেস ম্যানেজার চাইলে এটি পরিবর্তন করে দিতে পারেন)।
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            লগইন করুন
          </button>
        </form>
      </div>
    </div>
  );
};
