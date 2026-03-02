import { NextResponse } from 'next/server';
import { resend, SENDER_EMAIL } from '@/lib/resend';
import { ADMIN_OTP_COOKIE, ADMIN_SESSION_COOKIE } from '@/lib/admin-constants';
import {
    createAdminSessionToken,
    createOtpToken,
    getAdminCredentials,
    verifyAdminSessionToken,
    verifyOtpToken,
} from '@/lib/admin-auth';

export async function POST(req: Request) {
    try {
        const { action, email, password, otp } = await req.json();

        const { email: targetEmail, password: targetPassword } = getAdminCredentials();

        if (action === 'request_otp') {
            if (email !== targetEmail || password !== targetPassword) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            if (!resend) {
                return NextResponse.json({ error: 'Email service is not configured. Set RESEND_API_KEY.' }, { status: 503 });
            }

            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

            const otpState = createOtpToken(email, generatedOtp);

            const { error } = await resend.emails.send({
                from: SENDER_EMAIL,
                to: email,
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
            const otpCookie = req.headers.get('cookie')
                ?.split(';')
                .map((item) => item.trim())
                .find((item) => item.startsWith(`${ADMIN_OTP_COOKIE}=`))
                ?.split('=')[1];

            if (!otpCookie || !otp || !verifyOtpToken(decodeURIComponent(otpCookie), email, otp)) {
                return NextResponse.json({ error: 'Incorrect OTP' }, { status: 400 });
            }

            const session = createAdminSessionToken(email);
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
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const sessionCookie = req.headers.get('cookie')
        ?.split(';')
        .map((item) => item.trim())
        .find((item) => item.startsWith(`${ADMIN_SESSION_COOKIE}=`))
        ?.split('=')[1];

    const session = sessionCookie ? verifyAdminSessionToken(decodeURIComponent(sessionCookie)) : null;

    return NextResponse.json({
        authenticated: Boolean(session),
        resendConfigured: Boolean(process.env.RESEND_API_KEY),
        adminEmail: getAdminCredentials().email,
    });
}
