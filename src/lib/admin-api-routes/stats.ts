import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminSupabase } from '../supabase.server';
import { requireAdminSession, checkSupabaseAdminConfig } from '../admin-api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const configError = checkSupabaseAdminConfig();
        if (configError) return res.status(configError.statusCode).json(configError.body);

        const { error } = requireAdminSession(req.headers.cookie as string);
        if (error) return res.status(error.statusCode).json(error.body);

        const supabase = getAdminSupabase();

        const [eventsRes, subscribersRes, mediaRes, storiesRes, projectsRes, contactsRes] = await Promise.all([
            supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'upcoming'),
            supabase.from('subscriptions').select('id', { count: 'exact', head: true }),
            supabase.from('media').select('id', { count: 'exact', head: true }),
            supabase.from('stories').select('id', { count: 'exact', head: true }),
            supabase.from('projects').select('id', { count: 'exact', head: true }),
            supabase.from('contacts').select('id', { count: 'exact', head: true }),
        ]);

        const statsError = eventsRes.error || subscribersRes.error || mediaRes.error || storiesRes.error || projectsRes.error || contactsRes.error;
        if (statsError) return res.status(500).json({ error: `Failed to load admin stats: ${statsError.message}` });

        return res.json({
            activeEvents: eventsRes.count ?? 0, subscribers: subscribersRes.count ?? 0,
            mediaItems: mediaRes.count ?? 0, publishedStories: storiesRes.count ?? 0,
            projects: projectsRes.count ?? 0, contacts: contactsRes.count ?? 0,
        });
    } catch (err) {
        console.error('GET /api/admin/stats error:', err);
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
    }
}
