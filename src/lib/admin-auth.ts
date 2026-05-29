import { createHmac, timingSafeEqual, randomInt } from 'crypto';
// Cookie constants exported from admin-constants.ts to avoid Edge Runtime issues
import { ADMIN_SESSION_COOKIE, ADMIN_OTP_COOKIE } from './admin-constants.js';
import { ADMIN_LOGIN_EMAIL, ADMIN_LOGIN_PASSWORD, ADMIN_AUTH_SECRET } from './env.js';

// Re-export for convenience (used by other modules)
export { ADMIN_SESSION_COOKIE, ADMIN_OTP_COOKIE };

type TokenPayload = {
    type: 'admin_session' | 'admin_otp';
    email: string;
    exp: number;
    nonce?: string;
    otpHash?: string;
};

const REQUIRED_ADMIN_ENV_VARS = ['ADMIN_LOGIN_EMAIL', 'ADMIN_LOGIN_PASSWORD', 'ADMIN_AUTH_SECRET'] as const;

const SESSION_DURATION_SECONDS = 60 * 60 * 12;
const OTP_DURATION_SECONDS = 60 * 10;

const b64urlEncode = (value: string) => Buffer.from(value, 'utf8').toString('base64url');
const b64urlDecode = (value: string) => Buffer.from(value, 'base64url').toString('utf8');

const getAuthSecret = () => {
    return ADMIN_AUTH_SECRET || null;
};

const requireAuthSecret = () => {
    const secret = ADMIN_AUTH_SECRET;
    if (!secret) {
        throw new Error('ADMIN_AUTH_SECRET environment variable is required. Generate one with: openssl rand -hex 32');
    }
    return secret;
};

const signRaw = (value: string) => createHmac('sha256', requireAuthSecret()).update(value).digest('base64url');

const createSignedToken = (payload: TokenPayload) => {
    const encodedPayload = b64urlEncode(JSON.stringify(payload));
    const signature = signRaw(encodedPayload);
    return `${encodedPayload}.${signature}`;
};

const parseAndVerifyToken = (token: string): TokenPayload | null => {
    if (!getAuthSecret()) {
        return null;
    }

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

export const getMissingAdminAuthEnvVars = () => {
    const vars = [];
    if (!ADMIN_LOGIN_EMAIL) vars.push('ADMIN_LOGIN_EMAIL');
    if (!ADMIN_LOGIN_PASSWORD) vars.push('ADMIN_LOGIN_PASSWORD');
    if (!ADMIN_AUTH_SECRET) vars.push('ADMIN_AUTH_SECRET');
    return vars;
};

export const getAdminCredentials = () => {
    const email = ADMIN_LOGIN_EMAIL;
    const password = ADMIN_LOGIN_PASSWORD;
    if (!email || !password) {
        throw new Error('ADMIN_LOGIN_EMAIL and ADMIN_LOGIN_PASSWORD environment variables are required.');
    }
    return { email, password };
};

/**
 * Performs a timing-safe comparison of two strings.
 */
export const safeCompare = (a: string, b: string) => {
    const bufferA = Buffer.from(a, 'utf8');
    const bufferB = Buffer.from(b, 'utf8');

    if (bufferA.length !== bufferB.length) {
        // Still perform a comparison to mitigate timing attacks
        timingSafeEqual(bufferA, bufferA);
        return false;
    }

    return timingSafeEqual(bufferA, bufferB);
};

/**
 * Generates a cryptographically secure 6-digit OTP.
 */
export const generateSecureOtp = () => {
    return randomInt(100000, 1000000).toString();
};

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
