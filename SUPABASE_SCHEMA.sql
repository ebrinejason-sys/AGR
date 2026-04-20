-- ============================================================
-- AFRICAN GIRL RISE — COMPLETE SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- Safe to run multiple times — uses IF NOT EXISTS / DO $$ blocks
-- ============================================================

-- ============================================================
-- TABLE 1: EVENTS
-- Admin can create events with goals, status, cover images,
-- gallery photos (via media table), and post-event achievements.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title           TEXT NOT NULL,
    description     TEXT,
    event_date      TIMESTAMP WITH TIME ZONE NOT NULL,
    location        TEXT,
    goal_amount     DECIMAL DEFAULT 0,
    goal_text       TEXT,                          -- e.g. "50 girls trained"
    current_amount  DECIMAL DEFAULT 0,
    donation_link   TEXT,
    status          TEXT DEFAULT 'upcoming'
                    CHECK (status IN ('upcoming', 'completed', 'cancelled')),
    cover_image     TEXT,                          -- URL from Supabase storage
    achievements    TEXT,                          -- Post-event write-up
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add any missing columns if the table already existed
DO $$
BEGIN
    BEGIN ALTER TABLE public.events ADD COLUMN location TEXT;
    EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.events ADD COLUMN goal_text TEXT;
    EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.events ADD COLUMN donation_link TEXT;
    EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.events ADD COLUMN cover_image TEXT;
    EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.events ADD COLUMN achievements TEXT;
    EXCEPTION WHEN duplicate_column THEN END;
END $$;


-- ============================================================
-- TABLE 2: MEDIA
-- Central media library. Images/videos can be stand-alone or
-- linked to a specific event (for event gallery feature).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.media (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    url         TEXT NOT NULL,
    type        TEXT NOT NULL CHECK (type IN ('image', 'video')),
    description TEXT,
    event_id    UUID REFERENCES public.events(id) ON DELETE SET NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$
BEGIN
    BEGIN
        ALTER TABLE public.media ADD COLUMN event_id UUID REFERENCES public.events(id) ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_column THEN END;
END $$;


-- ============================================================
-- TABLE 3: STORIES
-- Admin publishes impact stories (with rich HTML content from
-- the Quill editor), author name, and cover image.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.stories (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,                    -- HTML from Quill editor
    author      TEXT DEFAULT 'Grace Akatwijuka',
    image_url   TEXT,                             -- Cover image URL
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$
BEGIN
    BEGIN ALTER TABLE public.stories ADD COLUMN image_url TEXT;
    EXCEPTION WHEN duplicate_column THEN END;
END $$;


-- ============================================================
-- TABLE 4: SUBSCRIPTIONS
-- Newsletter subscribers captured from the site footer or
-- contact forms. Admin can email all subscribers (broadcast).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email      TEXT UNIQUE NOT NULL,
    name       TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================================
-- TABLE 5: CONTACTS
-- Stores all contact form submissions across all form types:
-- general, mentor, sponsor, donate. Extra fields (phone,
-- profession, etc.) stored as JSONB for flexibility.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contacts (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name         TEXT NOT NULL,
    email        TEXT NOT NULL,
    message      TEXT NOT NULL,
    type         TEXT DEFAULT 'general'
                 CHECK (type IN ('general', 'mentor', 'sponsor', 'donate')),
    extra_fields JSONB DEFAULT '{}',             -- phone, profession, org, etc.
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$
BEGIN
    BEGIN ALTER TABLE public.contacts ADD COLUMN type TEXT DEFAULT 'general';
    EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.contacts ADD COLUMN extra_fields JSONB DEFAULT '{}';
    EXCEPTION WHEN duplicate_column THEN END;
END $$;


-- ============================================================
-- TABLE 6: PROJECTS
-- Core programmes/pillars managed through the admin dashboard
-- (Rise Sanctuaries, Education Support, Legal Advocacy,
-- Rise Brothers). Each mapped to a pillar number (1-4).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title          TEXT NOT NULL,
    description    TEXT,
    image_url      TEXT,
    status         TEXT DEFAULT 'draft' CHECK (status IN ('active', 'draft')),
    pillar_number  INTEGER DEFAULT 1
                   CHECK (pillar_number BETWEEN 1 AND 4),
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$
BEGIN
    BEGIN ALTER TABLE public.projects ADD COLUMN pillar_number INTEGER DEFAULT 1;
    EXCEPTION WHEN duplicate_column THEN END;
END $$;


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Public can READ events, media, stories, and projects.
-- Public can INSERT contacts and subscriptions.
-- Admin operations go through the Service Role Key (bypasses RLS).
-- ============================================================

ALTER TABLE public.events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects     ENABLE ROW LEVEL SECURITY;

-- Public read policies
DO $$ BEGIN
    CREATE POLICY "Public read events"
        ON public.events FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN END; $$;

DO $$ BEGIN
    CREATE POLICY "Public read media"
        ON public.media FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN END; $$;

DO $$ BEGIN
    CREATE POLICY "Public read stories"
        ON public.stories FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN END; $$;

DO $$ BEGIN
    CREATE POLICY "Public read projects"
        ON public.projects FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN END; $$;

-- Public write policies (for form submissions)
DO $$ BEGIN
    CREATE POLICY "Public can subscribe"
        ON public.subscriptions FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN END; $$;

DO $$ BEGIN
    CREATE POLICY "Public can submit contact"
        ON public.contacts FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN END; $$;


-- ============================================================
-- SUPABASE STORAGE BUCKET (run separately if needed)
-- Create a public bucket called "media" for file uploads.
-- Do this in the Supabase Dashboard → Storage → New Bucket
-- OR run the SQL below:
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload to the media bucket (admin controls via API)
DO $$ BEGIN
    CREATE POLICY "Authenticated upload to media"
        ON storage.objects FOR INSERT TO anon, authenticated
        WITH CHECK (bucket_id = 'media');
EXCEPTION WHEN duplicate_object THEN END; $$;

DO $$ BEGIN
    CREATE POLICY "Public read from media"
        ON storage.objects FOR SELECT TO anon, authenticated
        USING (bucket_id = 'media');
EXCEPTION WHEN duplicate_object THEN END; $$;
