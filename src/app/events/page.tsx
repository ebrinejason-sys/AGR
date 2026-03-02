"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

type Event = {
    id: string;
    title: string;
    description: string;
    event_date: string;
    goal_amount: number;
    current_amount: number;
    status: 'upcoming' | 'completed' | 'cancelled';
};

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [donateModal, setDonateModal] = useState<string | null>(null);
    const [generalDonateLoading, setGeneralDonateLoading] = useState(false);
    const [eventDonateLoading, setEventDonateLoading] = useState<string | null>(null);
    const [currency, setCurrency] = useState<'UGX' | 'USD'>('UGX');
    const [eventCurrency, setEventCurrency] = useState<{[key: string]: 'UGX' | 'USD'}>({});

    useEffect(() => {
        async function fetchEvents() {
            // If supabase url isn't set, we mock the data to preview the UI
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                setEvents([
                    {
                        id: 'mock-1', title: 'Fund a Rise Room in Ibanda', description: 'Help us establish a safe space for girls to heal and climb out of poverty.', event_date: new Date(Date.now() + 864000000).toISOString(), goal_amount: 5000000, current_amount: 1500000, status: 'upcoming'
                    },
                    {
                        id: 'mock-2', title: 'Scholarship Drive 2026', description: 'When you keep your daughter in school, you are changing your family\'s future for generations.', event_date: new Date(Date.now() - 864000000).toISOString(), goal_amount: 2000000, current_amount: 2500000, status: 'completed'
                    }
                ]);
                setLoading(false);
                return;
            }

            const { data } = await supabase
                .from('events')
                .select('*')
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
                        <input type="tel" name="phoneNumber" placeholder="Phone Number (e.g., 256700123456)" required pattern="[0-9]{12}" title="Enter phone number starting with country code (e.g., 256700123456)" />
                    )}
                    <input type="number" name="amount" placeholder={`Amount (${currency})`} required min={currency === 'UGX' ? '1000' : '5'} step="any" />
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
                                <h2>{evt.title}</h2>
                                <p className={styles.date}>{new Date(evt.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p className={styles.description}>{evt.description}</p>

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
                                        {donateModal === evt.id ? (
                                            <form className={styles.donateForm} onSubmit={(e) => handleDonate(e, evt.id)}>
                                                <div className={styles.currencySelector}>
                                                    <label>
                                                        <input 
                                                            type="radio" 
                                                            name={`currency-${evt.id}`}
                                                            value="UGX" 
                                                            checked={(eventCurrency[evt.id] || 'UGX') === 'UGX'} 
                                                            onChange={() => setEventCurrency({...eventCurrency, [evt.id]: 'UGX'})} 
                                                        />
                                                        <span>UGX (Mobile Money)</span>
                                                    </label>
                                                    <label>
                                                        <input 
                                                            type="radio" 
                                                            name={`currency-${evt.id}`}
                                                            value="USD" 
                                                            checked={(eventCurrency[evt.id] || 'UGX') === 'USD'} 
                                                            onChange={() => setEventCurrency({...eventCurrency, [evt.id]: 'USD'})} 
                                                        />
                                                        <span>USD (Card)</span>
                                                    </label>
                                                </div>
                                                <input type="text" name="donorName" placeholder="Your Name" required />
                                                <input type="email" name="email" placeholder="Your Email" required />
                                                {(eventCurrency[evt.id] || 'UGX') === 'UGX' && (
                                                    <input type="tel" name="phoneNumber" placeholder="Phone Number (e.g., 256700123456)" required pattern="[0-9]{12}" title="Enter phone number starting with country code (e.g., 256700123456)" />
                                                )}
                                                <input type="number" name="amount" placeholder={`Amount (${eventCurrency[evt.id] || 'UGX'})`} required min={(eventCurrency[evt.id] || 'UGX') === 'UGX' ? '1000' : '5'} step="any" />
                                                <div className={styles.formActions}>
                                                    <button type="button" onClick={() => setDonateModal(null)} className={styles.btnCancel} disabled={eventDonateLoading === evt.id}>Cancel</button>
                                                    <button type="submit" className={styles.btnSubmit} disabled={eventDonateLoading === evt.id}>{eventDonateLoading === evt.id ? 'Processing...' : 'Proceed to Pay'}</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <button className={styles.btnPrimary} onClick={() => setDonateModal(evt.id)}>
                                                Donate to this Event
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
