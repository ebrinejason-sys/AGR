import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SubscriberWelcomeTemplate } from '../src/lib/email-templates';
import { isResendConfigured, resend, SENDER_EMAIL } from '../src/lib/resend';
import { supabase, isSupabaseConfigured } from '../src/lib/supabase.server';
import { rateLimit, getIPFromHeader, securityLog } from '../src/lib/rate-limit';

const INJECTION_PATTERN = /(<script|javascript:|on\w+\s*=|\bDROP\b|\bUNION\b|\bSELECT\b)/i;

function applySecurityHeaders(res: VercelResponse) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    applySecurityHeaders(res);
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const ct = req.headers['content-type'] || '';
    if (!ct.includes('application/json')) {
        return res.status(415).json({ error: 'Content-Type must be application/json' });
    }

    try {
        const ip = getIPFromHeader(req.headers['x-forwarded-for']);
        const rl = rateLimit(ip, 3, 60 * 60 * 1000);
        if (rl.isLimited) {
            securityLog({ type: 'rate_limited', ip, endpoint: '/api/subscribe' });
            return res.status(rl.statusCode).json(rl.body);
        }

        const body = req.body || {};
        const { email, name } = body;

        if (email && String(email).length > 255) return res.status(400).json({ error: 'Email too long' });
        if (name && String(name).length > 255) return res.status(400).json({ error: 'Name too long' });
        if (!email || typeof email !== 'string') return res.status(400).json({ error: 'Email is required.' });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
        if (email.length > 320) return res.status(400).json({ error: 'Email too long' });

        // Injection guard
        if (INJECTION_PATTERN.test(email) || (name && INJECTION_PATTERN.test(String(name)))) {
            securityLog({ type: 'suspicious', ip: getIPFromHeader(req.headers['x-forwarded-for']), endpoint: '/api/subscribe', detail: 'Injection in subscribe fields' });
            return res.status(400).json({ error: 'Invalid input detected.' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedName = name ? String(name).trim() : null;

        // Save to database if Supabase is configured
        if (isSupabaseConfigured) {
            const { error } = await supabase.from('subscriptions').insert({ email: normalizedEmail, name: normalizedName });

            if (error) {
                if (error.code === '23505') return res.json({ message: "You're already subscribed! Thank you for staying connected." });
                console.error('Subscription error:', error);
                return res.status(500).json({ error: 'Could not subscribe. Please try again.' });
            }
        }

        // Send welcome emails regardless of Supabase configuration
        if (isResendConfigured && resend) {
            const subscriberName = normalizedName || 'Friend';
            await resend.emails.send({ from: SENDER_EMAIL, to: normalizedEmail, subject: 'Welcome to African Girl Rise', html: SubscriberWelcomeTemplate(subscriberName) }).catch(err => console.error('Failed to send subscriber welcome email:', err));

            const adminRecipient = process.env.CONTACT_EMAIL || 'africangirlriseltd@gmail.com';
            await resend.emails.send({ from: SENDER_EMAIL, to: adminRecipient, replyTo: normalizedEmail, subject: '[AGR] New newsletter subscriber', html: `<div style="font-family:Arial,sans-serif;line-height:1.6;"><h2>New Subscriber</h2><p><strong>Email:</strong> ${normalizedEmail}</p><p><strong>Name:</strong> ${subscriberName}</p></div>` }).catch(console.error);
        } else if (!isResendConfigured) {
            console.warn('Resend email service not configured');
        }

        return res.json({ message: 'Welcome to the African Girl Rise family! 🌍' });
    } catch (error) {
        console.error("Subscription API Error:", error);
        const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
        const status = /not configured/i.test(message) ? 503 : 500;
        return res.status(status).json({ error: message });
    }
}
