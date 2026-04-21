import { lazy, Suspense, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, MapPin, X, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import styles from './EventsPage.module.css';

const DonationModal = lazy(() => import('@/components/DonationModal'));

type GalleryPhoto = { id: string; url: string; type: 'image' | 'video'; description: string };
type Event = { id: string; title: string; description: string; event_date: string; goal_amount: number; current_amount: number; status: 'upcoming' | 'completed' | 'cancelled'; cover_image?: string; location?: string; gallery?: GalleryPhoto[] };

function getProgressPercent(event: Event) { 
    if (!event.goal_amount) return 0; 
    return Math.min(Math.round((event.current_amount / event.goal_amount) * 100), 100); 
}

function EventCard({ evt, onClick }: { evt: Event; onClick: () => void }) {
    return (
        <div className={styles.eventCard} onClick={onClick}>
            <div className={styles.eventCover}>
                {evt.cover_image && <img src={evt.cover_image} alt={evt.title} />}
            </div>
            <div className={styles.eventCardBody}>
                <span className={`${styles.statusBadge} ${styles[evt.status]}`}>{evt.status}</span>
                <h3 className={styles.eventTitle}>{evt.title}</h3>
                <div className={styles.eventDate}><Calendar size={14} /> {formatDate(evt.event_date)}</div>
                {evt.location && <div className={styles.eventLocation}><MapPin size={14} /> {evt.location}</div>}
                <p className={styles.eventDescription}>{evt.description.slice(0, 120)}...</p>
                <div className={styles.tapHint}>View Details <ArrowRight size={14} /></div>
            </div>
        </div>
    );
}

function EventDetailModal({ event, onClose, onDonate }: { event: Event | null; onClose: () => void; onDonate: (e: Event) => void }) {
    useEffect(() => {
        if (!event) return;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, [event]);

    if (!event) return null;
    const pct = getProgressPercent(event);

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onClose}><X size={24} /></button>
                <div className={styles.modalCover}>
                    {event.cover_image && <img src={event.cover_image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div className={styles.modalBody}>
                    <span className={`${styles.statusBadge} ${styles[event.status]}`}>{event.status}</span>
                    <h2 className={styles.modalTitle}>{event.title}</h2>
                    <div className={styles.modalMeta} style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={18} /> {formatDate(event.event_date)}</span>
                        {event.location && <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={18} /> {event.location}</span>}
                    </div>
                    <p className={styles.modalDescription} style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>{event.description}</p>
                    
                    {event.goal_amount > 0 && (
                        <div className={styles.modalGoal}>
                            <span className={styles.modalGoalLabel}>FUNDRAISING PROGRESS</span>
                            <div style={{ display: 'flex', justifySelf: 'space-between', marginBottom: '0.5rem', fontWeight: 800 }}>
                                <span>{pct}% Towards Goal</span>
                            </div>
                            <progress className={styles.progressBar} value={pct} max={100} />
                        </div>
                    )}

                    {event.status !== 'completed' && (
                        <button className="btn-premium" style={{ width: '100%', marginTop: '2rem' }} onClick={() => onDonate(event)}>
                            Donate to Event
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [donationTarget, setDonationTarget] = useState<Event | null>(null);

    useEffect(() => {
        fetch('/api/public/data')
            .then(r => r.json())
            .then(data => { if (data.events) setEvents(data.events); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const upcoming = events.filter(e => e.status === 'upcoming');
    const completed = events.filter(e => e.status === 'completed');

    return (
        <div className={styles.container}>
            <section className={styles.eventSection} style={{ paddingTop: '160px' }}>
                <span className="subheading">Our Calendar</span>
                <h1 className="heading-display">Moments of <span className="text-gradient">Impact</span></h1>
                
                {loading ? (
                    <div style={{ padding: '100px 0', textAlign: 'center', fontWeight: 700 }}>Loading events...</div>
                ) : (
                    <>
                        {upcoming.length > 0 && (
                            <div style={{ marginTop: '80px' }}>
                                <h2 className={styles.sectionHeading}>Upcoming</h2>
                                <div className={styles.eventGrid}>
                                    {upcoming.map(evt => <EventCard key={evt.id} evt={evt} onClick={() => setSelectedEvent(evt)} />)}
                                </div>
                            </div>
                        )}

                        {completed.length > 0 && (
                            <div style={{ marginTop: '80px' }}>
                                <h2 className={styles.sectionHeading}>Past Impact</h2>
                                <div className={styles.eventGrid}>
                                    {completed.map(evt => <EventCard key={evt.id} evt={evt} onClick={() => setSelectedEvent(evt)} />)}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>

            {selectedEvent && createPortal(
                <EventDetailModal 
                    event={selectedEvent} 
                    onClose={() => setSelectedEvent(null)} 
                    onDonate={evt => { setSelectedEvent(null); setDonationTarget(evt); }} 
                />, 
                document.body
            )}

            {donationTarget && (
                <Suspense fallback={null}>
                    <DonationModal 
                        isOpen={Boolean(donationTarget)} 
                        onClose={() => setDonationTarget(null)} 
                        eventId={donationTarget.id} 
                        eventTitle={donationTarget.title} 
                    />
                </Suspense>
            )}
        </div>
    );
}
