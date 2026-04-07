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
        content: '<p>Before joining African Girl Rise, I thought my story was already written. Now, I am writing my own destiny through the Education Drive program. My dreams are no longer too big for my world.</p>',
        author: 'Sarah M.',
        created_at: new Date().toISOString(),
    },
    {
        id: 'mock-2',
        title: 'A Bridge to Radiance',
        content: '<p>Having a mentor who looks like me and has walked my path made all the difference in my academic journey. I realized my beginning does not define my becoming.</p>',
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
        description: 'Community outreach in marginalized districts.',
    }
];

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
            } catch {
                setStories(MOCK_STORIES);
                setMedia(MOCK_MEDIA);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <p className="subheading reveal">Narratives</p>
                <h1 className="heading-display reveal">Voices of <span className="text-gradient">Resilience</span></h1>
                <p className="subheading reveal" style={{ marginTop: '2rem', fontStyle: 'italic', letterSpacing: '0.1em' }}>
                    Authentic journeys of transformation and visual archives of our rise.
                </p>
            </section>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'stories' ? styles.active : ''}`}
                    onClick={() => setActiveTab('stories')}
                >
                    Written Archives
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'gallery' ? styles.active : ''}`}
                    onClick={() => setActiveTab('gallery')}
                >
                    Visual Gallery
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '15rem', opacity: 0.5, letterSpacing: '0.2em' }}>DOCUMENTING RESILIENCE...</div>
            ) : activeTab === 'stories' ? (
                <div className={styles.storyGrid}>
                    {stories.map(story => (
                        <article key={story.id} className={styles.storyCard}>
                            <h2 className="serif">{story.title}</h2>
                            <div className={styles.meta}>
                                <span>WRITTEN BY: {story.author}</span>
                                <span>DATE: {formatDate(story.created_at)}</span>
                            </div>
                            <div
                                className={styles.content}
                                dangerouslySetInnerHTML={{ __html: story.content }}
                            />
                        </article>
                    ))}
                </div>
            ) : (
                <div className={styles.mediaGrid}>
                    {media.map(item => (
                        <div key={item.id} className={styles.mediaItem}>
                            <div className={styles.mediaPreviewWrapper}>
                                {item.type === 'image' ? (
                                    <Image
                                      src={item.url}
                                      alt={item.description}
                                      fill
                                      className={styles.mediaPreview}
                                      style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <video src={item.url} controls className={styles.mediaPreview} />
                                )}
                            </div>
                            <div className={styles.mediaCaption}>{item.description}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
