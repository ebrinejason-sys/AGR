import { Resend } from 'resend';

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const ADMIN_EMAIL = process.env.ADMIN_LOGIN_EMAIL || 'africangirlriseltd@gmail.com';
export const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL || 'African Girl Rise <onboarding@resend.dev>';
