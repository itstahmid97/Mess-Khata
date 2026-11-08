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
  Download
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
                {APP_NAME} - সাধারণ ব্যবহার নির্দেশিকা (User Manual)
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
              মেস বা হোস্টেলের খাবার ও ভাড়ার হিসাব এতদিন মানুষ জটিল এক্সেল শিটে বা কাগজের খাতায় করত। এতে প্রায়ই সূত্র মুছে যেত, হিসাবের অমিল দেখা দিত এবং মোবাইল থেকে হিসাব দেখা কঠিন হতো। <strong>{APP_NAME}</strong> একটি স্বয়ংক্রিয় ডিজিটাল খাতা, যেখানে মিল হিসাব ও বাসা ভাড়ার হিসাব দুটি আলাদা খাতায় নির্ভুলভাবে রিয়েলটাইমে হিসাব করা হয়।
            </p>
          </section>

          {/* Section 2: Privacy & Login */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <Lock className="w-5 h-5 text-purple-700" />
              ২. তথ্যের সম্পূর্ণ গোপনীয়তা ও মেসে প্রবেশ
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                • <strong>গোপনীয়তা সুরক্ষা:</strong> আপনার মেসের কোনো তথ্য বা সদস্যদের নাম অন্য কোনো মেসের সদস্যরা দেখতে পারবে না।
              </p>
              <p>
                • <strong>মেস কোড দিয়ে প্রবেশ:</strong> আপনার মেসের একটি নির্দিষ্ট কোড থাকবে (যেমন: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono font-bold text-purple-800">SHANTI-101</code>)। সেই কোড বা মেসের নাম লিখলে আপনার মেসের পেজ চলে আসবে।
              </p>
              <p>
                • <strong>স্বয়ংক্রিয় লগইন:</strong> একবার আপনার ফোনে বা ব্রাউজারে লগইন করলে আর বারবার লগইন করতে হয় না।
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
                • লগইন পেজের <strong>&quot;নতুন মেস শুরু করুন&quot;</strong> অপশনে যান।
              </p>
              <p>
                • আপনার মেসের নাম (যেমন: শান্তিনীড় মেস) ও একটি পছন্দের মেস কোড লিখুন।
              </p>
              <p>
                • ম্যানেজারের নাম ও পাসওয়ার্ড নির্ধারণ করে মেস তৈরি করুন।
              </p>
              <p>
                • এরপর এডমিন প্যানেলে ঢুকে আপনার মেসের রুম অনুযায়ী সদস্যদের যুক্ত করুন ও তাদের ইউজারনেম এবং পাসওয়ার্ড দিয়ে দিন।
              </p>
            </div>
          </section>

          {/* Section 4: Separate Meal vs Rent Accounts */}
          <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
            <h3 className="text-base font-bold text-amber-950 flex items-center gap-2 mb-2">
              <Home className="w-5 h-5 text-amber-800" />
              ৪. খাবার/মিল ও বাসা ভাড়া—সম্পূর্ণ দুটি আলাদা হিসাব!
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-amber-950">
              <p>
                • <strong>১. মিল হিসাব খাতা (Meal Ledger):</strong> এখানে চাল, ডাল, মাছ, মাংসের বাজার খরচ, মিল সংখ্যা ও মিল রেটের হিসাব রাখা হয়। বাসা ভাড়ার কোনো টাকা এর সাথে মেশানো হয় না।
              </p>
              <p>
                • <strong>২. বাসা ভাড়া খাতা (Rent Ledger):</strong> মেসে সবার রুমের ভাড়া একই হয় না। তাই প্রতিটি সদস্যের জন্য আলাদা <strong>রুম ভাড়া</strong> নির্ধারণ করা থাকে। আর ওয়াইফাই, বুয়া, গ্যাস, কারেন্ট ও ময়লা বিল সবার মাঝে সমান ভাগে ভাগ হয়।
              </p>
              <p>
                • <strong>সমন্বিত ড্যাশবোর্ড (Master):</strong> মাস শেষে মিলের খরচ এবং বাসা ভাড়ার খরচ একত্র করে সদস্যের চূড়ান্ত পাওনা বা বকেয়া নিষ্পত্তি করা হয়।
              </p>
            </div>
          </section>

          {/* Section 5: Daily Meals with Lunch, Dinner, Guest (Fractions: 0.25, 0.5) */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <Utensils className="w-5 h-5 text-emerald-700" />
              ৫. দুপুর, রাত ও গেস্ট মিল এন্ট্রি (০.২৫, ০.৫০ ভগ্নাংশ সহ)
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                • <strong>তারিখ ও বার:</strong> প্রতিটি দিন বাংলা তারিখ ও বার (যেমন: <em>০৫ নভেম্বর ২০২৬, বৃহস্পতিবার</em>) অনুসারে দেখা যায়।
              </p>
              <p>
                • <strong>দুপুর ও রাত মিল:</strong> কে দুপুরে খেল আর কে রাতে খেল তা আলাদাভাবে লিখা যায়।
              </p>
              <p>
                • <strong>গেস্ট মিল ও ভগ্নাংশ মিল:</strong> মেহমান আসলে বা অল্প খেলে ম্যানেজার <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">0.25</code> (পোয়া মিল), <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">0.50</code> (অর্ধেক মিল), <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">0.75</code> ইত্যাদি কাস্টম সংখ্যা লিখে দিতে পারবেন অথবা ১-ক্লিক বাটনে চাপ দিয়ে যোগ করতে পারবেন।
              </p>
            </div>
          </section>

          {/* Section 6: Bazar & Meal Rate Formula */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
              ৬. বাজার খরচ ও লাইভ মিল রেট নির্ধারণের নিয়ম
            </h3>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-3">
              <code className="text-xs sm:text-sm font-bold font-mono text-orange-950 block">
                মিল রেট = মোট বাজার খরচ ÷ মোট মিল সংখ্যা
              </code>
              <code className="text-xs sm:text-sm font-bold font-mono text-orange-950 block mt-1">
                সদস্যের মিল খরচ = তার মোট মিল × মিল রেট
              </code>
            </div>
            <p className="text-xs text-gray-600">
              কে কবে কত টাকার কি বাজার করেছে তা ফর্দসহ বাজার তালিকায় জমা হয়। প্রতিটি নতুন বাজার এন্ট্রি হওয়ার সাথে সাথে মিল রেট স্বয়ংক্রিয়ভাবে আপডেট হয়ে যায়।
            </p>
          </section>

          {/* Section 7: Room Rent & Shared Utilities */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <Home className="w-5 h-5 text-indigo-700" />
              ৭. রুম অনুযায়ী ব্যক্তিগত বাসা ভাড়া ও কমন ইউটিলিটি বিল
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                • <strong>ব্যক্তিগত রুম ভাড়া:</strong> রুমের সাইজ বা সুযোগ-সুবিধা অনুযায়ী মেম্বারদের রুম ভাড়া আলাদা হতে পারে (যেমন: নাহিদ ৪৫০০, তাসিন ৪২০০, শাওন ৪০০০ ইত্যাদি)।
              </p>
              <p>
                • <strong>কমন ইউটিলিটি বিল:</strong> ওয়াইফাই, বুয়া/খালা বিল, গ্যাস, কারেন্ট ও ময়লা বিলের মোট টাকা সক্রিয় সকল মেম্বারদের মাঝে সমান ভাগে ভাগ হয়ে যায়।
              </p>
            </div>
          </section>

          {/* Section 8: Deposit & Balance */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <Wallet className="w-5 h-5 text-teal-700" />
              ৮. টাকা জমা (ডিপোজিট) ও পাওনা / বকেয়া নিষ্পত্তি
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                • মেম্বাররা যখন ম্যানেজারের কাছে টাকা জমা দেন, তখন জমাটি মিল বাবদ নাকি ভাড়া বাবদ তা নির্দিষ্ট করে দেওয়া যায়।
              </p>
              <p>
                • <strong className="text-emerald-700">পাবে (সবুজ রং):</strong> মেম্বারের খরচের চেয়ে জমা বেশি ছিল। মেস ফান্ড থেকে এই টাকা তিনি ফেরত পাবেন।
              </p>
              <p>
                • <strong className="text-rose-700">দিতে হবে (লাল রং):</strong> মেম্বারের খরচ জমার চেয়ে বেশি হয়েছে। এই বকেয়া টাকা মেস ম্যানেজারের কাছে জমা দিতে হবে।
              </p>
            </div>
          </section>

          {/* Section 9: Month Archive & Auto Reset */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <RotateCcw className="w-5 h-5 text-blue-700" />
              ৯. মাস সমাপনী ও পূর্ববর্তী মাসের হিসাব (আর্কাইভ)
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                • মাস শেষে ম্যানেজার এডমিন প্যানেল থেকে <strong>&quot;নতুন মাস শুরু ও অটো-রিসেট&quot;</strong> বাটনে চাপ দিলে বিদায়ী মাসের সমস্ত রেকর্ড আর্কাইভে সংরক্ষিত হয়ে যায়।
              </p>
              <p>
                • নতুন মাসের জন্য দৈনিক মিল ও বাজার শূন্য (০) থেকে শুরু হয়।
              </p>
              <p>
                • আগের মাসের পাওনা বা বকেয়া স্বয়ংক্রিয়ভাবে নতুন মাসের ওপেনিং ব্যালেন্স হিসেবে স্থানান্তর (Carry Forward) করা যায়।
              </p>
              <p>
                • মেম্বার বা ম্যানেজার যেকোনো সময় <strong>&quot;আর্কাইভ&quot;</strong> ট্যাবে গিয়ে পেছনের যেকোনো মাসের হিসাব ও পিডিএফ দেখতে পারেন।
              </p>
            </div>
          </section>

          {/* Section 10: PDF Download & Print */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <Printer className="w-5 h-5 text-blue-700" />
              ১০. ১-ক্লিকে প্রফেশনাল PDF রিপোর্ট ডাউনলোড ও প্রিন্ট
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              ন্যাভবারে থাকা <strong>&quot;PDF রিপোর্ট&quot;</strong> বাটনে চাপ দিলেই মেসের নাম, সদস্যভিত্তিক খাবারের তালিকা, রুম ভাড়া, বাজার তালিকা এবং ম্যানেজারের স্বাক্ষরযুক্ত ফরম্যাটে পূর্ণাঙ্গ হিসাবের কপি প্রিন্ট বা পিডিএফ হিসেবে ফোনে সংরক্ষণ করা যায়। এটি মেসের বোর্ডে ঝুলিয়ে দেওয়া যাবে বা মেসেঞ্জার/হোয়াটসঅ্যাপে শেয়ার করা যাবে।
            </p>
          </section>

          {/* Section 11: Browser Backup & JSON Export */}
          <section className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
            <h3 className="text-base font-bold text-teal-950 flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-teal-700" />
              ১১. ডাটা হারানো রোধে ব্রাউজার ব্যাকআপ ও JSON ফাইল ডাউনলোড
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-teal-950">
              <p>
                • ওয়েবসাইট ব্যবহার করার সময় প্রতিটি এন্ট্রি স্বয়ংক্রিয়ভাবে আপনার ফোনের বা কম্পিউটারের ব্রাউজারে সেভ থাকে।
              </p>
              <p>
                • সার্ভার বা ইন্টারনেটে সাময়িক কোনো সমস্যা হলেও আপনার ডাটা হারাবে না।
              </p>
              <p>
                • বাড়তি নিরাপত্তার জন্য আপনি যেকোনো সময় ন্যাভবারের <strong>&quot;ব্রাউজার ব্যাকআপ&quot;</strong> বাটনে গিয়ে <strong>&quot;১-ক্লিকে ব্যাকআপ ফাইল (.json) ডাউনলোড করুন&quot;</strong> চাপ দিয়ে একটি ফাইল নিজের ফোনে সেভ করে রাখতে পারবেন এবং প্রয়োজনে তা রিস্টোর করতে পারবেন।
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
