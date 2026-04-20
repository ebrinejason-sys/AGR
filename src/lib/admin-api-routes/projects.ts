import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminSupabase } from '../supabase.server';
import { requireAdminSession, checkSupabaseAdminConfig } from '../admin-api';
import { normalizeMediaUrl, normalizeMediaUrls } from '../media';

const VALID_STATUSES = new Set(['active', 'draft']);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const configError = checkSupabaseAdminConfig();
    if (configError) return res.status(configError.statusCode).json(configError.body);

    const { error: authError } = requireAdminSession(req.headers.cookie as string);
    if (authError) return res.status(authError.statusCode).json(authError.body);

    const supabase = getAdminSupabase();

    try {
        if (req.method === 'GET') {
            const { data, error } = await supabase.from('projects').select('*').order('pillar_number', { ascending: true });
            if (error) return res.status(500).json({ error: error.message });
            return res.json({ projects: (data || []).map(p => normalizeMediaUrls(p, ['image_url'])) });
        }

        if (req.method === 'POST') {
            const { title, description, image_url, status, pillar_number } = req.body || {};
            if (!title) return res.status(400).json({ error: 'Title is required.' });
            if (status !== undefined && !VALID_STATUSES.has(String(status))) return res.status(400).json({ error: 'Invalid project status.' });
            const parsedPillar = Number(pillar_number || 1);
            if (!Number.isInteger(parsedPillar) || parsedPillar < 1 || parsedPillar > 4) return res.status(400).json({ error: 'pillar_number must be 1-4.' });

            const { data, error } = await supabase.from('projects').insert({
                title, description: description || null, image_url: normalizeMediaUrl(image_url) || null,
                status: status || 'draft', pillar_number: parsedPillar,
            }).select('*').single();

            if (error) return res.status(500).json({ error: error.message });
            return res.status(201).json({ project: normalizeMediaUrls(data, ['image_url']) });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('/api/admin/projects error:', err);
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
    }
}
