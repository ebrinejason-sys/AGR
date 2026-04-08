"use client";

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import DonationModal from '@/components/DonationModal';
import styles from './page.module.css';

type EventMedia = {
    id: string;
    url: string;
    type: 'image' | 'video';
    description: string;
};

type Event = {
    id: string;
    title: string;
    description: string;
    event_date: string;
    goal_amount: number;
    current_amount: number;
    status: 'upcoming' | 'completed' | 'cancelled';
    cover_image?: string;
    media?: EventMedia[];
};

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch('/api/public/data');
                const data = await res.json();
                if (res.ok) {
                    setEvents(data.events || []);
                }
            } catch (err) {
                console.error('Failed to fetch events:', err);
            }
            setLoading(false);
        }
        fetchEvents();
    }, []);

    const selectedEvent = events.find(e => e.id === selectedEventId);

    return (
        <div className={styles.container}>
            {/* Editorial Hero */}
            <section className={styles.hero}>
                <p className="subheading reveal">Milestones</p>
                <h1 className="heading-display reveal">Impact <span className="text-gradient">Events</span></h1>
                <p className="subheading reveal" style={{ fontStyle: 'italic', letterSpacing: '0.1em', marginTop: '2rem' }}>
                  Strategic milestones documenting our shared progress and the future of her rise.
                </p>
            </section>

            {/* Ticker */}
            <div className={styles.ticker} aria-hidden="true">
                <div className={styles.tickerTrack}>
                    {['Upcoming Events', 'Community Gatherings', 'Workshops', 'Training', 'Programs', 'Girls Empowerment', 'Health Talks', 'Legal Advocacy', 'Mentorship', 'Community Outreach', 'Upcoming Events', 'Community Gatherings', 'Workshops', 'Training', 'Programs', 'Girls Empowerment', 'Health Talks', 'Legal Advocacy', 'Mentorship', 'Community Outreach'].map((item, i) => (
                        <span key={i} className={styles.tickerItem}>{item}</span>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '15rem', opacity: 0.5, letterSpacing: '0.2em' }}>DOCUMENTING PROGRESS...</div>
            ) : (
                <section className={styles.eventSection}>
                    <div className={styles.eventGrid}>
                        {events.map((evt) => {
                            const progress = Math.min(Math.round((evt.current_amount / evt.goal_amount) * 100), 100);
                            return (
                                <div key={evt.id} className={styles.eventCard}>
                                    <span className={styles.statusBadge}>{evt.status}</span>
                                    <h2 className={styles.eventTitle}>{evt.title}</h2>
                                    <span className={styles.eventDate}>DATE: {formatDate(evt.event_date)}</span>

                                    <p className={styles.eventDescription}>{evt.description}</p>

                                    <div className={styles.progressContainer}>
                                        <div className={styles.progressHeader}>
                                            <span>Goal: {evt.goal_amount.toLocaleString()} UGX</span>
                                            <span>{progress}% REACHED</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                                        </div>
                                    </div>

                                    {evt.status !== 'completed' && (
                                        <button className="btn-premium" onClick={() => setSelectedEventId(evt.id)} style={{ width: '100%' }}>
                                            <span>Donate to Event</span>
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            <DonationModal
                isOpen={Boolean(selectedEvent)}
                onClose={() => setSelectedEventId(null)}
                eventId={selectedEvent?.id}
                eventTitle={selectedEvent?.title}
            />
        </div>
    );
}
