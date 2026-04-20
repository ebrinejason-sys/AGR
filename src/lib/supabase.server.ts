import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const sharedClientOptions = {
    auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
    },
};

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
export const isSupabaseAdminConfigured = Boolean(supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY);

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-key',
    sharedClientOptions
);

export const getAdminSupabase = () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || !serviceRoleKey) {
        throw new Error('Supabase admin client is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    }
    return createClient(url, serviceRoleKey, sharedClientOptions);
};
