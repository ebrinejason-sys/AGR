import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'node:crypto';
import { getAdminSupabase } from '../../src/lib/supabase.server.js';
import { requireAdminSession, checkSupabaseAdminConfig } from '../../src/lib/admin-api.js';
import { getMediaBucketName, getMediaTypeForUpload, MAX_MEDIA_FILE_BYTES, normalizeMediaUrl, normalizeMediaUrls } from '../../src/lib/media.js';
import { ensureMediaBucketPublic, removeMediaObject, clearPublishedMediaReferences } from '../../src/lib/media-storage.js';

// Disable Vercel body parsing; this route reads only small JSON payloads.
export const config = { api: { bodyParser: false } };

const sanitizeFileName = (n: string) => n.replace(/[^a-zA-Z0-9._-]/g, '-');
const MAX_JSON_BODY_BYTES = 64 * 1024;

class PayloadTooLargeError extends Error {}

function readRawBody(req: VercelRequest, maxBytes = MAX_JSON_BODY_BYTES): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        let total = 0;
        let tooLarge = false;
        req.on('data', (chunk: Buffer) => {
            if (tooLarge) return;
            total += chunk.length;
            if (total > maxBytes) {
                tooLarge = true;
                chunks.length = 0;
                reject(new PayloadTooLargeError('Request body too large'));
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

function parseJsonBody(body: Buffer): Record<string, unknown> {
    const parsed: unknown = JSON.parse(body.toString());
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Invalid request body.');
    }
    return parsed as Record<string, unknown>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const configError = checkSupabaseAdminConfig();
    if (configError) return res.status(configError.statusCode).json(configError.body);

    const { error: authError } = requireAdminSession(req.headers.cookie as string);
    if (authError) return res.status(authError.statusCode).json(authError.body);

    const supabase = getAdminSupabase();

    try {
        if (req.method === 'GET') {
            const { data, error } = await supabase
                .from('media')
                .select('id, url, type, description, event_id, created_at, events(id, title, status)')
                .order('created_at', { ascending: false });
            if (error) return res.status(500).json({ error: error.message });
            return res.json({ media: (data || []).map(item => normalizeMediaUrls(item, ['url'])) });
        }

        if (req.method === 'POST') {
            const body = parseJsonBody(await readRawBody(req));
            const bucket = getMediaBucketName();

            if (body.action === 'prepare') {
                if (!await ensureMediaBucketPublic(supabase, bucket)) {
                    return res.status(503).json({ error: 'Unable to configure media storage. Please try again later.' });
                }
                const fileName = typeof body.fileName === 'string' ? body.fileName.trim() : '';
                const contentType = typeof body.contentType === 'string' ? body.contentType : '';
                const size = typeof body.size === 'number' ? body.size : 0;
                const mediaType = getMediaTypeForUpload(fileName, contentType);
                if (!fileName || !mediaType) {
                    return res.status(400).json({ error: 'Unsupported file. Allowed: JPEG, PNG, GIF, WebP, AVIF images and MP4, WebM, OGG, MOV videos.' });
                }
                if (!Number.isSafeInteger(size) || size <= 0) {
                    return res.status(400).json({ error: 'The selected file is empty or invalid.' });
                }
                if (size > MAX_MEDIA_FILE_BYTES) {
                    return res.status(413).json({ error: 'File too large. Maximum upload size is 25 MB.' });
                }

                const safeName = sanitizeFileName(fileName) || 'upload';
                const filePath = `uploads/${Date.now()}-${randomUUID()}-${safeName}`;
                const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(filePath);
                if (error) return res.status(500).json({ error: `Unable to prepare storage upload: ${error.message}` });
                return res.json({ bucket, path: data.path, token: data.token, type: mediaType });
            }

            if (body.action === 'complete') {
                const filePath = typeof body.path === 'string' ? body.path : '';
                const fileName = filePath.split('/').pop() || '';
                const mediaType = getMediaTypeForUpload(fileName, typeof body.contentType === 'string' ? body.contentType : '');
                if (!/^uploads\/[a-zA-Z0-9._-]+$/.test(filePath) || !mediaType) {
                    return res.status(400).json({ error: 'Invalid uploaded file.' });
                }

                const { data: storedFiles, error: listError } = await supabase.storage
                    .from(bucket)
                    .list('uploads', { search: fileName, limit: 1 });
                if (listError) return res.status(500).json({ error: `Unable to verify uploaded file: ${listError.message}` });
                if (!storedFiles?.some((storedFile) => storedFile.name === fileName)) {
                    return res.status(400).json({ error: 'Uploaded file was not found in storage.' });
                }

                const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);
                const url = normalizeMediaUrl(publicData.publicUrl);
                if (!url) return res.status(500).json({ error: 'Unable to generate public URL.' });

                const eventId = typeof body.event_id === 'string' ? body.event_id.trim() : '';
                const description = typeof body.description === 'string' ? body.description.trim() : '';
                const { data, error: dbError } = await supabase.from('media').insert({
                    url,
                    type: mediaType,
                    description: description || null,
                    event_id: eventId || null,
                }).select('*').single();

                if (dbError) {
                    await removeMediaObject(supabase, url);
                    return res.status(500).json({ error: `Database insert failed: ${dbError.message}` });
                }
                return res.status(201).json({ media: normalizeMediaUrls(data, ['url']) });
            }

            return res.status(400).json({ error: 'Unsupported upload action.' });
        }

        if (req.method === 'DELETE') {
            // For DELETE with bodyParser: false, parse body manually (small JSON only)
            const rawBody = await readRawBody(req, 64 * 1024);
            const body = parseJsonBody(rawBody);
            const { id } = body;
            if (!id) return res.status(400).json({ error: 'Media id is required.' });

            const { data: record } = await supabase.from('media').select('url').eq('id', id).single();
            await removeMediaObject(supabase, record?.url);
            try {
                await clearPublishedMediaReferences(supabase, record?.url);
            } catch (refError) {
                console.warn('clearPublishedMediaReferences failed:', refError);
            }

            const { error } = await supabase.from('media').delete().eq('id', id);
            if (error) return res.status(500).json({ error: error.message });
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            return res.json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('/api/admin/media error:', err);
        const statusCode = err instanceof PayloadTooLargeError ? 413 : err instanceof SyntaxError ? 400 : 500;
        return res.status(statusCode).json({ error: err instanceof Error ? err.message : 'Internal server error' });
    }
}
