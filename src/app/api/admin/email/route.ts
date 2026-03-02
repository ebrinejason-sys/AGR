import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-api';
import { resend, SENDER_EMAIL } from '@/lib/resend';

export async function POST(request: Request) {
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

    const { error: sendError } = await resend.emails.send({
        from: SENDER_EMAIL,
        to,
        subject,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; white-space: pre-wrap;">${message}</div>`,
    });

    if (sendError) {
        return NextResponse.json({ error: sendError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
