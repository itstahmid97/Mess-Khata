import { MessData, MessCalculations, MonthArchive } from '../types';
import { formatTaka, formatBengaliFullDate, toBengaliNumber } from './helpers';

/**
 * ১. সম্পূর্ণ পৃথক মেসের মিল ও বাজার হিসাব PDF রিপোর্ট
 * (এখানে বাসা ভাড়া বা ইউটিলিটি বিলের কোনো হিসাব মেশানো হবে না)
 */
export function printMealReport(mess: MessData, calc: MessCalculations): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('পপ-আপ ব্লক করা আছে! অনুগ্রহ করে ব্রাউজারের পপ-আপ অনুমোদন করুন।');
    return;
  }

  const memberRows = calc.memberMealSummaries
    .map((s, index) => {
      const isRefund = s.mealBalance >= 0;
      const balanceClass = isRefund ? 'color: #15803d;' : 'color: #b91c1c;';
      const balanceLabel = isRefund 
        ? `পাবে (+${formatTaka(s.mealBalance)})` 
        : `দিতে হবে (${formatTaka(Math.abs(s.mealBalance))})`;

      return `
        <tr style="border-bottom: 1px solid #e5e7eb; font-size: 13px;">
          <td style="padding: 9px 10px; text-align: center;">${toBengaliNumber(index + 1)}</td>
          <td style="padding: 9px 10px; font-weight: 600;">
            ${s.member.name}
            ${s.member.role === 'manager' ? '<span style="font-size: 10px; background: #f3e8ff; color: #6b21a8; padding: 1px 5px; border-radius: 4px; margin-left: 4px;">ম্যানেজার</span>' : ''}
          </td>
          <td style="padding: 9px 10px; text-align: center;">${toBengaliNumber(s.totalLunch)}</td>
          <td style="padding: 9px 10px; text-align: center;">${toBengaliNumber(s.totalDinner)}</td>
          <td style="padding: 9px 10px; text-align: center; color: #b45309;">${s.totalGuest > 0 ? toBengaliNumber(s.totalGuest) : '-'}</td>
          <td style="padding: 9px 10px; text-align: center; font-weight: bold; background: #ecfdf5; color: #065f46;">${toBengaliNumber(s.totalMeals)}</td>
          <td style="padding: 9px 10px; text-align: right; font-weight: 600;">${formatTaka(s.mealCost)}</td>
          <td style="padding: 9px 10px; text-align: right; color: #0f766e; font-weight: 600;">${formatTaka(s.mealDeposited)}</td>
          <td style="padding: 9px 10px; text-align: right; font-weight: bold; ${balanceClass}">${balanceLabel}</td>
        </tr>
      `;
    })
    .join('');

  const bazarRows = mess.bazarEntries
    .map((b, index) => {
      const member = mess.members.find((m) => m.id === b.memberId);
      return `
        <tr style="border-bottom: 1px solid #f3f4f6; font-size: 12px;">
          <td style="padding: 7px 10px; text-align: center;">${toBengaliNumber(index + 1)}</td>
          <td style="padding: 7px 10px;">${formatBengaliFullDate(b.date)}</td>
          <td style="padding: 7px 10px; font-weight: 600;">${member?.name || 'অজানা'}</td>
          <td style="padding: 7px 10px;">${b.items}</td>
          <td style="padding: 7px 10px; text-align: right; font-weight: bold; color: #c2410c;">${formatTaka(b.amount)}</td>
        </tr>
      `;
    })
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>${mess.name} - ${mess.currentMonthName} মিল ও বাজার হিসাব রিপোর্ট</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; font-family: 'Hind Siliguri', sans-serif; }
        body { padding: 28px; color: #111827; background: #fff; margin: 0; }
        .header { text-align: center; border-bottom: 3px solid #10b981; padding-bottom: 14px; margin-bottom: 22px; }
        .title { font-size: 26px; font-weight: 700; color: #065f46; margin: 0; }
        .subtitle { font-size: 14px; color: #4b5563; margin-top: 4px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; text-align: center; background: #f9fafb; }
        .stat-card.highlight { background: #ecfdf5; border-color: #a7f3d0; }
        .stat-label { font-size: 12px; color: #4b5563; font-weight: 600; }
        .stat-value { font-size: 20px; font-weight: 800; color: #111827; margin-top: 4px; }
        .stat-value.green { color: #059669; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 26px; }
        th { background: #f3f4f6; padding: 9px 10px; font-size: 12px; font-weight: 700; text-align: left; border-bottom: 2px solid #d1d5db; color: #374151; }
        .section-title { font-size: 15px; font-weight: 700; color: #1f2937; margin: 24px 0 10px 0; border-left: 4px solid #10b981; padding-left: 10px; }
        .footer { margin-top: 45px; display: flex; justify-content: space-between; padding-top: 30px; }
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
        <button onclick="window.print()" style="background: #059669; color: white; border: none; padding: 9px 20px; font-size: 14px; font-weight: bold; border-radius: 8px; cursor: pointer;">
          🖨️ মিল হিসাব রিপোর্ট প্রিন্ট / PDF সংরক্ষণ
        </button>
      </div>

      <div class="header">
        <h1 class="title">${mess.name}</h1>
        <div class="subtitle">মাসিক মিল ও বাজার খরচ হিসাব বিবরণী | <strong>${mess.currentMonthName}</strong> (মেস কোড: ${mess.code})</div>
        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">প্রস্তুত তারিখ: ${formatBengaliFullDate(new Date().toISOString().slice(0, 10))} • পৃথক মিল খাতা</div>
      </div>

      <!-- Meal Summary Cards -->
      <div class="stats-grid">
        <div class="stat-card highlight">
          <div class="stat-label">বর্তমান মিল রেট</div>
          <div class="stat-value green">${formatTaka(calc.mealRate)}</div>
          <div style="font-size: 10px; color: #047857; margin-top: 2px;">মোট বাজার ÷ মোট মিল</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">মোট বাজার খরচ</div>
          <div class="stat-value">${formatTaka(calc.totalBazar)}</div>
          <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">${toBengaliNumber(mess.bazarEntries.length)} টি এন্ট্রি</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">মেসের মোট মিল</div>
          <div class="stat-value">${toBengaliNumber(calc.totalMeals)} টি</div>
          <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">দুপুর: ${toBengaliNumber(calc.totalLunch)} | রাত: ${toBengaliNumber(calc.totalDinner)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">মিল বাবদ মোট জমা</div>
          <div class="stat-value" style="color: #0f766e;">${formatTaka(calc.totalMealDeposits)}</div>
          <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">ফান্ড উদ্বৃত্ত: ${formatTaka(calc.totalMealDeposits - calc.totalBazar)}</div>
        </div>
      </div>

      <!-- Meal Table -->
      <div class="section-title">সদস্যদের মিল, খরচ ও ব্যালেন্স বিবরণী (সম্পূর্ণ পৃথক মিল হিসাব)</div>
      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">নং</th>
            <th>সদস্যের নাম</th>
            <th style="text-align: center;">দুপুর</th>
            <th style="text-align: center;">রাত</th>
            <th style="text-align: center;">গেস্ট</th>
            <th style="text-align: center;">মোট মিল</th>
            <th style="text-align: right;">মিল খরচ (${formatTaka(calc.mealRate)})</th>
            <th style="text-align: right;">মিলের জমা</th>
            <th style="text-align: right;">মিল ব্যালেন্স</th>
          </tr>
        </thead>
        <tbody>
          ${memberRows}
        </tbody>
        <tfoot>
          <tr style="background: #f9fafb; font-weight: bold; border-top: 2px solid #d1d5db;">
            <td colspan="2" style="padding: 10px; text-align: center;">সর্বমোট</td>
            <td style="padding: 10px; text-align: center;">${toBengaliNumber(calc.totalLunch)}</td>
            <td style="padding: 10px; text-align: center;">${toBengaliNumber(calc.totalDinner)}</td>
            <td style="padding: 10px; text-align: center;">${toBengaliNumber(calc.totalGuest)}</td>
            <td style="padding: 10px; text-align: center; color: #065f46;">${toBengaliNumber(calc.totalMeals)} টি</td>
            <td style="padding: 10px; text-align: right;">${formatTaka(calc.totalBazar)}</td>
            <td style="padding: 10px; text-align: right; color: #0f766e;">${formatTaka(calc.totalMealDeposits)}</td>
            <td style="padding: 10px; text-align: right;">
              <span style="color: #15803d;">ফেরত: +${formatTaka(calc.mealRefund)}</span><br>
              <span style="color: #b91c1c;">বকেয়া: -${formatTaka(calc.mealDue)}</span>
            </td>
          </tr>
        </tfoot>
      </table>

      <!-- Bazar List -->
      <div class="section-title">চলতি মাসের বাজার খরচের বিবরণী</div>
      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">নং</th>
            <th style="width: 120px;">তারিখ</th>
            <th style="width: 140px;">বাজারকারী</th>
            <th>বাজারের বিস্তারিত ফর্দ / পণ্য</th>
            <th style="text-align: right; width: 120px;">খরচ</th>
          </tr>
        </thead>
        <tbody>
          ${bazarRows.length > 0 ? bazarRows : '<tr><td colspan="5" style="text-align: center; padding: 15px; color: #6b7280;">কোনো বাজার এন্ট্রি নেই</td></tr>'}
        </tbody>
      </table>

      <!-- Footer Signatures -->
      <div class="footer">
        <div class="sign-box">মিল ম্যানেজারের স্বাক্ষর</div>
        <div class="sign-box">বাজারকারীর স্বাক্ষর</div>
        <div class="sign-box">মেম্বার অডিটরের স্বাক্ষর</div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * ২. সম্পূর্ণ পৃথক বাসা ভাড়া ও ইউটিলিটি বিল PDF রিপোর্ট
 * (এখানে খাবারের বা মিলের কোনো হিসাব মেশানো হবে না)
 */
export function printRentReport(mess: MessData, calc: MessCalculations): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('পপ-আপ ব্লক করা আছে! অনুগ্রহ করে ব্রাউজারের পপ-আপ অনুমোদন করুন।');
    return;
  }

  const activeMembersCount = mess.members.filter((m) => m.active).length || 1;
  const perMemberUtility = calc.totalSharedUtilities / activeMembersCount;

  const memberRows = calc.memberRentSummaries
    .map((s, index) => {
      const isPaid = s.rentBalance >= 0;
      const balanceClass = isPaid ? 'color: #15803d;' : 'color: #b91c1c;';
      const balanceLabel = s.rentBalance === 0
        ? '<span style="color: #15803d;">পরিশোধিত</span>'
        : isPaid 
        ? `অগ্রিম (+${formatTaka(s.rentBalance)})` 
        : `বকেয়া (${formatTaka(Math.abs(s.rentBalance))})`;

      return `
        <tr style="border-bottom: 1px solid #e5e7eb; font-size: 13px;">
          <td style="padding: 9px 10px; text-align: center;">${toBengaliNumber(index + 1)}</td>
          <td style="padding: 9px 10px; font-weight: 600;">${s.member.name}</td>
          <td style="padding: 9px 10px; text-align: right; font-weight: 600;">${formatTaka(s.roomRent)}</td>
          <td style="padding: 9px 10px; text-align: right;">${formatTaka(s.utilityShare)}</td>
          <td style="padding: 9px 10px; text-align: right; font-weight: bold; background: #eef2ff; color: #3730a3;">${formatTaka(s.totalRentCost)}</td>
          <td style="padding: 9px 10px; text-align: right; color: #0f766e; font-weight: 600;">${formatTaka(s.rentDeposited)}</td>
          <td style="padding: 9px 10px; text-align: right; font-weight: bold; ${balanceClass}">${balanceLabel}</td>
        </tr>
      `;
    })
    .join('');

  const billRows = mess.fixedExpenses
    .map((f, index) => `
      <tr style="border-bottom: 1px solid #f3f4f6; font-size: 12px;">
        <td style="padding: 7px 10px; text-align: center;">${toBengaliNumber(index + 1)}</td>
        <td style="padding: 7px 10px; font-weight: 600;">${f.name}</td>
        <td style="padding: 7px 10px; text-align: center;">সমান বণ্টন (${toBengaliNumber(activeMembersCount)} জন)</td>
        <td style="padding: 7px 10px; text-align: right; font-weight: bold;">${formatTaka(f.amount)}</td>
        <td style="padding: 7px 10px; text-align: right; color: #4338ca;">${formatTaka(f.amount / activeMembersCount)}</td>
      </tr>
    `)
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>${mess.name} - ${mess.currentMonthName} বাসা ভাড়া ও ইউটিলিটি বিল রিপোর্ট</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; font-family: 'Hind Siliguri', sans-serif; }
        body { padding: 28px; color: #111827; background: #fff; margin: 0; }
        .header { text-align: center; border-bottom: 3px solid #4338ca; padding-bottom: 14px; margin-bottom: 22px; }
        .title { font-size: 26px; font-weight: 700; color: #312e81; margin: 0; }
        .subtitle { font-size: 14px; color: #4b5563; margin-top: 4px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; text-align: center; background: #f9fafb; }
        .stat-card.highlight { background: #eef2ff; border-color: #c7d2fe; }
        .stat-label { font-size: 12px; color: #4b5563; font-weight: 600; }
        .stat-value { font-size: 20px; font-weight: 800; color: #111827; margin-top: 4px; }
        .stat-value.indigo { color: #4338ca; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 26px; }
        th { background: #f3f4f6; padding: 9px 10px; font-size: 12px; font-weight: 700; text-align: left; border-bottom: 2px solid #d1d5db; color: #374151; }
        .section-title { font-size: 15px; font-weight: 700; color: #1f2937; margin: 24px 0 10px 0; border-left: 4px solid #4338ca; padding-left: 10px; }
        .footer { margin-top: 45px; display: flex; justify-content: space-between; padding-top: 30px; }
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
        <button onclick="window.print()" style="background: #4338ca; color: white; border: none; padding: 9px 20px; font-size: 14px; font-weight: bold; border-radius: 8px; cursor: pointer;">
          🖨️ বাসা ভাড়া ও বিল রিপোর্ট প্রিন্ট / PDF সংরক্ষণ
        </button>
      </div>

      <div class="header">
        <h1 class="title">${mess.name}</h1>
        <div class="subtitle">মাসিক বাসা ভাড়া ও ইউটিলিটি বিল বিবরণী | <strong>${mess.currentMonthName}</strong> (মেস কোড: ${mess.code})</div>
        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">প্রস্তুত তারিখ: ${formatBengaliFullDate(new Date().toISOString().slice(0, 10))} • পৃথক ভাড়া ও বিল খাতা</div>
      </div>

      <!-- Rent Summary Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">মোট রুম ভাড়া</div>
          <div class="stat-value">${formatTaka(calc.totalRoomRent)}</div>
          <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">রুম অনুযায়ী ভিন্ন ভাড়া</div>
        </div>
        <div class="stat-card highlight">
          <div class="stat-label">মোট ইউটিলিটি বিল</div>
          <div class="stat-value indigo">${formatTaka(calc.totalSharedUtilities)}</div>
          <div style="font-size: 10px; color: #4338ca; margin-top: 2px;">ওয়াইফাই, বুয়া, গ্যাস, কারেন্ট, ময়লা</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">মাথাপিছু ইউটিলিটি শেয়ার</div>
          <div class="stat-value" style="color: #0369a1;">${formatTaka(perMemberUtility)}</div>
          <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">${toBengaliNumber(activeMembersCount)} জনের মাঝে সমান বণ্টন</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">ভাড়া বাবদ মোট জমা</div>
          <div class="stat-value" style="color: #0f766e;">${formatTaka(calc.totalRentDeposits)}</div>
          <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">বকেয়া: ${formatTaka(calc.rentDue)}</div>
        </div>
      </div>

      <!-- Rent Table -->
      <div class="section-title">সদস্যদের রুম ভাড়া ও ইউটিলিটি বিল তালিকা (সম্পূর্ণ পৃথক বাসা ভাড়া হিসাব)</div>
      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">নং</th>
            <th>সদস্যের নাম</th>
            <th style="text-align: right;">রুম ভাড়া</th>
            <th style="text-align: right;">ইউটিলিটি শেয়ার</th>
            <th style="text-align: right;">মোট বাসা প্রদেয়</th>
            <th style="text-align: right;">ভাড়া জমা</th>
            <th style="text-align: right;">ভাড়ার স্থিতি</th>
          </tr>
        </thead>
        <tbody>
          ${memberRows}
        </tbody>
        <tfoot>
          <tr style="background: #f9fafb; font-weight: bold; border-top: 2px solid #d1d5db;">
            <td colspan="2" style="padding: 10px; text-align: center;">সর্বমোট</td>
            <td style="padding: 10px; text-align: right;">${formatTaka(calc.totalRoomRent)}</td>
            <td style="padding: 10px; text-align: right;">${formatTaka(calc.totalSharedUtilities)}</td>
            <td style="padding: 10px; text-align: right; color: #3730a3;">${formatTaka(calc.totalRentPayableAll)}</td>
            <td style="padding: 10px; text-align: right; color: #0f766e;">${formatTaka(calc.totalRentDeposits)}</td>
            <td style="padding: 10px; text-align: right;">
              <span style="color: #b91c1c;">মোট বকেয়া: -${formatTaka(calc.rentDue)}</span>
            </td>
          </tr>
        </tfoot>
      </table>

      <!-- Utilities List -->
      <div class="section-title">মেসের কমন ইউটিলিটি বিলের বিস্তারিত বিভাজন</div>
      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">নং</th>
            <th>ইউটিলিটি খাতের নাম</th>
            <th style="text-align: center;">বণ্টন পদ্ধতি</th>
            <th style="text-align: right; width: 140px;">মোট বিল</th>
            <th style="text-align: right; width: 140px;">জনপ্রতি অংশ</th>
          </tr>
        </thead>
        <tbody>
          ${billRows.length > 0 ? billRows : '<tr><td colspan="5" style="text-align: center; padding: 15px; color: #6b7280;">কোনো ইউটিলিটি বিল নেই</td></tr>'}
        </tbody>
      </table>

      <!-- Footer Signatures -->
      <div class="footer">
        <div class="sign-box">বাসা ম্যানেজারের স্বাক্ষর</div>
        <div class="sign-box">মালিক/কেয়ারটেকারের স্বাক্ষর</div>
        <div class="sign-box">মেম্বার প্রতিনিধির স্বাক্ষর</div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * ৩. মেম্বারের একক ব্যক্তিগত স্লিপ (মিল অথবা বাসা ভাড়া)
 */
export function printMemberSlip(
  mess: MessData, 
  memberId: string, 
  calc: MessCalculations, 
  type: 'meal' | 'rent'
): void {
  const member = mess.members.find((m) => m.id === memberId);
  const mealSummary = calc.memberMealSummaries.find((s) => s.member.id === memberId);
  const rentSummary = calc.memberRentSummaries.find((s) => s.member.id === memberId);

  if (!member || !mealSummary || !rentSummary) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const isMeal = type === 'meal';
  const title = isMeal ? 'ব্যক্তিগত মিল হিসাব স্লিপ' : 'ব্যক্তিগত বাসা ভাড়া ও বিল স্লিপ';
  const themeColor = isMeal ? '#059669' : '#4338ca';

  let bodyContent = '';
  if (isMeal) {
    const isRefund = mealSummary.mealBalance >= 0;
    bodyContent = `
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-size: 13px; color: #166534; font-weight: bold;">মিল হিসাব সারসংক্ষেপ:</div>
        <table style="width: 100%; margin-top: 10px; font-size: 13px;">
          <tr><td>মোট মিল:</td><td style="text-align: right; font-weight: bold;">${toBengaliNumber(mealSummary.totalMeals)} টি (দুপুর: ${toBengaliNumber(mealSummary.totalLunch)}, রাত: ${toBengaliNumber(mealSummary.totalDinner)}, গেস্ট: ${toBengaliNumber(mealSummary.totalGuest)})</td></tr>
          <tr><td>মিল রেট:</td><td style="text-align: right; font-weight: bold;">${formatTaka(calc.mealRate)}</td></tr>
          <tr><td>মোট মিল খরচ:</td><td style="text-align: right; font-weight: bold;">${formatTaka(mealSummary.mealCost)}</td></tr>
          <tr><td>মিল বাবদ মোট জমা:</td><td style="text-align: right; font-weight: bold; color: #047857;">${formatTaka(mealSummary.mealDeposited)}</td></tr>
          <tr style="border-top: 1px solid #86efac; font-size: 14px;">
            <td style="padding-top: 6px; font-weight: bold;">মিলের স্থিতি:</td>
            <td style="padding-top: 6px; text-align: right; font-weight: bold; color: ${isRefund ? '#15803d' : '#b91c1c'};">
              ${isRefund ? `পাবে +${formatTaka(mealSummary.mealBalance)}` : `বকেয়া দিতে হবে -${formatTaka(Math.abs(mealSummary.mealBalance))}`}
            </td>
          </tr>
        </table>
      </div>
    `;
  } else {
    const isPaid = rentSummary.rentBalance >= 0;
    bodyContent = `
      <div style="background: #eef2ff; border: 1px solid #c7d2fe; padding: 14px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-size: 13px; color: #3730a3; font-weight: bold;">বাসা ভাড়া ও ইউটিলিটি বিল সারসংক্ষেপ:</div>
        <table style="width: 100%; margin-top: 10px; font-size: 13px;">
          <tr><td>নির্ধারিত রুম ভাড়া:</td><td style="text-align: right; font-weight: bold;">${formatTaka(rentSummary.roomRent)}</td></tr>
          <tr><td>ইউটিলিটি বিল শেয়ার (ওয়াইফাই, খালা, কারেন্ট ইত্যাদি):</td><td style="text-align: right; font-weight: bold;">${formatTaka(rentSummary.utilityShare)}</td></tr>
          <tr><td>মোট বাসা প্রদেয়:</td><td style="text-align: right; font-weight: bold;">${formatTaka(rentSummary.totalRentCost)}</td></tr>
          <tr><td>ভাড়া বাবদ মোট জমা:</td><td style="text-align: right; font-weight: bold; color: #047857;">${formatTaka(rentSummary.rentDeposited)}</td></tr>
          <tr style="border-top: 1px solid #a5b4fc; font-size: 14px;">
            <td style="padding-top: 6px; font-weight: bold;">ভাড়ার স্থিতি:</td>
            <td style="padding-top: 6px; text-align: right; font-weight: bold; color: ${isPaid ? '#15803d' : '#b91c1c'};">
              ${rentSummary.rentBalance === 0 ? 'সম্পূর্ণ পরিশোধিত' : isPaid ? `অগ্রিম জমা +${formatTaka(rentSummary.rentBalance)}` : `বকেয়া -${formatTaka(Math.abs(rentSummary.rentBalance))}`}
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>${member.name} - ${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; font-family: 'Hind Siliguri', sans-serif; }
        body { padding: 30px; max-width: 600px; margin: 0 auto; color: #111827; }
        .header { text-align: center; border-bottom: 2px solid ${themeColor}; padding-bottom: 12px; margin-bottom: 18px; }
        .title { font-size: 22px; font-weight: bold; color: ${themeColor}; margin: 0; }
        .subtitle { font-size: 13px; color: #6b7280; margin-top: 4px; }
        .member-info { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 13px; background: #f9fafb; padding: 10px 14px; border-radius: 8px; border: 1px solid #e5e7eb; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align: right; margin-bottom: 15px;">
        <button onclick="window.print()" style="background: ${themeColor}; color: white; border: none; padding: 7px 16px; font-size: 13px; font-weight: bold; border-radius: 6px; cursor: pointer;">
          🖨️ প্রিন্ট স্লিপ
        </button>
      </div>

      <div class="header">
        <h1 class="title">${mess.name}</h1>
        <div class="subtitle">${title} | ${mess.currentMonthName}</div>
      </div>

      <div class="member-info">
        <div><strong>সদস্য:</strong> ${member.name} (@${member.username})</div>
        <div><strong>মেস কোড:</strong> ${mess.code}</div>
      </div>

      ${bodyContent}

      <div style="margin-top: 35px; display: flex; justify-content: space-between;">
        <div style="text-align: center; width: 140px; border-top: 1px dashed #6b7280; font-size: 12px; padding-top: 4px;">ম্যানেজারের স্বাক্ষর</div>
        <div style="text-align: center; width: 140px; border-top: 1px dashed #6b7280; font-size: 12px; padding-top: 4px;">সদস্যের স্বাক্ষর</div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/** Legacy alias for backwards compatibility */
export const printMonthlyReport = printMealReport;


/**
 * ৪. আর্কাইভ মাসের পিডিএফ রিপোর্ট
 */
export function printArchiveReport(archive: MonthArchive, messName: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const rows = (archive.membersSummary || []).map((m, idx) => `
    <tr style="border-bottom: 1px solid #e5e7eb; font-size: 13px;">
      <td style="padding: 8px 10px; text-align: center;">${toBengaliNumber(idx + 1)}</td>
      <td style="padding: 8px 10px; font-weight: 600;">${m.memberName}</td>
      <td style="padding: 8px 10px; text-align: center;">${toBengaliNumber(m.totalMeals)}</td>
      <td style="padding: 8px 10px; text-align: right;">${formatTaka(m.mealCost)}</td>
      <td style="padding: 8px 10px; text-align: right; color: #047857;">${formatTaka(m.mealDeposited)}</td>
      <td style="padding: 8px 10px; text-align: right; font-weight: bold; color: ${m.mealBalance >= 0 ? '#15803d' : '#b91c1c'};">
        ${m.mealBalance >= 0 ? `+${formatTaka(m.mealBalance)} (পাবে)` : `-${formatTaka(Math.abs(m.mealBalance))} (দেবে)`}
      </td>
      <td style="padding: 8px 10px; text-align: right;">${formatTaka(m.roomRent)}</td>
      <td style="padding: 8px 10px; text-align: right;">${formatTaka(m.utilityShare)}</td>
      <td style="padding: 8px 10px; text-align: right; color: #047857;">${formatTaka(m.rentDeposited)}</td>
      <td style="padding: 8px 10px; text-align: right; font-weight: bold; color: ${m.rentBalance >= 0 ? '#15803d' : '#b91c1c'};">
        ${m.rentBalance === 0 ? 'পরিশোধিত' : m.rentBalance > 0 ? `+${formatTaka(m.rentBalance)}` : `-${formatTaka(Math.abs(m.rentBalance))}`}
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>${messName} - ${archive.monthNameBengali} আর্কাইভ রেকর্ড</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; font-family: 'Hind Siliguri', sans-serif; }
        body { padding: 24px; color: #111827; background: #fff; margin: 0; }
        .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; color: #1e40af; margin: 0; }
        .subtitle { font-size: 13px; color: #4b5563; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #f3f4f6; padding: 8px 10px; font-size: 12px; font-weight: 700; text-align: left; border-bottom: 2px solid #cbd5e1; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align: right; margin-bottom: 15px;">
        <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 8px 18px; font-size: 13px; font-weight: bold; border-radius: 6px; cursor: pointer;">
          🖨️ আর্কাইভ রিপোর্ট প্রিন্ট
        </button>
      </div>
      <div class="header">
        <h1 class="title">${messName}</h1>
        <div class="subtitle">আর্কাইভ হিসাব রিপোর্ট | ${archive.monthNameBengali} (মিল রেট: ${formatTaka(archive.mealRate)})</div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 35px; text-align: center;">নং</th>
            <th>সদস্য</th>
            <th style="text-align: center;">মিল</th>
            <th style="text-align: right;">মিল খরচ</th>
            <th style="text-align: right;">মিলের জমা</th>
            <th style="text-align: right;">মিলের স্থিতি</th>
            <th style="text-align: right;">রুম ভাড়া</th>
            <th style="text-align: right;">ইউটিলিটি</th>
            <th style="text-align: right;">ভাড়ার জমা</th>
            <th style="text-align: right;">ভাড়ার স্থিতি</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
