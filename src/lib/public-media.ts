export type PublicMediaItem = {
    id: string;
    url: string;
    type: 'image' | 'video';
    description: string | null;
    created_at?: string | null;
    eventTitle?: string | null;
};

export type PublicProjectItem = {
    id: string;
    title: string;
    description: string | null;
    image_url?: string | null;
    status?: string | null;
    pillar_number?: number | null;
};

type PublicEventMedia = {
    title?: string | null;
    gallery?: PublicMediaItem[] | null;
};

type PublicMediaPayload = {
    media?: PublicMediaItem[] | null;
    events?: PublicEventMedia[] | null;
};

/**
 * Merge standalone gallery uploads with event-linked photos, de-duplicated by id.
 * Admin uploads were disappearing from the homepage because it only read `data.media`
 * (rows with a null event_id), while event-linked rows lived only on event galleries.
 */
export function collectPublicMedia(data: PublicMediaPayload | null | undefined): PublicMediaItem[] {
    const seen = new Set<string>();
    const items: PublicMediaItem[] = [];

    const push = (item: PublicMediaItem | null | undefined, eventTitle: string | null) => {
        if (!item?.id || !item.url || seen.has(item.id)) return;
        seen.add(item.id);
        items.push({ ...item, eventTitle });
    };

    for (const item of data?.media || []) {
        push(item, item.eventTitle ?? null);
    }

    for (const event of data?.events || []) {
        const eventTitle = event.title?.trim() || null;
        for (const item of event.gallery || []) {
            push(item, eventTitle);
        }
    }

    return items;
}

export function isPublishedProject(project: PublicProjectItem | null | undefined): boolean {
    if (!project?.id || !project.title) return false;
    return project.status !== 'draft';
}

export function collectPublishedProjects(data: { projects?: PublicProjectItem[] | null } | null | undefined): PublicProjectItem[] {
    return (data?.projects || []).filter(isPublishedProject);
}
