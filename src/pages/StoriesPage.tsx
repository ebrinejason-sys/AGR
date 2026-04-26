import { useEffect, useState, lazy, Suspense } from 'react';
import { User, Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import PageHero from '@/components/PageHero';
import styles from './StoriesPage.module.css';

const DonationModal = lazy(() => import('@/components/DonationModal'));

type Story = { id: string; title: string; content: string; author: string; image_url?: string; created_at: string };

const MOCK_STORIES: Story[] = [
    { id: 'mock-1', title: 'The Silent Strength', content: '<p>Before joining African Girl Rise, I thought my story was already written. Now, I am writing my own destiny through the Rise Room programme. My dreams are no longer too big for my world.</p>', author: 'Sarah M.', created_at: new Date().toISOString() },
    { id: 'mock-2', title: 'A Bridge to Radiance', content: '<p>Having a mentor who looks like me and has walked my path made all the difference in my academic journey. I realised my beginning does not define my becoming.</p>', author: 'Grace A.', created_at: new Date().toISOString() },
];

function StoryCard({ story }: { story: Story }) {
    const [expanded, setExpanded] = useState(false);
    const plainText = story.content.replace(/<[^>]+>/g, '');
    const needsExpansion = plainText.length > 300;

    return (
        <article className={styles.storyCard}>
            {story.image_url && (
                <div className={styles.storyCover}>
                    <img src={story.image_url} alt={story.title} className={styles.storyImage} />
                </div>
            )}
            <div className={styles.storyCardInner}>
                <h2>{story.title}</h2>
                <div className={styles.meta}>
                    <span className={styles.metaItem}><User size={14} /> {story.author || 'African Girl Rise'}</span>
                    <span className={styles.metaItem}><Calendar size={14} /> {formatDate(story.created_at)}</span>
                </div>
                <div className={`${styles.content} ${!expanded && needsExpansion ? styles.contentClamped : ''}`} dangerouslySetInnerHTML={{ __html: story.content }} />
                {needsExpansion && (
                    <button className={styles.readMoreBtn} onClick={() => setExpanded(!expanded)}>
                        {expanded ? 'Show Less' : 'Read More'} <ArrowRight size={14} className={styles.inlineIconTrailing} />
                    </button>
                )}
            </div>
        </article>
    );
}

export default function StoriesPage() {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    useEffect(() => {
        fetch('/api/public/data')
            .then(r => r.json())
            .then(data => setStories(data.stories?.length > 0 ? data.stories : MOCK_STORIES))
            .catch(() => setStories(MOCK_STORIES))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className={styles.container}>
            <PageHero
                eyebrow="Voices of Change"
                title="Stories of Rise"
            />
            <section className={`${styles.storyGrid} ${styles.storyGridTopPad}`}>
                {loading ? (
                    <div className={styles.loadingState}>Loading stories...</div>
                ) : (
                    <div className={styles.storyGridInner}>
                        {stories.map(story => <StoryCard key={story.id} story={story} />)}
                    </div>
                )}
            </section>

            <section className={styles.ctaBanner}>
                <p className={styles.ctaBannerEyebrow}>Every Story Continues</p>
                <h2 className={styles.ctaBannerTitle}>Be the reason a girl <span className="text-gradient">writes her next chapter</span></h2>
                <button className="btn-premium" onClick={() => setIsDonationModalOpen(true)}>
                    Support a Story <ArrowRight size={18} className={styles.inlineIconTrailing} />
                </button>
            </section>

            {isDonationModalOpen && (
                <Suspense fallback={null}>
                    <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
                </Suspense>
            )}
        </div>
    );
}
