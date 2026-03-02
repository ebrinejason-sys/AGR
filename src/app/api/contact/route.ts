import { NextResponse } from 'next/server';
import { resend, SENDER_EMAIL } from '@/lib/resend';

const escapeHtml = (str: string): string =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

type FormType = 'general' | 'volunteer' | 'partner' | 'sponsor';

const FORM_LABELS: Record<FormType, string> = {
  general: '💬 General Inquiry',
  volunteer: '🤝 Volunteer Application',
  partner: '🏢 Partnership Request',
  sponsor: '💖 Sponsorship Interest',
};

function buildAdminHtml(type: FormType, fields: Record<string, string>): string {
  const safeFields: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value) safeFields[key] = escapeHtml(value);
  }

  const label = FORM_LABELS[type] || 'General Inquiry';
  let detailRows = '';

  switch (type) {
    case 'general':
      detailRows = `
        <p><strong>Name:</strong> ${safeFields.name || ''}</p>
        <p><strong>Email:</strong> ${safeFields.email || ''}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${safeFields.message || ''}</p>
      `;
      break;
    case 'volunteer':
      detailRows = `
        <p><strong>Name:</strong> ${safeFields.name || ''}</p>
        <p><strong>Email:</strong> ${safeFields.email || ''}</p>
        <p><strong>Phone:</strong> ${safeFields.phone || 'Not provided'}</p>
        <p><strong>Skills / Profession:</strong> ${safeFields.skills || 'Not provided'}</p>
        <p><strong>Availability:</strong> ${safeFields.availability || 'Not provided'}</p>
        <p><strong>Motivation:</strong></p>
        <p style="white-space: pre-wrap;">${safeFields.message || ''}</p>
      `;
      break;
    case 'partner':
      detailRows = `
        <p><strong>Organization:</strong> ${safeFields.orgName || ''}</p>
        <p><strong>Contact Person:</strong> ${safeFields.contactPerson || ''}</p>
        <p><strong>Email:</strong> ${safeFields.email || ''}</p>
        <p><strong>Partnership Type:</strong> ${safeFields.partnershipType || 'Not specified'}</p>
        <p><strong>Proposal:</strong></p>
        <p style="white-space: pre-wrap;">${safeFields.message || ''}</p>
      `;
      break;
    case 'sponsor':
      detailRows = `
        <p><strong>Name:</strong> ${safeFields.name || ''}</p>
        <p><strong>Email:</strong> ${safeFields.email || ''}</p>
        <p><strong>Sponsorship Type:</strong> ${safeFields.sponsorType || 'One-time'}</p>
        <p><strong>Interest:</strong></p>
        <p style="white-space: pre-wrap;">${safeFields.message || ''}</p>
      `;
      break;
  }

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>${label}</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 12px; margin: 16px 0; border-left: 4px solid #03a9f4;">
        ${detailRows}
      </div>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    if (!resend) {
      return NextResponse.json(
        { error: 'Email service is not configured. Set RESEND_API_KEY.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const type = (body.type as FormType) || 'general';
    const email = String(body.email || '').trim();
    const name = String(body.name || body.contactPerson || '').trim();
    const message = String(body.message || '').trim();

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const adminRecipient = process.env.CONTACT_EMAIL || 'africangirlriseltd@gmail.com';
    const adminHtml = buildAdminHtml(type, body);
    const safeName = escapeHtml(name || 'Friend');
    const typeLabel = FORM_LABELS[type] || 'General Inquiry';

    const { error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: adminRecipient,
      replyTo: email,
      subject: `[AGR] ${typeLabel} from ${safeName}`,
      html: adminHtml,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send confirmation email to the user
    const userConfirmationHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Thank you, ${safeName}</h2>
        <p>We received your <strong>${typeLabel.toLowerCase()}</strong> and our team will get back to you soon.</p>
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

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
