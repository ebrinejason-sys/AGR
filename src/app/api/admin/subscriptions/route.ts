import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminSession } from '@/lib/admin-api';

export async function GET(request: Request) {
    try {
        const { error } = requireAdminSession(request);
        if (error) return error;

        const supabase = getAdminSupabase();
        const { data, error: dbError } = await supabase
            .from('subscriptions')
            .select('*')
            .order('created_at', { ascending: false });

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ subscribers: data || [] });
    } catch (err) {
        console.error('GET /api/admin/subscriptions error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
