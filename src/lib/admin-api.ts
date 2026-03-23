import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-constants';
import { verifyAdminSessionToken } from '@/lib/admin-auth';

export const getCookieValue = (cookieHeader: string | null, cookieName: string) => {
    if (!cookieHeader) return null;

    return cookieHeader
        .split(';')
        .map((item) => item.trim())
        .find((item) => item.startsWith(`${cookieName}=`))
        ?.slice(cookieName.length + 1) ?? null;
};

export const requireAdminSession = (request: Request) => {
    const sessionCookie = getCookieValue(request.headers.get('cookie'), ADMIN_SESSION_COOKIE);

    if (!sessionCookie) {
        return { session: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    const session = verifyAdminSessionToken(decodeURIComponent(sessionCookie));
    if (!session) {
        return { session: null, error: NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 }) };
    }

    return { session, error: null };
};
