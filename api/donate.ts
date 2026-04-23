import type { VercelRequest, VercelResponse } from '@vercel/node';
import { rateLimit, getIPFromHeader } from '../lib/rate-limit';
import { initializeFlutterwaveMobileMoneyCheckout } from '../lib/flutterwave';
import { initializeMarzPayCheckout, type DonationCurrency, type DonationMethod } from '../lib/marzpay';

const VALID_CURRENCIES: DonationCurrency[] = ['UGX'];
const VALID_METHODS: DonationMethod[] = ['mobile_money', 'card'];
const MIN_AMOUNT = 500;
const MAX_AMOUNT = 10_000_000;


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const ip = getIPFromHeader(req.headers['x-forwarded-for']);
        const rl = rateLimit(ip, 5, 60 * 60 * 1000);
        if (rl.isLimited) return res.status(rl.statusCode).json(rl.body);

        const body = req.body || {};
        const { amount, email, name, eventId, currency = 'UGX', method = 'mobile_money', phoneNumber, mobileMoneyNetwork, provider } = body as {
            amount: number | string; email?: string; name?: string; eventId?: string;
            currency?: DonationCurrency; method?: DonationMethod; phoneNumber?: string; mobileMoneyNetwork?: string; provider?: string;
        };

        if (email && String(email).length > 255) return res.status(400).json({ error: 'Email too long.' });
        if (name && String(name).length > 255) return res.status(400).json({ error: 'Name too long.' });
        if (phoneNumber && String(phoneNumber).length > 32) return res.status(400).json({ error: 'Phone number too long.' });

        const parsedAmount = Number(amount);
        if (!VALID_CURRENCIES.includes(currency)) return res.status(400).json({ error: 'Invalid currency. Donations are processed in UGX.' });
        if (!VALID_METHODS.includes(method)) return res.status(400).json({ error: 'Invalid donation method.' });
        if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount < MIN_AMOUNT || parsedAmount > MAX_AMOUNT) {
            return res.status(400).json({ error: `Donation amount must be between UGX ${MIN_AMOUNT.toLocaleString()} and UGX ${MAX_AMOUNT.toLocaleString()}.` });
        }

        const normalizedEmail = email?.trim();
        if (!normalizedEmail) return res.status(400).json({ error: 'Email address is required.' });
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return res.status(400).json({ error: 'Enter a valid email address.' });
        if (method === 'mobile_money' && !phoneNumber?.trim()) return res.status(400).json({ error: 'Phone number is required for mobile money donations.' });
        if (method === 'mobile_money' && !mobileMoneyNetwork?.trim()) return res.status(400).json({ error: 'Select the mobile money network for this donation.' });

        const appBaseUrl = (process.env.BASE_URL || process.env.VITE_BASE_URL || `https://${req.headers.host}`).replace(/\/+$/, '');
        const normalizedName = name?.trim() || undefined;

        // Always use Flutterwave for mobile money, MarzPay for card
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
        } else if (method === 'card') {
            checkout = await initializeMarzPayCheckout({
                amount: parsedAmount,
                currency,
                email: normalizedEmail,
                name: normalizedName,
                eventId,
                callbackUrl: `${appBaseUrl}/api/marzpay/callback?provider=marzpay`
            });
        } else {
            return res.status(400).json({ error: 'Unsupported donation method.' });
        }

        return res.json(checkout);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        const status = /not configured/i.test(message) ? 503 : /required|valid|select|maximum|minimum/i.test(message) ? 400 : 502;
        console.error('Donation API Error:', error);
        return res.status(status).json({ error: message });
    }
}
