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
    eventTitle?: string | null;
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

async function loadOrderedRows(
    supabase: ReturnType<typeof getAdminSupabase>,
    table: 'stories' | 'projects' | 'events',
    orderColumn: string,
    ascending: boolean,
) {
    const ordered = await supabase.from(table).select('*').order(orderColumn, { ascending });
    if (!ordered.error) return ordered;

    console.warn(`GET /api/public/data ${table} ordered select failed, retrying unsorted:`, ordered.error.message);
    return supabase.from(table).select('*');
}

async function loadMediaRows(supabase: ReturnType<typeof getAdminSupabase>) {
    const detailed = await supabase
        .from('media')
        .select('id, url, type, description, event_id, created_at')
        .order('created_at', { ascending: false });

    if (!detailed.error) return detailed;

    // Older schemas may not have event_id. A failed select used to be mapped to
    // `data || []`, so the public site looked empty while admin uploads existed.
    console.warn('GET /api/public/data media select with event_id failed, retrying:', detailed.error.message);
    return supabase.from('media').select('*').order('created_at', { ascending: false });
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    const configError = checkSupabaseAdminConfig();
    if (configError) return res.status(configError.statusCode).json(configError.body);

    try {
        const supabase = getAdminSupabase();
        await ensureMediaBucketPublic(supabase);

        const [storiesRes, mediaRes, projectsRes, eventsRes] = await Promise.all([
            loadOrderedRows(supabase, 'stories', 'created_at', false),
            loadMediaRows(supabase),
            loadOrderedRows(supabase, 'projects', 'pillar_number', true),
            loadOrderedRows(supabase, 'events', 'event_date', true),
        ]);

        const queryErrors = [storiesRes.error, mediaRes.error, projectsRes.error, eventsRes.error]
            .filter(Boolean)
            .map((error) => error?.message || 'Unknown query error');

        if (queryErrors.length) {
            console.error('GET /api/public/data query errors:', queryErrors);
        }

        // Never convert a failed CMS query into a 200 with empty arrays. That made
        // the live site look like the admin had never uploaded anything.
        if (mediaRes.error || storiesRes.error || projectsRes.error || eventsRes.error) {
            return res.status(500).json({
                error: 'Published content could not be loaded.',
                errors: queryErrors,
            });
        }

        const mediaRows = sortMedia((mediaRes.data || []) as MediaRecord[], 'desc');
        const accessibleMedia = await withAccessibleMediaUrls(supabase, mediaRows, ['url']);

        const eventsWithCovers = await withAccessibleMediaUrls(
            supabase,
            (eventsRes.data || []) as Array<Record<string, unknown> & { id: string; title?: string | null }>,
            ['cover_image'],
        );

        const eventTitleById: Record<string, string | null> = {};
        for (const event of eventsWithCovers) {
            eventTitleById[event.id] = typeof event.title === 'string' ? event.title.trim() || null : null;
        }

        const media = accessibleMedia.map((item) => ({
            ...item,
            eventTitle: hasEventLink(item.event_id) ? eventTitleById[item.event_id] || null : item.eventTitle ?? null,
        }));

        const galleryByEvent: Record<string, typeof media> = {};
        for (const photo of sortMedia(media, 'asc')) {
            if (!hasEventLink(photo.event_id)) continue;
            if (!galleryByEvent[photo.event_id]) galleryByEvent[photo.event_id] = [];
            galleryByEvent[photo.event_id]!.push(photo);
        }

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
            content: sanitizeHtmlContent(normalizeRichTextMediaUrls(story.content)) || '',
        }));

        const projects = await withAccessibleMediaUrls(supabase, projectsRes.data || [], ['image_url']);

        return res.json({
            stories,
            media,
            projects,
            events,
        });
    } catch (err) {
        console.error('GET /api/public/data error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
