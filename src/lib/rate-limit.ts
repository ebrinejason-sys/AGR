import { NextResponse } from 'next/server';

type RateLimitRecord = {
    timestamps: number[];
};

const rateLimits = new Map<string, RateLimitRecord>();

/**
 * Basic in-memory rate limiter.
 * NOTE: This resets when the serverless function cold starts.
 * For production with high traffic, use Redis.
 */
export function rateLimit(ip: string, limit: number, windowMs: number) {
    const now = Date.now();
    const record = rateLimits.get(ip) || { timestamps: [] };

    // Filter out old timestamps
    record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);

    if (record.timestamps.length >= limit) {
        return {
            isLimited: true,
            response: NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            )
        };
    }

    record.timestamps.push(now);
    rateLimits.set(ip, record);

    return { isLimited: false, response: NextResponse.next() };
}

/**
 * Extracts the IP address from the request.
 */
export function getIP(request: Request): string {
    const xff = request.headers.get('x-forwarded-for');
    if (xff) return xff.split(',')[0].trim();
    return '127.0.0.1';
}
