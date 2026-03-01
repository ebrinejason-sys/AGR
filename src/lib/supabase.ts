import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This is the read-only / public client
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder-key');

// You can create an admin client that uses the SERVICE_ROLE_KEY to bypass RLS in the Admin Dashboard routes
export const getAdminSupabase = () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        console.warn("SUPABASE_SERVICE_ROLE_KEY is missing. Admin operations might fail.");
    }
    return createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        serviceRoleKey || 'placeholder-key'
    );
};
