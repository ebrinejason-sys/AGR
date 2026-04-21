import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } from './env.js';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_ANON_KEY;
const serviceRoleKey = SUPABASE_SERVICE_ROLE_KEY;

const sharedClientOptions = {
    auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
    },
};

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

// Default client with anon key
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-key',
    sharedClientOptions
);

/**
 * Get an admin instance of the Supabase client.
 * Use this ONLY in server-side routes that require high-privilege access.
 */
export const getAdminSupabase = () => {
    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Supabase admin client is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    }
    return createClient(supabaseUrl, serviceRoleKey, sharedClientOptions);
};
