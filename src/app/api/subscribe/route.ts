import { NextResponse } from 'next/server';
import { SubscriberWelcomeTemplate } from '@/lib/email-templates';
import { isResendConfigured, resend, SENDER_EMAIL } from '@/lib/resend';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { rateLimit, getIP } from '@/lib/rate-limit';

export async function POST(request: Request) {
    try {
        const ip = getIP(request);
        // Limit newsletter subscriptions (3 requests per hour)
        const { isLimited, response } = rateLimit(ip, 3, 60 * 60 * 1000);
        if (isLimited) return response;

        const body = await request.json();
        const { email, name } = body;

        if (email && String(email).length > 255) {
            return NextResponse.json({ error: 'Email too long' }, { status: 400 });
        }
        if (name && String(name).length > 255) {
            return NextResponse.json({ error: 'Name too long' }, { status: 400 });
        }

        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'Email is required.' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address.' },
                { status: 400 }
            );
        }

        if (!isSupabaseConfigured) {
            // In development without Supabase, just return success
            return NextResponse.json({
                message: 'Thank you for subscribing! (Demo mode)',
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedName = name ? String(name).trim() : null;

        // Insert into the subscriptions table
        const { error } = await supabase
            .from('subscriptions')
            .insert({
                email: normalizedEmail,
                name: normalizedName,
            });

        if (error) {
            // Handle duplicate email (unique constraint)
            if (error.code === '23505') {
                return NextResponse.json({
                    message: 'You\'re already subscribed! Thank you for staying connected.',
                });
            }
            console.error('Subscription error:', error);
            return NextResponse.json(
                { error: 'Could not subscribe. Please try again.' },
                { status: 500 }
            );
        }

        if (isResendConfigured && resend) {
            const subscriberName = normalizedName || 'Friend';

            const subscriberMail = await resend.emails.send({
                from: SENDER_EMAIL,
                to: normalizedEmail,
                subject: 'Welcome to African Girl Rise',
                html: SubscriberWelcomeTemplate(subscriberName),
            });

            if (subscriberMail.error) {
                console.error('Subscribe confirmation email error:', subscriberMail.error);
            }

            const adminRecipient = process.env.CONTACT_EMAIL || 'africangirlriseltd@gmail.com';
            const adminMail = await resend.emails.send({
                from: SENDER_EMAIL,
                to: adminRecipient,
                replyTo: normalizedEmail,
                subject: '[AGR] New newsletter subscriber',
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2>New Subscriber</h2>
                        <p><strong>Email:</strong> ${normalizedEmail}</p>
                        <p><strong>Name:</strong> ${subscriberName}</p>
                    </div>
                `,
            });

            if (adminMail.error) {
                console.error('Subscribe admin notification email error:', adminMail.error);
            }
        }

        return NextResponse.json({
            message: 'Welcome to the African Girl Rise family! 🌍',
        });
    } catch {
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
