'use client';

import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from '../components/Navbar';
import { 
  MealAccountView 
} from '../components/MealAccountView';
import { 
  RentAccountView 
} from '../components/RentAccountView';
import { 
  DailyMealGrid 
} from '../components/DailyMealGrid';
import { 
  BazarList 
} from '../components/BazarList';
import { 
  DepositsList 
} from '../components/DepositsList';
import { 
  ArchiveViewer 
} from '../components/ArchiveViewer';
import { 
  AdminPanel 
} from '../components/AdminPanel';
import { 
  AdminModal 
} from '../components/AdminModal';
import { 
  UserManual 
} from '../components/UserManual';
import { 
  BackupModal 
} from '../components/BackupModal';
import { 
  CreateMessModal 
} from '../components/CreateMessModal';
import { 
  MemberDetailModal 
} from '../components/MemberDetailModal';
import { 
  LoginPortal 
} from '../components/LoginPortal';
import { 
  PersonalAccountView 
} from '../components/PersonalAccountView';
import { 
  Footer 
} from '../components/Footer';

import { MessData, UserSession, MealEntry, BazarEntry, DepositEntry, FixedExpenseSegment } from '../types';
import { 
  getStoredMesses, 
  getStoredSession, 
  saveSession, 
  saveMess 
} from '../lib/storage';
import { calculateMessTotals, formatTaka, toBengaliNumber } from '../lib/helpers';
import { printMealReport, printRentReport } from '../lib/pdfGenerator';
import { INITIAL_DEMO_MESS, APP_NAME, APP_TAGLINE } from '../lib/constants';

import { 
  Home, 
  RotateCw, 
  Sparkles, 
  ShieldAlert, 
  Lock,
  UserCheck,
  Users
} from 'lucide-react';

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);
  const [allMesses, setAllMesses] = useState<MessData[]>([INITIAL_DEMO_MESS]);
  const [currentMess, setCurrentMess] = useState<MessData>(INITIAL_DEMO_MESS);
  
  // Default tab: Meal Account
  const [activeTab, setActiveTab] = useState<string>('meal_account');
  // View mode: 'personal' (only my meals & rent) vs 'mess' (all members)
  const [viewMode, setViewMode] = useState<'personal' | 'mess'>('personal');

  // Loading animation state for logo reload
  const [isReloading, setIsReloading] = useState(false);

  // Modals
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showCreateMess, setShowCreateMess] = useState(false);
  const [selectedMemberDetailId, setSelectedMemberDetailId] = useState<string | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const loadedMesses = getStoredMesses();
    const storedSession = getStoredSession();
    setAllMesses(loadedMesses);

    if (storedSession) {
      setSession(storedSession);
      const matched = loadedMesses.find((m) => m.id === storedSession.messId);
      if (matched) {
        setCurrentMess(matched);
      } else {
        setCurrentMess(loadedMesses[0] || INITIAL_DEMO_MESS);
      }
      setViewMode(storedSession.role === 'member' ? 'personal' : 'mess');
    } else {
      // By default load demo mess
      setCurrentMess(loadedMesses[0] || INITIAL_DEMO_MESS);
    }

    setMounted(true);
  }, []);

  // Update handlers
  const handleUpdateMess = (updated: MessData) => {
    saveMess(updated);
    setCurrentMess(updated);
    setAllMesses((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
  };

  const handleUpdateMeals = (updatedMeals: MealEntry[]) => {
    handleUpdateMess({
      ...currentMess,
      meals: updatedMeals,
    });
  };

  const handleUpdateBazar = (updatedBazar: BazarEntry[]) => {
    handleUpdateMess({
      ...currentMess,
      bazarEntries: updatedBazar,
    });
  };

  const handleUpdateDeposits = (updatedDeposits: DepositEntry[]) => {
    handleUpdateMess({
      ...currentMess,
      deposits: updatedDeposits,
    });
  };

  const handleUpdateFixedExpenses = (updatedExpenses: FixedExpenseSegment[]) => {
    handleUpdateMess({
      ...currentMess,
      fixedExpenses: updatedExpenses,
    });
  };

  const handleUpdateMemberRoomRent = (memberId: string, newRent: number) => {
    const updatedMembers = currentMess.members.map((m) =>
      m.id === memberId ? { ...m, roomRent: newRent } : m
    );
    handleUpdateMess({
      ...currentMess,
      members: updatedMembers,
    });
  };

  const handleChangeAdminPassword = (newPass: string) => {
    handleUpdateMess({
      ...currentMess,
      adminPassword: newPass,
    });
  };

  // Reload action triggered by Navbar Icon click
  const handleReloadApp = () => {
    setIsReloading(true);
    setTimeout(() => {
      const refreshedMesses = getStoredMesses();
      setAllMesses(refreshedMesses);
      if (session) {
        const matched = refreshedMesses.find((m) => m.id === session.messId);
        if (matched) setCurrentMess(matched);
      }
      setIsReloading(false);
    }, 600);
  };

  // Login handler
  const handleLoginSuccess = (newSession: UserSession, targetMess: MessData) => {
    setSession(newSession);
    setCurrentMess(targetMess);
    setViewMode(newSession.role === 'member' ? 'personal' : 'mess');
    setActiveTab('meal_account');
  };

  // Logout handler
  const handleLogout = () => {
    saveSession(null);
    setSession(null);
  };

  // Instant Demo Shortcuts without password
  const handleTryDemo = (role: 'manager' | 'member' = 'manager') => {
    let demoSession: UserSession;
    if (role === 'member') {
      const demoMember = INITIAL_DEMO_MESS.members.find((m) => m.username === 'tasin') || INITIAL_DEMO_MESS.members[1];
      demoSession = {
        messId: INITIAL_DEMO_MESS.id,
        role: 'member',
        memberId: demoMember.id,
        username: demoMember.username,
        name: demoMember.name,
      };
      setViewMode('personal');
    } else {
      const demoMgr = INITIAL_DEMO_MESS.members.find((m) => m.role === 'manager') || INITIAL_DEMO_MESS.members[0];
      demoSession = {
        messId: INITIAL_DEMO_MESS.id,
        role: 'manager',
        memberId: demoMgr.id,
        username: demoMgr.username,
        name: demoMgr.name,
      };
      setViewMode('mess');
    }
    saveSession(demoSession);
    setSession(demoSession);
    setCurrentMess(INITIAL_DEMO_MESS);
    setActiveTab('meal_account');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-white font-bold text-lg">{APP_NAME} লোড হচ্ছে...</div>
      </div>
    );
  }

  // If user is NOT logged in, show the Login Portal
  if (!session) {
    return (
      <LoginPortal
        onLoginSuccess={handleLoginSuccess}
        onTryDemo={handleTryDemo}
      />
    );
  }

  // Realtime calculations
  const calc = calculateMessTotals(currentMess);
  const isAdmin = session.role === 'manager';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* Full-screen Loading Overlay on Icon Click */}
      {isReloading && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl animate-spin mb-3">
            <RotateCw className="w-8 h-8" />
          </div>
          <div className="text-white font-bold text-base tracking-wide">
            {APP_NAME} রিলোড হচ্ছে...
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentMess={currentMess}
        session={session}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setShowAdminModal(true)}
        onOpenManual={() => setShowManual(true)}
        onOpenBackup={() => setShowBackup(true)}
        onPrintMealReport={() => printMealReport(currentMess, calc)}
        onPrintRentReport={() => printRentReport(currentMess, calc)}
        onReloadApp={handleReloadApp}
        isReloading={isReloading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {/* VIEW MODE 1: PERSONAL ACCOUNT (ONLY MY MEALS & RENT) */}
        {viewMode === 'personal' && session.memberId ? (
          <PersonalAccountView
            memberId={session.memberId}
            mess={currentMess}
            calc={calc}
            onSwitchToMessView={() => setViewMode('mess')}
          />
        ) : (
          /* VIEW MODE 2: MESS-WIDE FULL ACCOUNT */
          <div className="space-y-6">
            {/* Quick Switch Banner to Personal View */}
            {session.memberId && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-emerald-300" />
                  <div>
                    <span className="text-xs font-bold text-emerald-200">মেসের সার্বিক হিসাব মোড</span>
                    <p className="text-xs text-white">
                      আপনি বর্তমানে মেসের সকল সদস্যের তালিকা ও খাতা পর্যবেক্ষণ করছেন।
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setViewMode('personal')}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>👤 শুধু আমার ব্যক্তিগত হিসাব দেখুন</span>
                </button>
              </div>
            )}

            {/* TAB 1: SEPARATE MEAL ACCOUNT (MEAL LEDGER) */}
            {activeTab === 'meal_account' && (
              <MealAccountView
                mess={currentMess}
                calc={calc}
                onSelectMemberForDetail={(id) => setSelectedMemberDetailId(id)}
                loggedInMemberId={session.memberId}
              />
            )}

            {/* TAB 2: SEPARATE RENT ACCOUNT (RENT LEDGER) */}
            {activeTab === 'rent_account' && (
              <RentAccountView
                mess={currentMess}
                calc={calc}
                isAdmin={isAdmin}
                onUpdateMemberRoomRent={handleUpdateMemberRoomRent}
                loggedInMemberId={session.memberId}
              />
            )}

            {/* TAB 3: DAILY MEALS (Lunch, Dinner, Guest, 0.25 custom steps) */}
            {activeTab === 'daily_meals' && (
              <DailyMealGrid
                mess={currentMess}
                isAdmin={isAdmin}
                onUpdateMeals={handleUpdateMeals}
                onOpenAdminModal={() => setShowAdminModal(true)}
              />
            )}

            {/* TAB 4: BAZAR LIST */}
            {activeTab === 'bazar' && (
              <BazarList
                mess={currentMess}
                isAdmin={isAdmin}
                onUpdateBazar={handleUpdateBazar}
                onOpenAdminModal={() => setShowAdminModal(true)}
              />
            )}

            {/* TAB 5: DEPOSITS LIST */}
            {activeTab === 'deposits' && (
              <DepositsList
                mess={currentMess}
                isAdmin={isAdmin}
                onUpdateDeposits={handleUpdateDeposits}
                onOpenAdminModal={() => setShowAdminModal(true)}
              />
            )}

            {/* TAB 6: ARCHIVE HISTORY */}
            {activeTab === 'archives' && (
              <ArchiveViewer mess={currentMess} />
            )}

            {/* TAB 7: ADMIN CONTROL PANEL (Manager Only) */}
            {activeTab === 'admin' && isAdmin && (
              <AdminPanel
                mess={currentMess}
                calc={calc}
                onUpdateMess={handleUpdateMess}
                onLogoutAdmin={() => setActiveTab('meal_account')}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer with Developer credit S.M. Tahmid Hasan Shahria & Facebook */}
      <Footer
        onOpenManual={() => setShowManual(true)}
        onOpenBackup={() => setShowBackup(true)}
      />

      {/* Modals */}
      <AdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        mess={currentMess}
        onSuccessLogin={() => {
          setSession((prev) => prev ? { ...prev, role: 'manager' } : null);
          setViewMode('mess');
          setActiveTab('admin');
        }}
        onChangePassword={handleChangeAdminPassword}
      />

      <UserManual
        isOpen={showManual}
        onClose={() => setShowManual(false)}
      />

      <BackupModal
        isOpen={showBackup}
        onClose={() => setShowBackup(false)}
        onRefreshData={() => {
          const reloaded = getStoredMesses();
          setAllMesses(reloaded);
          const found = reloaded.find((m) => m.id === currentMess.id);
          if (found) setCurrentMess(found);
        }}
      />

      <CreateMessModal
        isOpen={showCreateMess}
        onClose={() => setShowCreateMess(false)}
        onMessCreated={(createdMess) => {
          setAllMesses(getStoredMesses());
          setCurrentMess(createdMess);
          const newSession: UserSession = {
            messId: createdMess.id,
            role: 'manager',
            username: 'manager',
            name: createdMess.managerName || 'মেস ম্যানেজার',
          };
          saveSession(newSession);
          setSession(newSession);
          setViewMode('mess');
          setActiveTab('admin');
        }}
      />

      <MemberDetailModal
        memberId={selectedMemberDetailId}
        onClose={() => setSelectedMemberDetailId(null)}
        mess={currentMess}
        calc={calc}
      />
    </div>
  );
}
