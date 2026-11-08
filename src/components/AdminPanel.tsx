'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Key, 
  Shield, 
  RotateCcw, 
  Archive, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  Settings, 
  Plus, 
  Check, 
  ArrowRight,
  Lock,
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';
import { MessData, Member, FixedExpenseSegment, MonthArchive, MessCalculations, DepositEntry } from '../types';
import { formatTaka, toBengaliNumber, generateId, getCurrentMonthKey, getCurrentMonthNameBengali } from '../lib/helpers';

interface AdminPanelProps {
  mess: MessData;
  calc: MessCalculations;
  onUpdateMess: (updated: MessData) => void;
  onLogoutAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  mess,
  calc,
  onUpdateMess,
  onLogoutAdmin,
}) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'members' | 'segments' | 'archive' | 'security'>('members');

  // Member Form Modal State
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123');
  const [roomRent, setRoomRent] = useState('4000');
  const [role, setRole] = useState<'member' | 'manager'>('member');

  // New Month Archive State
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [carryForwardBalances, setCarryForwardBalances] = useState(true);
  const [nextMonthName, setNextMonthName] = useState('');

  // Password change state
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [passMessage, setPassMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Open Member Modal
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setName('');
    setPhone('');
    setUsername('');
    setPassword('123');
    setRoomRent('4000');
    setRole('member');
    setShowMemberModal(true);
  };

  const handleOpenEditMember = (m: Member) => {
    setEditingMember(m);
    setName(m.name);
    setPhone(m.phone || '');
    setUsername(m.username);
    setPassword(m.password || '123');
    setRoomRent((m.roomRent || 4000).toString());
    setRole(m.role);
    setShowMemberModal(true);
  };

  const handleDeleteMember = (memberId: string) => {
    if (mess.members.length <= 1) {
      alert('মেসে কমপক্ষে একজন সদস্য থাকতে হবে!');
      return;
    }
    const member = mess.members.find((m) => m.id === memberId);
    if (confirm(`আপনি কি নিশ্চিতভাবে "${member?.name}" কে মেস থেকে মুছে ফেলতে চান? তার পূর্ববর্তী মিল ও জমার রেকর্ড সংরক্ষিত থাকবে।`)) {
      const updatedMembers = mess.members.filter((m) => m.id !== memberId);
      onUpdateMess({
        ...mess,
        members: updatedMembers,
      });
    }
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('সদস্যের নাম লিখুন!');
      return;
    }

    // Generate clean username if not entered
    const cleanUsername = username.trim()
      ? username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '')
      : `user_${Math.floor(100 + Math.random() * 900)}`;

    // Check duplicate username
    const exists = mess.members.some(
      (m) => m.username.toLowerCase() === cleanUsername && (!editingMember || m.id !== editingMember.id)
    );
    if (exists) {
      alert('এই ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হয়েছে! অন্য একটি ইউজারনেম নির্বাচন করুন।');
      return;
    }

    const parsedRent = parseFloat(roomRent) || 4000;

    if (editingMember) {
      const updatedMembers = mess.members.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name: name.trim(),
              phone: phone.trim(),
              username: cleanUsername,
              password: password.trim() || '123',
              roomRent: parsedRent,
              role,
            }
          : m
      );
      onUpdateMess({ ...mess, members: updatedMembers });
    } else {
      const newMember: Member = {
        id: generateId('mem'),
        name: name.trim(),
        phone: phone.trim(),
        username: cleanUsername,
        password: password.trim() || '123',
        roomRent: parsedRent,
        role,
        active: true,
        joinedAt: new Date().toISOString().slice(0, 10),
      };
      onUpdateMess({ ...mess, members: [...mess.members, newMember] });
    }

    setShowMemberModal(false);
  };

  // Archive and Reset Month
  const handleArchiveMonth = () => {
    // 1. Snapshot current month into MonthArchive
    const archiveSnapshot: MonthArchive = {
      id: generateId('arch'),
      monthKey: mess.currentMonthKey,
      monthNameBengali: mess.currentMonthName,
      closedAt: new Date().toISOString(),
      totalBazar: calc.totalBazar,
      totalMeals: calc.totalMeals,
      mealRate: calc.mealRate,
      totalFixedBills: calc.totalSharedUtilities,
      totalRoomRent: calc.totalRoomRent,
      bazarEntries: [...mess.bazarEntries],
      fixedExpenses: [...mess.fixedExpenses],
      membersSummary: calc.combinedSummaries.map((s) => ({
        memberId: s.member.id,
        memberName: s.member.name,
        totalMeals: s.mealSummary.totalMeals,
        mealCost: s.mealSummary.mealCost,
        mealDeposited: s.mealSummary.mealDeposited,
        mealBalance: s.mealSummary.mealBalance,
        roomRent: s.rentSummary.roomRent,
        utilityShare: s.rentSummary.utilityShare,
        totalRentPayable: s.rentSummary.totalRentCost,
        rentDeposited: s.rentSummary.rentDeposited,
        rentBalance: s.rentSummary.rentBalance,
        finalNetBalance: s.finalNetBalance,
      })),
    };

    // 2. Prepare new deposits if carry-forward enabled
    const initialDeposits: DepositEntry[] = carryForwardBalances
      ? calc.combinedSummaries
          .filter((s) => s.finalNetBalance !== 0)
          .map((s) => ({
            id: generateId('dep_fwd'),
            date: new Date().toISOString().slice(0, 10),
            memberId: s.member.id,
            amount: s.finalNetBalance,
            type: 'general',
            method: 'পূর্ববর্তী মাস হস্তান্তর',
            note: `পূর্ববর্তী মাসের ব্যালেন্স সমর্পণ (${mess.currentMonthName})`,
          }))
      : [];

    // Calculate next month key and name
    const [yearStr, monthStr] = mess.currentMonthKey.split('-');
    let nextYear = parseInt(yearStr, 10);
    let nextMonth = parseInt(monthStr, 10) + 1;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    const nextMonthKey = `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
    const nextMonthBengali = nextMonthName.trim() || `মাস (${nextMonthKey})`;

    // 3. Reset active month
    const updatedMess: MessData = {
      ...mess,
      currentMonthKey: nextMonthKey,
      currentMonthName: nextMonthBengali,
      meals: [], // Reset meals
      bazarEntries: [], // Reset bazar
      deposits: initialDeposits, // Carry forward balances or clean
      archives: [archiveSnapshot, ...(mess.archives || [])],
      updatedAt: new Date().toISOString(),
    };

    onUpdateMess(updatedMess);
    setShowArchiveConfirm(false);
    alert(`অভিনন্দন! "${mess.currentMonthName}" সফলভাবে ক্লোজ ও আর্কাইভ করা হয়েছে এবং "${nextMonthBengali}" শুরু হয়েছে!`);
  };

  // Change Admin Password
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (currentAdminPass.trim() !== mess.adminPassword) {
      setPassMessage({ type: 'error', text: 'বর্তমান পাসওয়ার্ড মেলেনি!' });
      return;
    }

    if (newAdminPass.length < 4) {
      setPassMessage({ type: 'error', text: 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে!' });
      return;
    }

    if (newAdminPass !== confirmAdminPass) {
      setPassMessage({ type: 'error', text: 'নতুন পাসওয়ার্ড দুটি মেলেনি!' });
      return;
    }

    onUpdateMess({
      ...mess,
      adminPassword: newAdminPass.trim(),
    });

    setPassMessage({ type: 'success', text: 'সফলভাবে এডমিন পাসওয়ার্ড আপডেট হয়েছে!' });
    setCurrentAdminPass('');
    setNewAdminPass('');
    setConfirmAdminPass('');
  };

  return (
    <div className="bg-white rounded-2xl border border-purple-200 shadow-sm overflow-hidden mb-8">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-amber-300">
              <Shield className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold">
              মেস ম্যানেজার এডমিন কন্ট্রোল প্যানেল
            </h2>
          </div>
          <p className="text-xs text-purple-200 mt-1">
            মেম্বার যোগ/বর্জন, লগইন আইডি-পাসওয়ার্ড নির্ধারণ, বিলের খাত ও মাস সমাপনী আর্কাইভ
          </p>
        </div>

        <button
          onClick={onLogoutAdmin}
          className="text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          এডমিন মোড থেকে প্রস্থান
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50/70 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveAdminSubTab('members')}
          className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminSubTab === 'members'
              ? 'border-purple-600 text-purple-700 bg-white'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4 text-purple-600" />
          <span>মেম্বার তালিকা ও আইডি-পাসওয়ার্ড ({mess.members.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('archive')}
          className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminSubTab === 'archive'
              ? 'border-purple-600 text-purple-700 bg-white'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-purple-600" />
          <span>নতুন মাস শুরু ও অটো-রিসেট</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('security')}
          className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminSubTab === 'security'
              ? 'border-purple-600 text-purple-700 bg-white'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Key className="w-4 h-4 text-purple-600" />
          <span>এডমিন পাসওয়ার্ড পরিবর্তন</span>
        </button>
      </div>

      {/* Sub Tab 1: Member Management */}
      {activeAdminSubTab === 'members' && (
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                মেসের মেম্বারদের তালিকা ও ক্রেডেনশিয়াল
              </h3>
              <p className="text-xs text-gray-500">
                এখানে আপনি নতুন সদস্য যোগ করতে পারবেন এবং তাদের লগইন ইউজারনেম ও পাসওয়ার্ড দিয়ে দিতে পারবেন।
              </p>
            </div>

            <button
              onClick={handleOpenAddMember}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>নতুন মেম্বার যুক্ত করুন</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-100 text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  <th className="py-2.5 px-3 text-center w-12">নং</th>
                  <th className="py-2.5 px-3">নাম</th>
                  <th className="py-2.5 px-3">লগইন আইডি (Username)</th>
                  <th className="py-2.5 px-3">পাসওয়ার্ড</th>
                  <th className="py-2.5 px-3 text-right">রুম ভাড়া (৳)</th>
                  <th className="py-2.5 px-3">মোবাইল নম্বর</th>
                  <th className="py-2.5 px-3 text-center">রোল (পদবি)</th>
                  <th className="py-2.5 px-3 text-center w-24">একশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mess.members.map((member, idx) => (
                  <tr key={member.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-3 px-3 text-center text-gray-400 font-mono text-xs">
                      {toBengaliNumber(idx + 1)}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px] flex items-center justify-center">
                          {member.name.slice(0, 1)}
                        </div>
                        <span>{member.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                      @{member.username}
                    </td>

                    <td className="py-3 px-3 font-mono text-gray-600">
                      <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                        {member.password || '123'}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-gray-900 text-right">
                      {formatTaka(member.roomRent || 0)}
                    </td>

                    <td className="py-3 px-3 text-gray-600 font-mono">
                      {member.phone || '-'}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          member.role === 'manager'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {member.role === 'manager' ? 'ম্যানেজার' : 'মেম্বার'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditMember(member)}
                          className="p-1 rounded text-gray-400 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                          title="তথ্য বা পাসওয়ার্ড এডিট করুন"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="মেম্বার ডিলিট করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub Tab 2: New Month & Archive */}
      {activeAdminSubTab === 'archive' && (
        <div className="p-4 sm:p-6">
          <div className="max-w-2xl bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <Archive className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-amber-950">
                  চলতি মাস ক্লোজ ও নতুন মাস শুরুর স্বয়ংক্রিয় ব্যবস্থা
                </h3>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  প্রতি মাস শেষে মেস ম্যানেজার যখন এই বাটনে চাপবেন, তখন বর্তমান মাসের সম্পূর্ণ হিসাব (বাজারের তালিকা, মোট মিল, মিল রেট, মেম্বারদের ব্যালেন্স) স্বয়ংক্রিয়ভাবে ডাটাবেজে <strong>আর্কাইভ</strong> হয়ে যাবে। এরপর নতুন মাসের জন্য সকল দৈনিক মিল ও বাজার শূন্য (০) হয়ে স্বয়ংক্রিয় রিসেট হয়ে যাবে!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6">
            <h4 className="font-bold text-gray-900 text-sm mb-3">
              চলতি মাসের ক্লোজিং প্রিভিউ ({mess.currentMonthName})
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <span className="text-gray-500">মোট বাজার:</span>
                <div className="font-bold text-gray-900 text-sm">{formatTaka(calc.totalBazar)}</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <span className="text-gray-500">মোট মিল:</span>
                <div className="font-bold text-gray-900 text-sm">{toBengaliNumber(calc.totalMeals)} টি</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <span className="text-gray-500">চূড়ান্ত মিল রেট:</span>
                <div className="font-bold text-emerald-700 text-sm">{formatTaka(calc.mealRate)}</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <span className="text-gray-500">মোট ভাড়া ও বিল:</span>
                <div className="font-bold text-purple-700 text-sm">{formatTaka(calc.totalRentPayableAll)}</div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-gray-200">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-gray-800 font-medium">
                <input
                  type="checkbox"
                  checked={carryForwardBalances}
                  onChange={(e) => setCarryForwardBalances(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
                <span>
                  মেম্বারদের বর্তমান মাসের পাওনা/বকেয়া ব্যালেন্স নতুন মাসে সমর্পণ (Carry Forward) করুন
                </span>
              </label>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  নতুন মাসের নাম লিখুন (ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ডিসেম্বর ২০২৬"
                  value={nextMonthName}
                  onChange={(e) => setNextMonthName(e.target.value)}
                  className="text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={() => setShowArchiveConfirm(true)}
                className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>বর্তমান মাস সংরক্ষণ ও নতুন মাস শুরু করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab 3: Security & Password */}
      {activeAdminSubTab === 'security' && (
        <div className="p-4 sm:p-6 max-w-lg">
          <div className="mb-5">
            <h3 className="text-base font-bold text-gray-900">
              এডমিন পাসওয়ার্ড পরিবর্তন (Change Admin Password)
            </h3>
            <p className="text-xs text-gray-500">
              ডিফল্ট পাসওয়ার্ড ছিল: <code className="font-mono font-bold text-purple-700">@@Meal##1</code>
            </p>
          </div>

          {passMessage && (
            <div
              className={`p-3 rounded-lg mb-4 text-xs font-medium ${
                passMessage.type === 'error'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {passMessage.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                বর্তমান পাসওয়ার্ড (Current Password)
              </label>
              <input
                type="password"
                required
                placeholder="যেমন: @@Meal##1"
                value={currentAdminPass}
                onChange={(e) => setCurrentAdminPass(e.target.value)}
                className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                value={newAdminPass}
                onChange={(e) => setNewAdminPass(e.target.value)}
                className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                value={confirmAdminPass}
                onChange={(e) => setConfirmAdminPass(e.target.value)}
                className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              পাসওয়ার্ড পরিবর্তন করুন
            </button>
          </form>
        </div>
      )}

      {/* Member Add/Edit Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingMember ? 'মেম্বারের তথ্য পরিবর্তন করুন' : 'নতুন মেম্বার যুক্ত করুন'}
            </h3>

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  সদস্যের পুরো নাম
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: তানভীর আহমেদ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  মোবাইল নম্বর (ঐচ্ছিক)
                </label>
                <input
                  type="tel"
                  placeholder="যেমন: 01700000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    লগইন ইউজারনেম (Login ID)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: tanvir"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    পাসওয়ার্ড
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: 123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ব্যক্তিগত মাসিক রুম ভাড়া (Room Rent ৳)
                </label>
                <input
                  type="number"
                  required
                  placeholder="যেমন: ৪০০০ বা ৪৫০০"
                  value={roomRent}
                  onChange={(e) => setRoomRent(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">
                  💡 সবার রুম অনুযায়ী ভাড়া আলাদা হতে পারে। এখানে এই সদস্যের নির্দিষ্ট রুমের ভাড়া লিখুন।
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  মেসে ভূমিকা / পদবি
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'member' | 'manager')}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="member">সাধারণ সদস্য (Member)</option>
                  <option value="manager">মেস ম্যানেজার (Manager)</option>
                </select>
              </div>

              <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                💡 এই মেম্বার তার লগইন ইউজারনেম ও পাসওয়ার্ড দিয়ে ওয়েবসাইটে ঢুকে তার ব্যক্তিগত মিল ও খরচের হিসাব দেখতে পারবেন।
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {editingMember ? 'সংরক্ষণ করুন' : 'যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              আপনি কি নিশ্চিতভাবে এই মাস সমাপ্ত করতে চান?
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              &quot;{mess.currentMonthName}&quot; এর চূড়ান্ত হিসাব আর্কাইভ ইতিহাসে সেভ হবে। নতুন মাসের জন্য দৈনিক মিল ও বাজার শূন্য (০) থেকে শুরু হবে।
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                না, ফিরে যান
              </button>
              <button
                onClick={handleArchiveMonth}
                className="px-5 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-md transition-colors cursor-pointer"
              >
                হ্যাঁ, মাস ক্লোজ ও আর্কাইভ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
