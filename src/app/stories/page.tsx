"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                // Mock Data
                setStories([{
                    id: '1',
                    title: "My Journey from the Village",
                    content: "I used to walk 10km every day just to get to a school without desks. When African Girl Rise provided me with educational support and a bicycle, everything changed...",
                    author: "Sylvia M.",
                    created_at: new Date().toISOString()
                }]);
                setMedia([
                    { id: 'm1', url: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=600&auto=format&fit=crop', type: 'image', description: 'Students smiling in the new Rise Room' },
                    { id: 'm2', url: 'https://images.unsplash.com/photo-1524584218214-e77adba52419?q=80&w=600&auto=format&fit=crop', type: 'image', description: 'Community gathering at Ibanda' },
                ]);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/public/data');
                const data = await res.json();

                if (res.ok) {
                    setStories(data.stories || []);
                    setMedia(data.media || []);
                }
            } catch (err) {
                console.error("Failed to fetch gallery data", err);
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
