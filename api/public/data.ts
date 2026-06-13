import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminSupabase } from '../../src/lib/supabase.server.js';
import { normalizeMediaUrls, normalizeRichTextMediaUrls } from '../../src/lib/media.js';

type MediaRecord = {
    created_at?: string | null;
    display_order?: number | null;
    sort_order?: number | null;
};

function getManualOrder(item: MediaRecord): number | null {
    const order = item.display_order ?? item.sort_order;
    return typeof order === 'number' && Number.isFinite(order) ? order : null;
}

function sortMedia<T extends MediaRecord>(items: T[], createdAtDirection: 'asc' | 'desc') {
    return [...items].sort((a, b) => {
        const orderA = getManualOrder(a);
        const orderB = getManualOrder(b);

        if (orderA !== null && orderB !== null && orderA !== orderB) return orderA - orderB;
        if (orderA !== null && orderB === null) return -1;
        if (orderA === null && orderB !== null) return 1;

        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return createdAtDirection === 'asc' ? timeA - timeB : timeB - timeA;
    });
}

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
        for (const photo of sortMedia(eventGalleryRes.data || [], 'asc')) {
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
            media: sortMedia(mediaRes.data || [], 'desc').map(item => normalizeMediaUrls(item, ['url'])),
            projects: (projectsRes.data || []).map(project => normalizeMediaUrls(project, ['image_url'])),
            events,
        });
    } catch (err) {
        console.error('GET /api/public/data error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
