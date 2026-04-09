"use client";

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import styles from './page.module.css';
import Image from 'next/image';

type Story = {
    id: string;
    title: string;
    content: string;
    author: string;
    image_url?: string;
    created_at: string;
};

type Media = {
    id: string;
    url: string;
    type: 'image' | 'video';
    description: string;
};

const MOCK_STORIES: Story[] = [
    {
        id: 'mock-1',
        title: 'The Silent Strength',
        content: '<p>Before joining African Girl Rise, I thought my story was already written. Now, I am writing my own destiny through the Rise Room programme. My dreams are no longer too big for my world.</p>',
        author: 'Sarah M.',
        created_at: new Date().toISOString(),
    },
    {
        id: 'mock-2',
        title: 'A Bridge to Radiance',
        content: '<p>Having a mentor who looks like me and has walked my path made all the difference in my academic journey. I realised my beginning does not define my becoming.</p>',
        author: 'Grace A.',
        created_at: new Date().toISOString(),
    }
];

const MOCK_MEDIA: Media[] = [
    {
        id: 'mock-m1',
        url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
        type: 'image',
        description: 'Empowerment through collective strength.',
    },
    {
        id: 'mock-m2',
        url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
        type: 'image',
        description: 'Community outreach in marginalised districts.',
    }
];

const PREVIEW_LENGTH = 500; // characters of stripped HTML

function StoryCard({ story }: { story: Story }) {
    const [expanded, setExpanded] = useState(false);
    const plainText = story.content.replace(/<[^>]+>/g, '');
    const needsExpansion = plainText.length > PREVIEW_LENGTH;

    return (
        <article className={styles.storyCard}>
            {story.image_url && (
                <div className={styles.storyCover}>
                    <Image
                        src={story.image_url}
                        alt={story.title}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        sizes="(max-width: 768px) 100vw, 900px"
                    />
                    <div className={styles.storyCoverOverlay} />
                </div>
            )}
            <div className={styles.storyCardInner}>
                <h2 className="serif">{story.title}</h2>
                <div className={styles.meta}>
                    <span>WRITTEN BY: {story.author || 'African Girl Rise'}</span>
                    <span>DATE: {formatDate(story.created_at)}</span>
                </div>
                <div
                    className={`${styles.content} ${!expanded && needsExpansion ? styles.contentClamped : ''}`}
                    dangerouslySetInnerHTML={{ __html: story.content }}
                />
                {needsExpansion && (
                    <button className={styles.readMoreBtn} onClick={() => setExpanded(!expanded)}>
                        {expanded ? 'Show Less ↑' : 'Read More ↓'}
                    </button>
                )}
            </div>
        </article>
    );
}

export default function StoriesPage() {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/public/data')
            .then(r => r.json())
            .then(data => {
                setStories(data.stories?.length > 0 ? data.stories : MOCK_STORIES);
            })
            .catch(() => setStories(MOCK_STORIES))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <p className="subheading reveal">Their Words</p>
                <h1 className="heading-display reveal">Stories of <span className="text-gradient">Rise</span></h1>
            </section>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '10rem 5%', color: 'var(--text-muted)' }}>
                    Loading stories…
                </div>
            ) : (
                <div className={styles.storyGrid}>
                    {stories.map(story => (
                        <StoryCard key={story.id} story={story} />
                    ))}
                </div>
            )}
        </div>
    );
}
