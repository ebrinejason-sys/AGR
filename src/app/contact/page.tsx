"use client";

import { useState } from 'react';
import styles from './page.module.css';

type FormType = 'general' | 'volunteer' | 'partner' | 'sponsor';

const FORM_TABS: { key: FormType; label: string; icon: string }[] = [
    { key: 'general', label: 'General', icon: '💬' },
    { key: 'volunteer', label: 'Volunteer', icon: '🤝' },
    { key: 'partner', label: 'Partner', icon: '🏢' },
    { key: 'sponsor', label: 'Sponsor a Girl', icon: '💖' },
];

export default function Contact() {
    const [activeTab, setActiveTab] = useState<FormType>('general');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const [general, setGeneral] = useState({ name: '', email: '', message: '' });
    const [volunteer, setVolunteer] = useState({
        name: '', email: '', phone: '', skills: '', availability: '', message: ''
    });
    const [partner, setPartner] = useState({
        orgName: '', contactPerson: '', email: '', partnershipType: '', message: ''
    });
    const [sponsor, setSponsor] = useState({
        name: '', email: '', sponsorType: 'one-time', message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        let payload: Record<string, string> = {};

        switch (activeTab) {
            case 'general':
                payload = { type: 'general', ...general };
                break;
            case 'volunteer':
                payload = { type: 'volunteer', ...volunteer };
                break;
            case 'partner':
                payload = { type: 'partner', ...partner };
                break;
            case 'sponsor':
                payload = { type: 'sponsor', ...sponsor };
                break;
        }

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to send message');

            setStatus('success');
            switch (activeTab) {
                case 'general':
                    setGeneral({ name: '', email: '', message: '' });
                    break;
                case 'volunteer':
                    setVolunteer({ name: '', email: '', phone: '', skills: '', availability: '', message: '' });
                    break;
                case 'partner':
                    setPartner({ orgName: '', contactPerson: '', email: '', partnershipType: '', message: '' });
                    break;
                case 'sponsor':
                    setSponsor({ name: '', email: '', sponsorType: 'one-time', message: '' });
                    break;
            }
        } catch {
            setStatus('error');
        }
    };

    const handleTabChange = (tab: FormType) => {
        setActiveTab(tab);
        setStatus('idle');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className="heading-xl">Contact <span className="text-gradient">African Girl Rise</span></h1>
                <p className={styles.subtitle}>
                    Reach us for volunteering, partnerships, sponsorship, or general inquiries.
                </p>
            </div>

            <div className={styles.contentGrid}>
                <div className={`${styles.formCard} ${styles.fullWidth}`}>
                    <h2>Get in Touch</h2>
                    <p className={styles.formDesc}>Whether you want to support a girl, volunteer, partner, or just say hello.</p>

                    <div className={styles.tabBar}>
                        {FORM_TABS.map(tab => (
                            <button
                                key={tab.key}
                                className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                                onClick={() => handleTabChange(tab.key)}
                                type="button"
                            >
                                <span className={styles.tabIcon}>{tab.icon}</span>
                                <span className={styles.tabLabel}>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        {activeTab === 'general' && (
                            <>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="gen-name">Your Name</label>
                                    <input
                                        type="text"
                                        id="gen-name"
                                        required
                                        value={general.name}
                                        onChange={e => setGeneral({ ...general, name: e.target.value })}
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="gen-email">Your Email</label>
                                    <input
                                        type="email"
                                        id="gen-email"
                                        required
                                        value={general.email}
                                        onChange={e => setGeneral({ ...general, email: e.target.value })}
                                        placeholder="jane@example.com"
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="gen-message">Message</label>
                                    <textarea
                                        id="gen-message"
                                        required
                                        rows={5}
                                        value={general.message}
                                        onChange={e => setGeneral({ ...general, message: e.target.value })}
                                        placeholder="How can we help you?"
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'volunteer' && (
                            <>
                                <div className={styles.inputRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="vol-name">Full Name</label>
                                        <input
                                            type="text"
                                            id="vol-name"
                                            required
                                            value={volunteer.name}
                                            onChange={e => setVolunteer({ ...volunteer, name: e.target.value })}
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="vol-email">Email</label>
                                        <input
                                            type="email"
                                            id="vol-email"
                                            required
                                            value={volunteer.email}
                                            onChange={e => setVolunteer({ ...volunteer, email: e.target.value })}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="vol-phone">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="vol-phone"
                                            value={volunteer.phone}
                                            onChange={e => setVolunteer({ ...volunteer, phone: e.target.value })}
                                            placeholder="+256 700 123 456"
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="vol-skills">Skills / Profession</label>
                                        <input
                                            type="text"
                                            id="vol-skills"
                                            value={volunteer.skills}
                                            onChange={e => setVolunteer({ ...volunteer, skills: e.target.value })}
                                            placeholder="e.g. Teaching, Design, Law"
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="vol-avail">Availability</label>
                                    <input
                                        type="text"
                                        id="vol-avail"
                                        value={volunteer.availability}
                                        onChange={e => setVolunteer({ ...volunteer, availability: e.target.value })}
                                        placeholder="e.g. Weekends, Full-time, Remote"
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="vol-message">Why would you like to volunteer?</label>
                                    <textarea
                                        id="vol-message"
                                        required
                                        rows={4}
                                        value={volunteer.message}
                                        onChange={e => setVolunteer({ ...volunteer, message: e.target.value })}
                                        placeholder="Tell us about your motivation and how you'd like to help..."
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'partner' && (
                            <>
                                <div className={styles.inputRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="part-org">Organization Name</label>
                                        <input
                                            type="text"
                                            id="part-org"
                                            required
                                            value={partner.orgName}
                                            onChange={e => setPartner({ ...partner, orgName: e.target.value })}
                                            placeholder="Your organization"
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="part-contact">Contact Person</label>
                                        <input
                                            type="text"
                                            id="part-contact"
                                            required
                                            value={partner.contactPerson}
                                            onChange={e => setPartner({ ...partner, contactPerson: e.target.value })}
                                            placeholder="Full name"
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="part-email">Email</label>
                                        <input
                                            type="email"
                                            id="part-email"
                                            required
                                            value={partner.email}
                                            onChange={e => setPartner({ ...partner, email: e.target.value })}
                                            placeholder="contact@organization.com"
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="part-type">Partnership Type</label>
                                        <select
                                            id="part-type"
                                            required
                                            value={partner.partnershipType}
                                            onChange={e => setPartner({ ...partner, partnershipType: e.target.value })}
                                            className={styles.selectInput}
                                        >
                                            <option value="">Select type...</option>
                                            <option value="funding">Funding Partner</option>
                                            <option value="implementation">Implementation Partner</option>
                                            <option value="knowledge">Knowledge / Training Partner</option>
                                            <option value="media">Media / Communications Partner</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="part-message">Partnership Proposal</label>
                                    <textarea
                                        id="part-message"
                                        required
                                        rows={5}
                                        value={partner.message}
                                        onChange={e => setPartner({ ...partner, message: e.target.value })}
                                        placeholder="Describe how your organization would like to partner with African Girl Rise..."
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'sponsor' && (
                            <>
                                <div className={styles.inputRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="spon-name">Your Name</label>
                                        <input
                                            type="text"
                                            id="spon-name"
                                            required
                                            value={sponsor.name}
                                            onChange={e => setSponsor({ ...sponsor, name: e.target.value })}
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="spon-email">Email</label>
                                        <input
                                            type="email"
                                            id="spon-email"
                                            required
                                            value={sponsor.email}
                                            onChange={e => setSponsor({ ...sponsor, email: e.target.value })}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Sponsorship Type</label>
                                    <div className={styles.radioGroup}>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="sponsorType"
                                                value="one-time"
                                                checked={sponsor.sponsorType === 'one-time'}
                                                onChange={() => setSponsor({ ...sponsor, sponsorType: 'one-time' })}
                                            />
                                            <span>One-time Sponsorship</span>
                                        </label>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="sponsorType"
                                                value="monthly"
                                                checked={sponsor.sponsorType === 'monthly'}
                                                onChange={() => setSponsor({ ...sponsor, sponsorType: 'monthly' })}
                                            />
                                            <span>Monthly Sponsorship</span>
                                        </label>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="sponsorType"
                                                value="education-drive"
                                                checked={sponsor.sponsorType === 'education-drive'}
                                                onChange={() => setSponsor({ ...sponsor, sponsorType: 'education-drive' })}
                                            />
                                            <span>Full Education Drive</span>
                                        </label>
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="spon-message">Tell us about your interest</label>
                                    <textarea
                                        id="spon-message"
                                        required
                                        rows={4}
                                        value={sponsor.message}
                                        onChange={e => setSponsor({ ...sponsor, message: e.target.value })}
                                        placeholder="Tell us about your interest in sponsoring a girl's education..."
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
                            {status === 'loading' ? 'Sending...' : 'Send Message'}
                        </button>

                        {status === 'success' && (
                            <p className={styles.successMsg}>Thank you! Your message has been sent successfully.</p>
                        )}
                        {status === 'error' && (
                            <p className={styles.errorMsg}>Oops! Something went wrong. Please try again.</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}