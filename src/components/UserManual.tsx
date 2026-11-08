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
  Globe,
  Sun,
  Moon,
  ExternalLink,
  Lock,
  Server
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
                {APP_NAME} - পূর্ণাঙ্গ ব্যবহার নির্দেশিকা ও ডকুমেন্টেশন
              </h2>
              <p className="text-xs text-emerald-200">
                মেসের মিল, বাজার, রুম ভাড়া, বিল, Supabase সেটআপ ও Vercel ডেপ্লয়মেন্ট গাইড
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
          {/* 1. Introduction & Philosophy */}
          <section className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5">
            <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
              ১. এক্সেল শিট থেকে {APP_NAME}-এ রূপান্তরের প্রয়োজনীয়তা
            </h3>
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
              মেস বা ব্যাচেলর বাসায় সবচেয়ে বড় সমস্যা হলো খাতা-কলমে বা জটিল এক্সেল ফাইলে হিসাব সংরক্ষণ করা। এতে বারবার সূত্র মুছে যাওয়া, হিসাব গরমিল হওয়া, কার রুমে ভাড়া কত আর কার মিল কত তা এলোমেলো হয়ে যাওয়ার ঝুঁকি থাকে। <strong>{APP_NAME}</strong>-এ <strong>মিল হিসাব</strong> এবং <strong>বাসা ভাড়ার হিসাব</strong> দুটিকে সম্পূর্ণ আলাদা দুটি লেজারে রাখা হয়েছে, যা রিয়েলটাইমে শতভাগ নির্ভুল ফলাফল দেয়।
            </p>
          </section>

          {/* 2. Privacy & Multi-Mess Architecture */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <Lock className="w-5 h-5 text-purple-700" />
              ২. তথ্যের গোপনীয়তা ও মাল্টি-মেস (কোনো পাবলিক মেস তালিকা থাকবে না)
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                • <strong>গোপনীয়তা সুরক্ষা:</strong> কোনো মেসের ভেতরের আর্থিক তথ্য বা মেম্বারদের নাম অন্য মেসের কোনো ব্যবহারকারী দেখতে পারবে না। ওয়েবসাইটে কোনো পাবলিক ড্রপডাউন রাখা হয়নি।
              </p>
              <p>
                • <strong>লগইন ও পারসিস্টেন্ট সেশন:</strong> একবার আপনার মেস কোড দিয়ে ব্রাউজারে লগইন করলে সেশন স্বয়ংক্রিয়ভাবে সেভ থাকে। তাই পেজ রিলোড দিলে বা পরের দিন ঢুকলে আর বারবার লগইন করতে হয় না।
              </p>
              <p>
                • <strong>নতুন ডিভাইসে লগইন:</strong> নতুন ফোনে বা ল্যাপটপে ঢুকলে শুধু মেসের নাম বা মেস কোড (যেমন: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">SHANTI-101</code>) লিখলেই আপনার মেসটি চলে আসবে এবং ম্যানেজার বা মেম্বার পাসওয়ার্ড দিয়ে সহজে প্রবেশ করা যাবে।
              </p>
            </div>
          </section>

          {/* 3. Add Your Mess & Onboarding */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <Users className="w-5 h-5 text-indigo-700" />
              ৩. নতুন মেস তৈরি করার নিয়ম (Add Your Mess / শুরু করুন)
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                ১. লগইন পেজের <strong>&quot;নতুন মেস শুরু করুন&quot;</strong> ট্যাবে ক্লিক করুন।
              </p>
              <p>
                ২. মেসের নাম লিখুন (যেমন: <em>শান্তিনীড় মেস</em> বা <em>স্বপ্ননীড় মেস</em>)।
              </p>
              <p>
                ৩. একটি মেস কোড দিন (যেমন: <code className="font-mono font-bold bg-indigo-100 text-indigo-900 px-1 rounded">SHANTI-101</code>)।
              </p>
              <p>
                ৪. মেস ম্যানেজারের প্রোফাইল তৈরি করুন (নাম, মোবাইল নম্বর ও এডমিন পাসওয়ার্ড)।
              </p>
              <p>
                ৫. <strong>&quot;মেস তৈরি সম্পন্ন করুন&quot;</strong> চাপলেই আপনার নতুন মেস প্রস্তুত হয়ে যাবে এবং আপনি এডমিন প্যানেল থেকে মেম্বার যোগ করতে পারবেন।
              </p>
            </div>
          </section>

          {/* 4. Separate Accounts: Meal vs Rent */}
          <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
            <h3 className="text-base font-bold text-amber-950 flex items-center gap-2 mb-2">
              <Home className="w-5 h-5 text-amber-800" />
              ৪. খাবার ও মিল এবং বাসা ভাড়া—সম্পূর্ণ দুটি আলাদা খাতা!
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-amber-950">
              <p>
                • <strong>১. মিল হিসাব (Meal Ledger):</strong> এখানে শুধু চাল, ডাল, মাছ, মাংসের বাজার খরচ, দুপুর/রাত/গেস্ট মিল সংখ্যা এবং মিল রেটের হিসাব রাখা হয়।
              </p>
              <p>
                • <strong>২. বাসা ভাড়া হিসাব (Rent Ledger):</strong> মেসে সবার রুমের ভাড়া একই হয় না। কোনো রুমে ২ জন, কোনো রুমে ১ জন, কোনো রুম বড় হওয়ায় ভাড়া বেশি। তাই এডমিন প্রতিটি মেম্বারের জন্য যার যার নির্দিষ্ট <strong>রুম ভাড়া (Individual Room Rent)</strong> নির্ধারণ করে দেন।
              </p>
              <p>
                • <strong>কমন ইউটিলিটি বিল:</strong> ওয়াইফাই, বুয়া/খালা বিল, গ্যাস সিলিন্ডার, বিদ্যুৎ বিল ও ময়লা বিল মেসের সকল সক্রিয় সদস্যদের মাঝে সমান ভাগে বণ্টন করা হয়।
              </p>
              <p>
                • <strong>সমন্বিত ড্যাশবোর্ড (Master):</strong> চূড়ান্তভাবে মিলের পাওনা/বকেয়া এবং বাসা ভাড়ার পাওনা/বকেয়া একত্র করে সদস্যের চূড়ান্ত ব্যালেন্স নির্ধারণ করা হয়।
              </p>
            </div>
          </section>

          {/* 5. Daily Meal with Lunch, Dinner, Guest (Fractions: 0.25, 0.5) */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <Utensils className="w-5 h-5 text-emerald-700" />
              ৫. দুপুর, রাত ও গেস্ট মিল এন্ট্রি (০.২৫, ০.৫০ ভগ্নাংশ সহ)
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                • <strong>তারিখ ও বাংলা বার:</strong> প্রতিটি দিন বাংলা তারিখ ও বার (যেমন: <em>০৫ নভেম্বর ২০২৬, বৃহস্পতিবার</em>) দিয়ে সাজানো।
              </p>
              <p>
                • <strong>নির্দিষ্ট সময়ে মিল এন্ট্রি:</strong> প্রতিটি সদস্যের জন্য <span className="font-bold text-amber-700">দুপুর</span>, <span className="font-bold text-indigo-700">রাত</span> এবং <span className="font-bold text-purple-700">গেস্ট মিল</span> আলাদাভাবে লেখা যায়।
              </p>
              <p>
                • <strong>ভগ্নাংশ মিল (Fractions):</strong> অনেক সময় মেহমান আসলে বা অল্প খেলে <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">0.25</code>, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">0.5</code>, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">0.75</code> ইত্যাদি মিল দেওয়ার প্রয়োজন হয়। ম্যানেজার সরাসরি সংখ্যা টাইপ করে বা ১-ক্লিক বাটন দিয়ে তা সেট করতে পারেন।
              </p>
            </div>
          </section>

          {/* 6. Bazar & Meal Rate Formula */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
              ৬. বাজার খরচ ও লাইভ মিল রেটের গাণিতিক সূত্র (ডিফল্ট ৭০.০০ ৳)
            </h3>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-3">
              <code className="text-xs sm:text-sm font-bold font-mono text-orange-950 block">
                মিল রেট = মোট বাজার খরচ ÷ মোট মিল সংখ্যা
              </code>
              <code className="text-xs sm:text-sm font-bold font-mono text-orange-950 block mt-1">
                সদস্যের মিল খরচ = সদস্যের মোট মিল × মিল রেট
              </code>
            </div>
            <p className="text-xs text-gray-600">
              ডেমো শান্তিনীড় মেসে ১০০ মিল এবং ৭,০০০ টাকার বাজার যুক্ত রয়েছে, ফলে প্রাথমিক মিল রেট নিখুঁতভাবে <strong>৳ ৭০.০০</strong> হিসেবে তৈরি করা আছে। নতুন বাজার এন্ট্রি দেওয়ার সাথে সাথে রেট রিয়েলটাইমে আপডেট হয়।
            </p>
          </section>

          {/* 7. Deposit & Balance Settlement */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <Wallet className="w-5 h-5 text-teal-700" />
              ৭. টাকা জমা (ডিপোজিট) ও সদস্যভিত্তিক পাওনা/বকেয়া নিষ্পত্তি
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                • টাকা জমা দেওয়ার সময় ম্যানেজার নির্ধারণ করতে পারেন জমাটি কি <strong>মিলের জন্য</strong> নাকি <strong>বাসা ভাড়ার জন্য</strong>।
              </p>
              <p>
                • <strong className="text-emerald-700">পাবে (সবুজ রং):</strong> মেম্বারের খরচের চেয়ে জমা বেশি ছিল। মেস ফান্ড থেকে এই টাকা তিনি ফেরত পাবেন।
              </p>
              <p>
                • <strong className="text-rose-700">দিতে হবে (লাল রং):</strong> মেম্বারের খরচ জমার চেয়ে বেশি হয়েছে। এই বকেয়া টাকা মেস ম্যানেজারের কাছে জমা দিতে হবে।
              </p>
            </div>
          </section>

          {/* 8. Monthly Archive & Auto Reset */}
          <section>
            <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 mb-3 border-b pb-2">
              <RotateCcw className="w-5 h-5 text-blue-700" />
              ৮. মাস সমাপনী, অটো-রিসেট ও আর্কাইভ ব্যবস্থা
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                • মাস শেষে এডমিন প্যানেল থেকে <strong>&quot;নতুন মাস শুরু ও অটো-রিসেট&quot;</strong> বাটনে চাপ দিলে বর্তমান মাসের সমস্ত রেকর্ড ডাটাবেজের আর্কাইভে সংরক্ষিত হয়ে যায়।
              </p>
              <p>
                • নতুন মাসের জন্য দৈনিক মিল ও বাজার শূন্য (০) হয়ে স্বয়ংক্রিয় ফ্রেশ শুরু হয়।
              </p>
              <p>
                • ব্যালেন্স হস্তান্তর (Carry Forward) চালু রাখলে মেম্বারদের বিগত মাসের অবশিষ্ট পাওনা বা বকেয়া নতুন মাসের ওপেনিং জমা হিসেবে স্বয়ংক্রিয় যুক্ত হয়।
              </p>
            </div>
          </section>

          {/* 9. Supabase Database Configuration (Step by Step) */}
          <section className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-700">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2 mb-2">
              <Server className="w-5 h-5" />
              ৯. Supabase ডাটাবেজ কনফিগার করার নিয়ম (আপনার প্রজেক্ট: Meal Khata)
            </h3>
            <div className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              <p>
                আপনার স্ক্রিনশট অনুযায়ী প্রজেক্টের URL হলো: <code className="bg-slate-800 text-emerald-300 px-2 py-0.5 rounded font-mono">https://msimypjjdnoujqmzleco.supabase.co</code>
              </p>
              <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 space-y-2">
                <div className="font-bold text-white">ধাপ ১: SQL স্ক্রিপ্ট রান করুন</div>
                <p className="text-xs text-gray-400">
                  Supabase ড্যাশবোর্ডের বাম পাশের <strong>SQL Editor</strong>-এ যান। প্রজেক্টের রুট ডিরেক্টরিতে থাকা <code className="text-amber-300">supabase_schema.sql</code> ফাইলের কোডগুলো পেস্ট করে <strong>Run</strong> বাটনে চাপুন।
                </p>

                <div className="font-bold text-white pt-2 border-t border-slate-700">ধাপ ২: API Key সংগ্রহ করুন</div>
                <p className="text-xs text-gray-400">
                  ড্যাশবোর্ডের নিচে বামে <strong>Project Settings (কগ আইকন) &gt; API</strong>-এ যান। সেখান থেকে <code className="text-amber-300">Project URL</code> এবং <code className="text-amber-300">anon / public key</code> কপি করুন।
                </p>

                <div className="font-bold text-white pt-2 border-t border-slate-700">ধাপ ৩: এনভায়রনমেন্ট ভেরিয়েবল সেট করুন</div>
                <p className="text-xs text-gray-400">
                  প্রজেক্টে <code className="text-amber-300">.env.local</code> ফাইল তৈরি করে নিচের মতো বসান:
                </p>
                <code className="block bg-black/60 p-2.5 rounded font-mono text-[11px] text-emerald-300">
                  NEXT_PUBLIC_SUPABASE_URL=https://msimypjjdnoujqmzleco.supabase.co<br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=আপনার_anon_key_এখানে_দিন
                </code>
              </div>
              <p className="text-[11px] text-emerald-300">
                💡 <strong>ফ্রি টায়ার সুরক্ষা:</strong> আমাদের ডাটাবেজ আর্কিটেকচারটি সুপার লাইটওয়েট JSONB ডকুমেন্টেড ফরম্যাটে তৈরি, যাতে শত শত মেস তৈরি হলেও Supabase-এর ৫০০ মেগাবাইট ফ্রি স্টোরেজের ১% ও খরচ হবে না!
              </p>
            </div>
          </section>

          {/* 10. Vercel Deployment & GitHub */}
          <section className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5">
            <h3 className="text-base font-bold text-blue-950 flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-blue-700" />
              ১০. GitHub-এ আপলোড ও Vercel-এ লাইভ ডেপ্লয় করার নির্দেশিকা
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-blue-950">
              <p>
                ১. <strong>GitHub রিপোজিটরিতে পুশ:</strong> <br />
                প্রজেক্টে ইতিমধ্যে <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">.gitignore</code> তৈরি করা আছে যা আপনার গোপন পাসওয়ার্ড ও নোড মডিউল নিরাপদ রাখবে।
                <code className="block bg-white p-2 rounded border border-blue-200 font-mono text-xs mt-1 text-gray-800">
                  git init<br />
                  git add .<br />
                  git commit -m &quot;Initial Meal Khata Commit&quot;<br />
                  git branch -M main<br />
                  git remote add origin https://github.com/আপনার_ইউজারনেম/meal-khata.git<br />
                  git push -u origin main
                </code>
              </p>
              <p>
                ২. <strong>Vercel-এ ডেপ্লয়:</strong><br />
                [vercel.com](https://vercel.com)-এ গিয়ে আপনার GitHub একাউন্ট দিয়ে লগইন করুন। <strong>Add New &gt; Project</strong> নির্বাচন করে <code className="font-mono font-bold">meal-khata</code> রিপোজিটরি ইমপোর্ট করুন।
              </p>
              <p>
                ৩. <strong>Environment Variables যোগ:</strong><br />
                Vercel ডেপ্লয় পেজে <strong>Environment Variables</strong> সেকশনে গিয়ে <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> এবং <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> দিয়ে <strong>Deploy</strong> চাপুন। মাত্র ১ মিনিটের মধ্যে আপনার ওয়েবসাইট বিশ্বব্যাপী লাইভ হয়ে যাবে!
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            নির্দেশিকা প্রস্তুতকারক: <strong>{DEVELOPER_NAME}</strong>
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
