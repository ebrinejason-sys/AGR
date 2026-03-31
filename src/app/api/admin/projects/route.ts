import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminSession } from '@/lib/admin-api';

export async function GET(request: Request) {
    try {
        const { error } = requireAdminSession(request);
        if (error) return error;

        const supabase = getAdminSupabase();
        const { data, error: dbError } = await supabase
            .from('projects')
            .select('*')
            .order('pillar_number', { ascending: true });

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ projects: data || [] });
    } catch (err) {
        console.error('GET /api/admin/projects error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { error } = requireAdminSession(request);
        if (error) return error;

        const body = await request.json();
        const { title, description, image_url, status, pillar_number } = body;

        if (!title) {
            return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
        }

        const supabase = getAdminSupabase();
        const { data, error: dbError } = await supabase
            .from('projects')
            .insert({
                title,
                description: description || null,
                image_url: image_url || null,
                status: status || 'draft',
                pillar_number: Number(pillar_number || 1),
            })
            .select('*')
            .single();

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ project: data }, { status: 201 });
    } catch (err) {
        console.error('POST /api/admin/projects error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
