import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminSession, checkSupabaseAdminConfig } from '@/lib/admin-api';
import { normalizeMediaUrl, normalizeMediaUrls, normalizeRichTextMediaUrls } from '@/lib/media';

export async function GET(request: Request) {
    try {
        const configError = checkSupabaseAdminConfig();
        if (configError) return configError;

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

        return NextResponse.json({
            stories: (data || []).map((story) => ({
                ...normalizeMediaUrls(story, ['image_url']),
                content: normalizeRichTextMediaUrls(story.content),
            }))
        });
    } catch (err) {
        console.error('GET /api/admin/stories error:', err);
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

        const { session, error } = requireAdminSession(request);
        if (error) return error;

        const body = await request.json();
        const { title, content, image_url, author } = body;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
        }

        const supabase = getAdminSupabase();
        const { data, error: dbError } = await supabase
            .from('stories')
            .insert({
                title,
                content: normalizeRichTextMediaUrls(content),
                author: author || session?.email || 'Admin',
                image_url: normalizeMediaUrl(image_url) || null,
            })
            .select('*')
            .single();

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({
            story: {
                ...normalizeMediaUrls(data, ['image_url']),
                content: normalizeRichTextMediaUrls(data.content),
            }
        }, { status: 201 });
    } catch (err) {
        console.error('POST /api/admin/stories error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const configError = checkSupabaseAdminConfig();
        if (configError) return configError;

        const { error } = requireAdminSession(request);
        if (error) return error;

        const body = await request.json();
        const { id, title, content, image_url, author } = body;

        if (!id || !title || !content) {
            return NextResponse.json({ error: 'ID, title, and content are required.' }, { status: 400 });
        }

        const supabase = getAdminSupabase();
        const { data, error: dbError } = await supabase
            .from('stories')
            .update({
                title,
                content: normalizeRichTextMediaUrls(content),
                image_url: normalizeMediaUrl(image_url) ?? null,
                author: author || undefined,
            })
            .eq('id', id)
            .select('*')
            .single();

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({
            story: {
                ...normalizeMediaUrls(data, ['image_url']),
                content: normalizeRichTextMediaUrls(data.content),
            }
        });
    } catch (err) {
        console.error('PUT /api/admin/stories error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const configError = checkSupabaseAdminConfig();
        if (configError) return configError;

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
    } catch (err) {
        console.error('DELETE /api/admin/stories error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
