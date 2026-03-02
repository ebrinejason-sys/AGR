import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminSession } from '@/lib/admin-api';

export async function GET(request: Request) {
    const { error } = requireAdminSession(request);
    if (error) return error;

    const supabase = getAdminSupabase();
    const { data, error: dbError } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ stories: data || [] });
}

export async function POST(request: Request) {
    const { session, error } = requireAdminSession(request);
    if (error) return error;

    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
        return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    const supabase = getAdminSupabase();
    const { data, error: dbError } = await supabase
        .from('stories')
        .insert({
            title,
            content,
            author: session?.email || 'Admin',
        })
        .select('*')
        .single();

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ story: data }, { status: 201 });
}

export async function DELETE(request: Request) {
    const { error } = requireAdminSession(request);
    if (error) return error;

    const body = await request.json();
    const { id } = body;

    if (!id) {
        return NextResponse.json({ error: 'Story id is required.' }, { status: 400 });
    }

    const supabase = getAdminSupabase();
    const { error: dbError } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
