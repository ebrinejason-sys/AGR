/**
 * In-memory sliding-window rate limiter.
 *
 * Note: In Vercel serverless, each function instance has its own memory.
 * This is a best-effort, per-instance guard.  For production at scale,
 * back this with Redis / Upstash.
 */

interface RateLimitRecord {
  timestamps: number[];
  blocked?: boolean;
  blockedUntil?: number;
}

const store = new Map<string, RateLimitRecord>();

// Aggressive blocker: if a single IP exceeds MAX_STRIKES hard-limit attempts,
// block it for BLOCK_WINDOW_MS regardless of future call frequency.
const MAX_STRIKES = 20;
const BLOCK_WINDOW_MS = 30 * 60 * 1000; // 30 min

export type RateLimitResult =
  | { isLimited: false }
  | { isLimited: true; statusCode: 429; body: { error: string } };

export function rateLimit(ip: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const record = store.get(ip) ?? { timestamps: [] };

  // Check hard block
  if (record.blocked && record.blockedUntil && now < record.blockedUntil) {
    return {
      isLimited: true,
      statusCode: 429,
      body: { error: 'Too many requests. Your IP has been temporarily blocked.' },
    };
  }

  // Lift expired block
  if (record.blocked && record.blockedUntil && now >= record.blockedUntil) {
    record.blocked = false;
    record.blockedUntil = undefined;
    record.timestamps = [];
  }

  // Slide the window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    // Check for hard block escalation
    const allTime = record.timestamps.length;
    if (allTime >= MAX_STRIKES) {
      record.blocked = true;
      record.blockedUntil = now + BLOCK_WINDOW_MS;
      store.set(ip, record);
    }

    return {
      isLimited: true,
      statusCode: 429,
      body: { error: 'Too many requests. Please try again later.' },
    };
  }

  record.timestamps.push(now);
  store.set(ip, record);
  return { isLimited: false };
}

/**
 * Safely extract the first real IP from x-forwarded-for.
 * Falls back to "127.0.0.1" when header is absent (local dev / test).
 */
export function getIPFromHeader(forwardedFor: string | string[] | undefined): string {
  if (!forwardedFor) return '127.0.0.1';
  const header = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
  // Take the leftmost (originating) IP and strip any port
  const raw = header.split(',')[0].trim();
  // Basic sanity check — prevent log injection
  return /^[\d.:a-fA-F]+$/.test(raw) ? raw : '0.0.0.0';
}

/**
 * Structured security audit log for auth events & anomalies.
 */
export function securityLog(event: {
  type: 'auth_attempt' | 'auth_success' | 'auth_failure' | 'rate_limited' | 'api_error' | 'suspicious';
  ip: string;
  detail?: string;
  endpoint?: string;
}) {
  const ts = new Date().toISOString();
  console.log(
    JSON.stringify({
      timestamp: ts,
      level: event.type === 'auth_success' ? 'INFO' : 'WARN',
      ...event,
    })
  );
}
