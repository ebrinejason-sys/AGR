import { createHmac, timingSafeEqual } from 'crypto';
// Cookie constants exported from admin-constants.ts to avoid Edge Runtime issues
import { ADMIN_SESSION_COOKIE, ADMIN_OTP_COOKIE } from './admin-constants';

// Re-export for convenience (used by other modules)
export { ADMIN_SESSION_COOKIE, ADMIN_OTP_COOKIE };

type TokenPayload = {
    type: 'admin_session' | 'admin_otp';
    email: string;
    exp: number;
    nonce?: string;
    otpHash?: string;
};

const SESSION_DURATION_SECONDS = 60 * 60 * 12;
const OTP_DURATION_SECONDS = 60 * 10;

const b64urlEncode = (value: string) => Buffer.from(value, 'utf8').toString('base64url');
const b64urlDecode = (value: string) => Buffer.from(value, 'base64url').toString('utf8');

const getAuthSecret = () => {
    const secret = process.env.ADMIN_AUTH_SECRET || process.env.RESEND_API_KEY || 'agr-insecure-dev-secret';
    return secret;
};

const signRaw = (value: string) => createHmac('sha256', getAuthSecret()).update(value).digest('base64url');

const createSignedToken = (payload: TokenPayload) => {
    const encodedPayload = b64urlEncode(JSON.stringify(payload));
    const signature = signRaw(encodedPayload);
    return `${encodedPayload}.${signature}`;
};

const parseAndVerifyToken = (token: string): TokenPayload | null => {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;

    const expected = signRaw(encodedPayload);
    const providedBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expected, 'utf8');

    if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) {
        return null;
    }

    try {
        const payload = JSON.parse(b64urlDecode(encodedPayload)) as TokenPayload;
        if (Date.now() > payload.exp) {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
};

const hashOtp = (email: string, otp: string, nonce: string, exp: number) => {
    return signRaw(`${email}:${otp}:${nonce}:${exp}`);
};

export const getAdminCredentials = () => ({
    email: process.env.ADMIN_LOGIN_EMAIL || 'africangirlriseltd@gmail.com',
    password: process.env.ADMIN_LOGIN_PASSWORD || 'rise2026',
});

export const createOtpToken = (email: string, otp: string) => {
    const exp = Date.now() + OTP_DURATION_SECONDS * 1000;
    const nonce = crypto.randomUUID();
    const otpHash = hashOtp(email, otp, nonce, exp);

    return {
        token: createSignedToken({
            type: 'admin_otp',
            email,
            exp,
            nonce,
            otpHash,
        }),
        maxAge: OTP_DURATION_SECONDS,
    };
};

export const verifyOtpToken = (token: string, email: string, otp: string) => {
    const payload = parseAndVerifyToken(token);
    if (!payload || payload.type !== 'admin_otp' || payload.email !== email || !payload.nonce || !payload.otpHash) {
        return false;
    }

    const expectedHash = hashOtp(email, otp, payload.nonce, payload.exp);
    const providedBuffer = Buffer.from(payload.otpHash, 'utf8');
    const expectedBuffer = Buffer.from(expectedHash, 'utf8');

    if (providedBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return timingSafeEqual(providedBuffer, expectedBuffer);
};

export const createAdminSessionToken = (email: string) => {
    const exp = Date.now() + SESSION_DURATION_SECONDS * 1000;
    return {
        token: createSignedToken({
            type: 'admin_session',
            email,
            exp,
        }),
        maxAge: SESSION_DURATION_SECONDS,
    };
};

export const verifyAdminSessionToken = (token: string) => {
    const payload = parseAndVerifyToken(token);
    if (!payload || payload.type !== 'admin_session') return null;
    return { email: payload.email };
};
