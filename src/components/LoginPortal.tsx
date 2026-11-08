'use client';

import React, { useState } from 'react';
import { 
  Home, 
  Shield, 
  User, 
  Key, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Sparkles,
  Phone,
  Lock,
  DoorOpen
} from 'lucide-react';
import { MessData, UserSession, Member } from '../types';
import { findMessByCodeOrName, createNewMess, saveSession } from '../lib/storage';
import { APP_NAME, APP_TAGLINE, DEFAULT_ADMIN_PASSWORD } from '../lib/constants';

interface LoginPortalProps {
  onLoginSuccess: (session: UserSession, mess: MessData) => void;
  onTryDemo: () => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  onLoginSuccess,
  onTryDemo,
}) => {
  const [view, setView] = useState<'login' | 'register'>('login');

  // Login Search
  const [messQuery, setMessQuery] = useState('');
  const [foundMess, setFoundMess] = useState<MessData | null>(null);
  const [loginRole, setLoginRole] = useState<'manager' | 'member'>('manager');
  const [managerPassword, setManagerPassword] = useState('');
  const [memberUsername, setMemberUsername] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Registration Form
  const [regMessName, setRegMessName] = useState('');
  const [regMessCode, setRegMessCode] = useState('');
  const [regManagerName, setRegManagerName] = useState('');
  const [regManagerPhone, setRegManagerPhone] = useState('');
  const [regAdminPass, setRegAdminPass] = useState(DEFAULT_ADMIN_PASSWORD);

  // Find Mess by code or name
  const handleSearchMess = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!messQuery.trim()) {
      setErrorMsg('মেসের নাম বা মেস কোড লিখুন!');
      return;
    }

    setIsSearching(true);
    const result = await findMessByCodeOrName(messQuery.trim());
    setIsSearching(false);

    if (result) {
      setFoundMess(result);
      if (result.members.length > 0) {
        setMemberUsername(result.members[0].username);
      }
    } else {
      setErrorMsg(`"${messQuery}" নামে কোনো মেস পাওয়া যায়নি! অনুগ্রহ করে সঠিক মেস কোড লিখুন অথবা নতুন মেস তৈরি করুন।`);
    }
  };

  // Perform Login
  const handlePerformLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!foundMess) return;

    if (loginRole === 'manager') {
      const correctPass = foundMess.adminPassword || DEFAULT_ADMIN_PASSWORD;
      if (managerPassword.trim() === correctPass) {
        const session: UserSession = {
          messId: foundMess.id,
          role: 'manager',
          username: 'manager',
          name: foundMess.managerName || 'মেস ম্যানেজার',
        };
        saveSession(session);
        onLoginSuccess(session, foundMess);
      } else {
        setErrorMsg('ভুল এডমিন পাসওয়ার্ড! (ডিফল্ট: @@Meal##1)');
      }
    } else {
      const member = foundMess.members.find(
        (m) => m.username.toLowerCase() === memberUsername.trim().toLowerCase()
      );
      if (!member) {
        setErrorMsg('এই ইউজারনেম দিয়ে কোনো মেম্বার পাওয়া যায়নি!');
        return;
      }
      const memberPass = member.password || '123';
      if (memberPassword.trim() === memberPass) {
        const session: UserSession = {
          messId: foundMess.id,
          role: 'member',
          memberId: member.id,
          username: member.username,
          name: member.name,
        };
        saveSession(session);
        onLoginSuccess(session, foundMess);
      } else {
        setErrorMsg('ভুল মেম্বার পাসওয়ার্ড! (ডিফল্ট: 123)');
      }
    }
  };

  // Handle New Mess Registration
  const handleRegisterMess = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regMessName.trim()) {
      setErrorMsg('মেসের নাম লিখুন!');
      return;
    }

    try {
      const newMess = createNewMess(
        regMessName.trim(),
        regMessCode.trim(),
        regAdminPass.trim(),
        regManagerName.trim(),
        regManagerPhone.trim()
      );

      const session: UserSession = {
        messId: newMess.id,
        role: 'manager',
        username: newMess.members[0]?.username || 'manager',
        name: newMess.managerName || 'মেস ম্যানেজার',
      };
      saveSession(session);
      onLoginSuccess(session, newMess);
      alert(`অভিনন্দন! "${newMess.name}" সফলভাবে শুরু হয়েছে। মেস কোড: ${newMess.code}। এবার এডমিন প্যানেল থেকে আপনার মেসের অন্যান্য মেম্বারদের যুক্ত করুন।`);
    } catch {
      setErrorMsg('মেস তৈরি করতে ব্যর্থ হয়েছে!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-500/20 mb-3 animate-pulse">
          <Home className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {APP_NAME} <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40">PRO</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1 max-w-md">
          {APP_TAGLINE} - মেস ম্যানেজার ও সদস্যদের জন্য ব্যক্তিগত ও সুরক্ষিত পোর্টাল
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 border border-gray-100">
        {/* Toggle Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6 text-xs sm:text-sm font-bold">
          <button
            onClick={() => {
              setView('login');
              setErrorMsg('');
              setFoundMess(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              view === 'login'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            মেসে প্রবেশ করুন (Login)
          </button>
          <button
            onClick={() => {
              setView('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              view === 'register'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            নতুন মেস শুরু করুন (Add Mess)
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* VIEW 1: LOGIN FLOW */}
        {view === 'login' && (
          <div>
            {!foundMess ? (
              /* Step 1: Find Mess by Code or Name */
              <form onSubmit={handleSearchMess} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    আপনার মেস কোড বা মেসের নাম দিন
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="যেমন: SHANTI-101 বা শান্তিনীড় মেস"
                    value={messQuery}
                    onChange={(e) => setMessQuery(e.target.value)}
                    className="w-full text-sm px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    💡 গোপনীয়তার স্বার্থে কোনো পাবলিক তালিকা দেখানো হয় না। আপনার মেসের কোড বা নাম দিয়ে মেসে প্রবেশ করুন।
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSearching ? 'অনুসন্ধান চলছে...' : 'মেস খুঁজুন ও এগিয়ে যান'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* 1-Click Demo Shortcut */}
                <div className="pt-4 border-t border-gray-100 text-center">
                  <button
                    type="button"
                    onClick={onTryDemo}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>ডেমো শান্তিনীড় মেস টেস্ট করুন (নাহিদ, তাসিন, শাওন...)</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Role Selector and Password */
              <form onSubmit={handlePerformLogin} className="space-y-4">
                {/* Found Mess Badge */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-emerald-700 font-semibold">নির্বাচিত মেস:</div>
                    <div className="text-sm font-bold text-emerald-950">{foundMess.name}</div>
                    <div className="text-[10px] text-emerald-600 font-mono">কোড: {foundMess.code}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFoundMess(null)}
                    className="text-xs text-emerald-700 underline font-semibold hover:text-emerald-900"
                  >
                    বদলান
                  </button>
                </div>

                {/* Role Switch */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    আপনি কীভাবে প্রবেশ করতে চান?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLoginRole('manager')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        loginRole === 'manager'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>মেস ম্যানেজার</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginRole('member')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        loginRole === 'member'
                          ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>মেম্বার / সদস্য</span>
                    </button>
                  </div>
                </div>

                {loginRole === 'manager' ? (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      ম্যানেজার এডমিন পাসওয়ার্ড (Default: @@Meal##1)
                    </label>
                    <input
                      type="password"
                      required
                      autoFocus
                      placeholder="পাসওয়ার্ড লিখুন..."
                      value={managerPassword}
                      onChange={(e) => setManagerPassword(e.target.value)}
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        আপনার মেম্বার আইডি / ইউজারনেম নির্বাচন করুন
                      </label>
                      <select
                        value={memberUsername}
                        onChange={(e) => setMemberUsername(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        {foundMess.members.map((m) => (
                          <option key={m.id} value={m.username}>
                            {m.name} (@{m.username})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        মেম্বার পাসওয়ার্ড (Default: 123)
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="পাসওয়ার্ড লিখুন..."
                        value={memberPassword}
                        onChange={(e) => setMemberPassword(e.target.value)}
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  মেসে প্রবেশ করুন
                </button>
              </form>
            )}
          </div>
        )}

        {/* VIEW 2: ADD YOUR MESS (WIZARD) */}
        {view === 'register' && (
          <form onSubmit={handleRegisterMess} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                মেসের নাম (Mess Name)
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: স্বপ্ননীড় মেস বা পদ্মা হোস্টেল"
                value={regMessName}
                onChange={(e) => setRegMessName(e.target.value)}
                className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                মেস কোড / ইউজার আইডি (Mess Code)
              </label>
              <input
                type="text"
                placeholder="যেমন: SWAPNO-101 (ফাঁকা রাখলে অটো তৈরি হবে)"
                value={regMessCode}
                onChange={(e) => setRegMessCode(e.target.value)}
                className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ম্যানেজারের নাম
                </label>
                <input
                  type="text"
                  required
                  placeholder="আপনার নাম"
                  value={regManagerName}
                  onChange={(e) => setRegManagerName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  placeholder="017..."
                  value={regManagerPhone}
                  onChange={(e) => setRegManagerPhone(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ম্যানেজার এডমিন পাসওয়ার্ড
              </label>
              <input
                type="text"
                required
                value={regAdminPass}
                onChange={(e) => setRegAdminPass(e.target.value)}
                className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                ডিফল্ট পাসওয়ার্ড: <code className="font-bold text-emerald-800">@@Meal##1</code> (আপনি চাইলে বদলাতে পারেন)
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer mt-2"
            >
              মেস তৈরি সম্পন্ন করুন ও শুরু করুন
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
