import { NextResponse } from 'next/server';
import { resend, SENDER_EMAIL } from '@/lib/resend';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { rateLimit, getIP } from '@/lib/rate-limit';

const escapeHtml = (str: string): string =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

type FormType = 'general' | 'mentor' | 'sponsor' | 'donate';

const FORM_LABELS: Record<FormType, string> = {
  general: '💬 General Inquiry',
  mentor: '🎓 Mentor Application',
  sponsor: '💖 Sponsorship Interest',
  donate: '🌍 Donation / Partnership',
};

function safe(val: unknown): string {
  return escapeHtml(String(val || '').trim() || '—');
}

function row(label: string, val: unknown): string {
  const v = String(val || '').trim();
  if (!v) return '';
  return `<p><strong>${label}:</strong> ${escapeHtml(v)}</p>`;
}

function buildAdminHtml(type: FormType, b: Record<string, unknown>): string {
  const label = FORM_LABELS[type] || 'General Inquiry';
  let detailRows = '';

  switch (type) {
    case 'general':
      detailRows = `
        ${row('Name', b.name)}
        ${row('Email', b.email)}
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${safe(b.message)}</p>
      `;
      break;
    case 'mentor':
      detailRows = `
        ${row('Name', b.name)}
        ${row('Email', b.email)}
        ${row('Phone', b.phone)}
        ${row('Profession / Expertise', b.profession)}
        ${row('Organisation', b.organization)}
        ${row('Contribution Area', b.contributionArea)}
        ${row('Mentoring Capacity / Year', b.mentorCapacity)}
        ${b.message ? `<p><strong>Notes:</strong></p><p style="white-space: pre-wrap;">${safe(b.message)}</p>` : ''}
      `;
      break;
    case 'sponsor':
      detailRows = `
        ${row('Organisation', b.orgName)}
        ${row('Contact Person', b.contactPerson)}
        ${row('Email', b.email)}
        ${row('Phone', b.phone)}
        ${row('Sponsorship Type', b.sponsorType)}
        ${row('Budget Range', b.budgetRange)}
        <p><strong>Message / Proposal:</strong></p>
        <p style="white-space: pre-wrap;">${safe(b.message)}</p>
      `;
      break;
    case 'donate':
      detailRows = `
        ${row('Name / Organisation', b.name)}
        ${row('Email', b.email)}
        ${row('Phone', b.phone)}
        ${row('Donor Type', b.donationType)}
        ${row('Area of Giving', b.donationIntent)}
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${safe(b.message)}</p>
      `;
      break;
  }

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color:#333;">${label}</h2>
      <div style="background:#f5f5f5; padding:20px; border-radius:12px; margin:16px 0; border-left:4px solid #e91e8c;">
        ${detailRows}
      </div>
      <p style="color:#999; font-size:0.85em;">Submitted via cangirlriseltd.org</p>
    </div>
  `;
}

function sanitize(val: unknown, max = 255): string {
  return String(val || '').trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const ip = getIP(request);
    const { isLimited, response } = rateLimit(ip, 3, 60 * 60 * 1000);
    if (isLimited) return response;

    if (!resend) {
      return NextResponse.json(
        { error: 'Email service is not configured. Set RESEND_API_KEY.' },
        { status: 503 }
      );
    }

    const body = await request.json() as Record<string, unknown>;

    const type = (body.type as FormType) || 'general';
    const email = sanitize(body.email);
    const name = sanitize(body.name || body.contactPerson);
    const message = sanitize(body.message, 10000);

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if ((type === 'general' || type === 'donate') && !message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build extra_fields JSON for Supabase storage
    const extraFields: Record<string, string> = {};
    const fieldsToCapture = [
      'phone', 'profession', 'organization', 'contributionArea', 'mentorCapacity',
      'orgName', 'contactPerson', 'sponsorType', 'budgetRange',
      'donationType', 'donationIntent',
    ];
    for (const f of fieldsToCapture) {
      const v = sanitize(body[f]);
      if (v) extraFields[f] = v;
    }

    // ── Save to Supabase ──
    if (isSupabaseConfigured) {
      const displayName = (sanitize(body.orgName) || sanitize(body.contactPerson) || name || 'Anonymous').slice(0, 255);
      await supabase.from('contacts').insert({
        name: displayName,
        email,
        message: message || '(no message)',
        type,
        extra_fields: extraFields,
      });
      // We don't block the response on a DB error — email delivery is primary
    }

    // ── Email to admin ──
    const adminRecipient = process.env.CONTACT_EMAIL || 'africangirlriseltd@gmail.com';
    const safeName = escapeHtml(name || 'Friend');
    const typeLabel = FORM_LABELS[type];
    const adminHtml = buildAdminHtml(type, body);

    const { error: sendError } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: adminRecipient,
      replyTo: email,
      subject: `[AGR] ${typeLabel} from ${safeName}`,
      html: adminHtml,
    });

    if (sendError) {
      return NextResponse.json({ error: sendError.message }, { status: 500 });
    }

    // ── Confirmation email to user ──
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Thank you for contacting African Girl Rise',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Thank you, ${safeName}</h2>
          <p>We received your <strong>${typeLabel.toLowerCase()}</strong> and our team will be in touch soon.</p>
          <p style="margin-top:2rem; font-style:italic;">Rise. Then reach back.</p>
          <p><strong>African Girl Rise Initiative</strong></p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
