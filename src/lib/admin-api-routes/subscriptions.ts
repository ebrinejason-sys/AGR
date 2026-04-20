import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminSupabase } from '../supabase.server';
import { requireAdminSession, checkSupabaseAdminConfig } from '../admin-api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const configError = checkSupabaseAdminConfig();
    if (configError) return res.status(configError.statusCode).json(configError.body);

    const { error: authError } = requireAdminSession(req.headers.cookie as string);
    if (authError) return res.status(authError.statusCode).json(authError.body);

    try {
        const supabase = getAdminSupabase();
        const { data, error } = await supabase.from('subscriptions').select('*').order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        return res.json({ subscribers: data || [] });
    } catch (err) {
        console.error('/api/admin/subscriptions error:', err);
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
    }
}
