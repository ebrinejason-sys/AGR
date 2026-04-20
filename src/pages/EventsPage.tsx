import { lazy, Suspense, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { formatDate } from '@/lib/utils';
import styles from './EventsPage.module.css';

const DonationModal = lazy(() => import('@/components/DonationModal'));

type GalleryPhoto = { id: string; url: string; type: 'image' | 'video'; description: string };
type Event = { id: string; title: string; description: string; event_date: string; goal_amount: number; goal_text?: string; current_amount: number; status: 'upcoming' | 'completed' | 'cancelled'; cover_image?: string; location?: string; donation_link?: string; achievements?: string; gallery?: GalleryPhoto[] };

function getProgressPercent(event: Event) { if (!event.goal_amount) return 0; return Math.min(Math.round((event.current_amount / event.goal_amount) * 100), 100); }

function EventCard({ evt, onClick }: { evt: Event; onClick: () => void }) {
    return (
        <div className={styles.eventCard} onClick={onClick} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick()}>
            {evt.cover_image ? (
                <div className={styles.eventCover} style={{ position: 'relative', overflow: 'hidden' }}>
                    <img src={evt.cover_image} alt={evt.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className={styles.eventCoverOverlay} />
                </div>
            ) : <div className={styles.eventCoverPlaceholder} />}
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

function EventDetailModal({ event, onClose, onDonate }: { event: Event | null; onClose: () => void; onDonate: (e: Event) => void }) {
    useEffect(() => {
        if (!event) return;
        const prev = document.body.style.overflow;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handler);
        return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', handler); };
    }, [event, onClose]);

    if (!event) return null;
    const pct = getProgressPercent(event);

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby={`event-title-${event.id}`}>
                <button className={styles.modalClose} onClick={onClose} aria-label="Close">×</button>
                {event.cover_image && <div className={styles.modalCover} style={{ position: 'relative', overflow: 'hidden' }}><img src={event.cover_image} alt={event.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /><div className={styles.modalCoverOverlay} /></div>}
                <div className={styles.modalBody}>
                    <span className={`${styles.statusBadge} ${styles[event.status]}`}>{event.status}</span>
                    <h2 id={`event-title-${event.id}`} className={styles.modalTitle}>{event.title}</h2>
                    <div className={styles.modalMeta}><span>📅 {formatDate(event.event_date)}</span>{event.location && <span>📍 {event.location}</span>}</div>
                    <p className={styles.modalDescription}>{event.description}</p>
                    {(event.goal_amount > 0 || event.goal_text) && <div className={styles.modalGoal}><span className={styles.modalGoalLabel}>TARGET</span>{event.goal_text && <p className={styles.modalGoalText}>{event.goal_text}</p>}{event.goal_amount > 0 && <><div className={styles.progressHeader}><span>Goal: {Number(event.goal_amount).toLocaleString()} UGX</span><span>{pct}% REACHED</span></div><progress className={styles.progressBar} value={pct} max={100} /></>}</div>}
                    {event.status === 'completed' && event.achievements && <div className={styles.modalAchievements}><span className={styles.modalGoalLabel}>WHAT WE ACHIEVED</span><p>{event.achievements}</p></div>}
                    {event.status !== 'completed' && <div className={styles.modalCtas}><button className="btn-premium" onClick={() => onDonate(event)}><span>Donate to Event</span></button></div>}
                    {event.status === 'completed' && event.gallery && event.gallery.length > 0 && <div className={styles.modalGallery}><span className={styles.modalGoalLabel}>EVENT GALLERY</span><div className={styles.galleryGrid}>{event.gallery.map(photo => <div key={photo.id} className={styles.galleryItem} style={{ position: 'relative', overflow: 'hidden' }}><img src={photo.url} alt={photo.description || event.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /></div>)}</div></div>}
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
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); return () => setIsMounted(false); }, []);

    useEffect(() => {
        fetch('/api/public/data').then(r => r.json()).then(data => { if (data.events) setEvents(data.events); }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const upcomingEvents = events.filter(e => e.status === 'upcoming');
    const completedEvents = events.filter(e => e.status === 'completed');

    return (
        <div className={styles.container}>
            <section className={styles.hero}><div className={styles.heroContent}><span className={styles.eyebrow}>Our Calendar</span><h1 className={styles.pageTitle}>Moments of <span className="text-gradient">Impact</span></h1><p className={styles.pageSubtitle}>Join our mission through community events, workshops, and advocacy drives across Uganda.</p></div></section>
            {loading ?<div className={styles.loadingState}>Loading events…</div> : (
                <section className={styles.eventSection}>
                    {upcomingEvents.length > 0 && <><h2 className={styles.sectionHeading}>Upcoming Events</h2><div className={styles.eventGrid}>{upcomingEvents.map(evt => <EventCard key={evt.id} evt={evt} onClick={() => setSelectedEvent(evt)} />)}</div></>}
                    {completedEvents.length > 0 && <><h2 className={`${styles.sectionHeading} ${styles.completedHeading}`}>Completed Events</h2><div className={styles.eventGrid}>{completedEvents.map(evt => <EventCard key={evt.id} evt={evt} onClick={() => setSelectedEvent(evt)} />)}</div></>}
                    {events.length === 0 && <div className={styles.emptyState}><p className={styles.emptyText}>No events yet — check back soon.</p></div>}
                </section>
            )}
            {isMounted && createPortal(<EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onDonate={evt => { setSelectedEvent(null); setDonationTarget(evt); }} />, document.body)}
            {donationTarget && <Suspense fallback={null}><DonationModal isOpen={Boolean(donationTarget)} onClose={() => setDonationTarget(null)} eventId={donationTarget.id} eventTitle={donationTarget.title} /></Suspense>}
        </div>
    );
}
