import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminSupabase } from '../../src/lib/supabase.server.js';
import { requireAdminSession, checkSupabaseAdminConfig } from '../../src/lib/admin-api.js';
import { getMediaBucketName, normalizeMediaUrl, normalizeMediaUrls } from '../../src/lib/media.js';
import { ensureMediaBucketPublic, removeMediaObject, clearPublishedMediaReferences } from '../../src/lib/media-storage.js';

// Disable Vercel body parser so we can handle raw multipart ourselves
export const config = { api: { bodyParser: false } };

const sanitizeFileName = (n: string) => n.replace(/[^a-zA-Z0-9._-]/g, '-');

// Upload constraints — enforced server-side (client MIME/size cannot be trusted).
const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB per file
const MAX_REQUEST_BYTES = MAX_FILE_BYTES + 1024 * 1024; // allow for multipart overhead
// Whitelist of safe, non-active media content types. SVG is intentionally excluded
// because it can carry inline script (stored XSS when rendered inline).
const ALLOWED_CONTENT_TYPES = new Set([
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif',
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
]);
const ALLOWED_EXTENSION_PATTERN = /\.(jpe?g|png|gif|webp|avif|mp4|webm|ogg|mov)$/i;

class PayloadTooLargeError extends Error {}

function readRawBody(req: VercelRequest, maxBytes = MAX_REQUEST_BYTES): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        let total = 0;
        req.on('data', (chunk: Buffer) => {
            total += chunk.length;
            if (total > maxBytes) {
                reject(new PayloadTooLargeError('Payload too large'));
                req.destroy();
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

function parseMultipart(body: Buffer, boundary: string): {
    fields: Record<string, string>;
    file?: { data: Buffer; name: string; type: string };
} {
    const fields: Record<string, string> = {};
    let file: { data: Buffer; name: string; type: string } | undefined;

    const sep = Buffer.from(`--${boundary}`);
    const parts = splitBuffer(body, sep);

    for (const part of parts) {
        if (part.length === 0) continue;
        const crlfcrlf = part.indexOf('\r\n\r\n');
        if (crlfcrlf === -1) continue;

        const headerSection = part.slice(0, crlfcrlf).toString();
        const valueBuffer = part.slice(crlfcrlf + 4);
        // Remove trailing CRLF
        const value = valueBuffer.slice(0, valueBuffer.length - 2);

        const dispMatch = headerSection.match(/Content-Disposition:\s*form-data;([^;\r\n]+(?:;[^;\r\n]+)*)/i);
        if (!dispMatch) continue;

        const nameMatch = dispMatch[1].match(/name="([^"]+)"/i);
        const filenameMatch = dispMatch[1].match(/filename="([^"]+)"/i);
        const typeMatch = headerSection.match(/Content-Type:\s*([^\r\n]+)/i);

        if (!nameMatch) continue;
        const fieldName = nameMatch[1];

        if (filenameMatch) {
            file = {
                data: value,
                name: filenameMatch[1],
                type: typeMatch ? typeMatch[1].trim() : 'application/octet-stream',
            };
        } else {
            fields[fieldName] = value.toString();
        }
    }

    return { fields, file };
}

function splitBuffer(buf: Buffer, sep: Buffer): Buffer[] {
    const result: Buffer[] = [];
    let start = 0;
    while (start < buf.length) {
        const idx = buf.indexOf(sep, start);
        if (idx === -1) { result.push(buf.slice(start)); break; }
        result.push(buf.slice(start, idx));
        start = idx + sep.length;
    }
    return result;
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
            const contentType = req.headers['content-type'] || '';
            const boundaryMatch = contentType.match(/boundary=([^\s;]+)/);
            if (!boundaryMatch) return res.status(400).json({ error: 'Missing multipart boundary.' });

            const declaredLength = Number(req.headers['content-length']);
            if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
                return res.status(413).json({ error: 'File too large. Maximum upload size is 25 MB.' });
            }

            let rawBody: Buffer;
            try {
                rawBody = await readRawBody(req);
            } catch (err) {
                if (err instanceof PayloadTooLargeError) {
                    return res.status(413).json({ error: 'File too large. Maximum upload size is 25 MB.' });
                }
                throw err;
            }

            const { fields, file } = parseMultipart(rawBody, boundaryMatch[1]);

            if (!file) return res.status(400).json({ error: 'File is required.' });
            if (file.data.length === 0) return res.status(400).json({ error: 'Uploaded file is empty.' });
            if (file.data.length > MAX_FILE_BYTES) {
                return res.status(413).json({ error: 'File too large. Maximum upload size is 25 MB.' });
            }

            const declaredType = file.type.toLowerCase().split(';')[0].trim();
            if (!ALLOWED_CONTENT_TYPES.has(declaredType) || !ALLOWED_EXTENSION_PATTERN.test(file.name || '')) {
                return res.status(400).json({ error: 'Unsupported file. Allowed: JPEG, PNG, GIF, WebP, AVIF images and MP4, WebM, OGG, MOV videos.' });
            }

            const bucket = getMediaBucketName();
            await ensureMediaBucketPublic(supabase, bucket);
            const fileName = `${Date.now()}-${sanitizeFileName(file.name || 'upload')}`;
            const filePath = `uploads/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file.data, { contentType: declaredType, upsert: false });

            if (uploadError) return res.status(500).json({ error: `Storage upload failed: ${uploadError.message}` });

            const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);
            const url = normalizeMediaUrl(publicData.publicUrl);
            if (!url) {
                await supabase.storage.from(bucket).remove([filePath]);
                return res.status(500).json({ error: 'Unable to generate public URL.' });
            }

            const eventId = fields.event_id?.trim();
            const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
            const { data, error: dbError } = await supabase.from('media').insert({
                url, type: mediaType,
                description: fields.description?.trim() || null,
                event_id: eventId || null,
            }).select('*').single();

            if (dbError) {
                await supabase.storage.from(bucket).remove([filePath]);
                return res.status(500).json({ error: `Database insert failed: ${dbError.message}` });
            }
            return res.status(201).json({ media: normalizeMediaUrls(data, ['url']) });
        }

        if (req.method === 'DELETE') {
            // For DELETE with bodyParser: false, parse body manually (small JSON only)
            const rawBody = await readRawBody(req, 64 * 1024);
            const body = JSON.parse(rawBody.toString());
            const { id } = body || {};
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
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
    }
}
