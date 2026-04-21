/**
 * Central configuration for environment variables — African Girl Rise.
 *
 * ⚠️  SECURITY BOUNDARY:
 *  - This file is imported by SERVER-ONLY code (api/ routes running in Node.js).
 *  - It must NEVER be imported by any file in src/pages/, src/components/, or
 *    any path that Vite bundles for the browser.
 *  - Only VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are intentionally
 *    exposed to the frontend via the separate src/lib/supabase.ts client.
 *
 * The function below reads from process.env ONLY (Node.js / Vercel serverless).
 * It intentionally does NOT fall back to import.meta.env so that secrets cannot
 * accidentally be included in the browser bundle through tree-shaking misses.
 */

function getServerEnv(key: string, defaultValue: string = ''): string {
    if (typeof process === 'undefined') {
        // We are in a browser bundle — this should never happen.
        // process is narrowed to `never` here, so we cannot access process.env.
        // Log unconditionally when in browser context (tree-shaken in production builds).
        if (typeof window !== 'undefined') {
            console.error(`[SECURITY] env.ts was imported in browser context. Key: ${key}`);
        }
        return defaultValue;
    }
    return (process.env[key] ?? defaultValue).trim();
}

// Payment Configurations — SERVER ONLY
export const FLUTTERWAVE_SECRET_KEY = getServerEnv('FLUTTERWAVE_SECRET_KEY');
export const FLUTTERWAVE_CLIENT_ID = getServerEnv('FLUTTERWAVE_CLIENT_ID');
export const FLUTTERWAVE_CLIENT_SECRET = getServerEnv('FLUTTERWAVE_CLIENT_SECRET');
export const FLUTTERWAVE_ENVIRONMENT = getServerEnv('FLUTTERWAVE_ENVIRONMENT', 'production');

export const MARZPAY_SECRET_KEY = getServerEnv('MARZPAY_SECRET_KEY') || getServerEnv('MARZPAY_API_SECRET');
export const MARZPAY_ENVIRONMENT = getServerEnv('MARZPAY_ENVIRONMENT', 'production');

// Email Configuration — SERVER ONLY
export const RESEND_API_KEY = getServerEnv('RESEND_API_KEY');
export const RESEND_FROM_EMAIL = getServerEnv('RESEND_FROM_EMAIL', 'African Girl Rise <onboarding@resend.dev>');

// Admin Configuration — SERVER ONLY
export const ADMIN_LOGIN_EMAIL = getServerEnv('ADMIN_LOGIN_EMAIL', 'africangirlriseltd@gmail.com');
export const ADMIN_LOGIN_PASSWORD = getServerEnv('ADMIN_LOGIN_PASSWORD');
export const ADMIN_AUTH_SECRET = getServerEnv('ADMIN_AUTH_SECRET');

// Supabase Configuration
// Note: SUPABASE_SERVICE_ROLE_KEY is SERVER ONLY and must never reach the browser.
export const SUPABASE_URL = getServerEnv('SUPABASE_URL') || getServerEnv('VITE_SUPABASE_URL');
export const SUPABASE_ANON_KEY = getServerEnv('SUPABASE_ANON_KEY') || getServerEnv('VITE_SUPABASE_PUBLISHABLE_KEY') || getServerEnv('SUPABASE_PUBLISHABLE_KEY');
export const SUPABASE_SERVICE_ROLE_KEY = getServerEnv('SUPABASE_SERVICE_ROLE_KEY');

export const isConfigured = {
    flutterwave: Boolean(FLUTTERWAVE_SECRET_KEY || (FLUTTERWAVE_CLIENT_ID && FLUTTERWAVE_CLIENT_SECRET)),
    marzpay: Boolean(MARZPAY_SECRET_KEY),
    resend: Boolean(RESEND_API_KEY),
    admin: Boolean(ADMIN_LOGIN_EMAIL && ADMIN_LOGIN_PASSWORD && ADMIN_AUTH_SECRET),
    supabase: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
};
