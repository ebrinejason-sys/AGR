import { ADMIN_SESSION_COOKIE } from './admin-constants.js';
import { verifyAdminSessionToken } from './admin-auth.js';
import { isSupabaseAdminConfigured } from './supabase.server.js';

export type ApiError = { statusCode: number; body: { error: string } };

export const checkSupabaseAdminConfig = (): ApiError | null => {
    if (!isSupabaseAdminConfigured) {
        return {
            statusCode: 503,
            body: { error: 'Supabase Admin is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.' },
        };
    }
    return null;
};

export const getCookieValue = (cookieHeader: string | null | undefined, cookieName: string) => {
    if (!cookieHeader) return null;

    return cookieHeader
        .split(';')
        .map((item) => item.trim())
        .find((item) => item.startsWith(`${cookieName}=`))
        ?.slice(cookieName.length + 1) ?? null;
};

const safeDecodeCookie = (value: string) => {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
};

export const requireAdminSession = (cookieHeader: string | null | undefined) => {
    const sessionCookie = getCookieValue(cookieHeader, ADMIN_SESSION_COOKIE);

    if (!sessionCookie) {
        return { session: null, error: { statusCode: 401, body: { error: 'Unauthorized' } } as ApiError };
    }

    const session = verifyAdminSessionToken(safeDecodeCookie(sessionCookie));
    if (!session) {
        return { session: null, error: { statusCode: 401, body: { error: 'Session expired. Please log in again.' } } as ApiError };
    }

    return { session, error: null };
};
