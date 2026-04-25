import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getChannelData, getRecentVideos } from '../src/lib/youtube.js';
import { rateLimit, getIPFromHeader } from '../src/lib/rate-limit.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const ip = getIPFromHeader(req.headers['x-forwarded-for']);
        const rl = rateLimit(ip, 30, 60 * 1000); // 30 requests per minute
        if (rl.isLimited) return res.status(rl.statusCode).json(rl.body);

        // Cache for 1 hour
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600');

        const [channel, videos] = await Promise.all([
            getChannelData(),
            getRecentVideos(12)
        ]);

        return res.json({
            channel,
            videos,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('YouTube API Error:', error);
        const message = error instanceof Error ? error.message : 'Failed to fetch YouTube data';
        const status = /configured/i.test(message) ? 503 : 502;
        return res.status(status).json({ error: message });
    }
}
