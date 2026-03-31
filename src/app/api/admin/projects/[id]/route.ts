import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminSession } from '@/lib/admin-api';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { error } = requireAdminSession(request);
        if (error) return error;

        const { id } = await params;
        const supabase = getAdminSupabase();
        const { data, error: dbError } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error('GET /api/admin/projects/[id] error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { error } = requireAdminSession(request);
        if (error) return error;

        const { id } = await params;
        const body = await request.json();
        const { title, description, image_url, status, pillar_number } = body;

        const updates: Record<string, unknown> = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (image_url !== undefined) updates.image_url = image_url;
        if (status !== undefined) updates.status = status;
        if (pillar_number !== undefined) updates.pillar_number = Number(pillar_number);

        const supabase = getAdminSupabase();
        const { data, error: dbError } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', id)
            .select('*')
            .single();

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error('PUT /api/admin/projects/[id] error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { error } = requireAdminSession(request);
        if (error) return error;

        const { id } = await params;
        const supabase = getAdminSupabase();
        const { error: dbError } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/admin/projects/[id] error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
