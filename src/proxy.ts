import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-constants';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only process admin routes
    if (!pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const isLoginPage = pathname === '/admin/login';

    // Redirect to login if no session and not already on login page
    if (!sessionCookie && !isLoginPage) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
