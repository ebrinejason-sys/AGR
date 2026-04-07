"use client";

import { useState } from "react";
import styles from "./page.module.css";

type ContactType = 'general' | 'volunteer' | 'mentor' | 'sponsor';

export default function Contact() {
    const [activeTab, setActiveTab] = useState<ContactType>('general');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type: activeTab })
            });
            if (res.ok) setStatus('success');
            else setStatus('error');
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className={styles.container}>
            {/* Editorial Hero */}
            <section className={styles.hero}>
                <p className="subheading reveal">Engagement</p>
                <h1 className="heading-display reveal">Contact <span className="text-gradient">Rise</span></h1>
                <p className="subheading reveal" style={{ fontStyle: 'italic', letterSpacing: '0.1em', marginTop: '2rem' }}>
                  Connect with our visionary team and join the architectural movement of change.
                </p>
            </section>

            <section className={styles.contactSection}>
                <div className={styles.contactGrid}>
                    <div className={styles.infoCol}>
                        <h2 className="heading-section">Connect <br /> with <span className="text-gradient">Us</span></h2>

                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>LOCATION</span>
                            <p className={styles.infoValue}>Kiburara, Ibanda District, Uganda</p>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>EMAIL</span>
                            <p className={styles.infoValue}>africangirlriseltd@gmail.com</p>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>COMMUNICATION</span>
                            <p className={styles.infoValue}>WhatsApp: 0703727965</p>
                        </div>
                    </div>

                    <div className={styles.formCard}>
                        <div className={styles.tabBar}>
                            <button className={`${styles.tab} ${activeTab === 'general' ? styles.tabActive : ''}`} onClick={() => setActiveTab('general')}>General</button>
                            <button className={`${styles.tab} ${activeTab === 'volunteer' ? styles.tabActive : ''}`} onClick={() => setActiveTab('volunteer')}>Volunteer</button>
                            <button className={`${styles.tab} ${activeTab === 'mentor' ? styles.tabActive : ''}`} onClick={() => setActiveTab('mentor')}>Mentor</button>
                            <button className={`${styles.tab} ${activeTab === 'sponsor' ? styles.tabActive : ''}`} onClick={() => setActiveTab('sponsor')}>Sponsor</button>
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>FULL NAME</label>
                                <input type="text" className={styles.input} required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>EMAIL ADDRESS</label>
                                <input type="email" className={styles.input} required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>MESSAGE</label>
                                <textarea rows={1} className={styles.input} required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                            </div>

                            <button type="submit" className="btn-premium" style={{ width: '100%' }} disabled={status === 'loading'}>
                                <span>{status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}</span>
                            </button>

                            {status === 'success' && <p style={{ marginTop: '2rem', color: 'var(--color-pink)', fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.1em' }}>MESSAGE DELIVERED SUCCESSFULLY.</p>}
                            {status === 'error' && <p style={{ marginTop: '2rem', color: 'red', fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.1em' }}>AN ERROR OCCURRED. PLEASE RETRY.</p>}
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
