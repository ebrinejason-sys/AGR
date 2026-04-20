import { useState } from 'react';
import { Link } from 'react-router-dom';
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
            setMessage(data.message || 'You are subscribed.');
            setEmail('');
        } catch {
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>

                {/* ── Newsletter Band ── */}
                <div className={styles.newsletterBand}>
                    <div className={styles.nlLeft}>
                        <h4>Stay in the loop.</h4>
                        <p>Get occasional updates on programs, events, and ways to support girls across Uganda.</p>
                    </div>
                    <div className={styles.nlRight}>
                        <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
                            <div className={styles.inputRow}>
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={styles.input}
                                    id="footer-newsletter-email"
                                />
                                <button
                                    type="submit"
                                    className={styles.subscribeBtn}
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? 'Sending…' : 'Subscribe'}
                                </button>
                            </div>
                            {status === 'success' && <p className={styles.successMsg}>{message}</p>}
                            {status === 'error' && <p className={styles.errorMsg}>{message}</p>}
                        </form>
                    </div>
                </div>

                {/* ── Footer Grid ── */}
                <div className={styles.footerGrid}>

                    {/* Brand Column */}
                    <div className={styles.brandColumn}>
                        <div className={styles.brandBlock}>
                            <span className={styles.brandName}>AFRICAN GIRL RISE</span>
                            <p className={styles.brandTagline}>
                                Practical, local support that keeps girls safe and in school across Uganda.
                                Education, safety, and advocacy — for every girl.
                            </p>
                        </div>

                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <span className={styles.contactLabel}>Location</span>
                                <span className={styles.contactValue}>Kiburara, Ibanda District, Uganda</span>
                            </div>
                            <div className={styles.contactItem}>
                                <span className={styles.contactLabel}>Email</span>
                                <a href="mailto:africangirlriseltd@gmail.com" className={styles.contactValue}>
                                    africangirlriseltd@gmail.com
                                </a>
                            </div>
                            <div className={styles.contactItem}>
                                <span className={styles.contactLabel}>WhatsApp / Phone</span>
                                <a href="tel:+256703727965" className={styles.contactValue}>
                                    0703 727 965 · 0763 738 733
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <div className={styles.linksColumn}>
                        <span className={styles.columnTitle}>About</span>
                        <nav className={styles.linksList}>
                            <Link to="/our-story">Who We Are</Link>
                            <Link to="/founder">Founder</Link>
                            <Link to="/stories">Impact Stories</Link>
                            <Link to="/events">Events</Link>
                        </nav>
                    </div>

                    {/* Programs */}
                    <div className={styles.linksColumn}>
                        <span className={styles.columnTitle}>Programs</span>
                        <nav className={styles.linksList}>
                            <Link to="/programs">All Programs</Link>
                            <Link to="/programs/rise-rooms">Rise Sanctuaries</Link>
                            <Link to="/programs/rise-brothers">Rise Brothers</Link>
                            <Link to="/legal-advocacy">Legal Advocacy</Link>
                            <Link to="/contact">Get Involved</Link>
                        </nav>
                    </div>

                </div>

                {/* ── Bottom Bar ── */}
                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} African Girl Rise Ltd. All rights reserved.
                    </p>
                    <nav className={styles.legalLinks}>
                        <Link to="/legal/terms">Terms of Service</Link>
                        <Link to="/legal/privacy">Privacy Policy</Link>
                        <Link to="/legal/refund">Refund Policy</Link>
                    </nav>
                    <p className={styles.mission}>Education · Safety · Advocacy</p>
                </div>

            </div>
        </footer>
    );
}
