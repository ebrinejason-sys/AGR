import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const body = req.body || {};
        if (!body || (body.event !== 'boot' && body.event !== 'runtime_error')) {
            return res.status(400).json({ error: 'Invalid event' });
        }

        const sanitizePathname = (v: unknown) => { if (typeof v !== 'string' || !v.startsWith('/')) return '/'; return v.slice(0, 160); };
        const sanitizeIOSVersion = (v: unknown) => { if (typeof v !== 'string') return null; if (!/^\d{1,2}\.\d{1,2}(\.\d{1,2})?$/.test(v)) return null; return v; };

        const safePayload = {
            source: body.source === 'runtime_stability_guard' ? body.source : 'unknown',
            event: body.event, iosVersion: sanitizeIOSVersion(body.iosVersion),
            deviceFamily: body.deviceFamily ?? null, runtimeSafe: Boolean(body.runtimeSafe),
            pathname: sanitizePathname(body.pathname),
            errorCount: typeof body.errorCount === 'number' ? Math.max(0, Math.min(body.errorCount, 1000)) : 0,
            reducedMotion: Boolean(body.reducedMotion), hasLowMemory: Boolean(body.hasLowMemory),
            isLegacyWebView: Boolean(body.isLegacyWebView),
            timestamp: typeof body.timestamp === 'number' ? body.timestamp : Date.now(),
            serverTimestamp: Date.now(),
        };

        console.info('[telemetry][ios]', JSON.stringify(safePayload));
        return res.json({ ok: true });
    } catch {
        return res.status(400).json({ error: 'Invalid telemetry payload' });
    }
}
