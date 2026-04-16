import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const sharedClientOptions = {
    auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
    },
};

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
export const isSupabaseAdminConfigured = Boolean(supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY);

// This shared client is only used for server-side inserts/reads. Session persistence stays off
// so WebKit never touches Supabase auth storage on the public site.
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-key',
    sharedClientOptions
);

// You can create an admin client that uses the SERVICE_ROLE_KEY to bypass RLS in the Admin Dashboard routes
export const getAdminSupabase = () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error("Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    }
    return createClient(
        supabaseUrl,
        serviceRoleKey,
        sharedClientOptions
    );
};
