"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name: name || undefined }),
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
            setName('');
        } catch {
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                {/* Newsletter Section */}
                <div className={styles.newsletterSection}>
                    <h3 className={styles.newsletterTitle}>Stay Connected</h3>
                    <p className={styles.newsletterDesc}>
                        Join our newsletter for updates on events, stories of transformation, and ways you can help.
                    </p>

                    <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
                        <div className={styles.inputRow}>
                            <input
                                type="text"
                                placeholder="Your name (optional)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={styles.input}
                            />
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
                                {status === 'loading' ? 'Joining...' : 'Subscribe'}
                            </button>
                        </div>
                        {status === 'success' && (
                            <p className={styles.successMsg}>{message}</p>
                        )}
                        {status === 'error' && (
                            <p className={styles.errorMsg}>{message}</p>
                        )}
                    </form>
                </div>

                {/* Footer Grid */}
                <div className={styles.footerGrid}>
                    {/* Brand Column */}
                    <div className={styles.brandColumn}>
                        <h4 className={styles.brandName}>AFRICAN GIRL RISE</h4>
                        <p className={styles.brandTagline}>
                            Breaking cycles of poverty. One girl at a time. One generation at a time.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.linksColumn}>
                        <h4 className={styles.columnTitle}>Explore</h4>
                        <nav className={styles.linksList}>
                            <Link href="/our-story">Our Story</Link>
                            <Link href="/events">Events & Donate</Link>
                            <Link href="/stories">Stories & Gallery</Link>
                            <Link href="/contact">Contact</Link>
                        </nav>
                    </div>

                    {/* Get Involved */}
                    <div className={styles.linksColumn}>
                        <h4 className={styles.columnTitle}>Get Involved</h4>
                        <nav className={styles.linksList}>
                            <Link href="/events">Donate Now</Link>
                            <Link href="/contact">Volunteer</Link>
                            <Link href="/contact">Partner With Us</Link>
                            <Link href="/contact">Sponsor a Girl</Link>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.linksColumn}>
                        <h4 className={styles.columnTitle}>Reach Us</h4>
                        <div className={styles.contactInfo}>
                            <p>📍 Ibanda District, Western Uganda</p>
                            <p>📧 grace@africangirlriseltd.org</p>
                            <p>📱 +256 703 727 965</p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className={styles.divider} />

                {/* Bottom Bar */}
                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} African Girl Rise Initiative. All rights reserved.
                    </p>
                    <p className={styles.mission}>
                        Rise. Then reach back. Always reach back.
                    </p>
                </div>
            </div>
        </footer>
    );
}
