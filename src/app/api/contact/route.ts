import { NextResponse } from 'next/server';
import { resend, SENDER_EMAIL } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    if (!resend) {
      return NextResponse.json(
        { error: 'Email service is not configured. Set RESEND_API_KEY.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const adminRecipient = process.env.CONTACT_EMAIL || 'africangirlriseltd@gmail.com';

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: adminRecipient,
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html: adminHtml,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const userConfirmationHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Thank you, ${name}</h2>
        <p>We received your message and our team will get back to you soon.</p>
        <p>Rise. Then reach back.</p>
        <p>African Girl Rise Initiative</p>
      </div>
    `;

    await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Thank you for contacting African Girl Rise',
      html: userConfirmationHtml,
    });

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
