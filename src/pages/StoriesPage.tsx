import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import styles from './StoriesPage.module.css';

type Story = { id: string; title: string; content: string; author: string; image_url?: string; created_at: string };

const MOCK_STORIES: Story[] = [
    { id: 'mock-1', title: 'The Silent Strength', content: '<p>Before joining African Girl Rise, I thought my story was already written. Now, I am writing my own destiny through the Rise Room programme. My dreams are no longer too big for my world.</p>', author: 'Sarah M.', created_at: new Date().toISOString() },
    { id: 'mock-2', title: 'A Bridge to Radiance', content: '<p>Having a mentor who looks like me and has walked my path made all the difference in my academic journey. I realised my beginning does not define my becoming.</p>', author: 'Grace A.', created_at: new Date().toISOString() },
];

const PREVIEW_LENGTH = 500;

function StoryCard({ story }: { story: Story }) {
    const [expanded, setExpanded] = useState(false);
    const plainText = story.content.replace(/<[^>]+>/g, '');
    const needsExpansion = plainText.length > PREVIEW_LENGTH;

    return (
        <article className={styles.storyCard}>
            {story.image_url && (
                <div className={styles.storyCover} style={{ position: 'relative', overflow: 'hidden' }}>
                    <img src={story.image_url} alt={story.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    <div className={styles.storyCoverOverlay} />
                </div>
            )}
            <div className={styles.storyCardInner}>
                <h2 className="serif">{story.title}</h2>
                <div className={styles.meta}>
                    <span>WRITTEN BY: {story.author || 'African Girl Rise'}</span>
                    <span>DATE: {formatDate(story.created_at)}</span>
                </div>
                <div className={`${styles.content} ${!expanded && needsExpansion ? styles.contentClamped : ''}`} dangerouslySetInnerHTML={{ __html: story.content }} />
                {needsExpansion && <button className={styles.readMoreBtn} onClick={() => setExpanded(!expanded)}>{expanded ? 'Show Less ↑' : 'Read More ↓'}</button>}
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
            .then(data => setStories(data.stories?.length > 0 ? data.stories : MOCK_STORIES))
            .catch(() => setStories(MOCK_STORIES))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <p className="subheading reveal">Their Words</p>
                <h1 className="heading-display reveal">Stories of <span className="text-gradient">Rise</span></h1>
            </section>
            {loading ? <div className={styles.loadingState}>Loading stories…</div> : (
                <div className={styles.storyGrid}>
                    {stories.map(story => <StoryCard key={story.id} story={story} />)}
                </div>
            )}
        </div>
    );
}
