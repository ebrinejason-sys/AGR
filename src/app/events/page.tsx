"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import DonationModal from '@/components/DonationModal';
import styles from './page.module.css';

type GalleryPhoto = {
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
    goal_text?: string;
    current_amount: number;
    status: 'upcoming' | 'completed' | 'cancelled';
    cover_image?: string;
    location?: string;
    donation_link?: string;
    achievements?: string;
    gallery?: GalleryPhoto[];
};

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [donationTarget, setDonationTarget] = useState<Event | null>(null);

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

    const upcomingEvents = events.filter(e => e.status === 'upcoming');
    const completedEvents = events.filter(e => e.status === 'completed');

    const openEvent = (evt: Event) => {
        setSelectedEvent(evt);
        document.body.style.overflow = 'hidden';
    };
    const closeEvent = () => {
        setSelectedEvent(null);
        document.body.style.overflow = '';
    };

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

                    {/* Upcoming */}
                    {upcomingEvents.length > 0 && (
                        <>
                            <h2 className={styles.sectionHeading}>Upcoming Events</h2>
                            <div className={styles.eventGrid}>
                                {upcomingEvents.map((evt) => (
                                    <EventCard key={evt.id} evt={evt} onClick={() => openEvent(evt)} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Completed */}
                    {completedEvents.length > 0 && (
                        <>
                            <h2 className={styles.sectionHeading} style={{ marginTop: '8rem' }}>Completed Events</h2>
                            <div className={styles.eventGrid}>
                                {completedEvents.map((evt) => (
                                    <EventCard key={evt.id} evt={evt} onClick={() => openEvent(evt)} />
                                ))}
                            </div>
                        </>
                    )}

                    {events.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '10rem 0', opacity: 0.5 }}>
                            <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}>No events yet — check back soon.</p>
                        </div>
                    )}
                </section>
            )}

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className={styles.modalOverlay} onClick={closeEvent}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={closeEvent} aria-label="Close">×</button>

                        {selectedEvent.cover_image && (
                            <div className={styles.modalCover}>
                                <Image
                                    src={selectedEvent.cover_image}
                                    alt={selectedEvent.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 768px) 100vw, 800px"
                                />
                                <div className={styles.modalCoverOverlay} />
                            </div>
                        )}

                        <div className={styles.modalBody}>
                            <span className={`${styles.statusBadge} ${styles[selectedEvent.status]}`}>{selectedEvent.status}</span>
                            <h2 className={styles.modalTitle}>{selectedEvent.title}</h2>

                            <div className={styles.modalMeta}>
                                <span>📅 {formatDate(selectedEvent.event_date)}</span>
                                {selectedEvent.location && <span>📍 {selectedEvent.location}</span>}
                            </div>

                            <p className={styles.modalDescription}>{selectedEvent.description}</p>

                            {/* Target / Goal */}
                            {(selectedEvent.goal_amount > 0 || selectedEvent.goal_text) && (
                                <div className={styles.modalGoal}>
                                    <span className={styles.modalGoalLabel}>TARGET</span>
                                    {selectedEvent.goal_text && (
                                        <p className={styles.modalGoalText}>{selectedEvent.goal_text}</p>
                                    )}
                                    {selectedEvent.goal_amount > 0 && (
                                        <>
                                            <div className={styles.progressHeader}>
                                                <span>Goal: {Number(selectedEvent.goal_amount).toLocaleString()} UGX</span>
                                                <span>{Math.min(Math.round((selectedEvent.current_amount / selectedEvent.goal_amount) * 100), 100)}% REACHED</span>
                                            </div>
                                            <div className={styles.progressBar}>
                                                <div className={styles.progressFill} style={{ width: `${Math.min(Math.round((selectedEvent.current_amount / selectedEvent.goal_amount) * 100), 100)}%` }} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Achievements for completed */}
                            {selectedEvent.status === 'completed' && selectedEvent.achievements && (
                                <div className={styles.modalAchievements}>
                                    <span className={styles.modalGoalLabel}>WHAT WE ACHIEVED</span>
                                    <p>{selectedEvent.achievements}</p>
                                </div>
                            )}

                            {/* CTA buttons */}
                            {selectedEvent.status !== 'completed' && (
                                <div className={styles.modalCtas}>
                                    {selectedEvent.donation_link ? (
                                        <a href={selectedEvent.donation_link} target="_blank" rel="noopener noreferrer" className="btn-premium">
                                            <span>Support This Event</span>
                                        </a>
                                    ) : (
                                        <button className="btn-premium" onClick={() => { closeEvent(); setDonationTarget(selectedEvent); }}>
                                            <span>Donate to Event</span>
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Gallery for completed events */}
                            {selectedEvent.status === 'completed' && selectedEvent.gallery && selectedEvent.gallery.length > 0 && (
                                <div className={styles.modalGallery}>
                                    <span className={styles.modalGoalLabel}>EVENT GALLERY</span>
                                    <div className={styles.galleryGrid}>
                                        {selectedEvent.gallery.map(photo => (
                                            <div key={photo.id} className={styles.galleryItem}>
                                                <Image
                                                    src={photo.url}
                                                    alt={photo.description || selectedEvent.title}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    sizes="(max-width: 768px) 50vw, 200px"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <DonationModal
                isOpen={Boolean(donationTarget)}
                onClose={() => setDonationTarget(null)}
                eventId={donationTarget?.id}
                eventTitle={donationTarget?.title}
            />
        </div>
    );
}

function EventCard({ evt, onClick }: { evt: Event; onClick: () => void }) {
    return (
        <div className={styles.eventCard} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick()}>
            {evt.cover_image ? (
                <div className={styles.eventCover}>
                    <Image
                        src={evt.cover_image}
                        alt={evt.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <div className={styles.eventCoverOverlay} />
                </div>
            ) : (
                <div className={styles.eventCoverPlaceholder} />
            )}

            <div className={styles.eventCardBody}>
                <span className={`${styles.statusBadge} ${styles[evt.status]}`}>{evt.status}</span>
                <h2 className={styles.eventTitle}>{evt.title}</h2>
                <span className={styles.eventDate}>📅 {formatDate(evt.event_date)}</span>
                {evt.location && <span className={styles.eventLocation}>📍 {evt.location}</span>}
                <p className={styles.eventDescription}>{evt.description.slice(0, 140)}{evt.description.length > 140 ? '…' : ''}</p>
                <span className={styles.tapHint}>Tap to view details →</span>
            </div>
        </div>
    );
}
