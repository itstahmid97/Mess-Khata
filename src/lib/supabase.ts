import { createClient, SupabaseClient } from '@supabase/supabase-js';

// User's project URL from the screenshot
const DEFAULT_SUPABASE_URL = 'https://msimypjjdnoujqmzleco.supabase.co';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseAnonKey.includes('placeholder') &&
  supabaseAnonKey.trim().length > 10
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
