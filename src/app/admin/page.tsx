'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Search, 
  Building2, 
  Users, 
  UtensilsCrossed, 
  ShoppingCart, 
  Calendar, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  ArrowRight,
  Database,
  Layers,
  Phone,
  Home
} from 'lucide-react';
import { MessData, Member } from '../../types';
import { fetchAllMessesFromSupabase, deleteMess } from '../../lib/storage';
import { formatTaka, toBengaliNumber, formatBengaliFullDate } from '../../lib/helpers';

// Founder Master Password (completely invisible to public users)
const FOUNDER_MASTER_SECRET = '@@Iwannakissyou##1';
const SESSION_AUTH_KEY = 'founder_super_admin_session_auth_v1';

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputPassword, setInputPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Messes data
  const [allMesses, setAllMesses] = useState<MessData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'inactive'>('all');

  // Inspect modal
  const [inspectMess, setInspectMess] = useState<MessData | null>(null);

  // Deleting state
  const [deletingMessId, setDeletingMessId] = useState<string | null>(null);

  // Check existing session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
      if (isAuth) {
        setIsAuthenticated(true);
        loadMesses();
      }
    }
  }, []);

  const loadMesses = async () => {
    setIsLoading(true);
    try {
      const messes = await fetchAllMessesFromSupabase();
      setAllMesses(messes);
    } catch (err) {
      console.error('Failed to load messes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === FOUNDER_MASTER_SECRET) {
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
      setIsAuthenticated(true);
      setAuthError(null);
      loadMesses();
    } else {
      setAuthError('ভুল পাসওয়ার্ড! প্রবেশাধিকার শুধুমাত্র প্ল্যাটফর্ম ফাউন্ডারের জন্য সংরক্ষিত।');
      setInputPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_AUTH_KEY);
    setIsAuthenticated(false);
    setInputPassword('');
  };

  const handleDeleteMess = async (mess: MessData) => {
    const confirmPrompt = window.prompt(
      `⚠️ আপনি কি নিশ্চিতভাবে "${mess.name}" (কোড: ${mess.code}) মেসটি ডাটাবেজ থেকে সম্পূর্ণ মুছে ফেলতে চান?\n\nনিশ্চিত হলে নিচে "DELETE" লিখুন:`
    );

    if (confirmPrompt && confirmPrompt.trim().toUpperCase() === 'DELETE') {
      setDeletingMessId(mess.id);
      try {
        await deleteMess(mess.id);
        setAllMesses((prev) => prev.filter((m) => m.id !== mess.id));
        if (inspectMess?.id === mess.id) setInspectMess(null);
        alert(`"${mess.name}" মেসটি ডাটাবেজ থেকে সফলভাবে মুছে ফেলা হয়েছে।`);
      } catch (err) {
        alert('মেসটি মুছতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      } finally {
        setDeletingMessId(null);
      }
    }
  };

  // Helper to check if a mess is active
  const isMessActive = (mess: MessData) => {
    const mealCount = mess.meals?.reduce((sum, m) => sum + (m.count || 0), 0) || 0;
    const bazarCount = mess.bazarEntries?.length || 0;
    const depositsCount = mess.deposits?.length || 0;
    return mealCount > 0 || bazarCount > 0 || depositsCount > 0;
  };

  // Stats
  const totalMessesCount = allMesses.length;
  const activeMessesCount = allMesses.filter(isMessActive).length;
  const inactiveMessesCount = totalMessesCount - activeMessesCount;
  const totalMembersCount = allMesses.reduce((acc, m) => acc + (m.members?.length || 0), 0);
  const totalMealsAll = allMesses.reduce(
    (acc, m) => acc + (m.meals?.reduce((sum, meal) => sum + (meal.count || 0), 0) || 0),
    0
  );
  const totalBazarAll = allMesses.reduce(
    (acc, m) => acc + (m.bazarEntries?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0),
    0
  );

  // Filtered list
  const filteredMesses = allMesses.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase()) ||
      (m.managerName && m.managerName.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterMode === 'active') return isMessActive(m);
    if (filterMode === 'inactive') return !isMessActive(m);
    return true;
  });

  // ========================================================
  // RENDER: PASSWORD LOCK SCREEN
  // ========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-5 shadow-lg shadow-purple-600/30">
            <Shield className="w-7 h-7" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white text-center">
            সুপার এডমিন কন্ট্রোল সেন্টার
          </h1>
          <p className="text-xs text-slate-400 text-center mt-1">
            মেস খাতা প্ল্যাটফর্ম • ফাউন্ডার সিকিউর পোর্টাল
          </p>

          {authError && (
            <div className="mt-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                মাস্টার পাসওয়ার্ড
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="গোপন পাসওয়ার্ড লিখুন..."
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>প্যানেলে প্রবেশ করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-[11px] text-slate-500 font-mono">
            Protected Platform Gateway • S.M. Tahmid Hasan Shahria
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // RENDER: FOUNDER SUPER ADMIN DASHBOARD
  // ========================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                  সুপার এডমিন কন্ট্রোল সেন্টার
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                  Founder Mode
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                সকল মেস মনিটরিং, সক্রিয়তা পর্যবেক্ষণ ও ডাটাবেজ নিয়ন্ত্রণ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={loadMesses}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="সুপাবেস থেকে লাইভ ডাটা রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">লাইভ রিফ্রেশ</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Real-time Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>মোট মেস</span>
              <Building2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">
              {toBengaliNumber(totalMessesCount)} <span className="text-xs font-normal text-slate-400">টি</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">ডাটাবেজে নিবন্ধিত</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>মোট মেম্বার</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-2 font-mono">
              {toBengaliNumber(totalMembersCount)} <span className="text-xs font-normal text-slate-400">জন</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">সকল মেস মিলিয়ে</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>সক্রিয় মেস</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2 font-mono">
              {toBengaliNumber(activeMessesCount)} <span className="text-xs font-normal text-slate-400">টি</span>
            </div>
            <p className="text-[10px] text-emerald-500/80 mt-0.5">মিল বা বাজার চলছে</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>শুধু খোলা / নিষ্ক্রিয়</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2 font-mono">
              {toBengaliNumber(inactiveMessesCount)} <span className="text-xs font-normal text-slate-400">টি</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">০ মিল ও বাজার</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>প্ল্যাটফর্মের মোট মিল</span>
              <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">
              {toBengaliNumber(totalMealsAll)} <span className="text-xs font-normal text-slate-400">টি</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">সর্বমোট খাবার এন্ট্রি</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>মোট বাজার খরচ</span>
              <ShoppingCart className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-orange-400 mt-2 font-mono truncate">
              {formatTaka(totalBazarAll)}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">সকল মেসের ট্রানজেকশন</p>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl self-start">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              সকল মেস ({toBengaliNumber(totalMessesCount)})
            </button>

            <button
              onClick={() => setFilterMode('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterMode === 'active'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>সক্রিয় ({toBengaliNumber(activeMessesCount)})</span>
            </button>

            <button
              onClick={() => setFilterMode('inactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterMode === 'inactive'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>নিষ্ক্রিয় / টেস্ট ({toBengaliNumber(inactiveMessesCount)})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="মেসের নাম, কোড বা ম্যানেজার..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Messes List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>ডাটাবেজে নিবন্ধিত সকল মেস</span>
                <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md font-mono">
                  {toBengaliNumber(filteredMesses.length)} টি
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                সরাসরি সুপাবেস ক্লাউড পোস্টগ্রেস টেবিল থেকে প্রাপ্ত লাইভ রেকর্ড
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-semibold">সুপাবেস থেকে মেসের তথ্য লোড হচ্ছে...</p>
            </div>
          ) : filteredMesses.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Building2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">কোনো মেস পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <th className="py-3 px-4 text-center w-12">নং</th>
                    <th className="py-3 px-4">মেসের নাম ও কোড</th>
                    <th className="py-3 px-4">ম্যানেজার</th>
                    <th className="py-3 px-4 text-center">মেম্বার</th>
                    <th className="py-3 px-4 text-center">মোট মিল</th>
                    <th className="py-3 px-4 text-right">মোট বাজার</th>
                    <th className="py-3 px-4 text-center">অবস্থা (Status)</th>
                    <th className="py-3 px-4 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredMesses.map((mess, idx) => {
                    const active = isMessActive(mess);
                    const mealCount = mess.meals?.reduce((sum, m) => sum + (m.count || 0), 0) || 0;
                    const bazarTotal = mess.bazarEntries?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0;
                    const membersCount = mess.members?.length || 0;
                    const isDeleting = deletingMessId === mess.id;

                    return (
                      <tr key={mess.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-xs">
                          {toBengaliNumber(idx + 1)}
                        </td>

                        <td className="py-3.5 px-4">
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-1.5">
                              <span>{mess.name}</span>
                              {mess.code === 'SHANTI-101' && (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-medium">
                                  অফিসিয়াল ডেমো
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                              <span>কোড: <strong className="text-purple-300">{mess.code}</strong></span>
                              <span>•</span>
                              <span>মাস: {mess.currentMonthName}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-200 font-medium">
                            {mess.managerName || 'মেস ম্যানেজার'}
                          </div>
                          {mess.managerPhone && (
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-500" />
                              <span>{mess.managerPhone}</span>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-200">
                          {toBengaliNumber(membersCount)} জন
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">
                          {toBengaliNumber(mealCount)} টি
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold text-orange-400">
                          {formatTaka(bazarTotal)}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {active ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              <span>সক্রিয় (Active)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                              <span>শুধু তৈরি (Idle)</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setInspectMess(mess)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="মেসের মেম্বার ও ডাটা বিস্তারিত দেখুন"
                            >
                              <Eye className="w-4 h-4 text-blue-400" />
                            </button>

                            <button
                              onClick={() => handleDeleteMess(mess)}
                              disabled={isDeleting}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
                              title="এই মেসটি সম্পূর্ণ ডাটাবেজ থেকে মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Inspect Mess Modal */}
      {inspectMess && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 text-slate-200 text-xs sm:text-sm">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>{inspectMess.name}</span>
                  <span className="text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded">
                    কোড: {inspectMess.code}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  ম্যানেজার: {inspectMess.managerName || 'মেস ম্যানেজার'} | আইডি: {inspectMess.id}
                </p>
              </div>

              <button
                onClick={() => setInspectMess(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 scrollbar-thin">
              {/* Quick Numbers */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">মেম্বার</div>
                  <div className="text-lg font-bold text-white font-mono mt-1">
                    {toBengaliNumber(inspectMess.members?.length || 0)} জন
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">মোট মিল</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                    {toBengaliNumber(inspectMess.meals?.reduce((s, m) => s + (m.count || 0), 0) || 0)} টি
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">মোট বাজার</div>
                  <div className="text-lg font-bold text-orange-400 font-mono mt-1">
                    {formatTaka(inspectMess.bazarEntries?.reduce((s, b) => s + (b.amount || 0), 0) || 0)}
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div>
                <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-wider">
                  মেম্বার তালিকা ({toBengaliNumber(inspectMess.members?.length || 0)} জন)
                </h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden max-h-48 overflow-y-auto scrollbar-thin">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 sticky top-0">
                      <tr>
                        <th className="py-2 px-3">নাম</th>
                        <th className="py-2 px-3">ইউজারনেম</th>
                        <th className="py-2 px-3 text-right">রুম ভাড়া</th>
                        <th className="py-2 px-3 text-center">ভূমিকা</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {inspectMess.members?.map((mem) => (
                        <tr key={mem.id} className="hover:bg-slate-800/40">
                          <td className="py-2 px-3 font-semibold text-white">{mem.name}</td>
                          <td className="py-2 px-3 text-slate-400 font-mono">@{mem.username}</td>
                          <td className="py-2 px-3 text-right font-mono text-purple-300">
                            {formatTaka(mem.roomRent || 0)}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              mem.role === 'manager' 
                                ? 'bg-purple-500/20 text-purple-300' 
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {mem.role === 'manager' ? 'ম্যানেজার' : 'মেম্বার'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bazar Entries */}
              <div>
                <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-wider">
                  সাম্প্রতিক বাজার খরচ ({toBengaliNumber(inspectMess.bazarEntries?.length || 0)} টি)
                </h4>
                {inspectMess.bazarEntries && inspectMess.bazarEntries.length > 0 ? (
                  <div className="border border-slate-800 rounded-xl overflow-hidden max-h-40 overflow-y-auto scrollbar-thin">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 sticky top-0">
                        <tr>
                          <th className="py-2 px-3">তারিখ</th>
                          <th className="py-2 px-3">ফর্দ / বিবরণ</th>
                          <th className="py-2 px-3 text-right">টাকা</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {inspectMess.bazarEntries.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-800/40">
                            <td className="py-2 px-3 text-slate-400">{b.date}</td>
                            <td className="py-2 px-3 text-slate-200">{b.items}</td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-orange-400">
                              {formatTaka(b.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic bg-slate-950 p-3 rounded-xl border border-slate-800">
                    এখনও কোনো বাজার এন্ট্রি করা হয়নি।
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <button
                onClick={() => handleDeleteMess(inspectMess)}
                className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>মেসটি সম্পূর্ণ মুছুন</span>
              </button>

              <button
                onClick={() => setInspectMess(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
