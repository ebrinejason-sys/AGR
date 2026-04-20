import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdminSession } from '../admin-api';
import { isResendConfigured, resend, SENDER_EMAIL } from '../resend';

const escapeHtml = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { error: authError } = requireAdminSession(req.headers.cookie as string);
    if (authError) return res.status(authError.statusCode).json(authError.body);

    if (!isResendConfigured || !resend) return res.status(503).json({ error: 'Email service is not configured.' });

    try {
        const { to, subject, message } = req.body || {};
        if (!to || !subject || !message) return res.status(400).json({ error: 'Recipient, subject and message are required.' });

        const { error } = await resend.emails.send({
            from: SENDER_EMAIL, to, subject,
            html: `<div style="font-family:Arial,sans-serif;line-height:1.6;white-space:pre-wrap;">${escapeHtml(String(message))}</div>`,
        });

        if (error) return res.status(500).json({ error: error.message });
        return res.json({ success: true });
    } catch (err) {
        console.error('/api/admin/email error:', err);
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
    }
}
