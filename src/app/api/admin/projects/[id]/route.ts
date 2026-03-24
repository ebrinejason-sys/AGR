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
            return NextResponse.json({ error: dbError.message }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { error } = requireAdminSession(request);
        if (error) return error;

        const { id } = await params;
        const data = await request.json();
        const supabase = getAdminSupabase();

        const { data: updatedData, error: dbError } = await supabase
            .from('projects')
            .update(data)
            .eq('id', id)
            .select('*')
            .single();

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json(updatedData);
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
