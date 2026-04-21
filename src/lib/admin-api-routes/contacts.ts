import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminSupabase } from '../supabase.server.js';
import { requireAdminSession, checkSupabaseAdminConfig } from '../admin-api.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const configError = checkSupabaseAdminConfig();
    if (configError) return res.status(configError.statusCode).json(configError.body);

    const { error: authError } = requireAdminSession(req.headers.cookie as string);
    if (authError) return res.status(authError.statusCode).json(authError.body);

    const supabase = getAdminSupabase();

    try {
        if (req.method === 'GET') {
            const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
            if (error) return res.status(500).json({ error: error.message });
            return res.json({ contacts: data || [] });
        }

        if (req.method === 'DELETE') {
            const { id } = req.body || {};
            if (!id) return res.status(400).json({ error: 'Contact ID is required.' });
            const { error } = await supabase.from('contacts').delete().eq('id', id);
            if (error) return res.status(500).json({ error: error.message });
            return res.json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('/api/admin/contacts error:', err);
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
    }
}
