import { useState } from 'react';
import { Users, GraduationCap, Laptop, Sparkles, ArrowRight } from 'lucide-react';
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
            <section className={styles.header}>
                <span className="subheading">Share Your Wisdom</span>
                <h1 className="heading-display">Get <span className="text-gradient">Involved</span></h1>
                <p className={styles.subtitle}>Guide rising leaders toward their full potential by sharing your time and expertise.</p>
            </section>

            <div className={styles.contentWrapper}>
                <div className={styles.infoSection}>
                    <h2>Ways to Volunteer</h2>
                    <div className={styles.opportunityList}>
                        <div className={styles.opportunityCard}>
                            <Users className={`${styles.opportunityIcon} ${styles.opportunityIconPink}`} size={32} />
                            <h3>Career Mentorship</h3>
                            <p>Guide girls through career exploration and professional development.</p>
                        </div>
                        <div className={styles.opportunityCard}>
                            <GraduationCap className={`${styles.opportunityIcon} ${styles.opportunityIconTeal}`} size={32} />
                            <h3>Academic Support</h3>
                            <p>Tutoring, STEM workshops, and national exam preparation.</p>
                        </div>
                        <div className={styles.opportunityCard}>
                            <Laptop className={`${styles.opportunityIcon} ${styles.opportunityIconPurple}`} size={32} />
                            <h3>Skills Training</h3>
                            <p>Teach digital literacy, financial skills, or entrepreneurship.</p>
                        </div>
                        <div className={styles.opportunityCard}>
                            <Sparkles className={`${styles.opportunityIcon} ${styles.opportunityIconNeutral}`} size={32} />
                            <h3>Rise Sisterhood</h3>
                            <p>Provide ongoing encouragement and emotional guidance.</p>
                        </div>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <div className={styles.formCard}>
                        <h2>Application Form</h2>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Full Name</label>
                                <input type="text" id="name" value={volunteer.name} onChange={e => setVolunteer({ ...volunteer, name: e.target.value })} required className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" value={volunteer.email} onChange={e => setVolunteer({ ...volunteer, email: e.target.value })} required className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="skills">Profession / Skills</label>
                                <input type="text" id="skills" value={volunteer.skills} onChange={e => setVolunteer({ ...volunteer, skills: e.target.value })} required className={styles.input} placeholder="e.g., Doctor, Engineer, Teacher..." />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="availability">Availability</label>
                                <input type="text" id="availability" value={volunteer.availability} onChange={e => setVolunteer({ ...volunteer, availability: e.target.value })} required className={styles.input} placeholder="e.g., Weekends, Virtual..." />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="message">Why do you want to mentor?</label>
                                <textarea id="message" value={volunteer.message} onChange={e => setVolunteer({ ...volunteer, message: e.target.value })} required rows={4} className={styles.textarea} />
                            </div>
                            {status === 'success' && <div className={styles.successMsg}>Thank you! We'll review your application and be in touch soon.</div>}
                            <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
                                {status === 'loading' ? 'Sending...' : 'Join the Network'} <ArrowRight size={18} className={styles.inlineIconTrailing} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
