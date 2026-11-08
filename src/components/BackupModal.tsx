'use client';

import React, { useRef, useState, useEffect } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  HardDrive, 
  RefreshCw, 
  ShieldCheck,
  Cloud,
  Key,
  ExternalLink
} from 'lucide-react';
import { 
  downloadBackupJson, 
  restoreBackupFromJson, 
  getCrashBackupInfo,
  syncAllMessesToSupabase 
} from '../lib/storage';
import { 
  getSupabaseUrl, 
  getSupabaseAnonKey, 
  setSupabaseCredentials, 
  isSupabaseReady, 
  DEFAULT_SUPABASE_URL 
} from '../lib/supabase';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Supabase credentials state
  const [supabaseUrl, setSupabaseUrlState] = useState(DEFAULT_SUPABASE_URL);
  const [anonKeyInput, setAnonKeyInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCloudReady, setIsCloudReady] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const url = getSupabaseUrl();
      const key = getSupabaseAnonKey();
      setSupabaseUrlState(url);
      setAnonKeyInput(key);
      setIsCloudReady(isSupabaseReady());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const backupInfo = getCrashBackupInfo();

  // Save Supabase key and trigger sync
  const handleSaveAndSyncSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!anonKeyInput.trim()) {
      setStatusMessage({ type: 'error', text: 'অনুগ্রহ করে Supabase Anon Key লিখুন!' });
      return;
    }

    setSupabaseCredentials(supabaseUrl.trim(), anonKeyInput.trim());
    setIsSyncing(true);
    const res = await syncAllMessesToSupabase();
    setIsSyncing(false);
    setIsCloudReady(isSupabaseReady());

    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
      onRefreshData();
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const handleDownload = () => {
    downloadBackupJson();
    setStatusMessage({
      type: 'success',
      text: 'আপনার ব্যাকআপ ফাইলটি (.json) সফলভাবে ডিভাইসে ডাউনলোড হয়েছে!',
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const res = restoreBackupFromJson(content);
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        onRefreshData();
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in fade-in zoom-in-95 scrollbar-thin">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer text-lg"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              ডাটাবেজ কানেকশন ও ব্যাকআপ সেন্টার
            </h3>
            <p className="text-xs text-gray-500">
              Supabase ক্লাউড ডাটাবেজ এবং অফলাইন ব্রাউজার ব্যাকআপ
            </p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* SECTION 1: SUPABASE CLOUD DATABASE CONNECTION */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-700 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">১. Supabase ক্লাউড ডাটাবেজ</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isCloudReady
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
              }`}
            >
              {isCloudReady ? '🟢 ক্লাউড সক্রিয় (Connected)' : '🟡 API Key প্রয়োজন'}
            </span>
          </div>

          <p className="text-[11px] text-gray-400 mb-3">
            প্রজেক্ট URL: <code className="text-emerald-300 font-mono text-[10px]">{supabaseUrl}</code>
          </p>

          <form onSubmit={handleSaveAndSyncSupabase} className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                Supabase Anon Key পেস্ট করুন:
              </label>
              <input
                type="password"
                placeholder="eyJh..."
                value={anonKeyInput}
                onChange={(e) => setAnonKeyInput(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSyncing}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'সেভ করুন ও ক্লাউডে সিঙ্ক করুন'}</span>
            </button>
          </form>
        </div>

        {/* SECTION 2: FAIL-SAFE BROWSER BACKUP & JSON FILE */}
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-teal-950">
                ২. ব্রাউজার অফলাইন ব্যাকআপ (Fail-Safe)
              </span>
            </div>
            <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          <p className="text-xs text-teal-900 leading-relaxed">
            সার্ভার বা ইন্টারনেটে কোনো সমস্যা হলেও আপনার কোনো ডাটা হারাবে না। প্রতিটি এন্ট্রি রিয়েলটাইমে ব্রাউজারের মেমরিতে সংরক্ষিত থাকে।
          </p>
          {backupInfo?.timestamp && (
            <div className="mt-2 text-[11px] text-teal-800 font-mono">
              সর্বশেষ ব্যাকআপ: {new Date(backupInfo.timestamp).toLocaleTimeString('bn-BD')}
            </div>
          )}
        </div>

        {/* JSON FILE DOWNLOAD & RESTORE */}
        <div className="space-y-2.5">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>১-ক্লিকে ব্যাকআপ ফাইল (.json) ডাউনলোড করুন</span>
          </button>

          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs sm:text-sm border border-gray-300 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-gray-600" />
            <span>পূর্বে সংরক্ষিত JSON ফাইল আপলোড করে রিস্টোর করুন</span>
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
