import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminSupabase } from '../../src/lib/supabase.server.js';
import { checkSupabaseAdminConfig } from '../../src/lib/admin-api.js';
import { hasEventLink, normalizeRichTextMediaUrls, sanitizeHtmlContent } from '../../src/lib/media.js';
import { ensureMediaBucketPublic, withAccessibleMediaUrls } from '../../src/lib/media-storage.js';

type MediaRecord = {
    id: string;
    url: string;
    type: 'image' | 'video';
    description: string | null;
    event_id?: string | null;
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
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    const configError = checkSupabaseAdminConfig();
    if (configError) return res.status(configError.statusCode).json(configError.body);

    try {
        const supabase = getAdminSupabase();
        await ensureMediaBucketPublic(supabase);

        const [storiesRes, mediaRes, projectsRes, eventsRes] = await Promise.all([
            supabase.from('stories').select('*').order('created_at', { ascending: false }),
            supabase.from('media').select('id, url, type, description, event_id, created_at').order('created_at', { ascending: false }),
            supabase.from('projects').select('*').order('pillar_number', { ascending: true }),
            supabase.from('events').select('*').order('event_date', { ascending: true }),
        ]);

        const queryErrors = [storiesRes.error, mediaRes.error, projectsRes.error, eventsRes.error].filter(Boolean);
        if (queryErrors.length) {
            console.error('GET /api/public/data query errors:', queryErrors.map((error) => error?.message));
        }

        // A failed media query used to be treated as "no uploads" because we mapped `data || []`.
        if (mediaRes.error) {
            return res.status(500).json({ error: 'Gallery media could not be loaded.' });
        }

        const mediaRows = sortMedia((mediaRes.data || []) as MediaRecord[], 'desc');
        const accessibleMedia = await withAccessibleMediaUrls(supabase, mediaRows, ['url']);

        const galleryByEvent: Record<string, typeof accessibleMedia> = {};
        for (const photo of sortMedia(accessibleMedia, 'asc')) {
            if (!hasEventLink(photo.event_id)) continue;
            if (!galleryByEvent[photo.event_id]) galleryByEvent[photo.event_id] = [];
            galleryByEvent[photo.event_id]!.push(photo);
        }

        const eventsWithCovers = await withAccessibleMediaUrls(
            supabase,
            (eventsRes.data || []) as Array<Record<string, unknown> & { id: string }>,
            ['cover_image'],
        );
        const events = eventsWithCovers.map((ev) => ({
            ...ev,
            gallery: galleryByEvent[ev.id] || [],
        }));

        const storiesWithImages = await withAccessibleMediaUrls(
            supabase,
            (storiesRes.data || []) as Array<Record<string, unknown> & { content?: string | null }>,
            ['image_url'],
        );
        const stories = storiesWithImages.map((story) => ({
            ...story,
            content: sanitizeHtmlContent(normalizeRichTextMediaUrls(story.content)),
        }));

        const projects = await withAccessibleMediaUrls(supabase, projectsRes.data || [], ['image_url']);

        return res.json({
            stories,
            // Return every admin upload. Homepage and gallery previously hid event-linked
            // rows, and empty-string event_id values were dropped from both lists.
            media: accessibleMedia,
            projects,
            events,
        });
    } catch (err) {
        console.error('GET /api/public/data error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
