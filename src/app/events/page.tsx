"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import styles from './page.module.css';
import DonationModal from '@/components/DonationModal';

type Event = {
    id: string;
    title: string;
    description: string;
    event_date: string;
    goal_amount: number;
    current_amount: number;
    status: 'upcoming' | 'completed' | 'cancelled';
    cover_image?: string;
    achievements?: string;
    media?: { id: string; url: string; type: 'image' | 'video'; description: string }[];
};

const MOCK_EVENTS: Event[] = [
    {
        id: 'mock-1',
        title: 'Education Drive 2025 Launch',
        description: 'Join us as we kick off our 2025 Education Drive program, providing tuition and supplies for 50 girls in Kiburara.',
        event_date: '2025-02-15T09:00:00Z',
        goal_amount: 15000000,
        current_amount: 4500000,
        status: 'upcoming',
        cover_image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
    },
    {
        id: 'mock-2',
        title: 'Community Health & Wellness Workshop',
        description: 'A successful weekend workshop covering SRHR and mental health resilience for adolescent girls and their guardians.',
        event_date: '2024-11-10T10:00:00Z',
        goal_amount: 5000000,
        current_amount: 5000000,
        status: 'completed',
        cover_image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
        achievements: 'Reached over 120 girls and distributed 500 dignity kits.',
    }
];

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [generalDonateOpen, setGeneralDonateOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const selectedEvent = selectedEventId ? events.find((evt) => evt.id === selectedEventId) : null;

    useEffect(() => {
        async function fetchEvents() {
            try {
                // If supabase is not configured, we just show an empty state or handle it gracefully
                const { data } = await supabase
                    .from('events')
                    .select('*, media(*)')
                    .neq('status', 'cancelled')
                    .order('event_date', { ascending: true });

                if (data && data.length > 0) {
                    setEvents(data);
                } else {
                    setEvents(MOCK_EVENTS);
                }
            } catch (err) {
                console.error("Failed to fetch events", err);
                setEvents(MOCK_EVENTS);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className="heading-xl">Events & <span className="text-gradient">Donations</span></h1>
                <p className={styles.ctaSubtitle}>
                    Support our mission. Your money, invested wisely, does not just change one life. It transforms generations.
                </p>
            </header>

            <section className={styles.generalDonateCard}>
                <h2>Donate Any Amount</h2>
                <p>Support the overall cause even if you are not selecting a specific event. Start by choosing your payment method.</p>
                <div className={styles.formActions}>
                    <button type="button" className={styles.btnSubmit} onClick={() => setGeneralDonateOpen(true)}>
                        Open Payment Modal
                    </button>
                </div>
            </section>

            {loading ? (
                <div className={styles.loader}>Loading events...</div>
            ) : events.length === 0 ? (
                <div className={styles.empty}>No events currently active.</div>
            ) : (
                <div className={styles.grid}>
                    {events.map(evt => {
                        const progress = evt.goal_amount > 0 ? Math.min((evt.current_amount / evt.goal_amount) * 100, 100) : 0;

                        return (
                            <div key={evt.id} className={`${styles.eventCard} ${evt.status === 'completed' ? styles.completed : ''}`}>
                                <div className={styles.statusBadge}>{evt.status.toUpperCase()}</div>
                                {evt.cover_image && (
                                    <div className={styles.eventCoverWrapper}>
                                        <img src={evt.cover_image} alt={evt.title} className={styles.eventCoverImg} loading="lazy" decoding="async" />
                                    </div>
                                )}
                                <h2>{evt.title}</h2>
                                <p className={styles.date}>{formatDate(evt.event_date, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p className={styles.description}>{evt.description}</p>
                                {evt.status === 'completed' && evt.achievements && (
                                    <div style={{ background: 'var(--card-hover-bg)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', borderLeft: '3px solid var(--color-pink)' }}>
                                        <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-pink)' }}>Achievements</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{evt.achievements}</p>
                                    </div>
                                )}

                                {evt.media && evt.media.length > 0 && (
                                    <div className={styles.eventGallery}>
                                        <h4 className={styles.eventGalleryTitle}>Event Gallery</h4>
                                        <div className={styles.eventGalleryGrid}>
                                            {evt.media.map(m => (
                                                <div key={m.id} className={styles.eventGalleryItem}>
                                                    {m.type === 'image' ? (
                                                        <img src={m.url} alt={m.description || 'event media'} className={styles.eventGalleryMedia} loading="lazy" decoding="async" />
                                                    ) : (
                                                        <video src={m.url} playsInline preload="none" muted className={styles.eventGalleryMedia} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className={styles.progressContainer}>
                                    <div className={styles.progressText}>
                                        <span>UGX {evt.current_amount.toLocaleString()} raised</span>
                                        <span>Goal: UGX {evt.goal_amount.toLocaleString()}</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                                    </div>
                                </div>

                                {evt.status === 'upcoming' && (
                                    <div className={styles.actions}>
                                        <button className={styles.btnPrimary} onClick={() => setSelectedEventId(evt.id)}>
                                            Donate to this Event
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <DonationModal
                isOpen={generalDonateOpen}
                onClose={() => setGeneralDonateOpen(false)}
            />

            <DonationModal
                isOpen={Boolean(selectedEvent)}
                onClose={() => setSelectedEventId(null)}
                eventId={selectedEvent?.id}
                eventTitle={selectedEvent?.title}
            />
        </div>
    );
}
