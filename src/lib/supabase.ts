import { createClient, SupabaseClient } from '@supabase/supabase-js';

// User's project URL from Supabase dashboard
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://msimypjjdnoujqmzleco.supabase.co';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_ANON_KEY.trim().length > 15 && 
  !SUPABASE_ANON_KEY.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabase) return supabase;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (key && key.trim().length > 15) {
    try {
      return createClient(SUPABASE_URL, key.trim());
    } catch {
      return null;
    }
  }
  return null;
}
