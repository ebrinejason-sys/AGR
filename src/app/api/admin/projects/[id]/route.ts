import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminSession, checkSupabaseAdminConfig } from '@/lib/admin-api';

const VALID_PROJECT_STATUSES = new Set(['active', 'draft']);

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const configError = checkSupabaseAdminConfig();
        if (configError) return configError;

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
        const configError = checkSupabaseAdminConfig();
        if (configError) return configError;

        const { error } = requireAdminSession(request);
        if (error) return error;

        const { id } = await params;
        const body = await request.json();
        const { title, description, image_url, status, pillar_number } = body;

        const updates: Record<string, unknown> = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (image_url !== undefined) updates.image_url = image_url;
        if (status !== undefined) {
            if (!VALID_PROJECT_STATUSES.has(String(status))) {
                return NextResponse.json({ error: 'Invalid project status.' }, { status: 400 });
            }
            updates.status = status;
        }
        if (pillar_number !== undefined) {
            const parsedPillar = Number(pillar_number);
            if (!Number.isInteger(parsedPillar) || parsedPillar < 1 || parsedPillar > 4) {
                return NextResponse.json({ error: 'pillar_number must be an integer between 1 and 4.' }, { status: 400 });
            }
            updates.pillar_number = parsedPillar;
        }

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
        const configError = checkSupabaseAdminConfig();
        if (configError) return configError;

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
