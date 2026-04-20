import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminSupabase } from '../../supabase.server';
import { requireAdminSession, checkSupabaseAdminConfig } from '../../admin-api';
import { normalizeMediaUrl, normalizeMediaUrls } from '../../media';

const VALID_STATUSES = new Set(['active', 'draft']);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const configError = checkSupabaseAdminConfig();
    if (configError) return res.status(configError.statusCode).json(configError.body);

    const { error: authError } = requireAdminSession(req.headers.cookie as string);
    if (authError) return res.status(authError.statusCode).json(authError.body);

    const id = req.query.id as string;
    const supabase = getAdminSupabase();

    try {
        if (req.method === 'GET') {
            const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
            if (error) return res.status(500).json({ error: error.message });
            if (!data) return res.status(404).json({ error: 'Project not found' });
            return res.json(normalizeMediaUrls(data, ['image_url']));
        }

        if (req.method === 'PUT') {
            const { title, description, image_url, status, pillar_number } = req.body || {};
            const updates: Record<string, unknown> = {};
            if (title !== undefined) updates.title = title;
            if (description !== undefined) updates.description = description;
            if (image_url !== undefined) updates.image_url = normalizeMediaUrl(image_url);
            if (status !== undefined) {
                if (!VALID_STATUSES.has(String(status))) return res.status(400).json({ error: 'Invalid project status.' });
                updates.status = status;
            }
            if (pillar_number !== undefined) {
                const p = Number(pillar_number);
                if (!Number.isInteger(p) || p < 1 || p > 4) return res.status(400).json({ error: 'pillar_number must be 1-4.' });
                updates.pillar_number = p;
            }

            const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select('*').single();
            if (error) return res.status(500).json({ error: error.message });
            return res.json(normalizeMediaUrls(data, ['image_url']));
        }

        if (req.method === 'DELETE') {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (error) return res.status(500).json({ error: error.message });
            return res.json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('/api/admin/projects/[id] error:', err);
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
    }
}
