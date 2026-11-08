-- =========================================================
-- মেস খাতা (MessKhata) - Supabase Database Schema
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/msimypjjdnoujqmzleco/sql
-- =========================================================

-- 1. Create messes table
CREATE TABLE IF NOT EXISTS public.messes (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    admin_password TEXT NOT NULL DEFAULT '@@Meal##1',
    manager_name TEXT DEFAULT 'মেস ম্যানেজার',
    manager_phone TEXT DEFAULT '',
    current_month_key TEXT NOT NULL,
    current_month_name TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create index on code and name for instant lookup
CREATE INDEX IF NOT EXISTS idx_messes_code ON public.messes(code);
CREATE INDEX IF NOT EXISTS idx_messes_name ON public.messes(name);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.messes ENABLE ROW LEVEL SECURITY;

-- 4. Clean drop old policies if they exist to prevent errors
DROP POLICY IF EXISTS "Allow public select on messes" ON public.messes;
DROP POLICY IF EXISTS "Allow public insert on messes" ON public.messes;
DROP POLICY IF EXISTS "Allow public update on messes" ON public.messes;
DROP POLICY IF EXISTS "Allow public read for messes" ON public.messes;
DROP POLICY IF EXISTS "Allow public insert for messes" ON public.messes;
DROP POLICY IF EXISTS "Allow public update for messes" ON public.messes;

-- 5. Create wide open anon policies for multi-mess sync
CREATE POLICY "Allow public select on messes" 
    ON public.messes FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert on messes" 
    ON public.messes FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update on messes" 
    ON public.messes FOR UPDATE 
    USING (true);
