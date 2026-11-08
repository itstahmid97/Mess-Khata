'use client';

import React, { useRef, useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  HardDrive, 
  RefreshCw, 
  ShieldCheck 
} from 'lucide-react';
import { downloadBackupJson, restoreBackupFromJson, getCrashBackupInfo } from '../lib/storage';
import { isSupabaseConfigured } from '../lib/supabase';
import { formatBengaliFullDate } from '../lib/helpers';

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

  if (!isOpen) return null;

  const backupInfo = getCrashBackupInfo();

  const handleDownload = () => {
    downloadBackupJson();
    setStatusMessage({
      type: 'success',
      text: 'আপনার ব্যাকআপ ফাইলটি ডিভাইসে সফলভাবে ডাউনলোড হয়েছে!',
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
    // reset input
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer text-lg"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              ডাটা নিরাপত্তা ও ব্রাউজার ক্র্যাশ ব্যাকআপ
            </h3>
            <p className="text-xs text-gray-500">
              ডাটা হারানোর ঝুঁকি এড়াতে সার্বক্ষণিক স্বয়ংক্রিয় ব্যাকআপ ব্যবস্থা
            </p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
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

        {/* Status Card */}
        <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-teal-950">
                স্বয়ংক্রিয় লোকাল ব্যাকআপ চালু রয়েছে
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
              Active
            </span>
          </div>
          <p className="text-xs text-teal-900 leading-relaxed">
            ওয়েব অ্যাপ যদি কোনো কারণে রিফ্রেশ বা ক্র্যাশ হয়, তবুও আপনার কোনো তথ্য হারাবে না। ব্রাউজারের মেমরিতে আপনার সমস্ত মেসের রেকর্ড সুরক্ষিত আছে।
          </p>
          {backupInfo?.timestamp && (
            <div className="mt-2 text-[11px] text-teal-800 font-mono">
              সর্বশেষ ব্যাকআপ স্ন্যাপশট: {new Date(backupInfo.timestamp).toLocaleTimeString('bn-BD')} ({new Date(backupInfo.timestamp).toLocaleDateString('bn-BD')})
            </div>
          )}
        </div>

        {/* Database Status */}
        <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-5 h-5 text-gray-600" />
            <div>
              <div className="text-xs font-bold text-gray-900">ডাটাবেজ কানেকশন স্ট্যাটাস</div>
              <div className="text-[11px] text-gray-500">
                {isSupabaseConfigured
                  ? 'Supabase ক্লাউড ডাটাবেজের সাথে সংযুক্ত'
                  : 'ব্রাউজার লোকাল স্টোরেজ ডাটাবেজ (অফলাইন সমর্থিত)'}
              </div>
            </div>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              isSupabaseConfigured
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {isSupabaseConfigured ? 'Supabase Sync' : 'Offline Storage'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
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
            <span>পূর্বে ডাউনলোড করা ব্যাকআপ থেকে রিস্টোর করুন</span>
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
