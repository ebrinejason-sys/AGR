import { NextResponse } from 'next/server';
import { rateLimit, getIP } from '@/lib/rate-limit';

type DonationCurrency = 'UGX' | 'USD' | 'EUR' | 'GBP';

const VALID_CURRENCIES: DonationCurrency[] = ['UGX', 'USD', 'EUR', 'GBP'];

const MIN_AMOUNT_BY_CURRENCY: Record<DonationCurrency, number> = {
    UGX: 1000,
    USD: 5,
    EUR: 5,
    GBP: 5,
};

const getPayPalDonateUrl = (params: {
    businessEmail: string;
    amount: number;
    currency: Exclude<DonationCurrency, 'UGX'>;
    donorName?: string;
    eventId?: string;
}) => {
    const url = new URL('https://www.paypal.com/donate');
    url.searchParams.set('business', params.businessEmail);
    url.searchParams.set('currency_code', params.currency);
    url.searchParams.set('amount', String(params.amount));
    if (params.donorName) {
        url.searchParams.set('item_name', `Donation from ${params.donorName}`);
    }
    if (params.eventId) {
        url.searchParams.set('item_number', params.eventId);
    }
    return url.toString();
};

export async function POST(req: Request) {
    try {
        const ip = getIP(req);
        // Limit donation attempts (5 requests per hour)
        const { isLimited, response } = rateLimit(ip, 5, 60 * 60 * 1000);
        if (isLimited) return response;

        const body = await req.json();
        const { amount, email, name, eventId, currency = 'UGX', phoneNumber } = body as {
            amount: number | string;
            email: string;
            name?: string;
            eventId?: string;
            currency?: DonationCurrency;
            phoneNumber?: string;
        };

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
        if (!VALID_CURRENCIES.includes(currency)) {
            return NextResponse.json({ error: 'Invalid currency. Use UGX, USD, EUR, or GBP.' }, { status: 400 });
        }

        const minAmount = MIN_AMOUNT_BY_CURRENCY[currency];
        if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount < minAmount || !email) {
            return NextResponse.json({ error: `Missing required fields or amount below minimum (${currency} ${minAmount})` }, { status: 400 });
        }

        // For UGX mobile money, phone number is required
        if (currency === 'UGX' && !phoneNumber) {
            return NextResponse.json({ error: 'Phone number required for Mobile Money payments' }, { status: 400 });
        }

        const appBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://africangirlriseltd.org';
        const successUrl = `${appBaseUrl}/events?donation=success`;
        const paypalBusinessEmail = process.env.PAYPAL_BUSINESS_EMAIL || 'africangirlriseltd@gmail.com';

        const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

        if (!secretKey) {
            if (currency !== 'UGX') {
                return NextResponse.json(
                    {
                        error: 'Flutterwave is not configured for international checkout.',
                        code: 'FLUTTERWAVE_NOT_CONFIGURED',
                        paypalUrl: getPayPalDonateUrl({
                            businessEmail: paypalBusinessEmail,
                            amount: parsedAmount,
                            currency,
                            donorName: name,
                            eventId,
                        }),
                    },
                    { status: 503 }
                );
            }
            return NextResponse.json({ error: 'Payment service not configured. Set FLUTTERWAVE_SECRET_KEY in environment variables.' }, { status: 503 });
        }

        const paymentConfigByCurrency: Record<string, { payment_options: string; country?: string }> = {
            UGX: {
                payment_options: 'mobilemoneyuganda',
                country: 'UG',
            },
            USD: {
                payment_options: 'card,banktransfer',
            },
            EUR: {
                payment_options: 'card,banktransfer',
            },
            GBP: {
                payment_options: 'card,banktransfer',
            },
        };

        const payload: Record<string, unknown> = {
            tx_ref: `agr_${Date.now()}_${eventId || 'gen'}`,
            amount: parsedAmount,
            currency: currency,
            redirect_url: successUrl,
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
            ...paymentConfigByCurrency[currency]
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
            if (currency !== 'UGX') {
                return NextResponse.json(
                    {
                        error: 'Flutterwave initialization failed for international payment. Redirecting to PayPal fallback.',
                        code: 'FLUTTERWAVE_INIT_FAILED',
                        paypalUrl: getPayPalDonateUrl({
                            businessEmail: paypalBusinessEmail,
                            amount: parsedAmount,
                            currency,
                            donorName: name,
                            eventId,
                        }),
                    },
                    { status: 502 }
                );
            }
            return NextResponse.json({ error: 'Payment initialization failed', details: data }, { status: 500 });
        }

        return NextResponse.json({ paymentUrl, provider: 'flutterwave' });

    } catch (error) {
        console.error('Donation API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
