import { NextResponse } from 'next/server';
import { rateLimit, getIP } from '@/lib/rate-limit';

export async function POST(req: Request) {
    try {
        const ip = getIP(req);
        // Limit donation attempts (5 requests per hour)
        const { isLimited, response } = rateLimit(ip, 5, 60 * 60 * 1000);
        if (isLimited) return response;

        const body = await req.json();
        const { amount, email, name, eventId, currency = 'UGX', phoneNumber } = body;

        if (email && String(email).length > 255) {
            return NextResponse.json({ error: 'Email too long' }, { status: 400 });
        }
        if (name && String(name).length > 255) {
            return NextResponse.json({ error: 'Name too long' }, { status: 400 });
        }
        if (phoneNumber && String(phoneNumber).length > 20) {
            return NextResponse.json({ error: 'Phone number too long' }, { status: 400 });
        }

        const parsedAmount = Number(amount);
        const validCurrencies = ['UGX', 'USD'];

        const minAmount = currency === 'USD' ? 5 : 1000;
        if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount < minAmount || !email) {
            return NextResponse.json({ error: `Missing required fields or amount below minimum (${currency} ${minAmount})` }, { status: 400 });
        }

        if (!validCurrencies.includes(currency)) {
            return NextResponse.json({ error: 'Invalid currency. Use UGX or USD.' }, { status: 400 });
        }

        // For UGX mobile money, phone number is required
        if (currency === 'UGX' && !phoneNumber) {
            return NextResponse.json({ error: 'Phone number required for Mobile Money payments' }, { status: 400 });
        }

        const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

        if (!secretKey) {
            return NextResponse.json({ error: 'Payment service not configured. Set FLUTTERWAVE_SECRET_KEY in environment variables.' }, { status: 503 });
        }

        const payload: Record<string, unknown> = {
            tx_ref: `agr_${Date.now()}_${eventId || 'gen'}`,
            amount: parsedAmount,
            currency: currency,
            redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://africangirlriseltd.org'}/events?donation=success`,
            customer: {
                email,
                name: name || 'Anonymous Donor',
                phonenumber: phoneNumber || undefined
            },
            customizations: {
                title: 'African Girl Rise',
                description: 'Donation to break the cycle of poverty',
                logo: 'https://africangirlriseltd.org/logo.png'
            },
            // Configure payment options based on currency
            ...(currency === 'UGX' && {
                payment_options: 'mobilemoneyuganda,card',
                country: 'UG'
            }),
            ...(currency === 'USD' && {
                payment_options: 'card'
            })
        };

        const fwResponse = await fetch('https://api.flutterwave.com/v3/payments', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await fwResponse.json();
        const paymentUrl = data?.data?.link;

        if (!fwResponse.ok || data.status !== 'success' || !paymentUrl) {
            console.error('Flutterwave V3 API Error:', data);
            return NextResponse.json({ error: 'Payment initialization failed', details: data }, { status: 500 });
        }

        return NextResponse.json({ paymentUrl });

    } catch (error) {
        console.error('Donation API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
