import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
export const isSupabaseAdminConfigured = Boolean(supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY);

export const checkSupabaseAdminConfig = () => {
    if (!supabaseUrl || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("Supabase admin is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    }
};

// This is the read-only / public client
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder-key');

// You can create an admin client that uses the SERVICE_ROLE_KEY to bypass RLS in the Admin Dashboard routes
export const getAdminSupabase = () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error("Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    }
    return createClient(
        supabaseUrl,
        serviceRoleKey
    );
};
