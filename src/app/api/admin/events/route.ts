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
        const { data, error: dbError } = await supabase
            .from('events')
            .select('*')
            .order('event_date', { ascending: false });

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ events: data || [] });
    } catch (err) {
        console.error('GET /api/admin/events error:', err);
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
        const { title, description, event_date, goal_amount, cover_image, achievements } = body;

        if (!title || !event_date) {
            return NextResponse.json({ error: 'Title and event date are required.' }, { status: 400 });
        }

        const goal = Number(goal_amount || 0);
        if (!Number.isFinite(goal) || goal < 0) {
            return NextResponse.json({ error: 'Goal amount must be a positive number.' }, { status: 400 });
        }

        const supabase = getAdminSupabase();
        const { data, error: dbError } = await supabase
            .from('events')
            .insert({
                title,
                description: description || null,
                event_date,
                goal_amount: goal,
                current_amount: 0,
                status: 'upcoming',
                cover_image: cover_image || null,
                achievements: achievements || null,
            })
            .select('*')
            .single();

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ event: data }, { status: 201 });
    } catch (err) {
        console.error('POST /api/admin/events error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const configError = checkSupabaseAdminConfig();
        if (configError) return configError;

        const { error } = requireAdminSession(request);
        if (error) return error;

        const body = await request.json();
        const { id, status, title, description, event_date, goal_amount, cover_image, achievements } = body;

        if (!id) {
            return NextResponse.json({ error: 'Event id is required.' }, { status: 400 });
        }

        const updates: Record<string, unknown> = {};
        if (status) updates.status = status;
        if (title) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (event_date) updates.event_date = event_date;
        if (goal_amount !== undefined) {
            const goal = Number(goal_amount);
            if (!Number.isFinite(goal) || goal < 0) {
                return NextResponse.json({ error: 'Goal amount must be a positive number.' }, { status: 400 });
            }
            updates.goal_amount = goal;
        }
        if (cover_image !== undefined) updates.cover_image = cover_image;
        if (achievements !== undefined) updates.achievements = achievements;

        const supabase = getAdminSupabase();
        const { data, error: dbError } = await supabase
            .from('events')
            .update(updates)
            .eq('id', id)
            .select('*')
            .single();

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ event: data });
    } catch (err) {
        console.error('PATCH /api/admin/events error:', err);
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
            return NextResponse.json({ error: 'Event id is required.' }, { status: 400 });
        }

        const supabase = getAdminSupabase();
        const { error: dbError } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/admin/events error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
