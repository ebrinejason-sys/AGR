import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminSupabase } from '../../supabase.server';
import { requireAdminSession, checkSupabaseAdminConfig } from '../../admin-api';
import { isResendConfigured, resend, SENDER_EMAIL } from '../../resend';

const escapeHtml = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const configError = checkSupabaseAdminConfig();
    if (configError) return res.status(configError.statusCode).json(configError.body);

    const { error: authError } = requireAdminSession(req.headers.cookie as string);
    if (authError) return res.status(authError.statusCode).json(authError.body);

    if (!isResendConfigured || !resend) return res.status(503).json({ error: 'Email service is not configured.' });

    try {
        const { subject, message } = req.body || {};
        if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required.' });

        const supabase = getAdminSupabase();
        const { data: subscribers, error: dbError } = await supabase.from('subscriptions').select('email, name');
        if (dbError) return res.status(500).json({ error: `Failed to fetch subscribers: ${dbError.message}` });
        if (!subscribers || subscribers.length === 0) return res.status(400).json({ error: 'No subscribers found.' });

        const emails = subscribers.map(s => s.email);

        const { error: sendError } = await resend.emails.send({
            from: SENDER_EMAIL, to: SENDER_EMAIL, bcc: emails, subject,
            html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;line-height:1.6;"><div style="background:linear-gradient(135deg,#e91e63,#9c27b0);padding:2rem;border-radius:12px 12px 0 0;"><h1 style="color:#fff;margin:0;font-size:1.5rem;">African Girl Rise</h1><p style="color:rgba(255,255,255,0.8);margin:0.5rem 0 0;font-size:0.9rem;">Breaking cycles. One girl at a time.</p></div><div style="background:#ffffff;padding:2rem;border:1px solid #eee;white-space:pre-wrap;">${escapeHtml(String(message))}</div><div style="background:#f8f5ff;padding:1.5rem;border-radius:0 0 12px 12px;font-size:0.8rem;color:#6b6b8a;text-align:center;">African Girl Rise Ltd · Kiburara, Ibanda District, Uganda</div></div>`,
        });

        if (sendError) return res.status(500).json({ error: sendError.message });
        return res.json({ success: true, sent: emails.length });
    } catch (err) {
        console.error('/api/admin/email/broadcast error:', err);
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
    }
}
