"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import styles from './page.module.css';

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

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [donateModal, setDonateModal] = useState<string | null>(null);
    const [generalDonateLoading, setGeneralDonateLoading] = useState(false);
    const [eventDonateLoading, setEventDonateLoading] = useState<string | null>(null);
    const [currency, setCurrency] = useState<'UGX' | 'USD'>('UGX');
    const [eventCurrency, setEventCurrency] = useState<{ [key: string]: 'UGX' | 'USD' }>({});

    const selectedEvent = donateModal ? events.find((evt) => evt.id === donateModal) : null;

    const getQuickAmounts = (selectedCurrency: 'UGX' | 'USD') => {
        return selectedCurrency === 'UGX' ? ['10000', '50000', '100000'] : ['5', '20', '50'];
    };

    const applyQuickAmount = (form: HTMLFormElement, amount: string) => {
        const amountInput = form.elements.namedItem('amount') as HTMLInputElement | null;
        if (amountInput) {
            amountInput.value = amount;
            amountInput.focus();
        }
    };

    useEffect(() => {
        async function fetchEvents() {
            // If supabase url isn't set, we mock the data to preview the UI
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                setEvents([
                    {
                        id: 'mock-1', title: 'Fund a Rise Room in Ibanda', description: 'Help us establish a safe space for girls to heal and climb out of poverty.', event_date: new Date(Date.now() + 864000000).toISOString(), goal_amount: 5000000, current_amount: 1500000, status: 'upcoming'
                    },
                    {
                        id: 'mock-2', title: 'Education Drive 2026', description: 'When you keep your daughter in school, you are changing your family\'s future for generations.', event_date: new Date(Date.now() - 864000000).toISOString(), goal_amount: 2000000, current_amount: 2500000, status: 'completed'
                    }
                ]);
                setLoading(false);
                return;
            }

            const { data } = await supabase
                .from('events')
                .select('*, media(*)')
                .neq('status', 'cancelled')
                .order('event_date', { ascending: true });

            if (data) setEvents(data);
            setLoading(false);
        }
        fetchEvents();
    }, []);

    const handleDonate = async (e: React.FormEvent, eventId: string) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const amount = form.amount.value;
        const email = form.email.value;
        const name = form.donorName.value;
        const selectedCurrency = eventCurrency[eventId] || 'UGX';
        const phoneNumber = selectedCurrency === 'UGX' ? form.phoneNumber?.value : undefined;

        try {
            setEventDonateLoading(eventId);
            const res = await fetch('/api/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, email, name, eventId, currency: selectedCurrency, phoneNumber })
            });
            const data = await res.json();
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                alert(data.error || "Payment initialization failed. Please try again later.");
                setEventDonateLoading(null);
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred connecting to the payment gateway.");
            setEventDonateLoading(null);
        }
    };

    const handleGeneralDonate = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const amount = form.amount.value;
        const email = form.email.value;
        const name = form.donorName.value;
        const phoneNumber = currency === 'UGX' ? form.phoneNumber?.value : undefined;

        try {
            setGeneralDonateLoading(true);
            const res = await fetch('/api/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, email, name, currency, phoneNumber })
            });
            const data = await res.json();
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                alert(data.error || 'Payment initialization failed. Please try again later.');
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred connecting to the payment gateway.");
        } finally {
            setGeneralDonateLoading(false);
        }
    };

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
                <p>Support the overall cause even if you are not selecting a specific event.</p>
                <form className={styles.donateForm} onSubmit={handleGeneralDonate}>
                    <div className={styles.currencySelector}>
                        <label>
                            <input
                                type="radio"
                                name="currency"
                                value="UGX"
                                checked={currency === 'UGX'}
                                onChange={() => setCurrency('UGX')}
                            />
                            <span>UGX (Mobile Money)</span>
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="currency"
                                value="USD"
                                checked={currency === 'USD'}
                                onChange={() => setCurrency('USD')}
                            />
                            <span>USD (Card)</span>
                        </label>
                    </div>
                    <input type="text" name="donorName" placeholder="Your Name" required />
                    <input type="email" name="email" placeholder="Your Email" required />
                    {currency === 'UGX' && (
                        <input type="tel" name="phoneNumber" placeholder="Phone Number (e.g., 256703727965)" required pattern="[0-9]{10,15}" title="Enter a valid phone number with country code if needed (e.g., 256703727965)" />
                    )}
                    <input type="number" name="amount" placeholder={`Amount (${currency})`} required min={currency === 'UGX' ? '1000' : '5'} step="any" />
                    <div className={styles.quickAmounts}>
                        {getQuickAmounts(currency).map((amt) => (
                            <button
                                key={amt}
                                type="button"
                                className={styles.quickAmountBtn}
                                onClick={(e) => applyQuickAmount((e.currentTarget.form as HTMLFormElement), amt)}
                            >
                                {currency} {Number(amt).toLocaleString()}
                            </button>
                        ))}
                    </div>
                    <p className={styles.paymentHelp}>
                        {currency === 'UGX' ? 'Mobile Money requires a reachable phone number.' : 'Card payments are securely processed in USD.'}
                    </p>
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.btnSubmit} disabled={generalDonateLoading}>
                            {generalDonateLoading ? 'Processing...' : 'Donate to the Cause'}
                        </button>
                    </div>
                </form>
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
                                        <button className={styles.btnPrimary} onClick={() => setDonateModal(evt.id)}>
                                            Donate to this Event
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedEvent && (
                <div className={styles.modalOverlay} onClick={() => setDonateModal(null)}>
                    <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Donate to: {selectedEvent.title}</h3>
                            <button
                                type="button"
                                className={styles.modalClose}
                                onClick={() => setDonateModal(null)}
                                aria-label="Close donation modal"
                            >
                                ×
                            </button>
                        </div>

                        <form className={styles.donateForm} onSubmit={(e) => handleDonate(e, selectedEvent.id)}>
                            <div className={styles.currencySelector}>
                                <label>
                                    <input
                                        type="radio"
                                        name={`currency-${selectedEvent.id}`}
                                        value="UGX"
                                        checked={(eventCurrency[selectedEvent.id] || 'UGX') === 'UGX'}
                                        onChange={() => setEventCurrency({ ...eventCurrency, [selectedEvent.id]: 'UGX' })}
                                    />
                                    <span>UGX (Mobile Money)</span>
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name={`currency-${selectedEvent.id}`}
                                        value="USD"
                                        checked={(eventCurrency[selectedEvent.id] || 'UGX') === 'USD'}
                                        onChange={() => setEventCurrency({ ...eventCurrency, [selectedEvent.id]: 'USD' })}
                                    />
                                    <span>USD (Card)</span>
                                </label>
                            </div>
                            <input type="text" name="donorName" placeholder="Your Name" required />
                            <input type="email" name="email" placeholder="Your Email" required />
                            {(eventCurrency[selectedEvent.id] || 'UGX') === 'UGX' && (
                                <input type="tel" name="phoneNumber" placeholder="Phone Number (e.g., 256703727965)" required pattern="[0-9]{10,15}" title="Enter a valid phone number with country code if needed (e.g., 256703727965)" />
                            )}
                            <input type="number" name="amount" placeholder={`Amount (${eventCurrency[selectedEvent.id] || 'UGX'})`} required min={(eventCurrency[selectedEvent.id] || 'UGX') === 'UGX' ? '1000' : '5'} step="any" />
                            <div className={styles.quickAmounts}>
                                {getQuickAmounts(eventCurrency[selectedEvent.id] || 'UGX').map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        className={styles.quickAmountBtn}
                                        onClick={(e) => applyQuickAmount((e.currentTarget.form as HTMLFormElement), amt)}
                                    >
                                        {(eventCurrency[selectedEvent.id] || 'UGX')} {Number(amt).toLocaleString()}
                                    </button>
                                ))}
                            </div>
                            <p className={styles.paymentHelp}>
                                {(eventCurrency[selectedEvent.id] || 'UGX') === 'UGX' ? 'Mobile Money requires a reachable phone number.' : 'Card payments are securely processed in USD.'}
                            </p>
                            <div className={styles.formActions}>
                                <button type="button" onClick={() => setDonateModal(null)} className={styles.btnCancel} disabled={eventDonateLoading === selectedEvent.id}>Cancel</button>
                                <button type="submit" className={styles.btnSubmit} disabled={eventDonateLoading === selectedEvent.id}>{eventDonateLoading === selectedEvent.id ? 'Processing...' : 'Proceed to Pay'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
