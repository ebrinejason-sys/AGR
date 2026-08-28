import { collectPublicMedia, collectPublishedProjects, type PublicMediaItem, type PublicProjectItem } from './public-media';

export type PublicProject = PublicProjectItem;

export type PublicStory = {
    id: string;
    title: string;
    content: string;
    author: string;
    image_url?: string | null;
    created_at: string;
};

export type PublicEvent = {
    id: string;
    title: string;
    description: string | null;
    event_date: string;
    goal_amount: number;
    current_amount: number;
    status: 'upcoming' | 'completed' | 'cancelled';
    cover_image?: string | null;
    location?: string | null;
    gallery?: PublicMediaItem[] | null;
};

export type PublicCmsData = {
    media: PublicMediaItem[];
    stories: PublicStory[];
    projects: PublicProject[];
    events: PublicEvent[];
};

function asArray<T>(value: unknown): T[] {
    return Array.isArray(value) ? (value as T[]) : [];
}

/**
 * Single client fetch path for admin-published CMS content.
 * Always bypasses HTTP cache so a previously empty payload cannot stick
 * in the browser after the admin uploads new media, stories, or events.
 */
export async function fetchPublicCms(): Promise<PublicCmsData> {
    const response = await fetch('/api/public/data', { cache: 'no-store' });
    const payload = await response.json().catch(() => ({})) as {
        error?: unknown;
        stories?: unknown;
        media?: PublicMediaItem[] | null;
        events?: PublicEvent[] | null;
        projects?: PublicProject[] | null;
    };

    if (!response.ok) {
        const message = typeof payload.error === 'string' ? payload.error : 'Public content could not be loaded.';
        throw new Error(message);
    }

    const media = collectPublicMedia(payload);
    const stories = asArray<PublicStory>(payload.stories).filter((story) => Boolean(story?.id && story.title));
    const projects = collectPublishedProjects(payload);
    const events = asArray<PublicEvent>(payload.events).filter((event) => Boolean(event?.id && event.title));

    if (
        typeof payload.error === 'string' &&
        media.length === 0 &&
        stories.length === 0 &&
        projects.length === 0 &&
        events.length === 0
    ) {
        throw new Error(payload.error);
    }

    return { media, stories, projects, events };
}
