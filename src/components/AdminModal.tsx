'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  HelpCircle 
} from 'lucide-react';
import { MessData } from '../types';
import { DEFAULT_ADMIN_PASSWORD } from '../lib/constants';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  mess: MessData;
  onSuccessLogin: () => void;
  onChangePassword: (newPass: string) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  mess,
  onSuccessLogin,
  onChangePassword,
}) => {
  const [tab, setTab] = useState<'login' | 'change_password'>('login');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Change password fields
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const currentAdminPass = mess.adminPassword || DEFAULT_ADMIN_PASSWORD;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (passwordInput.trim() === currentAdminPass) {
      onSuccessLogin();
      setPasswordInput('');
      onClose();
    } else {
      setErrorMessage('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক এডমিন পাসওয়ার্ড লিখুন। (ডিফল্ট: @@Meal##1)');
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (currentPass.trim() !== currentAdminPass) {
      setErrorMessage('বর্তমান পাসওয়ার্ড মেলেনি!');
      return;
    }

    if (newPass.length < 4) {
      setErrorMessage('নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে!');
      return;
    }

    if (newPass !== confirmNewPass) {
      setErrorMessage('নতুন পাসওয়ার্ড দুটি মেলেনি!');
      return;
    }

    onChangePassword(newPass.trim());
    setSuccessMessage('সফলভাবে এডমিন পাসওয়ার্ড পরিবর্তন করা হয়েছে!');
    setCurrentPass('');
    setNewPass('');
    setConfirmNewPass('');

    setTimeout(() => {
      setTab('login');
      setSuccessMessage('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer text-lg"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {tab === 'login' ? 'মেস ম্যানেজার / এডমিন লগইন' : 'এডমিন পাসওয়ার্ড পরিবর্তন'}
            </h3>
            <p className="text-xs text-gray-500">
              মেস: <strong className="text-gray-800">{mess.name}</strong>
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-gray-200 mb-5">
          <button
            onClick={() => {
              setTab('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
              tab === 'login'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            লগইন করুন
          </button>
          <button
            onClick={() => {
              setTab('change_password');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
              tab === 'change_password'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            পাসওয়ার্ড পরিবর্তন / ভুলে গেছেন?
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab 1: Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ম্যানেজার পাসওয়ার্ড (Default: @@Meal##1)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="পাসওয়ার্ড লিখুন..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                ডিফল্ট মাস্টার পাসওয়ার্ড: <code className="font-mono font-bold bg-amber-100 px-1 py-0.5 rounded text-amber-950">@@Meal##1</code>। আপনি চাইলে উপরের &quot;পাসওয়ার্ড পরিবর্তন&quot; ট্যাব থেকে যেকোনো সময় পাসওয়ার্ড বদলে নিতে পারেন।
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer mt-2"
            >
              এডমিন প্যানেলে প্রবেশ করুন
            </button>
          </form>
        )}

        {/* Tab 2: Change Password Form */}
        {tab === 'change_password' && (
          <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                বর্তমান পাসওয়ার্ড (Current Password)
              </label>
              <input
                type="password"
                required
                placeholder="বর্তমান পাসওয়ার্ড লিখুন (যেমন: @@Meal##1)"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                নতুন পাসওয়ার্ড (New Password)
              </label>
              <input
                type="password"
                required
                placeholder="নতুন পাসওয়ার্ড লিখুন..."
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                নতুন পাসওয়ার্ড পুনরায় লিখুন (Confirm New Password)
              </label>
              <input
                type="password"
                required
                placeholder="নতুন পাসওয়ার্ড আবার লিখুন..."
                value={confirmNewPass}
                onChange={(e) => setConfirmNewPass(e.target.value)}
                className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer mt-2"
            >
              পাসওয়ার্ড আপডেট করুন
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
