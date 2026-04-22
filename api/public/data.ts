import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminSupabase } from '../../src/lib/supabase.server.js';
import { normalizeMediaUrls, normalizeRichTextMediaUrls } from '../../src/lib/media.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
    try {
        const supabase = getAdminSupabase();

        const [storiesRes, mediaRes, projectsRes, eventsRes, eventGalleryRes] = await Promise.all([
            supabase.from('stories').select('*').order('created_at', { ascending: false }),
            supabase.from('media').select('*').is('event_id', null).order('created_at', { ascending: false }),
            supabase.from('projects').select('*').order('pillar_number', { ascending: true }),
            supabase.from('events').select('*').order('event_date', { ascending: true }),
            supabase.from('media').select('*').not('event_id', 'is', null).order('created_at', { ascending: true }),
        ]);

        const galleryByEvent: Record<string, typeof eventGalleryRes.data> = {};
        for (const photo of eventGalleryRes.data || []) {
            if (!photo.event_id) continue;
            if (!galleryByEvent[photo.event_id]) galleryByEvent[photo.event_id] = [];
            galleryByEvent[photo.event_id]!.push(photo);
        }

        const events = (eventsRes.data || []).map(ev => ({
            ...normalizeMediaUrls(ev, ['cover_image']),
            gallery: (galleryByEvent[ev.id] || []).map(photo => normalizeMediaUrls(photo, ['url'])),
        }));

        return res.json({
            stories: (storiesRes.data || []).map(story => ({ ...normalizeMediaUrls(story, ['image_url']), content: normalizeRichTextMediaUrls(story.content) })),
            media: (mediaRes.data || []).map(item => normalizeMediaUrls(item, ['url'])),
            projects: (projectsRes.data || []).map(project => normalizeMediaUrls(project, ['image_url'])),
            events,
        });
    } catch (err) {
        console.error('GET /api/public/data error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
