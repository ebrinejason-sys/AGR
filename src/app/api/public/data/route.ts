import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';

export async function GET() {
    try {
        const supabase = getAdminSupabase();

        const [storiesRes, mediaRes] = await Promise.all([
            supabase.from('stories').select('*').order('created_at', { ascending: false }),
            supabase.from('media').select('*').order('created_at', { ascending: false })
        ]);

        return NextResponse.json({
            stories: storiesRes.data || [],
            media: mediaRes.data || []
        });
    } catch (err) {
        console.error('GET /api/public/data error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
