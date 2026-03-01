import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const ADMIN_EMAIL = 'admin@africangirlriseltd.org'; // Replace this if another email is preferred
export const SENDER_EMAIL = 'African Girl Rise <onboarding@resend.dev>'; // Using resend dev for now; replace with 'info@africangirlriseltd.org' when domain is linked
