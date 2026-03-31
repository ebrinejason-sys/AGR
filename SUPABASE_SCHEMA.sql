-- Run this in your Supabase SQL Editor

-- 1. Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    goal_amount DECIMAL DEFAULT 0,
    current_amount DECIMAL DEFAULT 0,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
    cover_image TEXT,
    achievements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add columns if table already existed before this update
DO $$ 
BEGIN 
    BEGIN
        ALTER TABLE public.events ADD COLUMN cover_image TEXT;
    EXCEPTION WHEN duplicate_column THEN END;
    
    BEGIN
        ALTER TABLE public.events ADD COLUMN achievements TEXT;
    EXCEPTION WHEN duplicate_column THEN END;
END $$;

-- 2. Media (Gallery) Table
CREATE TABLE IF NOT EXISTS public.media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    description TEXT,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add event_id if table already existed 
DO $$ 
BEGIN 
    BEGIN
        ALTER TABLE public.media ADD COLUMN event_id UUID REFERENCES public.events(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_column THEN END;
END $$;


-- 3. Stories Table
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT DEFAULT 'Grace Akatwijuka',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS) policies 
-- For this setup we will allow anonymous reads for public data, but require authentication for inserts/updates.
-- (Assumes Admin dashboard will use Supabase Auth or a Service Role Key)

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DO $$ BEGIN
    CREATE POLICY "Public can view events" ON public.events FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN END; $$;

DO $$ BEGIN
    CREATE POLICY "Public can view media" ON public.media FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN END; $$;

DO $$ BEGIN
    CREATE POLICY "Public can view stories" ON public.stories FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN END; $$;

-- Allow public to insert into subscriptions and contacts
DO $$ BEGIN
    CREATE POLICY "Public can subscribe" ON public.subscriptions FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN END; $$;

DO $$ BEGIN
    CREATE POLICY "Public can submit contact form" ON public.contacts FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN END; $$;

-- 6. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('active', 'draft')),
    pillar_number INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Public can view projects" ON public.projects FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN END; $$;
