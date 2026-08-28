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

export function hasEventLink(eventId: unknown): eventId is string {
    return typeof eventId === 'string' && eventId.trim().length > 0;
}

export function parseSupabaseStorageUrl(url: string | null | undefined): { bucket: string; path: string } | null {
    const cleaned = normalizeMediaUrl(url);
    if (!cleaned) return null;

    try {
        const parsed = new URL(cleaned);
        const match = parsed.pathname.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/(.+)$/);
        if (!match) return null;

        return {
            bucket: decodeURIComponent(match[1]),
            path: decodeURIComponent(match[2]),
        };
    } catch {
        return null;
    }
}

export function isSameMediaObject(left: string | null | undefined, right: string | null | undefined): boolean {
    if (typeof left === 'string' && typeof right === 'string' && left.trim() === right.trim()) {
        return left.trim().length > 0;
    }

    const parsedLeft = parseSupabaseStorageUrl(left);
    const parsedRight = parseSupabaseStorageUrl(right);
    return Boolean(
        parsedLeft &&
        parsedRight &&
        parsedLeft.bucket === parsedRight.bucket &&
        parsedLeft.path === parsedRight.path,
    );
}

export function stripHtmlMediaByUrl(html: string | null | undefined, mediaUrl: string | null | undefined): string | null | undefined {
    if (typeof html !== 'string' || !mediaUrl) return html;

    return html.replace(/<img\b[^>]*>/gi, (tag) => {
        const srcMatch = tag.match(/\bsrc=(["'])(.*?)\1/i);
        if (!srcMatch) return tag;
        return isSameMediaObject(srcMatch[2], mediaUrl) ? '' : tag;
    });
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

// Tags that can execute script or load external/active content. Stripped entirely
// (including their contents) before admin-authored rich text is stored/rendered.
const DANGEROUS_TAG_BLOCK_PATTERN = /<\s*(script|style|iframe|object|embed|svg|math|template)\b[\s\S]*?<\s*\/\s*\1\s*>/gi;
// Self-closing / unclosed variants of structural tags that should never appear in body HTML.
const DANGEROUS_TAG_VOID_PATTERN = /<\s*\/?\s*(script|style|iframe|object|embed|svg|math|template|link|meta|base|form)\b[^>]*>/gi;
// Inline event handlers e.g. onclick="..." onerror='...' onload=foo
const EVENT_HANDLER_ATTR_PATTERN = /\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
// javascript:/vbscript:/data: in href/src/style attributes
const ACTIVE_URI_ATTR_PATTERN = /\s(?:href|src|xlink:href|action|formaction|style)\s*=\s*(["']?)\s*(?:javascript|vbscript|data)\s*:[^"'>\s]*\1/gi;

/**
 * Defence-in-depth sanitizer for admin-authored rich text (Quill HTML).
 * Removes script-bearing tags, inline event handlers, and active-content URIs
 * while preserving ordinary formatting (p, headings, lists, links, images, etc.).
 * Not a replacement for a full DOM sanitizer, but blocks the common stored-XSS
 * vectors before the HTML is persisted and later rendered via dangerouslySetInnerHTML.
 */
export function sanitizeHtmlContent(html: string | null | undefined): string | null | undefined {
    if (typeof html !== 'string') {
        return html;
    }

    let cleaned = html;
    let previous: string;
    // Loop to defeat nested / overlapping constructs revealed after a first pass.
    do {
        previous = cleaned;
        cleaned = cleaned
            .replace(DANGEROUS_TAG_BLOCK_PATTERN, '')
            .replace(DANGEROUS_TAG_VOID_PATTERN, '')
            .replace(EVENT_HANDLER_ATTR_PATTERN, '')
            .replace(ACTIVE_URI_ATTR_PATTERN, '');
    } while (cleaned !== previous);

    return cleaned;
}