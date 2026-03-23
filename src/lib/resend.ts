import { Resend } from 'resend';

export const RESEND_API_KEY =
	process.env.RESEND_API_KEY ||
	process.env.RESEND_KEY ||
	process.env.RESEND_TOKEN ||
	'';

export const isResendConfigured = Boolean(RESEND_API_KEY);

export const resend = isResendConfigured ? new Resend(RESEND_API_KEY) : null;

export const ADMIN_EMAIL = process.env.ADMIN_LOGIN_EMAIL || 'africangirlriseltd@gmail.com';
export const SENDER_EMAIL =
	process.env.RESEND_FROM_EMAIL ||
	process.env.SENDER_EMAIL ||
	'African Girl Rise <onboarding@resend.dev>';
