import type { Metadata } from 'next';
import './globals.css';
import { APP_NAME, APP_TAGLINE } from '../lib/constants';

export const metadata: Metadata = {
  title: `${APP_NAME} - ${APP_TAGLINE}`,
  description: 'মেসের মিল হিসাব, বাজার খরচ, বাসা ভাড়া ও সদস্যদের চূড়ান্ত পাওনা-বকেয়া হিসাবের ডিজিটাল প্ল্যাটফর্ম। এক্সেল শিটের সহজ ও আধুনিক বিকল্প।',
  keywords: 'মেস খাতা, মিল হিসাব, mess manager, meal management system, mess khata bangladesh, bazar hisab',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="antialiased selection:bg-emerald-200 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
