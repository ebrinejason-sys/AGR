"use client";

import { useState } from 'react';
import { Mail, Search } from 'lucide-react';
import styles from './subscriptions.module.css';

export default function AdminSubscriptions() {
    const [subscribers] = useState([
        { id: '1', email: 'supporter@example.com', name: 'John Doe', joined: '2026-02-15' },
        { id: '2', email: 'hello@world.com', name: 'Jane Smith', joined: '2026-02-28' }
    ]);

    const [composeModal, setComposeModal] = useState<string | null>(null);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [sending, setSending] = useState(false);

    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        // Future: POST to /api/admin/email taking composeModal (email) and the subject/body
        setTimeout(() => {
            alert("Email queued successfully!");
            setSending(false);
            setComposeModal(null);
            setEmailSubject('');
            setEmailBody('');
        }, 1500);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Subscribers & Contacts</h1>
                    <p className={styles.subtitle}>View your audience and send communications directly.</p>
                </div>

                <div className={styles.searchBox}>
                    <Search size={20} className={styles.searchIcon} />
                    <input type="text" placeholder="Search subscribers..." className={styles.searchInput} />
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
                        {subscribers.map(sub => (
                            <tr key={sub.id}>
                                <td className={styles.cellName}>{sub.name || 'Anonymous'}</td>
                                <td className={styles.cellEmail}>{sub.email}</td>
                                <td>{sub.joined}</td>
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
                {subscribers.length === 0 && (
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
        </div>
    );
}
