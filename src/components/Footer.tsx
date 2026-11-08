'use client';

import React from 'react';
import { Heart, ExternalLink, ShieldCheck, Database, BookOpen } from 'lucide-react';
import { DEVELOPER_NAME, DEVELOPER_FB, APP_NAME } from '../lib/constants';

interface FooterProps {
  onOpenManual: () => void;
  onOpenBackup: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenManual, onOpenBackup }) => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 py-8 text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Brand Info */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-extrabold text-gray-900 text-sm">{APP_NAME}</span>
              <span className="text-gray-300">•</span>
              <span className="text-emerald-700 font-semibold">ডিজিটাল মেস ও মিল সমাধান</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              রুম ভাড়া ও মিল হিসাব আলাদা রাখার পূর্ণাঙ্গ স্বয়ংক্রিয় সিস্টেম
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={onOpenManual}
              className="text-gray-600 hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>ব্যবহার নির্দেশিকা</span>
            </button>
            <span className="text-gray-200">|</span>
            <button
              onClick={onOpenBackup}
              className="text-gray-600 hover:text-teal-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5 text-teal-600" />
              <span>ব্রাউজার ব্যাকআপ</span>
            </button>
          </div>

          {/* Developer Credit Requested by User */}
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-center md:text-right">
            <div className="text-[11px] text-gray-500">
              Developed by{' '}
              <a
                href={DEVELOPER_FB}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-gray-900 hover:text-blue-600 underline inline-flex items-center gap-1"
                title="Facebook Profile"
              >
                <span>{DEVELOPER_NAME}</span>
                <ExternalLink className="w-3 h-3 text-blue-500" />
              </a>
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              Facebook:{' '}
              <a
                href={DEVELOPER_FB}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-mono"
              >
                fb.com/itstahmid
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
          <div>
            © {new Date().getFullYear()} {APP_NAME}. সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>গোপনীয়তা সুরক্ষিত • কোনো পাবলিক মেস তালিকা উন্মুক্ত করা হয় না</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
