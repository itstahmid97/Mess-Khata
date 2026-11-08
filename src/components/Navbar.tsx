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
  Calendar,
  ShoppingCart,
  Wallet,
  Archive,
  Lock,
  UserCheck,
  Users
} from 'lucide-react';
import { MessData, UserSession } from '../types';
import { APP_NAME } from '../lib/constants';
import { getSyncStatus } from '../lib/storage';

interface NavbarProps {
  currentMess: MessData;
  session: UserSession | null;
  onLogout: () => void;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  onOpenManual: () => void;
  onOpenBackup: () => void;
  onPrintMealReport: () => void;
  onPrintRentReport: () => void;
  onReloadApp: () => void;
  isReloading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode: 'personal' | 'mess';
  onToggleViewMode: (mode: 'personal' | 'mess') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMess,
  session,
  onLogout,
  isAdmin,
  onOpenAdminModal,
  onOpenManual,
  onOpenBackup,
  onPrintMealReport,
  onPrintRentReport,
  onReloadApp,
  isReloading,
  activeTab,
  setActiveTab,
  viewMode,
  onToggleViewMode,
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
                {syncStatus.isOnline ? 'ক্লাউড সিঙ্কড' : 'লোকাল ব্রাউজারে সংরক্ষিত'}
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
            {/* Separate PDF Reports: Meal PDF & Rent PDF */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={onPrintMealReport}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                title="সম্পূর্ণ মিল ও বাজার হিসাবের পৃথক PDF রিপোর্ট"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-600" />
                <span>মিল PDF</span>
              </button>

              <button
                onClick={onPrintRentReport}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-800 hover:text-indigo-950 bg-white hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                title="বাসা ভাড়া ও ইউটিলিটি বিলের পৃথক PDF রিপোর্ট"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-600" />
                <span>ভাড়া PDF</span>
              </button>
            </div>

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

        {/* View Mode Switcher + Tab Navigation */}
        <div className="mt-3 pt-2 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Quick Toggle: "শুধু আমার ব্যক্তিগত হিসাব" vs "মেসের সবার হিসাব" */}
          {session?.memberId && (
            <div className="flex items-center p-1 bg-slate-100 rounded-xl self-start shrink-0">
              <button
                onClick={() => onToggleViewMode('personal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'personal'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>👤 শুধু আমার হিসাব</span>
              </button>

              <button
                onClick={() => onToggleViewMode('mess')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'mess'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>👥 মেসের সবার হিসাব</span>
              </button>
            </div>
          )}

          {/* Tab Navigation (Exclusively Separate Meal and Rent) */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto scrollbar-none text-xs sm:text-sm font-bold w-full">
            <button
              onClick={() => {
                onToggleViewMode('mess');
                setActiveTab('meal_account');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'mess' && activeTab === 'meal_account'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>১. মিল হিসাব (Meal Ledger)</span>
            </button>

            <button
              onClick={() => {
                onToggleViewMode('mess');
                setActiveTab('rent_account');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'mess' && activeTab === 'rent_account'
                  ? 'bg-indigo-700 text-white shadow-sm'
                  : 'text-indigo-800 bg-indigo-50 hover:bg-indigo-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>২. বাসা ভাড়া ও বিল (Rent Ledger)</span>
            </button>

            <button
              onClick={() => {
                onToggleViewMode('mess');
                setActiveTab('daily_meals');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'mess' && activeTab === 'daily_meals'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>দৈনিক মিল খাতা</span>
            </button>

            <button
              onClick={() => {
                onToggleViewMode('mess');
                setActiveTab('bazar');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'mess' && activeTab === 'bazar'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>বাজার খরচ</span>
            </button>

            <button
              onClick={() => {
                onToggleViewMode('mess');
                setActiveTab('deposits');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'mess' && activeTab === 'deposits'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>টাকা জমা</span>
            </button>

            <button
              onClick={() => {
                onToggleViewMode('mess');
                setActiveTab('archives');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'mess' && activeTab === 'archives'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>আর্কাইভ</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  onToggleViewMode('mess');
                  setActiveTab('admin');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'mess' && activeTab === 'admin'
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
      </div>
    </header>
  );
};
