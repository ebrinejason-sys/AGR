/**
 * Central configuration for environment variables across the African Girl Rise platform.
 * Supports both Node.js (process.env) and Vite (import.meta.env) environments.
 */

function getEnv(key: string, defaultValue: string = ''): string {
    // @ts-ignore - Handle Node.js environment
    const nodeEnv = typeof process !== 'undefined' ? process.env[key] : undefined;
    // @ts-ignore - Handle Vite environment
    const viteEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env[`VITE_${key}`] : undefined;
    
    return (nodeEnv || viteEnv || defaultValue).trim();
}

// Payment Configurations
export const FLUTTERWAVE_SECRET_KEY = getEnv('FLUTTERWAVE_SECRET_KEY');
export const FLUTTERWAVE_CLIENT_ID = getEnv('FLUTTERWAVE_CLIENT_ID');
export const FLUTTERWAVE_CLIENT_SECRET = getEnv('FLUTTERWAVE_CLIENT_SECRET');
export const FLUTTERWAVE_ENVIRONMENT = getEnv('FLUTTERWAVE_ENVIRONMENT', 'production');

export const MARZPAY_SECRET_KEY = getEnv('MARZPAY_SECRET_KEY');
export const MARZPAY_ENVIRONMENT = getEnv('MARZPAY_ENVIRONMENT', 'production');

// Email Configuration
export const RESEND_API_KEY = getEnv('RESEND_API_KEY');
export const RESEND_FROM_EMAIL = getEnv('RESEND_FROM_EMAIL', 'African Girl Rise <onboarding@resend.dev>');
export const ADMIN_LOGIN_EMAIL = getEnv('ADMIN_LOGIN_EMAIL', 'africangirlriseltd@gmail.com');

// Admin Configuration
export const ADMIN_LOGIN_PASSWORD = getEnv('ADMIN_LOGIN_PASSWORD');
export const ADMIN_AUTH_SECRET = getEnv('ADMIN_AUTH_SECRET');

// Supabase Configuration
export const SUPABASE_URL = getEnv('SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnv('SUPABASE_ANON_KEY');
export const SUPABASE_SERVICE_ROLE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');

export const isConfigured = {
    flutterwave: Boolean(FLUTTERWAVE_SECRET_KEY || (FLUTTERWAVE_CLIENT_ID && FLUTTERWAVE_CLIENT_SECRET)),
    marzpay: Boolean(MARZPAY_SECRET_KEY),
    resend: Boolean(RESEND_API_KEY),
    admin: Boolean(ADMIN_LOGIN_EMAIL && ADMIN_LOGIN_PASSWORD && ADMIN_AUTH_SECRET),
    supabase: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
};
