import { createClient, SupabaseClient } from '@supabase/supabase-js';

// User's project URL from the Supabase screenshot
export const DEFAULT_SUPABASE_URL = 'https://msimypjjdnoujqmzleco.supabase.co';

export function getSupabaseUrl(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('mess_khata_supabase_url') || process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  }
  return process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
}

export function getSupabaseAnonKey(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('mess_khata_supabase_anon_key') || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  }
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
}

export function setSupabaseCredentials(url: string, key: string): void {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem('mess_khata_supabase_url', url.trim());
    if (key) localStorage.setItem('mess_khata_supabase_anon_key', key.trim());
  }
}

export function isSupabaseReady(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(url && key && key.trim().length > 15 && !key.includes('placeholder'));
}

export function getSupabaseClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (url && key && key.trim().length > 15 && !key.includes('placeholder')) {
    try {
      return createClient(url, key);
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}

export const supabase = getSupabaseClient();
export const isSupabaseConfigured = isSupabaseReady();
