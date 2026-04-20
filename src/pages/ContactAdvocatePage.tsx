import { useState } from 'react';
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
            <div className={styles.header}>
                <h1 className="heading-xl">Become an <span className="text-gradient">Advocate</span></h1>
                <p className={styles.subtitle}>Amplify our message that every girl deserves to rise. Use your voice, platform, and networks to spread awareness.</p>
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.infoSection}>
                    <h2>Ways to Advocate</h2>
                    <div className={styles.opportunityList}>
                        <div className={styles.opportunityCard}><h3>📢 Social Media Ambassador</h3><p>Share our stories, campaigns, and impact updates on your social channels.</p></div>
                        <div className={styles.opportunityCard}><h3>✍️ Content Creator</h3><p>Write blog posts, create videos, or produce podcasts highlighting our mission.</p></div>
                        <div className={styles.opportunityCard}><h3>🎤 Community Speaker</h3><p>Present about our work at schools, churches, conferences, and community events.</p></div>
                        <div className={styles.opportunityCard}><h3>📸 Storyteller</h3><p>Help document and share the inspiring journeys of the girls we serve.</p></div>
                    </div>
                    <div className={styles.advocacyTips}>
                        <h3>Quick Ways to Start Today:</h3>
                        <ul>
                            <li>Follow us on social media and share our posts</li>
                            <li>Tell friends and family about our mission</li>
                            <li>Organize a fundraising event in your community</li>
                            <li>Write a review or testimonial about our impact</li>
                            <li>Connect us with potential partners or donors</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.formSection}>
                    <div className={styles.formCard}>
                        <h2>Join Our Advocacy Team</h2>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}><label htmlFor="name">Full Name *</label><input type="text" id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className={styles.input} /></div>
                            <div className={styles.formGroup}><label htmlFor="email">Email *</label><input type="email" id="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className={styles.input} /></div>
                            <div className={styles.formGroup}><label htmlFor="platform">Your Platform / Reach</label><input type="text" id="platform" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} className={styles.input} placeholder="e.g., Instagram (5K followers), Church community leader, Blogger..." /></div>
                            <div className={styles.formGroup}><label htmlFor="message">How would you like to advocate for us? *</label><textarea id="message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={6} className={styles.textarea} placeholder="Share your ideas for spreading our message..." /></div>
                            {status === 'success' && <div className={styles.successMsg}>✅ Thank you for joining our advocacy movement! We&apos;ll send you resources and updates soon.</div>}
                            {status === 'error' && <div className={styles.errorMsg}>⚠️ Something went wrong. Please try again or email us directly.</div>}
                            <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>{status === 'loading' ? 'Sending...' : 'Become an Advocate'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
