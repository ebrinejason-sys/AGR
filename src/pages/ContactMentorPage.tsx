import { useState } from 'react';
import styles from './ContactPartnerPage.module.css';

export default function ContactMentorPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [volunteer, setVolunteer] = useState({ name: '', email: '', phone: '', skills: '', availability: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'volunteer', ...volunteer }),
            });
            if (!res.ok) throw new Error('Failed to send message');
            setStatus('success');
            setVolunteer({ name: '', email: '', phone: '', skills: '', availability: '', message: '' });
        } catch { setStatus('error'); }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className="heading-xl">Get <span className="text-gradient">Involved</span></h1>
                <p className={styles.subtitle}>Share your time, wisdom, and expertise to guide rising leaders toward their full potential.</p>
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.infoSection}>
                    <h2>Ways to Mentor & Volunteer</h2>
                    <div className={styles.opportunityList}>
                        <div className={styles.opportunityCard}><h3>👥 Career Mentorship</h3><p>Guide girls through career exploration, university applications, and professional development.</p></div>
                        <div className={styles.opportunityCard}><h3>📚 Academic Support</h3><p>Tutoring, homework help, STEM workshops, and exam preparation.</p></div>
                        <div className={styles.opportunityCard}><h3>💼 Skills Training</h3><p>Teach digital skills, financial literacy, public speaking, or entrepreneurship basics.</p></div>
                        <div className={styles.opportunityCard}><h3>🌟 Rise Sisterhood</h3><p>Join our Big Sister/Little Sister program to provide ongoing encouragement and guidance.</p></div>
                    </div>
                </div>
                <div className={styles.formSection}>
                    <div className={styles.formCard}>
                        <h2>Join Our Mentor Network</h2>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}><label htmlFor="name">Full Name *</label><input type="text" id="name" value={volunteer.name} onChange={e => setVolunteer({ ...volunteer, name: e.target.value })} required className={styles.input} /></div>
                            <div className={styles.formGroup}><label htmlFor="email">Email *</label><input type="email" id="email" value={volunteer.email} onChange={e => setVolunteer({ ...volunteer, email: e.target.value })} required className={styles.input} /></div>
                            <div className={styles.formGroup}><label htmlFor="phone">Phone Number</label><input type="tel" id="phone" value={volunteer.phone} onChange={e => setVolunteer({ ...volunteer, phone: e.target.value })} className={styles.input} placeholder="Optional" /></div>
                            <div className={styles.formGroup}><label htmlFor="skills">Skills / Profession *</label><input type="text" id="skills" value={volunteer.skills} onChange={e => setVolunteer({ ...volunteer, skills: e.target.value })} required className={styles.input} placeholder="e.g., Software Engineer, Teacher, Accountant..." /></div>
                            <div className={styles.formGroup}><label htmlFor="availability">Availability *</label><input type="text" id="availability" value={volunteer.availability} onChange={e => setVolunteer({ ...volunteer, availability: e.target.value })} required className={styles.input} placeholder="e.g., Weekends, Once a month, Virtual only..." /></div>
                            <div className={styles.formGroup}><label htmlFor="message">Why do you want to mentor? *</label><textarea id="message" value={volunteer.message} onChange={e => setVolunteer({ ...volunteer, message: e.target.value })} required rows={6} className={styles.textarea} placeholder="Share what motivates you to get involved..." /></div>
                            {status === 'success' && <div className={styles.successMsg}>✅ Thank you! We&apos;ll be in touch soon to onboard you into our mentor network.</div>}
                            {status === 'error' && <div className={styles.errorMsg}>⚠️ Something went wrong. Please try again or email us directly.</div>}
                            <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>{status === 'loading' ? 'Sending...' : 'Join as a Mentor'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
