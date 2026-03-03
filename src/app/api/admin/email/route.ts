import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-api';
import { resend, SENDER_EMAIL } from '@/lib/resend';

const escapeHtml = (str: string): string =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export async function POST(request: Request) {
    try {
        const { error } = requireAdminSession(request);
        if (error) return error;

        if (!resend) {
            return NextResponse.json({ error: 'Email service not configured. Set RESEND_API_KEY.' }, { status: 503 });
        }

        const body = await request.json();
        const { to, subject, message } = body;

        if (!to || !subject || !message) {
            return NextResponse.json({ error: 'Recipient, subject and message are required.' }, { status: 400 });
        }

        const safeMessage = escapeHtml(String(message));

        const { error: sendError } = await resend.emails.send({
            from: SENDER_EMAIL,
            to,
            subject,
            html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</div>`,
        });

        if (sendError) {
            return NextResponse.json({ error: sendError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('POST /api/admin/email error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
