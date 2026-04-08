"use client";

import { useEffect, useMemo, useState } from 'react';
import { Mail, Search, Radio } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import styles from './subscriptions.module.css';

type Subscriber = {
    id: string;
    email: string;
    name: string | null;
    created_at: string;
};

export default function AdminSubscriptions() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [composeModal, setComposeModal] = useState<string | null>(null);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [sending, setSending] = useState(false);

    // Broadcast to all
    const [broadcastOpen, setBroadcastOpen] = useState(false);
    const [broadcastSubject, setBroadcastSubject] = useState('');
    const [broadcastBody, setBroadcastBody] = useState('');
    const [broadcasting, setBroadcasting] = useState(false);

    useEffect(() => {
        fetch('/api/admin/subscriptions', { cache: 'no-store' })
            .then(async (res) => {
                if (res.status === 401) {
                    window.location.assign('/admin/login');
                    return;
                }
                const data = await res.json();
                if (res.ok) {
                    setSubscribers(data.subscribers || []);
                    setError(null);
                    return;
                }
                setError(data.error || 'Failed to load subscribers.');
            })
            .catch(() => setError('Network error while loading subscribers.'));
    }, []);

    const filteredSubscribers = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return subscribers;

        return subscribers.filter((subscriber) =>
            subscriber.email.toLowerCase().includes(term)
            || (subscriber.name || '').toLowerCase().includes(term)
        );
    }, [subscribers, search]);

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        const res = await fetch('/api/admin/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: composeModal,
                subject: emailSubject,
                message: emailBody,
            }),
        });

        if (res.status === 401) {
            window.location.assign('/admin/login');
            return;
        }

        const data = await res.json();
        if (!res.ok) {
            alert(data.error || 'Failed to send email.');
            setSending(false);
            return;
        }

        setSending(false);
        setComposeModal(null);
        setEmailSubject('');
        setEmailBody('');
    };

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm(`Send this newsletter to ALL ${subscribers.length} subscribers?`)) return;
        setBroadcasting(true);
        const res = await fetch('/api/admin/email/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject: broadcastSubject, message: broadcastBody }),
        });
        const data = await res.json();
        setBroadcasting(false);
        if (res.ok) {
            alert(`Newsletter sent to ${data.sent} subscribers!`);
            setBroadcastOpen(false);
            setBroadcastSubject('');
            setBroadcastBody('');
        } else {
            alert(data.error || 'Broadcast failed.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Subscribers & Contacts</h1>
                    <p className={styles.subtitle}>View your audience and send communications directly.</p>
                    {error && <p className={styles.subtitle}>{error}</p>}
                </div>

                <div className={styles.headerRight}>
                    <button
                        className={styles.broadcastBtn}
                        onClick={() => setBroadcastOpen(true)}
                    >
                        <Radio size={16} />
                        Broadcast Newsletter
                    </button>
                    <div className={styles.searchBox}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search subscribers..."
                            className={styles.searchInput}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Joined Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubscribers.map(sub => (
                            <tr key={sub.id}>
                                <td className={styles.cellName}>{sub.name || 'Anonymous'}</td>
                                <td className={styles.cellEmail}>{sub.email}</td>
                                <td>{formatDate(sub.created_at)}</td>
                                <td>
                                    <button
                                        className={styles.emailBtn}
                                        onClick={() => setComposeModal(sub.email)}
                                    >
                                        <Mail size={16} /> Contact
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredSubscribers.length === 0 && (
                    <div className={styles.emptyState}>No subscribers found.</div>
                )}
            </div>

            {composeModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Compose Email to {composeModal}</h2>
                        <form onSubmit={handleSendEmail} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label>Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    placeholder="e.g. Update from African Girl Rise"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Message</label>
                                <textarea
                                    required
                                    rows={8}
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    placeholder="Write your message here..."
                                />
                            </div>
                            <div className={styles.formActions}>
                                <button type="button" onClick={() => setComposeModal(null)} className={styles.cancelBtn}>Cancel</button>
                                <button type="submit" className={styles.submitBtn} disabled={sending}>
                                    {sending ? 'Sending...' : 'Send Email'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {broadcastOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>📡 Broadcast Newsletter</h2>
                        <p className={styles.broadcastInfo}>
                            This will send your message to <strong>all {subscribers.length} subscribers</strong> at once.
                        </p>
                        <form onSubmit={handleBroadcast} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label>Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={broadcastSubject}
                                    onChange={(e) => setBroadcastSubject(e.target.value)}
                                    placeholder="e.g. Monthly Update from African Girl Rise"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Message</label>
                                <textarea
                                    required
                                    rows={10}
                                    value={broadcastBody}
                                    onChange={(e) => setBroadcastBody(e.target.value)}
                                    placeholder="Write your newsletter here..."
                                />
                            </div>
                            <div className={styles.formActions}>
                                <button type="button" onClick={() => setBroadcastOpen(false)} className={styles.cancelBtn}>Cancel</button>
                                <button type="submit" className={styles.broadcastSubmitBtn} disabled={broadcasting}>
                                    {broadcasting ? 'Sending…' : `Send to All ${subscribers.length} Subscribers`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
