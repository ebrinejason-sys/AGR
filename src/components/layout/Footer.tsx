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

                {/* Stay Connected Section - Top */}
                <div className={styles.stayConnectedSection}>
                    <div className={styles.stayConnectedContent}>
                        <h4 className={styles.stayConnectedTitle}>Stay Connected</h4>
                        <p className={styles.stayConnectedDesc}>Get occasional updates on programs, events, and ways to help.</p>
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
                                    {status === 'loading' ? 'Sending...' : 'Subscribe'}
                                </button>
                            </div>
                            {status === 'success' && <p className={styles.successMsg}>{message}</p>}
                            {status === 'error' && <p className={styles.errorMsg}>{message}</p>}
                        </form>
                    </div>
                </div>

                {/* Footer Grid */}
                <div className={styles.footerGrid}>

                    {/* Column 1: About & Programs */}
                    <div className={styles.linksColumn}>
                        <h4 className={styles.columnTitle}>About</h4>
                        <nav className={styles.linksList}>
                            <Link to="/our-story">Who We Are</Link>
                            <Link to="/founder">Founder</Link>
                            <Link to="/stories">Stories</Link>
                        </nav>

                        <div className={styles.sectionSpacer}></div>

                        <h4 className={styles.columnTitle}>Programs</h4>
                        <nav className={styles.linksList}>
                            <Link to="/programs">Core Programs</Link>
                            <Link to="/legal-advocacy">Legal Advocacy</Link>
                            <Link to="/events">Events</Link>
                        </nav>
                    </div>

                    {/* Column 2: Brand & Contact */}
                    <div className={styles.brandColumn}>
                        <div className={styles.brandBlock}>
                            <h4 className={styles.brandName}>AFRICAN GIRL RISE</h4>
                            <p className={styles.brandTagline}>
                                Support for girls facing barriers in Uganda.
                            </p>
                        </div>

                        <h4 className={styles.columnTitle}>Contact</h4>
                        <div className={styles.contactInfo}>
                            <p><strong>Location:</strong> Kiburara, Ibanda District, Uganda</p>
                            <p><strong>Email:</strong> africangirlriseltd@gmail.com</p>
                            <p><strong>WhatsApp:</strong> 0703727965</p>
                            <p><strong>Phone:</strong> 0763738733</p>
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
                    <nav className={styles.legalLinks}>
                        <Link to="/legal/terms">Terms of Service</Link>
                        <Link to="/legal/privacy">Privacy Policy</Link>
                        <Link to="/legal/refund">Refund Policy</Link>
                    </nav>
                    <p className={styles.mission}>
                        Education, safety, and advocacy for girls.
                    </p>
                </div>
            </div>
        </footer>
    );
}
