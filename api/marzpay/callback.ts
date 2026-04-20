import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'POST') {
        try {
            const payload = req.body || {};
            const eventType = typeof payload?.event_type === 'string' ? payload.event_type : 'unknown';
            const reference = typeof payload?.transaction?.reference === 'string' ? payload.transaction.reference : 'unknown';
            const status = typeof payload?.transaction?.status === 'string' ? payload.transaction.status : 'unknown';
            console.info('MarzPay callback received', { eventType, reference, status });
            return res.json({ received: true });
        } catch (error) {
            console.error('MarzPay callback handling error:', error);
            return res.json({ received: false });
        }
    }

    if (req.method === 'GET') {
        const base = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
        const redirectUrl = new URL('/pay', base);
        for (const [key, value] of Object.entries(req.query)) {
            if (typeof value === 'string') redirectUrl.searchParams.set(key, value);
        }
        if (!redirectUrl.searchParams.has('provider')) redirectUrl.searchParams.set('provider', 'marzpay');
        if (!redirectUrl.searchParams.has('status')) redirectUrl.searchParams.set('status', 'processing');
        return res.redirect(302, redirectUrl.toString());
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
