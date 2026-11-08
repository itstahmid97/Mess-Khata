import { MessData, UserSession } from '../types';
import { INITIAL_DEMO_MESS, DEFAULT_SHARED_UTILITIES, DEFAULT_ADMIN_PASSWORD } from './constants';
import { getCurrentMonthKey, getCurrentMonthNameBengali, generateId } from './helpers';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY_MESSES = 'mess_khata_all_messes_v2';
const STORAGE_KEY_SESSION = 'mess_khata_current_session_v2';
const STORAGE_KEY_BACKUP = 'mess_khata_crash_backup_snapshot_v2';

export function getStoredMesses(): MessData[] {
  if (typeof window === 'undefined') return [INITIAL_DEMO_MESS];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_MESSES, JSON.stringify([INITIAL_DEMO_MESS]));
      saveCrashBackup([INITIAL_DEMO_MESS]);
      return [INITIAL_DEMO_MESS];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [INITIAL_DEMO_MESS];
  } catch (err) {
    console.error('Failed to read from localStorage:', err);
    return [INITIAL_DEMO_MESS];
  }
}

// User Session Management (Persistent Login)
export function getStoredSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(session: UserSession | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    }
  } catch (err) {
    console.error('Failed to save session:', err);
  }
}

// Secure Lookup: Find mess by Code or Name (case-insensitive)
export async function findMessByCodeOrName(query: string): Promise<MessData | null> {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  // 1. Check local storage first
  const allLocal = getStoredMesses();
  const localFound = allLocal.find(
    (m) => m.code.toLowerCase() === clean || m.name.toLowerCase() === clean
  );
  if (localFound) return localFound;

  // 2. If Supabase configured, query Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('messes')
        .select('*')
        .or(`code.ilike.${clean},name.ilike.${clean}`)
        .single();

      if (data && !error) {
        // save to local and return
        const fullMess = mapSupabaseToMess(data);
        saveMess(fullMess);
        return fullMess;
      }
    } catch (err) {
      console.warn('Supabase lookup error:', err);
    }
  }

  return null;
}

export function saveMess(mess: MessData): void {
  if (typeof window === 'undefined') return;
  try {
    const all = getStoredMesses();
    const updated = { ...mess, updatedAt: new Date().toISOString() };
    const index = all.findIndex((m) => m.id === mess.id);

    let nextMesses: MessData[];
    if (index >= 0) {
      nextMesses = [...all];
      nextMesses[index] = updated;
    } else {
      nextMesses = [...all, updated];
    }

    localStorage.setItem(STORAGE_KEY_MESSES, JSON.stringify(nextMesses));
    saveCrashBackup(nextMesses);

    // Sync to Supabase in background
    if (isSupabaseConfigured && supabase) {
      syncToSupabase(updated).catch((err) =>
        console.warn('Supabase sync skipped/notice:', err)
      );
    }
  } catch (err) {
    console.error('Failed to save mess to localStorage:', err);
  }
}

export function createNewMess(
  name: string, 
  code: string, 
  adminPassword?: string,
  managerName?: string,
  managerPhone?: string
): MessData {
  const newId = generateId('mess');
  const cleanCode = code && code.trim().length > 0
    ? code.trim().toUpperCase()
    : `MESS-${Math.floor(1000 + Math.random() * 9000)}`;

  const managerUser = managerName
    ? managerName.trim().toLowerCase().split(' ')[0]
    : 'manager';

  const defaultManager = {
    id: generateId('mem_mgr'),
    name: managerName?.trim() || 'মেস ম্যানেজার',
    phone: managerPhone?.trim() || '',
    username: managerUser,
    password: '123',
    roomRent: 4000,
    role: 'manager' as const,
    active: true,
    joinedAt: new Date().toISOString().slice(0, 10),
  };

  const newMess: MessData = {
    id: newId,
    name: name.trim(),
    code: cleanCode,
    adminPassword: adminPassword && adminPassword.trim() ? adminPassword.trim() : DEFAULT_ADMIN_PASSWORD,
    managerName: managerName?.trim() || 'মেস ম্যানেজার',
    managerPhone: managerPhone?.trim() || '',
    currentMonthKey: getCurrentMonthKey(),
    currentMonthName: getCurrentMonthNameBengali(),
    members: [defaultManager],
    meals: [],
    bazarEntries: [],
    deposits: [],
    fixedExpenses: DEFAULT_SHARED_UTILITIES.map((seg, idx) => ({
      ...seg,
      id: `seg_${idx + 1}`,
    })),
    archives: [],
    updatedAt: new Date().toISOString(),
  };

  saveMess(newMess);
  return newMess;
}

// Crash backup logic
function saveCrashBackup(data: MessData[]): void {
  try {
    const snapshot = {
      timestamp: new Date().toISOString(),
      version: '2.0',
      data,
    };
    localStorage.setItem(STORAGE_KEY_BACKUP, JSON.stringify(snapshot));
  } catch (err) {
    console.warn('Unable to write crash backup snapshot:', err);
  }
}

export function getCrashBackupInfo(): { timestamp: string; count: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BACKUP);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      timestamp: parsed.timestamp || '',
      count: parsed.data?.length || 0,
    };
  } catch {
    return null;
  }
}

export function downloadBackupJson(): void {
  if (typeof window === 'undefined') return;
  try {
    const messes = getStoredMesses();
    const payload = {
      title: 'মেস খাতা - সম্পূর্ণ ব্যাকআপ',
      exportedAt: new Date().toISOString(),
      messes,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mess-khata-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to export backup JSON:', err);
  }
}

export function restoreBackupFromJson(jsonString: string): { success: boolean; message: string; count?: number } {
  try {
    const parsed = JSON.parse(jsonString);
    let messesToRestore: MessData[] = [];

    if (Array.isArray(parsed)) {
      messesToRestore = parsed;
    } else if (parsed.messes && Array.isArray(parsed.messes)) {
      messesToRestore = parsed.messes;
    } else if (parsed.data && Array.isArray(parsed.data)) {
      messesToRestore = parsed.data;
    } else if (parsed.id && parsed.name && parsed.members) {
      messesToRestore = [parsed];
    } else {
      return { success: false, message: 'অপ্রত্যাশিত ব্যাকআপ ফাইল ফরম্যাট!' };
    }

    if (messesToRestore.length === 0) {
      return { success: false, message: 'ফাইলটিতে কোনো মেসের তথ্য পাওয়া যায়নি!' };
    }

    localStorage.setItem(STORAGE_KEY_MESSES, JSON.stringify(messesToRestore));
    saveCrashBackup(messesToRestore);

    return {
      success: true,
      message: `সফলভাবে ${messesToRestore.length} টি মেসের তথ্য রিস্টোর করা হয়েছে!`,
      count: messesToRestore.length,
    };
  } catch {
    return { success: false, message: 'ফাইলটি সঠিকভাবে পড়া যায়নি। অনুগ্রহ করে সঠিক JSON ফাইল নির্বাচন করুন।' };
  }
}

// Background sync to Supabase (optimized lightweight payload)
async function syncToSupabase(mess: MessData): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('messes').upsert({
      id: mess.id,
      code: mess.code,
      name: mess.name,
      admin_password: mess.adminPassword,
      current_month_key: mess.currentMonthKey,
      current_month_name: mess.currentMonthName,
      data: {
        members: mess.members,
        meals: mess.meals,
        bazarEntries: mess.bazarEntries,
        deposits: mess.deposits,
        fixedExpenses: mess.fixedExpenses,
        archives: mess.archives,
      },
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Supabase sync skipped/notice:', err);
  }
}

function mapSupabaseToMess(row: any): MessData {
  const content = row.data || {};
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    adminPassword: row.admin_password || DEFAULT_ADMIN_PASSWORD,
    managerName: row.manager_name || 'মেস ম্যানেজার',
    managerPhone: row.manager_phone || '',
    currentMonthKey: row.current_month_key || getCurrentMonthKey(),
    currentMonthName: row.current_month_name || getCurrentMonthNameBengali(),
    members: content.members || [],
    meals: content.meals || [],
    bazarEntries: content.bazarEntries || [],
    deposits: content.deposits || [],
    fixedExpenses: content.fixedExpenses || DEFAULT_SHARED_UTILITIES,
    archives: content.archives || [],
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}
