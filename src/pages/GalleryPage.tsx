import { useEffect, useMemo, useState } from 'react';
import { Camera, CalendarDays, ImageOff, Images } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { collectPublicMedia, type PublicMediaItem } from '@/lib/public-media';
import styles from './GalleryPage.module.css';

type GalleryMedia = PublicMediaItem;

function formatMediaDate(date?: string | null) {
    if (!date) return null;

    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
}

export default function GalleryPage() {
    const [media, setMedia] = useState<GalleryMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        fetch('/api/public/data')
            .then((response) => {
                if (!response.ok) throw new Error('Gallery data could not be loaded.');
                return response.json();
            })
            .then((data) => {
                if (!mounted) return;
                setMedia(collectPublicMedia(data));
                setError(null);
            })
            .catch(() => {
                if (!mounted) return;
                setError('Gallery media is temporarily unavailable.');
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    const stats = useMemo(() => {
        const imageCount = media.filter((item) => item.type === 'image').length;
        const videoCount = media.filter((item) => item.type === 'video').length;
        const eventCount = new Set(media.map((item) => item.eventTitle).filter(Boolean)).size;

        return [
            { label: 'Photos', value: imageCount },
            { label: 'Videos', value: videoCount },
            { label: 'Event sets', value: eventCount },
        ];
    }, [media]);

    return (
        <div className={styles.page}>
            <PageHero
                eyebrow="Gallery"
                title="Moments of Rise"
                description="A living archive of field moments, programme gatherings, and community impact uploaded by the African Girl Rise team."
                backgroundImage="/images/agr-photo-2.jpg"
            />

            <section className={styles.summaryBand}>
                {stats.map((stat) => (
                    <div key={stat.label} className={styles.summaryItem}>
                        <span>{stat.value}</span>
                        <p>{stat.label}</p>
                    </div>
                ))}
            </section>

            <section className={styles.gallerySection}>
                <div className={styles.sectionHeader}>
                    <div>
                        <span className="subheading">Uploaded Media</span>
                        <h2 className="heading-section">Latest from the field.</h2>
                    </div>
                    <div className={styles.headerBadge}>
                        <Images size={18} />
                        <span>{media.length} items</span>
                    </div>
                </div>

                {loading && (
                    <div className={styles.statePanel}>
                        <Camera size={28} />
                        <p>Loading gallery...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className={styles.statePanel}>
                        <ImageOff size={28} />
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && media.length === 0 && (
                    <div className={styles.statePanel}>
                        <ImageOff size={28} />
                        <p>No uploaded public gallery media is available yet.</p>
                    </div>
                )}

                {!loading && !error && media.length > 0 && (
                    <div className={styles.galleryGrid}>
                        {media.map((item) => {
                            const date = formatMediaDate(item.created_at);

                            return (
                                <figure key={`${item.eventTitle || 'gallery'}-${item.id}`} className={styles.mediaCard}>
                                    <div className={styles.mediaFrame}>
                                        {item.type === 'video' ? (
                                            <video src={item.url} controls playsInline className={styles.media} />
                                        ) : (
                                            <img src={item.url} alt={item.description || item.eventTitle || 'African Girl Rise gallery image'} className={styles.media} loading="lazy" />
                                        )}
                                        {item.eventTitle && <span className={styles.eventPill}>{item.eventTitle}</span>}
                                    </div>
                                    {(item.description || date) && (
                                        <figcaption className={styles.caption}>
                                            {item.description && <strong>{item.description}</strong>}
                                            {date && (
                                                <span>
                                                    <CalendarDays size={14} />
                                                    {date}
                                                </span>
                                            )}
                                        </figcaption>
                                    )}
                                </figure>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
