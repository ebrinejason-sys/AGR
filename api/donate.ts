import type { VercelRequest, VercelResponse } from '@vercel/node';
import { rateLimit, getIPFromHeader } from '../src/lib/rate-limit';
import { initializeFlutterwaveMobileMoneyCheckout } from '../src/lib/flutterwave';
import { initializeMarzPayCheckout, type DonationCurrency, type DonationMethod } from '../src/lib/marzpay';

const VALID_CURRENCIES: DonationCurrency[] = ['UGX'];
const VALID_METHODS: DonationMethod[] = ['mobile_money', 'card'];
const MIN_AMOUNT = 500;
const MAX_AMOUNT = 10_000_000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Add CORS headers for robustness if needed, though Vercel handles most of this
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        const ip = getIPFromHeader(req.headers['x-forwarded-for']);
        const rl = rateLimit(ip, 10, 60 * 60 * 1000); // Relaxed slightly for testing/multiple attempts
        if (rl.isLimited) {
            return res.status(rl.statusCode).json({ error: 'Too many requests. Please try again later.' });
        }

        const body = req.body || {};
        const { amount, email, name, eventId, currency = 'UGX', method = 'mobile_money', phoneNumber, mobileMoneyNetwork } = body as {
            amount: number | string;
            email?: string;
            name?: string;
            eventId?: string;
            currency?: DonationCurrency;
            method?: DonationMethod;
            phoneNumber?: string;
            mobileMoneyNetwork?: string;
        };

        // Basic sanity checks
        if (email && String(email).length > 255) return res.status(400).json({ error: 'Email is too long.' });
        if (name && String(name).length > 255) return res.status(400).json({ error: 'Name is too long.' });
        if (phoneNumber && String(phoneNumber).length > 32) return res.status(400).json({ error: 'Phone number is too long.' });

        const parsedAmount = Number(amount);
        if (!VALID_CURRENCIES.includes(currency)) {
            return res.status(400).json({ error: 'Invalid currency. We only support UGX at this time.' });
        }

        if (!VALID_METHODS.includes(method)) {
            return res.status(400).json({ error: 'Invalid donation method selected.' });
        }

        if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount < MIN_AMOUNT || parsedAmount > MAX_AMOUNT) {
            return res.status(400).json({
                error: `Donation amount must be between UGX ${MIN_AMOUNT.toLocaleString()} and UGX ${MAX_AMOUNT.toLocaleString()}.`
            });
        }

        const normalizedEmail = email?.trim();
        if (!normalizedEmail) {
            return res.status(400).json({ error: 'Email address is required for receipts.' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({ error: 'Please enter a valid email address.' });
        }

        if (method === 'mobile_money') {
            if (!phoneNumber?.trim()) {
                return res.status(400).json({ error: 'Phone number is required for Mobile Money.' });
            }
            if (!mobileMoneyNetwork?.trim()) {
                return res.status(400).json({ error: 'Please select a Mobile Money network (MTN or Airtel).' });
            }
        }

        const appBaseUrl = (process.env.BASE_URL || process.env.VITE_BASE_URL || `https://${req.headers.host}`).replace(/\/+$/, '');
        const normalizedName = name?.trim() || undefined;

        console.info(`Initiating ${method} checkout for ${normalizedEmail} - ${parsedAmount} ${currency}`);

        let checkout;
        if (method === 'mobile_money') {
            checkout = await initializeFlutterwaveMobileMoneyCheckout({
                amount: parsedAmount,
                currency,
                email: normalizedEmail,
                eventId,
                name: normalizedName,
                network: mobileMoneyNetwork?.trim(),
                phoneNumber: phoneNumber?.trim() || '',
                redirectUrl: `${appBaseUrl}/pay?provider=flutterwave`
            });
        } else {
            checkout = await initializeMarzPayCheckout({
                amount: parsedAmount,
                currency,
                email: normalizedEmail,
                name: normalizedName,
                eventId,
                callbackUrl: `${appBaseUrl}/api/marzpay/callback?provider=marzpay`
            });
        }

        if (!checkout.redirectUrl) {
            throw new Error('Payment provider failed to return a redirect URL.');
        }

        return res.status(200).json(checkout);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        console.error('Donation API Error:', error);

        // Handle specific error types to give better feedback to the user
        if (/not configured/i.test(message)) {
            return res.status(503).json({ error: 'Payment service is temporarily unavailable. Please try again later.' });
        }

        if (/invalid/i.test(message) || /required/i.test(message)) {
            return res.status(400).json({ error: message });
        }

        return res.status(502).json({ error: 'The payment gateway is currently unreachable. Please try again in a moment.' });
    }
}
