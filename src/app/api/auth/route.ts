import { NextResponse } from 'next/server';
import { isResendConfigured, resend, SENDER_EMAIL } from '@/lib/resend';
import { ADMIN_OTP_COOKIE, ADMIN_SESSION_COOKIE } from '@/lib/admin-constants';
import { getCookieValue } from '@/lib/admin-api';
import {
    createAdminSessionToken,
    createOtpToken,
    getAdminCredentials,
    getMissingAdminAuthEnvVars,
    verifyAdminSessionToken,
    verifyOtpToken,
} from '@/lib/admin-auth';

const normalizeEmail = (value: unknown) => typeof value === 'string' ? value.trim().toLowerCase() : '';
const normalizeOtp = (value: unknown) => typeof value === 'string' ? value.replace(/\D/g, '').slice(0, 6) : '';

export async function POST(req: Request) {
    try {
        const { action, email, password, otp } = await req.json();

        const missingAdminEnvVars = getMissingAdminAuthEnvVars();
        if (missingAdminEnvVars.length > 0 && action !== 'logout') {
            return NextResponse.json(
                {
                    error: `Admin authentication is not configured. Missing: ${missingAdminEnvVars.join(', ')}`,
                },
                { status: 503 }
            );
        }

        const { email: targetEmail, password: targetPassword } = getAdminCredentials();
        const normalizedEmail = normalizeEmail(email);
        const normalizedTargetEmail = normalizeEmail(targetEmail);
        const normalizedOtp = normalizeOtp(otp);

        if (action === 'request_otp') {
            if (normalizedEmail !== normalizedTargetEmail || password !== targetPassword) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            if (!resend) {
                return NextResponse.json({ error: 'Email service is not configured. Set RESEND_API_KEY.' }, { status: 503 });
            }

            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

            const otpState = createOtpToken(normalizedEmail, generatedOtp);

            const { error } = await resend.emails.send({
                from: SENDER_EMAIL,
                to: normalizedEmail,
                subject: 'Your Admin Login OTP - African Girl Rise',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #d81b60;">Admin Login Attempt</h2>
            <p>Someone is attempting to log into the African Girl Rise Admin Dashboard.</p>
            <p>Here is your One-Time Password (OTP):</p>
            <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="letter-spacing: 5px; color: #4a148c; margin: 0;">${generatedOtp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `
            });

            if (error) {
                console.error("Resend Error:", error);
                return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 });
            }

            const response = NextResponse.json({ success: true, message: 'OTP sent successfully' });
            response.cookies.set({
                name: ADMIN_OTP_COOKIE,
                value: otpState.token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: otpState.maxAge,
                path: '/',
            });

            return response;
        }

        if (action === 'verify_otp') {
            const otpCookie = getCookieValue(req.headers.get('cookie'), ADMIN_OTP_COOKIE);

            if (!otpCookie || !normalizedOtp || !verifyOtpToken(decodeURIComponent(otpCookie), normalizedEmail, normalizedOtp)) {
                return NextResponse.json({ error: 'Incorrect OTP' }, { status: 400 });
            }

            const session = createAdminSessionToken(normalizedEmail);
            const response = NextResponse.json({ success: true, message: 'OTP verified' });

            response.cookies.set({
                name: ADMIN_SESSION_COOKIE,
                value: session.token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: session.maxAge,
                path: '/',
            });

            response.cookies.set({
                name: ADMIN_OTP_COOKIE,
                value: '',
                maxAge: 0,
                path: '/',
            });

            return response;
        }

        if (action === 'logout') {
            const response = NextResponse.json({ success: true });
            response.cookies.set({
                name: ADMIN_SESSION_COOKIE,
                value: '',
                maxAge: 0,
                path: '/',
            });
            return response;
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (err) {
        console.error('Auth API Error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const missingAdminEnvVars = getMissingAdminAuthEnvVars();
    const sessionCookie = getCookieValue(req.headers.get('cookie'), ADMIN_SESSION_COOKIE);

    const session = sessionCookie ? verifyAdminSessionToken(decodeURIComponent(sessionCookie)) : null;

    let adminEmail = null;
    try {
        adminEmail = getAdminCredentials().email;
    } catch {
        // Handle case where env vars are missing
    }

    return NextResponse.json({
        authenticated: Boolean(session),
        authConfigured: missingAdminEnvVars.length === 0,
        missingAdminEnvVars,
        resendConfigured: isResendConfigured,
        adminEmail,
    });
}
