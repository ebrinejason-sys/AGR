const CONTROL_CHAR_PATTERN = /(?:%0D%0A|%0A|%0D|%09|[\r\n\t])+/gi;
const HTML_URL_ATTR_PATTERN = /\b(src|href)=(["'])(.*?)\2/gi;

export function getMediaBucketName(bucketName = process.env.SUPABASE_MEDIA_BUCKET): string {
    const trimmed = bucketName?.trim();
    return trimmed ? trimmed : 'media';
}

export function normalizeMediaUrl(url: string | null | undefined): string | null | undefined {
    if (typeof url !== 'string') {
        return url;
    }

    const cleaned = url.replace(CONTROL_CHAR_PATTERN, '').trim();
    return cleaned.length > 0 ? cleaned : null;
}

export function normalizeMediaUrls<T extends Record<string, unknown>>(
    record: T,
    keys: Array<keyof T>
): T {
    let changed = false;
    const nextRecord = { ...record };

    for (const key of keys) {
        const value = nextRecord[key];
        if (typeof value !== 'string') {
            continue;
        }

        const normalized = normalizeMediaUrl(value);
        if (normalized !== value) {
            nextRecord[key] = normalized as T[keyof T];
            changed = true;
        }
    }

    return changed ? nextRecord : record;
}

export function normalizeRichTextMediaUrls(html: string | null | undefined): string | null | undefined {
    if (typeof html !== 'string') {
        return html;
    }

    return html.replace(HTML_URL_ATTR_PATTERN, (_match, attribute, quote, value) => {
        const normalized = normalizeMediaUrl(value) ?? '';
        return `${attribute}=${quote}${normalized}${quote}`;
    });
}