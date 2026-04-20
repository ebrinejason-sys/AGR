import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getFlutterwaveChargeStatus } from '../../src/lib/flutterwave';
import { rateLimit, getIPFromHeader } from '../../src/lib/rate-limit';
import { getMarzPayCollectionStatus } from '../../src/lib/marzpay';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const ip = getIPFromHeader(req.headers['x-forwarded-for']);
        const rl = rateLimit(ip, 60, 5 * 60 * 1000);
        if (rl.isLimited) return res.status(rl.statusCode).json(rl.body);

        const provider = (req.query.provider as string)?.trim().toLowerCase() || null;
        const chargeId = (req.query.chargeId as string)?.trim();
        const transactionId = (req.query.transactionId as string)?.trim();

        res.setHeader('Cache-Control', 'no-store');

        if (provider === 'flutterwave' || (!provider && chargeId)) {
            if (!chargeId) return res.status(400).json({ error: 'Charge ID is required for Flutterwave status checks.' });
            const status = await getFlutterwaveChargeStatus(chargeId);
            return res.json(status);
        }

        if (provider === 'marzpay' || (!provider && transactionId)) {
            if (!transactionId) return res.status(400).json({ error: 'Transaction ID is required for MarzPay status checks.' });
            const status = await getMarzPayCollectionStatus(transactionId);
            return res.json(status);
        }

        return res.status(400).json({ error: 'Specify provider=flutterwave or provider=marzpay with the appropriate ID.' });
    } catch (error) {
        console.error('Donation status API Error:', error);
        return res.status(502).json({ error: error instanceof Error ? error.message : 'Failed to check donation status.' });
    }
}
