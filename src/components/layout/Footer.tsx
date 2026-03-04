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
                            Your story isn't over. It's just getting powerful.
                        </p>

                        <div className={styles.newsletterSection}>
                            <p className={styles.newsletterDesc}>Join our movement and newsletter:</p>
                            <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
                                <div className={styles.inputRow}>
                                    <input
                                        type="email"
                                        placeholder="Your email address"
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
                                        {status === 'loading' ? '⏳' : 'Subscribe'}
                                    </button>
                                </div>
                                {status === 'success' && <p className={styles.successMsg}>{message}</p>}
                                {status === 'error' && <p className={styles.errorMsg}>{message}</p>}
                            </form>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.linksColumn}>
                        <h4 className={styles.columnTitle}>Explore</h4>
                        <nav className={styles.linksList}>
                            <Link href="/">Home</Link>
                            <Link href="/our-story">Our Story</Link>
                            <Link href="/founder">Founder</Link>
                            <Link href="/programs">Our Programs</Link>
                            <Link href="/events">Events</Link>
                            <Link href="/stories">Gallery</Link>
                            <Link href="/donate">Donate</Link>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.contactColumn}>
                        <h4 className={styles.columnTitle}>Reach Us</h4>
                        <div className={styles.contactInfo}>
                            <p><strong>Location:</strong> Kiburara, Ibanda District, Uganda</p>
                            <p><strong>Email:</strong> africangirlriseltd@gmail.com</p>
                            <p><strong>Alt Email:</strong> graceakatwijuka73@gmail.com</p>
                            <p><strong>WhatsApp:</strong> 0703727965</p>
                            <p><strong>Calls:</strong> 0763738733</p>
                        </div>
                    </div>

                </div>

                {/* Divider */}
                <div className={styles.divider} />

                {/* Bottom Bar */}
                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} African Girl Rise Ltd Initiative. All rights reserved.
                    </p>
                    <p className={styles.mission}>
                        Building a generation defined not by their struggles, but by their strength.
                    </p>
                </div>
            </div>
        </footer>
    );
}
