'use client';

import React from 'react';
import { 
  Shield, 
  Printer, 
  BookOpen, 
  Database, 
  LogOut, 
  User, 
  Home, 
  RefreshCw,
  UtensilsCrossed,
  Layers,
  Calendar,
  ShoppingCart,
  Wallet,
  Archive,
  Lock
} from 'lucide-react';
import { MessData, Member, UserSession } from '../types';
import { APP_NAME, APP_TAGLINE } from '../lib/constants';
import { getSyncStatus } from '../lib/storage';

interface NavbarProps {
  currentMess: MessData;
  session: UserSession | null;
  onLogout: () => void;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  onOpenManual: () => void;
  onOpenBackup: () => void;
  onPrintReport: () => void;
  onReloadApp: () => void;
  isReloading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMess,
  session,
  onLogout,
  isAdmin,
  onOpenAdminModal,
  onOpenManual,
  onOpenBackup,
  onPrintReport,
  onReloadApp,
  isReloading,
  activeTab,
  setActiveTab,
}) => {
  const syncStatus = getSyncStatus();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      {/* Top Notice Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/60 text-emerald-200 border border-emerald-600/40">
              বর্তমান মাস: {currentMess.currentMonthName}
            </span>
            <span className="text-emerald-300">|</span>
            <span className="text-emerald-100 font-medium">
              মেস: <strong className="text-white font-bold">{currentMess.name}</strong> ({currentMess.code})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBackup}
              className="flex items-center gap-1.5 hover:text-emerald-200 transition-colors cursor-pointer text-[11px]"
              title="ডাটাবেজ সিঙ্ক ও ব্যাকআপ স্ট্যাটাস"
            >
              <Database className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">
                {syncStatus.isOnline ? 'ক্লাউড সিঙ্কড' : 'অফলাইন মোড (লোকালে সেভড)'}
              </span>
              <span className={`w-2 h-2 rounded-full ${syncStatus.isOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
            </button>

            <span className="text-emerald-400">|</span>

            <button
              onClick={onOpenManual}
              className="flex items-center gap-1 hover:text-emerald-200 transition-colors cursor-pointer text-[11px] font-medium"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>ব্যবহার নির্দেশিকা</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo with 1-click Website Reload Animation */}
          <div className="flex items-center gap-3">
            <div 
              onClick={onReloadApp}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
              title="ওয়েবসাইট রিফ্রেশ / রিলোড করতে এখানে ক্লিক করুন"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all ${isReloading ? 'animate-spin' : ''}`}>
                <Home className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center">
                    {APP_NAME}
                    <span className="text-[10px] ml-1.5 px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">PRO</span>
                  </h1>
                  <RefreshCw className={`w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600 transition-colors ${isReloading ? 'animate-spin' : ''}`} />
                </div>
                <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
                  {currentMess.name} • কোড: <code className="font-mono font-bold text-emerald-800">{currentMess.code}</code>
                </p>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PDF Report Print */}
            <button
              onClick={onPrintReport}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              title="বর্তমান মাসের সম্পূর্ণ হিসাব PDF হিসেবে ডাউনলোড বা প্রিন্ট করুন"
            >
              <Printer className="w-4 h-4 text-gray-600" />
              <span className="hidden sm:inline">PDF রিপোর্ট</span>
            </button>

            {/* Active User Badge */}
            {session && (
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-800 text-xs px-2.5 py-1.5 rounded-xl">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold hidden sm:inline">{session.name}</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1 rounded font-semibold">
                  {session.role === 'manager' ? 'ম্যানেজার' : 'মেম্বার'}
                </span>
                <button
                  onClick={onLogout}
                  className="text-gray-400 hover:text-rose-600 ml-1 p-0.5 rounded cursor-pointer transition-colors"
                  title="মেস থেকে লগআউট করুন"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Admin unlock status */}
            {!isAdmin && session?.role !== 'manager' && (
              <button
                onClick={onOpenAdminModal}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 px-3 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>ম্যানেজার লগইন</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation (Divided by Meal vs Rent) */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto mt-3 pt-2 border-t border-gray-100 scrollbar-none text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            📊 সমন্বিত হিসাব (Master)
          </button>

          <button
            onClick={() => setActiveTab('meal_account')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'meal_account'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>১. মিল হিসাব (Meal Ledger)</span>
          </button>

          <button
            onClick={() => setActiveTab('rent_account')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rent_account'
                ? 'bg-indigo-700 text-white shadow-sm'
                : 'text-indigo-800 bg-indigo-50 hover:bg-indigo-100'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>২. বাসা ভাড়া ও বিল (Rent Ledger)</span>
          </button>

          <button
            onClick={() => setActiveTab('daily_meals')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'daily_meals'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>দৈনিক মিল খাতা</span>
          </button>

          <button
            onClick={() => setActiveTab('bazar')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bazar'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>বাজার খরচ</span>
          </button>

          <button
            onClick={() => setActiveTab('deposits')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'deposits'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>টাকা জমা (Deposits)</span>
          </button>

          <button
            onClick={() => setActiveTab('archives')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'archives'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>আর্কাইভ</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-purple-800 text-white shadow-sm'
                  : 'text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>এডমিন প্যানেল</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
