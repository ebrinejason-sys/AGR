"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus('error');
                setMessage(data.error || 'Something went wrong.');
                return;
            }

            setStatus('success');
            setMessage(data.message || 'You\'re subscribed!');
            setEmail('');
        } catch {
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>

                {/* Footer Grid */}
                <div className={styles.footerGrid}>

                    {/* Brand & Newsletter Column */}
                    <div className={styles.brandColumn}>
                        <h4 className={styles.brandName}>AFRICAN GIRL RISE</h4>
                        <p className={styles.brandTagline}>
                            Empowering girls, transforming futures.
                        </p>

                        <div className={styles.newsletterSection}>
                            <p className={styles.newsletterDesc}>Stay connected:</p>
                            <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
                                <div className={styles.inputRow}>
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className={styles.input}
                                    />
                                    <button
                                        type="submit"
                                        className={styles.subscribeBtn}
                                        disabled={status === 'loading'}
                                    >
                                        {status === 'loading' ? '⏳' : 'Join'}
                                    </button>
                                </div>
                                {status === 'success' && <p className={styles.successMsg}>{message}</p>}
                                {status === 'error' && <p className={styles.errorMsg}>{message}</p>}
                            </form>
                        </div>
                    </div>

                    {/* Links & Contact Column */}
                    <div className={styles.linksColumn}>
                        <h4 className={styles.columnTitle}>About</h4>
                        <nav className={styles.linksList}>
                            <Link href="/our-story">Who We Are</Link>
                            <Link href="/founder">Founder</Link>
                            <Link href="/stories">Gallery</Link>
                        </nav>

                        <h4 className={styles.columnTitle}>Programs</h4>
                        <nav className={styles.linksList}>
                            <Link href="/programs">Core Programs</Link>
                            <Link href="/legal-advocacy">Legal Advocacy</Link>
                            <Link href="/events">Events</Link>
                        </nav>

                        <h4 className={styles.columnTitle}>Contact</h4>
                        <div className={styles.contactInfo}>
                            <p><strong>Location:</strong> Kiburara, Ibanda District, Uganda</p>
                            <p><strong>Email:</strong> africangirlriseltd@gmail.com</p>
                            <p><strong>WhatsApp:</strong> 0703727965</p>
                        </div>
                    </div>

                </div>

                {/* Divider */}
                <div className={styles.divider} />

                {/* Bottom Bar */}
                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} African Girl Rise Ltd. All rights reserved.
                    </p>
                    <p className={styles.mission}>
                        Empowering girls, transforming futures.
                    </p>
                </div>
            </div>
        </footer>
    );
}
