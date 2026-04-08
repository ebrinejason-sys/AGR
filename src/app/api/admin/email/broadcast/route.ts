import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminSession, checkSupabaseAdminConfig } from '@/lib/admin-api';
import { isResendConfigured, resend, SENDER_EMAIL } from '@/lib/resend';

const escapeHtml = (str: string): string =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export async function POST(request: Request) {
    try {
        const configError = checkSupabaseAdminConfig();
        if (configError) return configError;

        const { error } = requireAdminSession(request);
        if (error) return error;

        if (!isResendConfigured || !resend) {
            return NextResponse.json({ error: 'Email service is not configured.' }, { status: 503 });
        }

        const body = await request.json();
        const { subject, message } = body;

        if (!subject || !message) {
            return NextResponse.json({ error: 'Subject and message are required.' }, { status: 400 });
        }

        const safeMessage = escapeHtml(String(message));

        // Fetch all subscriber emails
        const supabase = getAdminSupabase();
        const { data: subscribers, error: dbError } = await supabase
            .from('subscriptions')
            .select('email, name');

        if (dbError) {
            return NextResponse.json({ error: `Failed to fetch subscribers: ${dbError.message}` }, { status: 500 });
        }

        if (!subscribers || subscribers.length === 0) {
            return NextResponse.json({ error: 'No subscribers found.' }, { status: 400 });
        }

        const emails = subscribers.map((s) => s.email);

        // Resend supports batch — send to bcc so recipients don't see each other
        const { error: sendError } = await resend.emails.send({
            from: SENDER_EMAIL,
            to: SENDER_EMAIL,   // send to self
            bcc: emails,        // bcc all subscribers
            subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                    <div style="background: linear-gradient(135deg, #e91e63, #9c27b0); padding: 2rem; border-radius: 12px 12px 0 0;">
                        <h1 style="color: #fff; margin: 0; font-size: 1.5rem;">African Girl Rise</h1>
                        <p style="color: rgba(255,255,255,0.8); margin: 0.5rem 0 0; font-size: 0.9rem;">
                            Breaking cycles. One girl at a time.
                        </p>
                    </div>
                    <div style="background: #ffffff; padding: 2rem; border: 1px solid #eee; white-space: pre-wrap;">
                        ${safeMessage}
                    </div>
                    <div style="background: #f8f5ff; padding: 1.5rem; border-radius: 0 0 12px 12px; font-size: 0.8rem; color: #6b6b8a; text-align: center;">
                        African Girl Rise Ltd · Kiburara, Ibanda District, Uganda<br/>
                        <a href="https://africangirlrise.org" style="color: #e91e63;">africangirlrise.org</a> · 
                        You are receiving this because you subscribed to our newsletter.
                    </div>
                </div>
            `,
        });

        if (sendError) {
            return NextResponse.json({ error: sendError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, sent: emails.length });
    } catch (err) {
        console.error('POST /api/admin/email/broadcast error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
