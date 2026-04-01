"use client";

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import styles from './page.module.css';

type Story = {
    id: string;
    title: string;
    content: string;
    author: string;
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
        title: 'Rising Beyond My Background',
        content: '<p>Before joining African Girl Rise, I thought my story was already written. Now, I am writing my own destiny through the Education Drive program.</p>',
        author: 'Sarah M.',
        created_at: new Date().toISOString(),
    },
    {
        id: 'mock-2',
        title: 'The Power of Mentorship',
        content: '<p>Having a mentor who looks like me and has walked my path made all the difference in my academic journey.</p>',
        author: 'Grace A.',
        created_at: new Date().toISOString(),
    }
];

const MOCK_MEDIA: Media[] = [
    {
        id: 'mock-m1',
        url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
        type: 'image',
        description: 'Classroom empowerment session',
    },
    {
        id: 'mock-m2',
        url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
        type: 'image',
        description: 'Community outreach 2024',
    }
];

const sanitizeStoryHtml = (html: string) => {
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/\son\w+=("[^"]*"|'[^']*')/gi, '');
};

export default function StoriesGallery() {
    const [stories, setStories] = useState<Story[]>([]);
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'stories' | 'gallery'>('stories');

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/public/data');
                const data = await res.json();

                if (res.ok) {
                    setStories(data.stories && data.stories.length > 0 ? data.stories : MOCK_STORIES);
                    setMedia(data.media && data.media.length > 0 ? data.media : MOCK_MEDIA);
                } else {
                    setStories(MOCK_STORIES);
                    setMedia(MOCK_MEDIA);
                }
            } catch (err) {
                console.error("Failed to fetch gallery data", err);
                setStories(MOCK_STORIES);
                setMedia(MOCK_MEDIA);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className="heading-xl">Voices of <span className="text-gradient">Resilience</span></h1>
                <p className={styles.subtitle}>
                    Read the stories of generational transformation and explore our journey through pictures and videos.
                </p>
            </header>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'stories' ? styles.active : ''}`}
                    onClick={() => setActiveTab('stories')}
                >
                    Written Stories
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'gallery' ? styles.active : ''}`}
                    onClick={() => setActiveTab('gallery')}
                >
                    Media Gallery
                </button>
            </div >

            {
                loading ? (
                    <div className={styles.loader} > Loading...</div>
                ) : activeTab === 'stories' ? (
                    <div className={styles.storyGrid}>
                        {stories.length === 0 ? <p className={styles.empty}>No stories shared yet.</p> : stories.map(story => (
                            <article key={story.id} className={styles.storyCard}>
                                <h2>{story.title}</h2>
                                <div className={styles.meta}>
                                    <span className={styles.author}>By {story.author}</span>
                                    <span className={styles.date}>{formatDate(story.created_at)}</span>
                                </div>
                                <div
                                    className={styles.content}
                                    dangerouslySetInnerHTML={{ __html: sanitizeStoryHtml(story.content) }}
                                />
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className={styles.mediaGrid}>
                        {media.length === 0 ? <p className={styles.empty}>No media uploaded yet.</p> : media.map(item => (
                            <div key={item.id} className={styles.mediaItem}>
                                <div className={styles.mediaPreviewWrapper}>
                                    {item.type === 'image' ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={item.url} alt={item.description || 'Gallery image'} className={styles.mediaPreview} loading="lazy" decoding="async" />
                                    ) : (
                                        <video src={item.url} controls playsInline preload="none" className={styles.mediaPreview} />
                                    )}
                                </div>
                                {item.description && <div className={styles.mediaCaption}>{item.description}</div>}
                            </div>
                        ))}
                    </div>
                )
            }
        </div >
    );
}
