import type { SupabaseClient } from '@supabase/supabase-js';
import { getMediaBucketName, normalizeMediaUrl, parseSupabaseStorageUrl } from './media.js';

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
): Promise<void> {
    if (mediaBucketEnsured) return;
    try {
        const { data, error } = await supabase.storage.getBucket(bucket);
        if (error || !data) {
            await supabase.storage.createBucket(bucket, { public: true });
        } else if (!data.public) {
            await supabase.storage.updateBucket(bucket, { public: true });
        }
        mediaBucketEnsured = true;
    } catch (err) {
        console.warn('ensureMediaBucketPublic failed (continuing):', err);
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
