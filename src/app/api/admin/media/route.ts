import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminSession } from '@/lib/admin-api';

const sanitizeFileName = (fileName: string) => fileName.replace(/[^a-zA-Z0-9._-]/g, '-');

export async function GET(request: Request) {
    const { error } = requireAdminSession(request);
    if (error) return error;

    const supabase = getAdminSupabase();
    const { data, error: dbError } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ media: data || [] });
}

export async function POST(request: Request) {
    const { error } = requireAdminSession(request);
    if (error) return error;

    const formData = await request.formData();
    const file = formData.get('file');
    const description = formData.get('description');

    if (!(file instanceof File)) {
        return NextResponse.json({ error: 'File is required.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        return NextResponse.json({ error: 'Only image and video files are supported.' }, { status: 400 });
    }

    const bucket = process.env.SUPABASE_MEDIA_BUCKET || 'media';
    const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
    const filePath = `uploads/${fileName}`;

    const supabase = getAdminSupabase();
    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
        });

    if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    const url = publicData.publicUrl;

    const mediaType = file.type.startsWith('image/') ? 'image' : 'video';

    const { data, error: dbError } = await supabase
        .from('media')
        .insert({
            url,
            type: mediaType,
            description: typeof description === 'string' ? description : null,
        })
        .select('*')
        .single();

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ media: data }, { status: 201 });
}
