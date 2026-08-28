import { useEffect, useState, lazy, Suspense } from 'react';
import { User, Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import PageHero from '@/components/PageHero';
import { fetchPublicCms, type PublicStory } from '@/lib/public-cms';
import styles from './StoriesPage.module.css';

const DonationModal = lazy(() => import('@/components/DonationModal'));

type Story = PublicStory;

function StoryCard({ story }: { story: Story }) {
    const [expanded, setExpanded] = useState(false);
    const html = story.content || '';
    const plainText = html.replace(/<[^>]+>/g, '');
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
                <div className={`${styles.content} ${!expanded && needsExpansion ? styles.contentClamped : ''}`} dangerouslySetInnerHTML={{ __html: html }} />
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
    const [error, setError] = useState<string | null>(null);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    useEffect(() => {
        let mounted = true;

        fetchPublicCms()
            .then((data) => {
                if (!mounted) return;
                setStories(data.stories);
                setError(null);
            })
            .catch(() => {
                if (!mounted) return;
                setStories([]);
                setError('Stories are temporarily unavailable.');
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
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
                ) : error ? (
                    <div className={styles.loadingState}>{error}</div>
                ) : stories.length === 0 ? (
                    <div className={styles.loadingState}>No published stories yet. Check back soon.</div>
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
