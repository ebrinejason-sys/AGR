import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminSession, checkSupabaseAdminConfig } from '@/lib/admin-api';
import { normalizeMediaUrl, normalizeMediaUrls } from '@/lib/media';

const VALID_EVENT_STATUSES = new Set(['upcoming', 'completed', 'cancelled']);

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

        return NextResponse.json({
            events: (data || []).map((event) => normalizeMediaUrls(event, ['cover_image']))
        });
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
        const { title, description, event_date, goal_amount, cover_image, achievements, location, goal_text, donation_link } = body;

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
                cover_image: normalizeMediaUrl(cover_image) || null,
                achievements: achievements || null,
                location: location || null,
                goal_text: goal_text || null,
                donation_link: donation_link || null,
            })
            .select('*')
            .single();

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ event: normalizeMediaUrls(data, ['cover_image']) }, { status: 201 });
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
        const { id, status, title, description, event_date, goal_amount, cover_image, achievements, location, goal_text, donation_link } = body;

        if (!id) {
            return NextResponse.json({ error: 'Event id is required.' }, { status: 400 });
        }

        const updates: Record<string, unknown> = {};
        if (status !== undefined) {
            if (!VALID_EVENT_STATUSES.has(String(status))) {
                return NextResponse.json({ error: 'Invalid event status.' }, { status: 400 });
            }
            updates.status = status;
        }
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
        if (cover_image !== undefined) updates.cover_image = normalizeMediaUrl(cover_image);
        if (achievements !== undefined) updates.achievements = achievements;
        if (location !== undefined) updates.location = location;
        if (goal_text !== undefined) updates.goal_text = goal_text;
        if (donation_link !== undefined) updates.donation_link = donation_link;

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

        return NextResponse.json({ event: normalizeMediaUrls(data, ['cover_image']) });
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
