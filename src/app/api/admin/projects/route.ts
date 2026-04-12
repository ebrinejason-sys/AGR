import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminSession, checkSupabaseAdminConfig } from '@/lib/admin-api';
import { normalizeMediaUrl, normalizeMediaUrls } from '@/lib/media';

const VALID_PROJECT_STATUSES = new Set(['active', 'draft']);

export async function GET(request: Request) {
    try {
        const configError = checkSupabaseAdminConfig();
        if (configError) return configError;

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

        return NextResponse.json({
            projects: (data || []).map((project) => normalizeMediaUrls(project, ['image_url']))
        });
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
        const configError = checkSupabaseAdminConfig();
        if (configError) return configError;

        const { error } = requireAdminSession(request);
        if (error) return error;

        const body = await request.json();
        const { title, description, image_url, status, pillar_number } = body;

        if (!title) {
            return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
        }

        if (status !== undefined && !VALID_PROJECT_STATUSES.has(String(status))) {
            return NextResponse.json({ error: 'Invalid project status.' }, { status: 400 });
        }

        const parsedPillar = Number(pillar_number || 1);
        if (!Number.isInteger(parsedPillar) || parsedPillar < 1 || parsedPillar > 4) {
            return NextResponse.json({ error: 'pillar_number must be an integer between 1 and 4.' }, { status: 400 });
        }

        const supabase = getAdminSupabase();
        const { data, error: dbError } = await supabase
            .from('projects')
            .insert({
                title,
                description: description || null,
                image_url: normalizeMediaUrl(image_url) || null,
                status: status || 'draft',
                pillar_number: parsedPillar,
            })
            .select('*')
            .single();

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ project: normalizeMediaUrls(data, ['image_url']) }, { status: 201 });
    } catch (err) {
        console.error('POST /api/admin/projects error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
