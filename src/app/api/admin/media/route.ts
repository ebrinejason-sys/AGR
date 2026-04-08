import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminSession, checkSupabaseAdminConfig } from '@/lib/admin-api';

const sanitizeFileName = (fileName: string) => fileName.replace(/[^a-zA-Z0-9._-]/g, '-');

export async function GET(request: Request) {
    try {
        const configError = checkSupabaseAdminConfig();
        if (configError) return configError;

        const { error } = requireAdminSession(request);
        if (error) return error;

        const supabase = getAdminSupabase();
        const { data, error: dbError } = await supabase
            .from('media')
            .select('id, url, type, description, event_id, created_at, events(id, title, status)')
            .order('created_at', { ascending: false });

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ media: data || [] });
    } catch (err) {
        console.error('GET /api/admin/media error:', err);
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

        const formData = await request.formData();
        const file = formData.get('file');
        const description = formData.get('description');
        const event_id = formData.get('event_id');

        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'File is required.' }, { status: 400 });
        }

        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            return NextResponse.json({ error: 'Only image and video files are supported.' }, { status: 400 });
        }

        // Ensure bucket name is correct, fall back to "media"
        const bucket = process.env.SUPABASE_MEDIA_BUCKET || 'media';
        const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
        const filePath = `uploads/${fileName}`;

        const supabase = getAdminSupabase();

        // 1. Upload to Storage
        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error('Supabase Storage Upload Error:', uploadError);
            return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 });
        }

        // 2. Get Public URL
        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        const url = publicData.publicUrl;

        // 3. Insert into Database
        const mediaType = file.type.startsWith('image/') ? 'image' : 'video';

        const { data, error: dbError } = await supabase
            .from('media')
            .insert({
                url,
                type: mediaType,
                description: typeof description === 'string' ? description : null,
                event_id: typeof event_id === 'string' && event_id.trim() !== '' ? event_id : null,
            })
            .select('*')
            .single();

        if (dbError) {
            console.error('Supabase Database Insert Error:', dbError);
            // If DB insert fails, cleanup: delete the uploaded file from storage
            await supabase.storage.from(bucket).remove([filePath]);
            return NextResponse.json({ error: `Database insert failed: ${dbError.message}. Storage has been cleaned up.` }, { status: 500 });
        }

        return NextResponse.json({ media: data }, { status: 201 });
    } catch (err) {
        console.error('POST /api/admin/media error:', err);
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
            return NextResponse.json({ error: 'Media id is required.' }, { status: 400 });
        }

        const supabase = getAdminSupabase();

        // Get the record first so we can remove the file from storage
        const { data: record } = await supabase.from('media').select('url').eq('id', id).single();

        if (record?.url) {
            // Extract the storage path from the public URL
            const urlParts = record.url.split('/object/public/');
            if (urlParts.length === 2) {
                const [bucketAndPath] = urlParts[1].split('?');
                const slashIdx = bucketAndPath.indexOf('/');
                if (slashIdx !== -1) {
                    const bucket = bucketAndPath.slice(0, slashIdx);
                    const filePath = bucketAndPath.slice(slashIdx + 1);
                    await supabase.storage.from(bucket).remove([filePath]);
                }
            }
        }

        const { error: dbError } = await supabase.from('media').delete().eq('id', id);

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/admin/media error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
