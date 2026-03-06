import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, email, name, eventId, currency = 'UGX', phoneNumber } = body;

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

        if (!process.env.FLUTTERWAVE_SECRET_KEY) {
            return NextResponse.json({ error: 'Payment service not configured. Set FLUTTERWAVE_SECRET_KEY in Vercel.' }, { status: 503 });
        }

        const flutterwaveUrl = "https://api.flutterwave.com/v3/payments";

        const payload: Record<string, unknown> = {
            tx_ref: `agr_${Date.now()}_${eventId || 'gen'}`,
            amount: parsedAmount,
            currency: currency,
            redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://africangirlriseltd.org'}/events?donation=success`,
            customer: {
                email,
                name: name || "Anonymous Donor",
                phonenumber: phoneNumber || undefined
            },
            customizations: {
                title: "African Girl Rise",
                description: "Donation to break the cycle of poverty",
                logo: "https://africangirlriseltd.org/logo.png"
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

        const response = await fetch(flutterwaveUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        const paymentUrl = data?.data?.link;
        if (!response.ok || data.status !== "success" || !paymentUrl) {
            console.error("Flutterwave API Error:", data);
            return NextResponse.json({ error: 'Payment initialization failed', details: data }, { status: 500 });
        } else {
            return NextResponse.json({ paymentUrl });
        }

    } catch (error) {
        console.error("Donation API Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
