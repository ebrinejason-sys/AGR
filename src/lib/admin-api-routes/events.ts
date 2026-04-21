import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminSupabase } from '../supabase.server.js';
import { requireAdminSession, checkSupabaseAdminConfig } from '../admin-api.js';
import { normalizeMediaUrl, normalizeMediaUrls } from '../media.js';

const VALID_STATUSES = new Set(['upcoming', 'completed', 'cancelled']);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const configError = checkSupabaseAdminConfig();
    if (configError) return res.status(configError.statusCode).json(configError.body);

    const { error: authError } = requireAdminSession(req.headers.cookie as string);
    if (authError) return res.status(authError.statusCode).json(authError.body);

    const supabase = getAdminSupabase();

    try {
        if (req.method === 'GET') {
            const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: false });
            if (error) return res.status(500).json({ error: error.message });
            return res.json({ events: (data || []).map(e => normalizeMediaUrls(e, ['cover_image'])) });
        }

        if (req.method === 'POST') {
            const { title, description, event_date, goal_amount, cover_image, achievements, location, goal_text, donation_link } = req.body || {};
            if (!title || !event_date) return res.status(400).json({ error: 'Title and event date are required.' });
            const goal = Number(goal_amount || 0);
            if (!Number.isFinite(goal) || goal < 0) return res.status(400).json({ error: 'Goal amount must be a positive number.' });

            const { data, error } = await supabase.from('events').insert({
                title, description: description || null, event_date, goal_amount: goal,
                current_amount: 0, status: 'upcoming',
                cover_image: normalizeMediaUrl(cover_image) || null,
                achievements: achievements || null, location: location || null,
                goal_text: goal_text || null, donation_link: donation_link || null,
            }).select('*').single();

            if (error) return res.status(500).json({ error: error.message });
            return res.status(201).json({ event: normalizeMediaUrls(data, ['cover_image']) });
        }

        if (req.method === 'PATCH') {
            const { id, ...updates } = req.body || {};
            if (!id) return res.status(400).json({ error: 'Event ID is required.' });
            if (updates.status && !VALID_STATUSES.has(updates.status)) return res.status(400).json({ error: 'Invalid event status.' });
            if (updates.cover_image !== undefined) updates.cover_image = normalizeMediaUrl(updates.cover_image) || null;

            const { data, error } = await supabase.from('events').update(updates).eq('id', id).select('*').single();
            if (error) return res.status(500).json({ error: error.message });
            return res.json({ event: normalizeMediaUrls(data, ['cover_image']) });
        }

        if (req.method === 'DELETE') {
            const { id } = req.body || {};
            if (!id) return res.status(400).json({ error: 'Event ID is required.' });
            const { error } = await supabase.from('events').delete().eq('id', id);
            if (error) return res.status(500).json({ error: error.message });
            return res.json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('/api/admin/events error:', err);
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
    }
}
