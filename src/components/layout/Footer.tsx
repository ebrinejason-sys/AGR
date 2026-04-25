import { lazy, Suspense, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import styles from './Footer.module.css';

const DonationModal = lazy(() => import('@/components/DonationModal'));

export default function Footer() {
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
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
            <div className={styles.container}>
                <div className={styles.newsletterSection}>
                    <div className={styles.newsletterInfo}>
                        <h3 className={styles.newsletterTitle}>Stay Informed</h3>
                        <p className={styles.newsletterText}>
                            Get updates on our impact, programs, and community stories.
                        </p>
                    </div>

                    <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                className={styles.input}
                                placeholder="Email address"
                                aria-label="Email address"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={status === 'loading'}
                                aria-label="Subscribe to newsletter"
                                title="Subscribe to newsletter"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        {status === 'success' && <p className={styles.statusSuccess}>{message}</p>}
                        {status === 'error' && <p className={styles.statusError}>{message}</p>}
                    </form>
                </div>

                <div className={styles.divider} />

                <div className={styles.grid}>
                    <div className={styles.brandCol}>
                        <h2 className={styles.brandName}>AFRICAN GIRL RISE</h2>
                        <p className={styles.brandDescription}>
                            Practical, local support that keeps girls safe and in school across Uganda.
                            Empowering through education, safety, and legal advocacy.
                        </p>
                        <div className={styles.contactList}>
                            <div className={styles.contactItem}>
                                <MapPin size={18} />
                                <span>Kiburara, Ibanda District, Uganda</span>
                            </div>
                            <div className={styles.contactItem}>
                                <Mail size={18} />
                                <a href="mailto:africangirlriseltd@gmail.com">africangirlriseltd@gmail.com</a>
                            </div>
                            <div className={styles.contactItem}>
                                <Phone size={18} />
                                <a href="tel:+256703727965">0703 727 965</a>
                            </div>
                        </div>
                    </div>

                    <div className={styles.linksCol}>
                        <h4 className={styles.colTitle}>Organization</h4>
                        <ul className={styles.linksList}>
                            <li><Link to="/our-story">Our Story</Link></li>
                            <li><Link to="/founder">The Founder</Link></li>
                            <li><Link to="/stories">Impact Stories</Link></li>
                            <li><Link to="/events">Events</Link></li>
                            <li><Link to="/media/live">Live Feed</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linksCol}>
                        <h4 className={styles.colTitle}>Programs</h4>
                        <ul className={styles.linksList}>
                            <li><Link to="/programs">All Programs</Link></li>
                            <li><Link to="/programs/rise-rooms">Rise Sanctuaries</Link></li>
                            <li><Link to="/programs/rise-brothers">Rise Brothers</Link></li>
                            <li><Link to="/legal-advocacy">Legal Advocacy</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linksCol}>
                        <h4 className={styles.colTitle}>Support Us</h4>
                        <ul className={styles.linksList}>
                            <li><Link to="/contact">Get Involved</Link></li>
                            <li><Link to="/contact">Partner With Us</Link></li>
                            <li>
                                <button
                                    type="button"
                                    className={styles.linkBtn}
                                    onClick={() => setIsDonationModalOpen(true)}
                                >
                                    Donate
                                </button>
                            </li>
                            <li><Link to="/contact/partner">Become a Sponsor</Link></li>
                        </ul>
                    </div>
                </div>

                {isDonationModalOpen && (
                    <Suspense fallback={null}>
                        <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
                    </Suspense>
                )}

                <div className={styles.bottomBar}>
                    <div className={styles.legal}>
                        <span>© {new Date().getFullYear()} African Girl Rise Ltd.</span>
                        <Link to="/legal/privacy">Privacy</Link>
                        <Link to="/legal/terms">Terms</Link>
                    </div>
                    <div className={styles.mission}>Education · Safety · Advocacy</div>
                </div>
            </div>
        </footer>
    );
}
