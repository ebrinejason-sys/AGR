import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminSupabase } from '../supabase.server.js';
import { requireAdminSession, checkSupabaseAdminConfig } from '../admin-api.js';
import { normalizeMediaUrl, normalizeMediaUrls, normalizeRichTextMediaUrls } from '../media.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const configError = checkSupabaseAdminConfig();
    if (configError) return res.status(configError.statusCode).json(configError.body);

    const { session, error: authError } = requireAdminSession(req.headers.cookie as string);
    if (authError) return res.status(authError.statusCode).json(authError.body);

    const supabase = getAdminSupabase();

    const normalizeStory = (s: Record<string, unknown>) => ({ ...normalizeMediaUrls(s, ['image_url']), content: normalizeRichTextMediaUrls(s.content as string) });

    try {
        if (req.method === 'GET') {
            const { data, error } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
            if (error) return res.status(500).json({ error: error.message });
            return res.json({ stories: (data || []).map(normalizeStory) });
        }

        if (req.method === 'POST') {
            const { title, content, image_url, author } = req.body || {};
            if (!title || !content) return res.status(400).json({ error: 'Title and content are required.' });

            const { data, error } = await supabase.from('stories').insert({
                title, content: normalizeRichTextMediaUrls(content),
                author: author || session?.email || 'Admin',
                image_url: normalizeMediaUrl(image_url) || null,
            }).select('*').single();

            if (error) return res.status(500).json({ error: error.message });
            return res.status(201).json({ story: normalizeStory(data) });
        }

        if (req.method === 'PUT') {
            const { id, title, content, image_url, author } = req.body || {};
            if (!id || !title || !content) return res.status(400).json({ error: 'ID, title, and content are required.' });

            const { data, error } = await supabase.from('stories').update({
                title, content: normalizeRichTextMediaUrls(content),
                image_url: normalizeMediaUrl(image_url) ?? null,
                ...(author ? { author } : {}),
            }).eq('id', id).select('*').single();

            if (error) return res.status(500).json({ error: error.message });
            return res.json({ story: normalizeStory(data) });
        }

        if (req.method === 'DELETE') {
            const { id } = req.body || {};
            if (!id) return res.status(400).json({ error: 'Story id is required.' });
            const { error } = await supabase.from('stories').delete().eq('id', id);
            if (error) return res.status(500).json({ error: error.message });
            return res.json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('/api/admin/stories error:', err);
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
    }
}
