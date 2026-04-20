import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireAdminSession, checkSupabaseAdminConfig } from '../src/lib/admin-api';

import contactsHandler from '../src/lib/admin-api-routes/contacts';
import emailHandler from '../src/lib/admin-api-routes/email';
import eventsHandler from '../src/lib/admin-api-routes/events';
import projectsHandler from '../src/lib/admin-api-routes/projects';
import projectsIdHandler from '../src/lib/admin-api-routes/projects/[id]';
import statsHandler from '../src/lib/admin-api-routes/stats';
import storiesHandler from '../src/lib/admin-api-routes/stories';
import subscriptionsHandler from '../src/lib/admin-api-routes/subscriptions';
import emailBroadcastHandler from '../src/lib/admin-api-routes/email/broadcast';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const configError = checkSupabaseAdminConfig();
    if (configError) return res.status(configError.statusCode).json(configError.body);

    const { error: authError } = requireAdminSession(req.headers.cookie as string);
    if (authError) return res.status(authError.statusCode).json(authError.body);

    const action = req.query.action as string;

    if (!action) {
        return res.status(400).json({ error: 'Missing action parameter' });
    }

    try {
        switch (action) {
            case 'contacts':
                return await contactsHandler(req, res);
            case 'email':
                return await emailHandler(req, res);
            case 'events':
                return await eventsHandler(req, res);
            case 'projects':
                // Check if id is passed in query for specific project logic
                if (req.query.id) {
                    return await projectsIdHandler(req, res);
                }
                return await projectsHandler(req, res);
            case 'stats':
                return await statsHandler(req, res);
            case 'stories':
                return await storiesHandler(req, res);
            case 'subscriptions':
                return await subscriptionsHandler(req, res);
            case 'email_broadcast':
                return await emailBroadcastHandler(req, res);
            default:
                return res.status(404).json({ error: 'Admin action not found' });
        }
    } catch (err) {
        console.error(`Admin API Error (${action}):`, err);
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
    }
}
