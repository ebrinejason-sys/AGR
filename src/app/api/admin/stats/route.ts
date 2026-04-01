import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminSession, checkSupabaseAdminConfig } from '@/lib/admin-api';

export async function GET(request: Request) {
    try {
        const configError = checkSupabaseAdminConfig();
        if (configError) return configError;

        const { error } = requireAdminSession(request);
        if (error) return error;

        const supabase = getAdminSupabase();

        // Fetch all counts in parallel
        const [eventsRes, subscribersRes, mediaRes, storiesRes, projectsRes] = await Promise.all([
            supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'upcoming'),
            supabase.from('subscriptions').select('id', { count: 'exact', head: true }),
            supabase.from('media').select('id', { count: 'exact', head: true }),
            supabase.from('stories').select('id', { count: 'exact', head: true }),
            supabase.from('projects').select('id', { count: 'exact', head: true }),
        ]);

        return NextResponse.json({
            activeEvents: eventsRes.count ?? 0,
            subscribers: subscribersRes.count ?? 0,
            mediaItems: mediaRes.count ?? 0,
            publishedStories: storiesRes.count ?? 0,
            projects: projectsRes.count ?? 0,
        });
    } catch (err) {
        console.error('GET /api/admin/stats error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
