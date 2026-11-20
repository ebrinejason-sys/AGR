import type { SupabaseClient } from '@supabase/supabase-js';
import { getMediaBucketName, isSameMediaObject, MAX_MEDIA_FILE_BYTES, normalizeMediaUrl, parseSupabaseStorageUrl, stripHtmlMediaByUrl } from './media.js';

let mediaBucketEnsured = false;

/**
 * Ensures the media storage bucket exists AND is public so that getPublicUrl()
 * returns URLs that load for anonymous visitors. A bucket created privately
 * (the Supabase default) causes uploaded images to 403 on the public site even
 * though the admin UI can still list the rows.
 */
export async function ensureMediaBucketPublic(
    supabase: SupabaseClient,
    bucket = getMediaBucketName(),
): Promise<boolean> {
    if (mediaBucketEnsured) return true;
    try {
        const { data, error } = await supabase.storage.getBucket(bucket);
        if (error || !data) {
            const { error: createError } = await supabase.storage.createBucket(bucket, {
                public: true,
                fileSizeLimit: MAX_MEDIA_FILE_BYTES,
            });
            if (createError) throw createError;
        } else {
            const currentLimit = data.file_size_limit == null ? null : Number(data.file_size_limit);
            const hasFileSizeLimit = currentLimit !== null && Number.isFinite(currentLimit) && currentLimit > 0;
            const fileSizeLimit = hasFileSizeLimit ? Math.min(currentLimit, MAX_MEDIA_FILE_BYTES) : MAX_MEDIA_FILE_BYTES;
            if (!data.public || currentLimit !== fileSizeLimit) {
                const { error: updateError } = await supabase.storage.updateBucket(bucket, {
                    public: true,
                    fileSizeLimit,
                });
                if (updateError) throw updateError;
            }
        }
        mediaBucketEnsured = true;
        return true;
    } catch (err) {
        console.warn('ensureMediaBucketPublic failed (continuing):', err);
        return false;
    }
}

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24; // 24 hours; refreshed on every public API request

export async function withAccessibleMediaUrls<T extends Record<string, unknown>>(
    supabase: SupabaseClient,
    records: T[],
    keys: Array<keyof T>,
): Promise<T[]> {
    const pathsByBucket = new Map<string, Set<string>>();

    for (const record of records) {
        for (const key of keys) {
            const parsed = parseSupabaseStorageUrl(typeof record[key] === 'string' ? String(record[key]) : null);
            if (!parsed) continue;
            const paths = pathsByBucket.get(parsed.bucket) ?? new Set<string>();
            paths.add(parsed.path);
            pathsByBucket.set(parsed.bucket, paths);
        }
    }

    if (pathsByBucket.size === 0) {
        return records.map((record) => normalizeRecordUrls(record, keys));
    }

    const signedByBucketPath = new Map<string, string>();

    await Promise.all(
        [...pathsByBucket.entries()].map(async ([bucket, paths]) => {
            const { data, error } = await supabase.storage.from(bucket).createSignedUrls([...paths], SIGNED_URL_TTL_SECONDS);
            if (error || !data) {
                console.warn(`createSignedUrls failed for bucket "${bucket}":`, error?.message || error);
                return;
            }

            for (const item of data) {
                if (!item.path || !item.signedUrl) continue;
                signedByBucketPath.set(`${bucket}:${item.path}`, item.signedUrl);
            }
        }),
    );

    return records.map((record) => {
        const nextRecord = { ...record };
        let changed = false;

        for (const key of keys) {
            const value = nextRecord[key];
            if (typeof value !== 'string') continue;

            const normalized = normalizeMediaUrl(value);
            const parsed = parseSupabaseStorageUrl(normalized);
            const signed = parsed ? signedByBucketPath.get(`${parsed.bucket}:${parsed.path}`) : null;
            const nextValue = (signed || normalized || value) as T[keyof T];

            if (nextValue !== value) {
                nextRecord[key] = nextValue;
                changed = true;
            }
        }

        return changed ? nextRecord : record;
    });
}

function normalizeRecordUrls<T extends Record<string, unknown>>(record: T, keys: Array<keyof T>): T {
    const nextRecord = { ...record };
    let changed = false;

    for (const key of keys) {
        const value = nextRecord[key];
        if (typeof value !== 'string') continue;
        const normalized = normalizeMediaUrl(value);
        if (normalized && normalized !== value) {
            nextRecord[key] = normalized as T[keyof T];
            changed = true;
        }
    }

    return changed ? nextRecord : record;
}

export async function removeMediaObject(
    supabase: SupabaseClient,
    url: string | null | undefined,
): Promise<void> {
    const parsed = parseSupabaseStorageUrl(url);
    if (!parsed) return;

    const { error } = await supabase.storage.from(parsed.bucket).remove([parsed.path]);
    if (error) {
        console.warn(`removeMediaObject failed for ${parsed.bucket}/${parsed.path}:`, error.message);
    }
}

export async function clearPublishedMediaReferences(
    supabase: SupabaseClient,
    mediaUrl: string | null | undefined,
): Promise<void> {
    const normalized = normalizeMediaUrl(mediaUrl);
    if (!normalized) return;

    const [{ data: stories }, { data: projects }, { data: events }] = await Promise.all([
        supabase.from('stories').select('id, image_url, content'),
        supabase.from('projects').select('id, image_url'),
        supabase.from('events').select('id, cover_image'),
    ]);

    await Promise.all([
        ...(stories || []).flatMap((story) => {
            const nextImage = isSameMediaObject(story.image_url, normalized) ? null : story.image_url;
            const nextContent = stripHtmlMediaByUrl(story.content, normalized);
            if (nextImage === story.image_url && nextContent === story.content) return [];
            return [supabase.from('stories').update({ image_url: nextImage, content: nextContent }).eq('id', story.id)];
        }),
        ...(projects || [])
            .filter((project) => isSameMediaObject(project.image_url, normalized))
            .map((project) => supabase.from('projects').update({ image_url: null }).eq('id', project.id)),
        ...(events || [])
            .filter((event) => isSameMediaObject(event.cover_image, normalized))
            .map((event) => supabase.from('events').update({ cover_image: null }).eq('id', event.id)),
    ]);
}
