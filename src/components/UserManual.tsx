'use client';

import React from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Shield, 
  CheckCircle2, 
  FileSpreadsheet, 
  RotateCcw, 
  Printer, 
  Database, 
  Users, 
  Utensils, 
  ShoppingCart, 
  Home, 
  Wallet, 
  Sun, 
  Moon, 
  Lock, 
  Download,
  UserCheck
} from 'lucide-react';
import { APP_NAME, DEVELOPER_NAME, DEVELOPER_FB } from '../lib/constants';

interface UserManualProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManual: React.FC<UserManualProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-900 via-teal-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                {APP_NAME} - পূর্ণাঙ্গ ব্যবহার নির্দেশিকা (User Manual)
              </h2>
              <p className="text-xs text-emerald-200">
                মেসের মিল, বাজার খরচ, বাসা ভাড়া, বিল ও সদস্যভিত্তিক হিসাব পরিচালনার নিয়মাবলি
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer text-xl"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-gray-800 text-sm leading-relaxed scrollbar-thin">
          {/* Section 1: Introduction */}
          <section className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5">
            <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
              ১. {APP_NAME} কী ও কেন এটি ব্যবহার করবেন?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
              মেস বা হোস্টেলের খাবার ও ভাড়ার হিসাব এতদিন মানুষ জটিল এক্সেল শিটে বা কাগজের খাতায় করত। এতে প্রায়ই সূত্র মুছে যেত, হিসাবের অমিল দেখা দিত এবং মোবাইল থেকে হিসাব দেখা কঠিন হতো। <strong>{APP_NAME}</strong> একটি আধুনিক ডিজিটাল প্ল্যাটফর্ম, যেখানে মিল হিসাব ও বাসা ভাড়ার হিসাব দুটিকে সম্পূর্ণ আলাদা ও স্বচ্ছ রেখে নির্ভুলভাবে রিয়েলটাইমে পরিচালনা করা হয়।
            </p>
          </section>

          {/* Section 2: Privacy & Login */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <Lock className="w-5 h-5 text-purple-700" />
              ২. তথ্যের সম্পূর্ণ গোপনীয়তা ও মেস কোড
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                • <strong>গোপনীয়তা সুরক্ষা:</strong> আপনার মেসের কোনো তথ্য বা সদস্যদের তালিকা অন্য কোনো মেসের ব্যক্তি দেখতে পারবে না। কোনো ড্রপডাউন বা পাবলিক লিস্ট রাখা হয়নি।
              </p>
              <p>
                • <strong>মেস কোড দিয়ে প্রবেশ:</strong> আপনার মেসের একটি নির্দিষ্ট কোড থাকবে (যেমন: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono font-bold text-purple-800">SHANTI-101</code>)। সেই কোড বা মেসের নাম লিখলে আপনার মেসের পেজ ওপেন হবে।
              </p>
              <p>
                • <strong>অটো-রিমেম্বার:</strong> একবার আপনার ফোনে বা ব্রাউজারে লগইন করলে আর বারবার লগইন করতে হয় না।
              </p>
            </div>
          </section>

          {/* Section 3: Add New Mess */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <Users className="w-5 h-5 text-indigo-700" />
              ৩. নতুন মেস শুরু করার নিয়ম (Add Your Mess)
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                • লগইন পেজের <strong>&quot;নতুন মেস শুরু করুন&quot;</strong> অপশনে চাপ দিন।
              </p>
              <p>
                • আপনার মেসের নাম (যেমন: শান্তিনীড় মেস) ও একটি সহজ মেস কোড লিখুন।
              </p>
              <p>
                • ম্যানেজারের নাম ও পাসওয়ার্ড নির্ধারণ করে মেস তৈরি সম্পন্ন করুন।
              </p>
              <p>
                • এডমিন প্যানেল থেকে আপনার মেসের সদস্যদের নাম, রুম ভাড়া এবং ইউজার আইডি সেট করে দিন।
              </p>
            </div>
          </section>

          {/* Section 4: Separate Meal vs Rent Accounts (100% Separate) */}
          <section className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5">
            <h3 className="text-base font-bold text-amber-950 flex items-center gap-2 mb-2">
              <Home className="w-5 h-5 text-amber-800" />
              ৪. খাবার/মিল ও বাসা ভাড়া—সম্পূর্ণ দুটি পৃথক হিসাব (কোনো জগাখিচুড়ি নেই)!
            </h3>
            <div className="space-y-2.5 text-xs sm:text-sm text-amber-950">
              <p>
                • <strong>১. মিল হিসাব খাতা (Meal Ledger):</strong> এখানে শুধু চাল, ডাল, তেল, মাছ, মাংসের বাজার খরচ, মিল সংখ্যা ও মিল রেটের পৃথক হিসাব থাকবে। বাসা ভাড়ার কোনো টাকা বা বিল এর সাথে মেশানো হবে না।
              </p>
              <p>
                • <strong>২. বাসা ভাড়া ও ইউটিলিটি খাতা (Rent Ledger):</strong> মেসে সবার রুম ভাড়া এক হয় না (রুম ও সিট অনুযায়ী ভিন্ন হয়)। তাই প্রতিটি সদস্যের আলাদা <strong>রুম ভাড়া</strong> এবং ওয়াইফাই, বুয়া/খালা, গ্যাস, কারেন্ট ও ময়লা বিলের সমান বণ্টন সম্পূর্ণ আলাদা খাতায় হিসাব করা হয়।
              </p>
              <p>
                • <strong>সম্পূর্ণ পৃথক প্রতিবেদন:</strong> মিলের জন্য আলাদা PDF রিপোর্ট এবং বাসা ভাড়ার জন্য আলাদা PDF রিপোর্ট তৈরি হয়—দুটোকে কখনও একসাথে মিলিয়ে মোট করা হয় না।
              </p>
            </div>
          </section>

          {/* Section 5: Personal View vs Mess View */}
          <section className="bg-blue-50/80 border border-blue-200 rounded-2xl p-5">
            <h3 className="text-base font-bold text-blue-950 flex items-center gap-2 mb-2">
              <UserCheck className="w-5 h-5 text-blue-800" />
              ৫. ব্যক্তিগত হিসাব বনাম মেসের সবার হিসাব দেখার সুবিধা
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-blue-950">
              <p>
                • <strong>👤 শুধু আমার ব্যক্তিগত হিসাব:</strong> কোনো সাধারণ সদস্য লগইন করলে তিনি সরাসরি তার নিজের হিসাব দেখতে পাবেন—তিনি এই মাসে কত তারিখে দুপুরে/রাতে কয়টা মিল খেয়েছেন, তার মিল খরচ কত, তিনি কত জমা দিয়েছেন এবং তার কত ফেরত বা বাকি আছে। সাথে তার রুমের ভাড়া ও ইউটিলিটি বিলের পৃথক স্ট্যাটাস।
              </p>
              <p>
                • <strong>👥 মেসের সবার হিসাব:</strong> সদস্য বা ম্যানেজার যেকোনো সময় ১-ক্লিক টগল বাটনে চাপ দিয়ে মেসের অন্য সকল সদস্যের সার্বিক তালিকা, মেসের মোট বাজার ও সবার মিল পর্যবেক্ষণ করতে পারবেন।
              </p>
            </div>
          </section>

          {/* Section 6: Daily Meals with Lunch, Dinner, Guest (Fractions: 0.25, 0.5) */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <Utensils className="w-5 h-5 text-emerald-700" />
              ৬. দুপুর, রাত ও গেস্ট মিল এন্ট্রি (০.২৫, ০.৫০ ভগ্নাংশ সহ)
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                • <strong>তারিখ ও বার:</strong> প্রতিটি দিন বাংলা ক্যালেন্ডার অনুসারে তারিখ ও বার (যেমন: <em>০১ নভেম্বর ২০২৪, শুক্রবার</em>) প্রদর্শিত হয়।
              </p>
              <p>
                • <strong>দুপুর ও রাত মিল:</strong> কে দুপুরে খেল আর কে রাতে খেল তা আলাদা কলামে সংরক্ষণ করা হয়।
              </p>
              <p>
                • <strong>গেস্ট মিল ও ভগ্নাংশ মিল:</strong> মেহমান আসলে বা ডায়েট/অল্প খাবার খেলে ম্যানেজার <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">0.25</code> (পোয়া মিল), <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">0.50</code> (অর্ধেক মিল), <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">0.75</code> ইত্যাদি কাস্টম সংখ্যা ইনপুট করতে পারেন বা বাটন চেপে ১-ক্লিকে বাড়াতে পারেন।
              </p>
            </div>
          </section>

          {/* Section 7: Bazar & Meal Rate Formula */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
              ৭. বাজার খরচ ও মিল রেট নির্ধারণের নিয়ম
            </h3>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-3">
              <code className="text-xs sm:text-sm font-bold font-mono text-orange-950 block">
                মিল রেট = মোট বাজার খরচ ÷ মেসের মোট মিল সংখ্যা
              </code>
              <code className="text-xs sm:text-sm font-bold font-mono text-orange-950 block mt-1">
                সদস্যের মিল খরচ = তার মোট মিল × মিল রেট
              </code>
            </div>
            <p className="text-xs text-gray-600">
              কে কবে কত টাকার কি বাজার করেছে তা ফর্দসহ বাজার তালিকায় জমা হয়। প্রতিটি বাজার এন্ট্রি হওয়ার সাথে সাথে মিল রেট স্বয়ংক্রিয়ভাবে আপডেট হয়ে যায়।
            </p>
          </section>

          {/* Section 8: Room Rent & Shared Utilities */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <Home className="w-5 h-5 text-indigo-700" />
              ৮. রুম অনুযায়ী ভিন্ন বাসা ভাড়া ও কমন ইউটিলিটি বিল
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                • <strong>ভিন্ন ভিন্ন রুম ভাড়া:</strong> রুমের সুযোগ-সুবিধা অনুযায়ী মেম্বারদের রুম ভাড়া আলাদা হয় (যেমন: নাহিদ ৪৫০০, তাসিন ৪২০০, শাওন ৪০০০ ইত্যাদি)। ম্যানেজার যেকোনো সময় যেকোনো সদস্যের রুম ভাড়া এডিট করতে পারেন।
              </p>
              <p>
                • <strong>কমন ইউটিলিটি বিল:</strong> ওয়াইফাই, বুয়া/খালা বিল, গ্যাস সিলিন্ডার, বিদ্যুৎ ও ময়লা বিল সক্রিয় সদস্যদের মাঝে সমান ভাগে সমবণ্টন হয়।
              </p>
            </div>
          </section>

          {/* Section 9: Deposits */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <Wallet className="w-5 h-5 text-teal-700" />
              ৯. টাকা জমা (মিলের জমা ও বাসা ভাড়ার জমা আলাদা)
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                • মেম্বার টাকা জমা দেওয়ার সময় নির্দিষ্ট করা থাকে এটি &quot;মিলের জমা&quot; নাকি &quot;বাসা ভাড়ার জমা&quot;।
              </p>
              <p>
                • মিলের জমা সরাসরি মিল ব্যালেন্সে যোগ হয় এবং ভাড়ার জমা সরাসরি বাসা ভাড়া ব্যালেন্সে যোগ হয়।
              </p>
            </div>
          </section>

          {/* Section 10: PDF Download & Print */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <Printer className="w-5 h-5 text-blue-700" />
              ১০. সম্পূর্ণ পৃথক দুটি PDF রিপোর্ট
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                • 🖨️ <strong>মিল PDF রিপোর্ট:</strong> মেসের মিল রেট, মোট বাজার, সদস্যভিত্তিক দুপুর/রাত/গেস্ট মিল ও মিল ব্যালেন্সের আলাদা প্রিন্ট কপি।
              </p>
              <p>
                • 🖨️ <strong>বাসা ভাড়া PDF রিপোর্ট:</strong> মেসের সকল সদস্যের রুম ভাড়া, ইউটিলিটি বিল বিভাজন, পরিশোধ ও বকেয়া ভাড়ার আলাদা প্রিন্ট কপি।
              </p>
              <p>
                • 🖨️ <strong>ব্যক্তিগত স্লিপ:</strong> প্রত্যেক সদস্য নিজের প্রোফাইল থেকে তার একক মিল স্লিপ বা ভাড়া স্লিপ ডাউনলোড করতে পারবেন।
              </p>
            </div>
          </section>

          {/* Section 11: Cloud & Offline Fail-Safe Backup */}
          <section className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
            <h3 className="text-base font-bold text-teal-950 flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-teal-700" />
              ১১. ডাবল লেয়ার ডাটা ব্যাকআপ ও অফলাইন নিরাপত্তা
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-teal-950 leading-relaxed">
              <p>
                • <strong>ক্লাউড ডাটাবেজ:</strong> আপনার মেসের সমস্ত তথ্য রিয়েলটাইমে ক্লাউড ডাটাবেজে সংরক্ষিত থাকে।
              </p>
              <p>
                • <strong>ব্রাউজার অফলাইন সুরক্ষা:</strong> কোনো কারণে ক্লাউড ডাটাবেজ ডিসকানেক্ট হলেও ব্রাউজার স্বয়ংক্রিয়ভাবে লোকাল স্টোরেজে সব তথ্য সেভ রাখবে এবং অফলাইন মোড ওয়ার্নিং দিবে। কোনো কাজ আটকে থাকবে না।
              </p>
              <p>
                • <strong>JSON ফাইল ডাউনলোড:</strong> মেস ম্যানেজার যেকোনো সময় ন্যাভবারের ব্যাকআপ অপশন থেকে ১-ক্লিকে একটি <strong>.json</strong> ব্যাকআপ ফাইল ডাউনলোড করে রাখতে পারেন।
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {APP_NAME} | মেস ও মিল সমাধান
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
          >
            বুঝেছি, বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
