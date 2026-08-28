import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { hasEventLink, parseSupabaseStorageUrl } from './media.ts';
import { collectPublicMedia, collectPublishedProjects } from './public-media.ts';

describe('collectPublicMedia', () => {
    it('keeps standalone uploads even when event-linked rows also exist', () => {
        const items = collectPublicMedia({
            media: [
                { id: 'standalone', url: 'https://cdn.example/a.jpg', type: 'image', description: 'Field visit' },
                { id: 'linked', url: 'https://cdn.example/b.jpg', type: 'image', description: 'Workshop', eventTitle: 'Rise Day' },
            ],
            events: [
                {
                    title: 'Rise Day',
                    gallery: [
                        { id: 'linked', url: 'https://cdn.example/b.jpg', type: 'image', description: 'Workshop' },
                    ],
                },
            ],
        });

        assert.equal(items.length, 2);
        assert.deepEqual(items.map((item) => item.id).sort(), ['linked', 'standalone']);
        assert.equal(items.find((item) => item.id === 'linked')?.eventTitle, 'Rise Day');
    });

    it('recovers event-linked uploads when data.media is empty', () => {
        const items = collectPublicMedia({
            media: [],
            events: [
                {
                    title: 'Mentorship Circle',
                    gallery: [
                        { id: 'photo-1', url: 'https://cdn.example/c.jpg', type: 'image', description: 'Circle' },
                    ],
                },
            ],
        });

        assert.equal(items.length, 1);
        assert.equal(items[0]?.id, 'photo-1');
        assert.equal(items[0]?.eventTitle, 'Mentorship Circle');
    });

    it('skips rows without an id or url', () => {
        const items = collectPublicMedia({
            media: [
                { id: '', url: 'https://cdn.example/missing-id.jpg', type: 'image', description: null },
                { id: 'ok', url: '', type: 'image', description: null },
                { id: 'kept', url: 'https://cdn.example/kept.jpg', type: 'video', description: null },
            ],
        });

        assert.equal(items.length, 1);
        assert.equal(items[0]?.id, 'kept');
    });
});

describe('hasEventLink', () => {
    it('treats empty strings as unlinked so those uploads stay in the public gallery', () => {
        assert.equal(hasEventLink(null), false);
        assert.equal(hasEventLink(''), false);
        assert.equal(hasEventLink('   '), false);
        assert.equal(hasEventLink('event-1'), true);
    });
});

describe('parseSupabaseStorageUrl', () => {
    it('parses public and signed object URLs', () => {
        assert.deepEqual(
            parseSupabaseStorageUrl('https://demo.supabase.co/storage/v1/object/public/media/uploads/photo.jpg'),
            { bucket: 'media', path: 'uploads/photo.jpg' },
        );
        assert.deepEqual(
            parseSupabaseStorageUrl('https://demo.supabase.co/storage/v1/object/sign/media/uploads/photo.jpg?token=abc'),
            { bucket: 'media', path: 'uploads/photo.jpg' },
        );
    });
});

describe('collectPublishedProjects', () => {
    it('hides draft projects and keeps active or unspecified ones', () => {
        const items = collectPublishedProjects({
            projects: [
                { id: '1', title: 'Draft sanctuary', status: 'draft', description: null },
                { id: '2', title: 'Active rescue', status: 'active', description: 'Live' },
                { id: '3', title: 'Legacy row', description: null },
            ],
        });

        assert.deepEqual(items.map((item) => item.id), ['2', '3']);
    });
});
