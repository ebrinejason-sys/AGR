import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';

export async function GET() {
    try {
        const supabase = getAdminSupabase();

        const [storiesRes, mediaRes, projectsRes, eventsRes] = await Promise.all([
            supabase.from('stories').select('*').order('created_at', { ascending: false }),
            supabase.from('media').select('*').order('created_at', { ascending: false }),
            supabase.from('projects').select('*').order('pillar_number', { ascending: true }),
            supabase.from('events').select('*').order('event_date', { ascending: true })
        ]);

        return NextResponse.json({
            stories: storiesRes.data || [],
            media: mediaRes.data || [],
            projects: projectsRes.data || [],
            events: eventsRes.data || []
        });
    } catch (err) {
        console.error('GET /api/public/data error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
