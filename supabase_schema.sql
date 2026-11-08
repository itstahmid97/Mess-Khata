-- =========================================================
-- মেস খাতা (MessKhata) - Supabase Database Schema
-- Supabase Free Tier Optimized (Ultra Lightweight Storage)
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/msimypjjdnoujqmzleco/sql
-- =========================================================

-- 1. Create messes table with JSONB document support for minimal storage footprint
CREATE TABLE IF NOT EXISTS messes (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    admin_password TEXT NOT NULL DEFAULT '@@Meal##1',
    manager_name TEXT DEFAULT 'মেস ম্যানেজার',
    manager_phone TEXT,
    current_month_key TEXT NOT NULL,
    current_month_name TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for instant lookup by mess code or name
CREATE INDEX IF NOT EXISTS idx_messes_code ON messes(code);
CREATE INDEX IF NOT EXISTS idx_messes_name ON messes(name);

-- 3. Row Level Security (RLS) - Enable public anon access for read/write
ALTER TABLE messes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for messes" ON messes
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert for messes" ON messes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update for messes" ON messes
    FOR UPDATE USING (true);
