import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name } = body;

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

        // Insert into the subscriptions table
        const { error } = await supabase
            .from('subscriptions')
            .insert({
                email: email.toLowerCase().trim(),
                name: name ? String(name).trim() : null,
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
