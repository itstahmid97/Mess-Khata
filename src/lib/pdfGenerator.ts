import { MessData, MessCalculations, MonthArchive } from '../types';
import { formatTaka, formatBengaliFullDate, toBengaliNumber } from './helpers';

export function printMonthlyReport(mess: MessData, calc: MessCalculations): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('পপ-আপ ব্লক করা আছে! অনুগ্রহ করে ব্রাউজারের পপ-আপ অনুমোদন করুন।');
    return;
  }

  const memberRows = calc.combinedSummaries
    .map((s, index) => {
      const isRefund = s.finalNetBalance >= 0;
      const balanceClass = isRefund ? 'color: #15803d;' : 'color: #b91c1c;';
      const balanceLabel = isRefund 
        ? `পাবে (+${formatTaka(s.finalNetBalance)})` 
        : `দিতে হবে (${formatTaka(Math.abs(s.finalNetBalance))})`;

      return `
        <tr style="border-bottom: 1px solid #e5e7eb; font-size: 13px;">
          <td style="padding: 8px 10px; text-align: center;">${toBengaliNumber(index + 1)}</td>
          <td style="padding: 8px 10px; font-weight: 600;">${s.member.name}</td>
          <td style="padding: 8px 10px; text-align: center;">${toBengaliNumber(s.mealSummary.totalMeals)}</td>
          <td style="padding: 8px 10px; text-align: right;">${formatTaka(s.mealSummary.mealCost)}</td>
          <td style="padding: 8px 10px; text-align: right;">${formatTaka(s.rentSummary.roomRent)}</td>
          <td style="padding: 8px 10px; text-align: right;">${formatTaka(s.rentSummary.utilityShare)}</td>
          <td style="padding: 8px 10px; text-align: right; font-weight: 600;">${formatTaka(s.totalCostCombined)}</td>
          <td style="padding: 8px 10px; text-align: right; color: #0f766e; font-weight: 600;">${formatTaka(s.totalDepositedCombined)}</td>
          <td style="padding: 8px 10px; text-align: right; font-weight: bold; ${balanceClass}">${balanceLabel}</td>
        </tr>
      `;
    })
    .join('');

  const bazarRows = mess.bazarEntries
    .map((b, index) => {
      const member = mess.members.find((m) => m.id === b.memberId);
      return `
        <tr style="border-bottom: 1px solid #f3f4f6; font-size: 12px;">
          <td style="padding: 6px 10px; text-align: center;">${toBengaliNumber(index + 1)}</td>
          <td style="padding: 6px 10px;">${formatBengaliFullDate(b.date)}</td>
          <td style="padding: 6px 10px; font-weight: 500;">${member?.name || 'অজানা'}</td>
          <td style="padding: 6px 10px;">${b.items}</td>
          <td style="padding: 6px 10px; text-align: right; font-weight: bold;">${formatTaka(b.amount)}</td>
        </tr>
      `;
    })
    .join('');

  const billRows = mess.fixedExpenses
    .map((f, index) => `
      <tr style="border-bottom: 1px solid #f3f4f6; font-size: 12px;">
        <td style="padding: 6px 10px; text-align: center;">${toBengaliNumber(index + 1)}</td>
        <td style="padding: 6px 10px; font-weight: 500;">${f.name}</td>
        <td style="padding: 6px 10px; text-align: right; font-weight: bold;">${formatTaka(f.amount)}</td>
      </tr>
    `)
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>${mess.name} - ${mess.currentMonthName} পূর্ণাঙ্গ হিসাব বিবরণী</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; font-family: 'Hind Siliguri', sans-serif; }
        body { padding: 24px; color: #111827; background: #fff; margin: 0; }
        .header { text-align: center; border-bottom: 2px solid #16a34a; padding-bottom: 14px; margin-bottom: 20px; }
        .title { font-size: 26px; font-weight: 700; color: #15803d; margin: 0; }
        .subtitle { font-size: 14px; color: #4b5563; margin-top: 4px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; text-align: center; background: #f9fafb; }
        .stat-label { font-size: 12px; color: #6b7280; font-weight: 500; }
        .stat-value { font-size: 18px; font-weight: 700; color: #111827; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #f3f4f6; padding: 9px 10px; font-size: 12px; font-weight: 600; text-align: left; border-bottom: 2px solid #d1d5db; }
        .section-title { font-size: 15px; font-weight: 700; color: #1f2937; margin: 18px 0 8px 0; border-left: 4px solid #16a34a; padding-left: 8px; }
        .footer { margin-top: 40px; display: flex; justify-content: space-between; padding-top: 30px; }
        .sign-box { text-align: center; border-top: 1px dashed #6b7280; width: 180px; padding-top: 6px; font-size: 13px; font-weight: 600; }
        @media print {
          body { padding: 10px; }
          .no-print { display: none; }
          @page { margin: 1.5cm; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align: right; margin-bottom: 15px;">
        <button onclick="window.print()" style="background: #16a34a; color: white; border: none; padding: 8px 18px; font-size: 14px; font-weight: bold; border-radius: 6px; cursor: pointer;">
          🖨️ PDF সেভ বা প্রিন্ট করুন
        </button>
      </div>

      <div class="header">
        <h1 class="title">${mess.name}</h1>
        <div class="subtitle">মিল ও বাসা ভাড়া হিসাব বিবরণী | <strong>${mess.currentMonthName}</strong> (মেস কোড: ${mess.code})</div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">প্রস্তুত তারিখ: ${formatBengaliFullDate(new Date().toISOString().slice(0, 10))}</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">বর্তমান মিল রেট</div>
          <div class="stat-value" style="color: #16a34a;">${formatTaka(calc.mealRate)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">মোট মিল সংখ্যা</div>
          <div class="stat-value" style="color: #2563eb;">${toBengaliNumber(calc.totalMeals)} টি</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">মোট বাজার খরচ</div>
          <div class="stat-value" style="color: #ea580c;">${formatTaka(calc.totalBazar)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">মোট বাসা ভাড়া ও বিল</div>
          <div class="stat-value" style="color: #7c3aed;">${formatTaka(calc.totalRentPayableAll)}</div>
        </div>
      </div>

      <div class="section-title">সদস্যভিত্তিক পূর্ণাঙ্গ বিবরণী (Final Statement)</div>
      <table>
        <thead>
          <tr>
            <th style="text-align: center; width: 35px;">নং</th>
            <th>সদস্যের নাম</th>
            <th style="text-align: center;">মোট মিল</th>
            <th style="text-align: right;">মিল খরচ</th>
            <th style="text-align: right;">রুম ভাড়া</th>
            <th style="text-align: right;">ইউটিলিটি</th>
            <th style="text-align: right;">সর্বমোট খরচ</th>
            <th style="text-align: right;">সর্বমোট জমা</th>
            <th style="text-align: right;">চূড়ান্ত ব্যালেন্স</th>
          </tr>
        </thead>
        <tbody>
          ${memberRows}
        </tbody>
      </table>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
        <div>
          <div class="section-title">বাজার খরচের তালিকা (${toBengaliNumber(mess.bazarEntries.length)} টি)</div>
          <table>
            <thead>
              <tr>
                <th style="text-align: center; width: 35px;">নং</th>
                <th>তারিখ</th>
                <th>বাজারকারী</th>
                <th>বিবরণ</th>
                <th style="text-align: right;">টাকা</th>
              </tr>
            </thead>
            <tbody>
              ${bazarRows || '<tr><td colspan="5" style="text-align: center; padding: 12px; color: #9ca3af;">কোনো বাজার এন্ট্রি নেই</td></tr>'}
            </tbody>
          </table>
        </div>

        <div>
          <div class="section-title">কমন ইউটিলিটি বিলসমূহ</div>
          <table>
            <thead>
              <tr>
                <th style="text-align: center; width: 35px;">নং</th>
                <th>খাত</th>
                <th style="text-align: right;">টাকা</th>
              </tr>
            </thead>
            <tbody>
              ${billRows || '<tr><td colspan="3" style="text-align: center; padding: 12px; color: #9ca3af;">কোনো বিল এন্ট্রি নেই</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <div class="footer">
        <div class="sign-box">মেস ম্যানেজার স্বাক্ষর</div>
        <div class="sign-box">বাজার ম্যানেজার স্বাক্ষর</div>
        <div class="sign-box">মেম্বার অডিট প্রতিনিধি</div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function printArchiveReport(archive: MonthArchive, messName: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('পপ-আপ ব্লক করা আছে! অনুগ্রহ করে ব্রাউজারের পপ-আপ অনুমোদন করুন।');
    return;
  }

  const memberRows = archive.membersSummary
    .map((s, index) => {
      const isRefund = s.finalNetBalance >= 0;
      const balanceClass = isRefund ? 'color: #15803d;' : 'color: #b91c1c;';
      const balanceLabel = isRefund 
        ? `পাবে (+${formatTaka(s.finalNetBalance)})` 
        : `দিতে হবে (${formatTaka(Math.abs(s.finalNetBalance))})`;

      return `
        <tr style="border-bottom: 1px solid #e5e7eb; font-size: 13px;">
          <td style="padding: 8px 12px; text-align: center;">${toBengaliNumber(index + 1)}</td>
          <td style="padding: 8px 12px; font-weight: 600;">${s.memberName}</td>
          <td style="padding: 8px 12px; text-align: center;">${toBengaliNumber(s.totalMeals)}</td>
          <td style="padding: 8px 12px; text-align: right;">${formatTaka(s.mealCost)}</td>
          <td style="padding: 8px 12px; text-align: right;">${formatTaka(s.roomRent || 0)}</td>
          <td style="padding: 8px 12px; text-align: right;">${formatTaka(s.utilityShare || 0)}</td>
          <td style="padding: 8px 12px; text-align: right; font-weight: 600;">${formatTaka(s.mealCost + (s.totalRentPayable || 0))}</td>
          <td style="padding: 8px 12px; text-align: right; color: #0284c7; font-weight: 600;">${formatTaka(s.mealDeposited + (s.rentDeposited || 0))}</td>
          <td style="padding: 8px 12px; text-align: right; font-weight: bold; ${balanceClass}">${balanceLabel}</td>
        </tr>
      `;
    })
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>${messName} - ${archive.monthNameBengali} (আর্কাইভ)</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; font-family: 'Hind Siliguri', sans-serif; }
        body { padding: 24px; color: #111827; background: #fff; margin: 0; }
        .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 14px; margin-bottom: 20px; }
        .title { font-size: 26px; font-weight: 700; color: #1d4ed8; margin: 0; }
        .subtitle { font-size: 14px; color: #4b5563; margin-top: 4px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; text-align: center; background: #f9fafb; }
        .stat-label { font-size: 12px; color: #6b7280; font-weight: 500; }
        .stat-value { font-size: 18px; font-weight: 700; color: #111827; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #f3f4f6; padding: 9px 12px; font-size: 12px; font-weight: 600; text-align: left; border-bottom: 2px solid #d1d5db; }
        .section-title { font-size: 15px; font-weight: 700; color: #1f2937; margin: 18px 0 8px 0; border-left: 4px solid #3b82f6; padding-left: 8px; }
        .footer { margin-top: 40px; display: flex; justify-content: space-between; padding-top: 30px; }
        .sign-box { text-align: center; border-top: 1px dashed #6b7280; width: 180px; padding-top: 6px; font-size: 13px; font-weight: 600; }
        @media print {
          body { padding: 10px; }
          .no-print { display: none; }
          @page { margin: 1.5cm; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align: right; margin-bottom: 15px;">
        <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 8px 18px; font-size: 14px; font-weight: bold; border-radius: 6px; cursor: pointer;">
          🖨️ PDF সেভ বা প্রিন্ট করুন
        </button>
      </div>

      <div class="header">
        <h1 class="title">${messName}</h1>
        <div class="subtitle">আর্কাইভ হিসাব বিবরণী | <strong>${archive.monthNameBengali}</strong></div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">মাস বন্ধ করা হয়েছে: ${formatBengaliFullDate(archive.closedAt.slice(0, 10))}</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">মোট বাজার খরচ</div>
          <div class="stat-value" style="color: #ea580c;">${formatTaka(archive.totalBazar)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">মোট মিল</div>
          <div class="stat-value" style="color: #2563eb;">${toBengaliNumber(archive.totalMeals)} টি</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">চূড়ান্ত মিল রেট</div>
          <div class="stat-value" style="color: #16a34a;">${formatTaka(archive.mealRate)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">মোট ভাড়া ও ইউটিলিটি</div>
          <div class="stat-value" style="color: #7c3aed;">${formatTaka(archive.totalFixedBills + (archive.totalRoomRent || 0))}</div>
        </div>
      </div>

      <div class="section-title">সদস্যভিত্তিক সমাপনী হিসাব</div>
      <table>
        <thead>
          <tr>
            <th style="text-align: center; width: 40px;">নং</th>
            <th>সদস্যের নাম</th>
            <th style="text-align: center;">মোট মিল</th>
            <th style="text-align: right;">মিল খরচ</th>
            <th style="text-align: right;">রুম ভাড়া</th>
            <th style="text-align: right;">ইউটিলিটি</th>
            <th style="text-align: right;">মোট খরচ</th>
            <th style="text-align: right;">জমা</th>
            <th style="text-align: right;">চূড়ান্ত ব্যালেন্স</th>
          </tr>
        </thead>
        <tbody>
          ${memberRows}
        </tbody>
      </table>

      <div class="footer">
        <div class="sign-box">মেস ম্যানেজার স্বাক্ষর</div>
        <div class="sign-box">বাজার ম্যানেজার স্বাক্ষর</div>
        <div class="sign-box">মেম্বার অডিট প্রতিনিধি</div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
