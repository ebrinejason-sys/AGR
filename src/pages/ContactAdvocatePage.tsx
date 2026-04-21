import { useState } from 'react';
import { Megaphone, PenTool, Mic2, Camera, ArrowRight } from 'lucide-react';
import styles from './ContactPartnerPage.module.css';

export default function ContactAdvocatePage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [form, setForm] = useState({ name: '', email: '', platform: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'general', name: form.name, email: form.email, message: `Platform/Reach: ${form.platform}\n\nAdvocacy Interest:\n${form.message}` }),
            });
            if (!res.ok) throw new Error('Failed to send message');
            setStatus('success');
            setForm({ name: '', email: '', platform: '', message: '' });
        } catch { setStatus('error'); }
    };

    return (
        <div className={styles.container}>
            <section className={styles.header}>
                <span className="subheading">Amplify Our Message</span>
                <h1 className="heading-display">Become an <span className="text-gradient">Advocate</span></h1>
                <p className={styles.subtitle}>Use your voice, platform, and networks to spread awareness that every girl deserves to rise.</p>
            </section>

            <div className={styles.contentWrapper}>
                <div className={styles.infoSection}>
                    <h2>Ways to Advocate</h2>
                    <div className={styles.opportunityList}>
                        <div className={styles.opportunityCard}>
                            <Megaphone className={styles.opportunityIcon} size={32} style={{ color: 'var(--accent-pink)', marginBottom: '1rem' }} />
                            <h3>Social Ambassador</h3>
                            <p>Share our stories, campaigns, and impact updates on your social channels.</p>
                        </div>
                        <div className={styles.opportunityCard}>
                            <PenTool className={styles.opportunityIcon} size={32} style={{ color: 'var(--accent-teal)', marginBottom: '1rem' }} />
                            <h3>Content Creator</h3>
                            <p>Write posts, create videos, or produce podcasts highlighting our mission.</p>
                        </div>
                        <div className={styles.opportunityCard}>
                            <Mic2 className={styles.opportunityIcon} size={32} style={{ color: 'var(--accent-purple)', marginBottom: '1rem' }} />
                            <h3>Community Speaker</h3>
                            <p>Present about our work at schools, churches, and community events.</p>
                        </div>
                        <div className={styles.opportunityCard}>
                            <Camera className={styles.opportunityIcon} size={32} style={{ color: 'var(--text-primary)', marginBottom: '1rem' }} />
                            <h3>Storyteller</h3>
                            <p>Help document and share the inspiring journeys of the girls we serve.</p>
                        </div>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <div className={styles.formCard}>
                        <h2>Join the Movement</h2>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Full Name</label>
                                <input type="text" id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="platform">Your Platform / Reach</label>
                                <input type="text" id="platform" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} className={styles.input} placeholder="e.g., Instagram, Blog, Local Community..." />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="message">How would you like to help?</label>
                                <textarea id="message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={4} className={styles.textarea} />
                            </div>
                            {status === 'success' && <div className={styles.successMsg}>Thank you for joining our advocacy movement! We'll be in touch.</div>}
                            <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
                                {status === 'loading' ? 'Sending...' : 'Become an Advocate'} <ArrowRight size={18} style={{ marginLeft: 8 }} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
