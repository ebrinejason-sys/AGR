import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';

export async function GET() {
    try {
        const supabase = getAdminSupabase();

        const [storiesRes, mediaRes, projectsRes, eventsRes, eventGalleryRes] = await Promise.all([
            supabase.from('stories').select('*').order('created_at', { ascending: false }),
            supabase.from('media').select('*').is('event_id', null).order('created_at', { ascending: false }),
            supabase.from('projects').select('*').order('pillar_number', { ascending: true }),
            supabase.from('events').select('*').order('event_date', { ascending: true }),
            supabase.from('media').select('*').not('event_id', 'is', null).order('created_at', { ascending: true }),
        ]);

        // Attach gallery photos to each event
        const galleryByEvent: Record<string, typeof eventGalleryRes.data> = {};
        for (const photo of eventGalleryRes.data || []) {
            if (!photo.event_id) continue;
            if (!galleryByEvent[photo.event_id]) galleryByEvent[photo.event_id] = [];
            galleryByEvent[photo.event_id]!.push(photo);
        }

        const events = (eventsRes.data || []).map(ev => ({
            ...ev,
            gallery: galleryByEvent[ev.id] || [],
        }));

        return NextResponse.json({
            stories: storiesRes.data || [],
            media: mediaRes.data || [],
            projects: projectsRes.data || [],
            events,
        });
    } catch (err) {
        console.error('GET /api/public/data error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
