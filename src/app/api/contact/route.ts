import { NextResponse } from 'next/server';
import { resend, ADMIN_EMAIL, SENDER_EMAIL } from '@/lib/resend';
import { supabase } from '@/lib/supabase';
import { ContactSubmissionTemplate } from '@/lib/email-templates';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Save to Supabase DB (if configured)
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            await supabase.from('contacts').insert([{ name, email, message }]);
        }

        // 2. Send email via Resend
        const { data, error } = await resend.emails.send({
            from: SENDER_EMAIL,
            to: ADMIN_EMAIL,
            subject: `New Contact Form Submission from ${name}`,
            html: ContactSubmissionTemplate(name, email, message),
        });

        if (error) {
            console.error("Resend Error:", error);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Contact API Route Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
