import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-constants';
import { verifyAdminSessionToken } from '@/lib/admin-auth';

export const requireAdminSession = (request: Request) => {
    const sessionCookie = request.headers.get('cookie')
        ?.split(';')
        .map((item) => item.trim())
        .find((item) => item.startsWith(`${ADMIN_SESSION_COOKIE}=`))
        ?.split('=')[1];

    if (!sessionCookie) {
        return { session: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    const session = verifyAdminSessionToken(decodeURIComponent(sessionCookie));
    if (!session) {
        return { session: null, error: NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 }) };
    }

    return { session, error: null };
};
