import type { VercelRequest, VercelResponse } from '@vercel/node';
import { resend, SENDER_EMAIL } from '../src/lib/resend';
import { supabase, isSupabaseConfigured } from '../src/lib/supabase.server';
import { rateLimit, getIPFromHeader } from '../src/lib/rate-limit';

const escapeHtml = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

type FormType = 'general' | 'mentor' | 'sponsor' | 'donate';
const FORM_LABELS: Record<FormType, string> = { general: '💬 General Inquiry', mentor: '🎓 Mentor Application', sponsor: '💖 Sponsorship Interest', donate: '🌍 Donation / Partnership' };

function safe(val: unknown) { return escapeHtml(String(val || '').trim() || '—'); }
function row(label: string, val: unknown) { const v = String(val || '').trim(); if (!v) return ''; return `<p><strong>${label}:</strong> ${escapeHtml(v)}</p>`; }
function sanitize(val: unknown, max = 255) { return String(val || '').trim().slice(0, max); }

function buildAdminHtml(type: FormType, b: Record<string, unknown>) {
    const label = FORM_LABELS[type] || 'General Inquiry';
    let detailRows = '';
    if (type === 'general') detailRows = `${row('Name', b.name)}${row('Email', b.email)}<p><strong>Message:</strong></p><p style="white-space:pre-wrap;">${safe(b.message)}</p>`;
    else if (type === 'mentor') detailRows = `${row('Name', b.name)}${row('Email', b.email)}${row('Phone', b.phone)}${row('Profession', b.profession)}${row('Organisation', b.organization)}${row('Contribution Area', b.contributionArea)}${row('Capacity/Year', b.mentorCapacity)}${b.message ? `<p><strong>Notes:</strong></p><p style="white-space:pre-wrap;">${safe(b.message)}</p>` : ''}`;
    else if (type === 'sponsor') detailRows = `${row('Organisation', b.orgName)}${row('Contact Person', b.contactPerson)}${row('Email', b.email)}${row('Phone', b.phone)}${row('Sponsorship Type', b.sponsorType)}${row('Budget Range', b.budgetRange)}<p><strong>Message:</strong></p><p style="white-space:pre-wrap;">${safe(b.message)}</p>`;
    else detailRows = `${row('Name / Organisation', b.name)}${row('Email', b.email)}${row('Phone', b.phone)}${row('Donor Type', b.donationType)}${row('Area of Giving', b.donationIntent)}<p><strong>Message:</strong></p><p style="white-space:pre-wrap;">${safe(b.message)}</p>`;
    return `<div style="font-family:Arial,sans-serif;line-height:1.6;"><h2 style="color:#333;">${label}</h2><div style="background:#f5f5f5;padding:20px;border-radius:12px;margin:16px 0;border-left:4px solid #e91e8c;">${detailRows}</div><p style="color:#999;font-size:0.85em;">Submitted via africangirlrise.org</p></div>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const ip = getIPFromHeader(req.headers['x-forwarded-for']);
        const rl = rateLimit(ip, 3, 60 * 60 * 1000);
        if (rl.isLimited) return res.status(rl.statusCode).json(rl.body);

        if (!resend) return res.status(503).json({ error: 'Email service is not configured. Set RESEND_API_KEY.' });

        const body = (req.body || {}) as Record<string, unknown>;
        const type = (body.type as FormType) || 'general';
        const email = sanitize(body.email);
        const name = sanitize(body.name || body.contactPerson);
        const message = sanitize(body.message, 10000);

        if (!email) return res.status(400).json({ error: 'Email is required' });
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email address' });
        if ((type === 'general' || type === 'donate') && !message) return res.status(400).json({ error: 'Message is required' });

        const extraFields: Record<string, string> = {};
        for (const f of ['phone','profession','organization','contributionArea','mentorCapacity','orgName','contactPerson','sponsorType','budgetRange','donationType','donationIntent']) {
            const v = sanitize(body[f]); if (v) extraFields[f] = v;
        }

        if (isSupabaseConfigured) {
            const displayName = (sanitize(body.orgName) || sanitize(body.contactPerson) || name || 'Anonymous').slice(0, 255);
            try {
                await supabase.from('contacts').insert({ name: displayName, email, message: message || '(no message)', type, extra_fields: extraFields });
            } catch { /* non-blocking: don't fail the response if DB insert fails */ }
        }

        const adminRecipient = process.env.CONTACT_EMAIL || 'africangirlriseltd@gmail.com';
        const safeName = escapeHtml(name || 'Friend');

        const { error: sendError } = await resend.emails.send({
            from: SENDER_EMAIL, to: adminRecipient, replyTo: email,
            subject: `[AGR] ${FORM_LABELS[type]} from ${safeName}`,
            html: buildAdminHtml(type, body),
        });

        if (sendError) return res.status(500).json({ error: sendError.message });

        await resend.emails.send({ from: SENDER_EMAIL, to: email, subject: 'Thank you for contacting African Girl Rise', html: `<div style="font-family:Arial,sans-serif;line-height:1.6;"><h2>Thank you, ${safeName}</h2><p>We received your message and our team will be in touch soon.</p><p style="margin-top:2rem;font-style:italic;">Rise. Then reach back.</p><p><strong>African Girl Rise Initiative</strong></p></div>` }).catch(console.error);

        return res.json({ message: 'Message sent successfully' });
    } catch {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
