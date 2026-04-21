import { RESEND_API_KEY, RESEND_FROM_EMAIL, ADMIN_LOGIN_EMAIL, isConfigured } from './env.js';
import { Resend } from 'resend';

/**
 * Resend Email Integration
 * Handles transactional emails for donations and contact forms.
 */

export const isResendConfigured = isConfigured.resend;
export const resend = isResendConfigured ? new Resend(RESEND_API_KEY) : null;

export const SENDER_EMAIL = RESEND_FROM_EMAIL;
export const ADMIN_EMAIL = ADMIN_LOGIN_EMAIL;

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    if (!resend) {
        console.warn('Resend is not configured. Email not sent:', { to, subject });
        return { success: false, error: 'Not configured' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: SENDER_EMAIL,
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Failed to send email:', err);
        return { success: false, error: err };
    }
}
