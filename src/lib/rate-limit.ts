type RateLimitRecord = {
    timestamps: number[];
};

const rateLimits = new Map<string, RateLimitRecord>();

export type RateLimitResult =
    | { isLimited: false }
    | { isLimited: true; statusCode: 429; body: { error: string } };

export function rateLimit(ip: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const record = rateLimits.get(ip) || { timestamps: [] };

    record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);

    if (record.timestamps.length >= limit) {
        return {
            isLimited: true,
            statusCode: 429,
            body: { error: 'Too many requests. Please try again later.' },
        };
    }

    record.timestamps.push(now);
    rateLimits.set(ip, record);

    return { isLimited: false };
}

export function getIPFromHeader(forwardedFor: string | string[] | undefined): string {
    if (!forwardedFor) return '127.0.0.1';
    const header = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    return header.split(',')[0].trim();
}
