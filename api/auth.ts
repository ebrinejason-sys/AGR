import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isResendConfigured, resend, SENDER_EMAIL } from '../src/lib/resend.js';
import { rateLimit, getIPFromHeader, securityLog } from '../src/lib/rate-limit.js';
import { ADMIN_OTP_COOKIE, ADMIN_SESSION_COOKIE } from '../src/lib/admin-constants.js';
import { getCookieValue } from '../src/lib/admin-api.js';
import {
    createAdminSessionToken,
    createOtpToken,
    getAdminCredentials,
    getMissingAdminAuthEnvVars,
    verifyAdminSessionToken,
    verifyOtpToken,
    safeCompare,
    generateSecureOtp,
} from '../src/lib/admin-auth.js';

const normalizeEmail = (value: unknown) => typeof value === 'string' ? value.trim().toLowerCase() : '';
const normalizeOtp = (value: unknown) => typeof value === 'string' ? value.replace(/\D/g, '').slice(0, 6) : '';
const normalizeText = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const safeDecodeCookie = (value: string) => { try { return decodeURIComponent(value); } catch { return value; } };

function applySecurityHeaders(res: VercelResponse) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    }
}

function setCookie(res: VercelResponse, name: string, value: string, maxAge: number) {
    const secure = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie',
        `${name}=${encodeURIComponent(value)}; HttpOnly; ${secure ? 'Secure; ' : ''}SameSite=Strict; Max-Age=${maxAge}; Path=/`
    );
}

function clearCookie(res: VercelResponse, name: string) {
    const secure = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie',
        `${name}=; HttpOnly; ${secure ? 'Secure; ' : ''}SameSite=Strict; Max-Age=0; Path=/`
    );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    applySecurityHeaders(res);

    if (req.method === 'GET') {
        const missingAdminEnvVars = getMissingAdminAuthEnvVars();
        const sessionCookie = getCookieValue(req.headers.cookie as string, ADMIN_SESSION_COOKIE);
        const session = sessionCookie ? verifyAdminSessionToken(safeDecodeCookie(sessionCookie)) : null;

        // NEVER expose adminEmail or env var names to the frontend in production
        return res.json({
            authenticated: Boolean(session),
            authConfigured: missingAdminEnvVars.length === 0,
            // Only expose missing var names during local dev
            missingAdminEnvVars: process.env.NODE_ENV !== 'production' ? missingAdminEnvVars : [],
            resendConfigured: isResendConfigured,
        });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const ip = getIPFromHeader(req.headers['x-forwarded-for']);
        // 5 attempts per 15 minutes per IP (down from 10 min for tighter security)
        const rl = rateLimit(ip, 5, 15 * 60 * 1000);
        if (rl.isLimited) {
            securityLog({ type: 'rate_limited', ip, endpoint: '/api/auth' });
            return res.status(rl.statusCode).json(rl.body);
        }

        const payload = req.body || {};
        const action = normalizeText(payload?.action);
        const email = payload?.email;
        const password = normalizeText(payload?.password);
        const otp = payload?.otp;

        if (!action) return res.status(400).json({ error: 'Action is required.' });

        const missingAdminEnvVars = getMissingAdminAuthEnvVars();
        if (missingAdminEnvVars.length > 0 && action !== 'logout') {
            return res.status(503).json({ error: `Admin authentication is not configured. Missing: ${missingAdminEnvVars.join(', ')}` });
        }

        const { email: targetEmail, password: targetPassword } = getAdminCredentials();
        const normalizedEmail = normalizeEmail(email);
        const normalizedTargetEmail = normalizeEmail(targetEmail);
        const normalizedOtp = normalizeOtp(otp);

        if (action === 'request_otp') {
            securityLog({ type: 'auth_attempt', ip, endpoint: '/api/auth', detail: 'request_otp' });
            if (!safeCompare(normalizedEmail, normalizedTargetEmail) || !safeCompare(password, targetPassword)) {
                securityLog({ type: 'auth_failure', ip, endpoint: '/api/auth', detail: 'Bad credentials' });
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            if (!resend) return res.status(503).json({ error: 'Email service is not configured. Set RESEND_API_KEY.' });

            const generatedOtp = generateSecureOtp();
            const otpState = createOtpToken(normalizedEmail, generatedOtp);

            const { error } = await resend.emails.send({
                from: SENDER_EMAIL,
                to: normalizedEmail,
                subject: 'Your Admin Login OTP - African Girl Rise',
                html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eee;border-radius:10px;"><h2 style="color:#d81b60;">Admin Login Attempt</h2><p>Your One-Time Password:</p><div style="background:#f4f4f4;padding:15px;text-align:center;border-radius:8px;margin:20px 0;"><h1 style="letter-spacing:5px;color:#4a148c;margin:0;">${generatedOtp}</h1></div><p style="color:#666;font-size:14px;">Expires in 10 minutes.</p></div>`,
            });

            if (error) {
                console.error('Failed to send OTP email:', error);
                return res.status(500).json({ error: 'Failed to send OTP email. Email service may be unavailable.' });
            }

            setCookie(res, ADMIN_OTP_COOKIE, otpState.token, otpState.maxAge);
            securityLog({ type: 'auth_attempt', ip, endpoint: '/api/auth', detail: 'OTP email sent' });
            return res.json({ success: true, message: 'OTP sent successfully' });
        }

        if (action === 'verify_otp') {
            const otpCookie = getCookieValue(req.headers.cookie as string, ADMIN_OTP_COOKIE);
            if (!otpCookie || !normalizedOtp || !verifyOtpToken(safeDecodeCookie(otpCookie), normalizedEmail, normalizedOtp)) {
                return res.status(400).json({ error: 'Incorrect OTP' });
            }

            const session = createAdminSessionToken(normalizedEmail);
            const cookies = [
                `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(session.token)}; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}SameSite=Strict; Max-Age=${session.maxAge}; Path=/`,
                `${ADMIN_OTP_COOKIE}=; HttpOnly; Max-Age=0; Path=/`,
            ];
            res.setHeader('Set-Cookie', cookies);
            securityLog({ type: 'auth_success', ip, endpoint: '/api/auth', detail: 'Admin session created' });
            return res.json({ success: true, message: 'OTP verified' });
        }

        if (action === 'logout') {
            clearCookie(res, ADMIN_SESSION_COOKIE);
            return res.json({ success: true });
        }

        return res.status(400).json({ error: 'Invalid action' });
    } catch (err) {
        console.error('Auth API Error:', err);
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
    }
}
