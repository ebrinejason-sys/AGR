"use client";

import { useState } from "react";
import styles from "./page.module.css";

type ContactType = 'general' | 'mentor' | 'sponsor' | 'donate';

type FormFields = {
    name: string;
    email: string;
    phone: string;
    message: string;
    // Mentor fields
    profession: string;
    organization: string;
    contributionArea: string;
    mentorCapacity: string;
    // Sponsor fields
    orgName: string;
    contactPerson: string;
    sponsorType: string;
    budgetRange: string;
    // Donate fields
    donationType: string;
    donationIntent: string;
};

const EMPTY_FORM: FormFields = {
    name: '', email: '', phone: '', message: '',
    profession: '', organization: '', contributionArea: '', mentorCapacity: '',
    orgName: '', contactPerson: '', sponsorType: '', budgetRange: '',
    donationType: '', donationIntent: '',
};

const TAB_LABELS: Record<ContactType, string> = {
    general: 'General',
    mentor: 'Become a Mentor',
    sponsor: 'Sponsor',
    donate: 'Donate / Partner',
};

const TAB_DESCRIPTIONS: Record<ContactType, string> = {
    general: 'Send us a message for any general enquiry or feedback.',
    mentor: 'Share your expertise and guide the next generation of African girls.',
    sponsor: 'Partner with us to fund and sustain our programmes.',
    donate: 'Support our work through individual or corporate giving.',
};

export default function Contact() {
    const [activeTab, setActiveTab] = useState<ContactType>('general');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState<FormFields>(EMPTY_FORM);

    const set = (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setFormData(prev => ({ ...prev, [field]: e.target.value }));

    const handleTabChange = (tab: ContactType) => {
        setActiveTab(tab);
        setStatus('idle');
        setFormData(EMPTY_FORM);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type: activeTab }),
            });
            if (res.ok) {
                setStatus('success');
                setFormData(EMPTY_FORM);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className={styles.container}>
            {/* Editorial Hero */}
            <section className={styles.hero}>
                <p className="subheading reveal">Engagement</p>
                <h1 className="heading-display reveal">Contact <span className="text-gradient">Rise</span></h1>
                <p className="subheading reveal" style={{ fontStyle: 'italic', letterSpacing: '0.1em', marginTop: '2rem' }}>
                                    Reach our team for mentorship, sponsorship, partnership, or general enquiries.
                </p>
            </section>

            {/* Ticker */}
            <div className={styles.ticker} aria-hidden="true">
                <div className={styles.tickerTrack}>
                    {['Get In Touch', 'Partner With Us', 'Mentorship', 'Sponsorship', 'Donate', 'Advocacy', 'Ibanda District', 'Uganda', 'cangirlriseltd.org', 'African Girl Rise', 'Get In Touch', 'Partner With Us', 'Mentorship', 'Sponsorship', 'Donate', 'Advocacy', 'Ibanda District', 'Uganda', 'cangirlriseltd.org', 'African Girl Rise'].map((item, i) => (
                        <span key={i} className={styles.tickerItem}>{item}</span>
                    ))}
                </div>
            </div>

            <section className={styles.contactSection}>
               <div className={styles.contactGrid}>
                    <div className={styles.infoCol}>
                        <h2 className="heading-section">Connect <br /> with <span className="text-gradient">Us</span></h2>

                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>LOCATION</span>
                            <p className={styles.infoValue}>Kiburara, Ibanda District,<br />Western Uganda</p>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>EMAIL</span>
                            <a className={styles.infoLink} href="mailto:africangirlriseltd@gmail.com">africangirlriseltd@gmail.com</a>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>WHATSAPP ONLY</span>
                            <a className={styles.infoLink} href="https://wa.me/256703727965" target="_blank" rel="noopener noreferrer">+256 703 727 965</a>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>CALLS ONLY</span>
                            <a className={styles.infoLink} href="tel:+256763738733">+256 763 738 733</a>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>WEBSITE</span>
                            <a className={styles.infoLink} href="https://africangirlriseltd.org" target="_blank" rel="noopener noreferrer">africangirlriseltd.org</a>
                        </div>

                        <div className={styles.tabDescriptionBox}>
                            <p className={styles.tabDescriptionText}>{TAB_DESCRIPTIONS[activeTab]}</p>
                        </div>
                    </div>

                    <div className={styles.formCard}>
                        <div className={styles.tabBar}>
                            {(Object.keys(TAB_LABELS) as ContactType[]).map(tab => (
                                <button
                                    key={tab}
                                    className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                                    onClick={() => handleTabChange(tab)}
                                >
                                    {TAB_LABELS[tab]}
                                </button>
                            ))}
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            {/* ── GENERAL ── */}
                            {activeTab === 'general' && (
                                <>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>FULL NAME</label>
                                        <input type="text" className={styles.input} required value={formData.name} onChange={set('name')} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>EMAIL ADDRESS</label>
                                        <input type="email" className={styles.input} required value={formData.email} onChange={set('email')} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>MESSAGE</label>
                                        <textarea rows={4} className={styles.input} required value={formData.message} onChange={set('message')} />
                                    </div>
                                </>
                            )}

                            {/* ── MENTOR ── */}
                            {activeTab === 'mentor' && (
                                <>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>FULL NAME</label>
                                        <input type="text" className={styles.input} required value={formData.name} onChange={set('name')} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>EMAIL ADDRESS</label>
                                        <input type="email" className={styles.input} required value={formData.email} onChange={set('email')} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>PHONE (OPTIONAL)</label>
                                        <input type="tel" className={styles.input} value={formData.phone} onChange={set('phone')} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>PROFESSION / AREA OF EXPERTISE</label>
                                        <input type="text" className={styles.input} required placeholder="e.g. Software Engineer, Nurse, Educator" value={formData.profession} onChange={set('profession')} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>ORGANISATION / INSTITUTION</label>
                                        <input type="text" className={styles.input} value={formData.organization} onChange={set('organization')} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>HOW WOULD YOU LIKE TO CONTRIBUTE?</label>
                                        <select className={styles.input} required value={formData.contributionArea} onChange={set('contributionArea')}>
                                            <option value="">Select an area</option>
                                            <option value="Career Guidance">Career Guidance</option>
                                            <option value="Academic Support">Academic Support</option>
                                            <option value="Digital Skills">Digital Skills</option>
                                            <option value="Financial Literacy">Financial Literacy</option>
                                            <option value="Mental Health & Wellbeing">Mental Health &amp; Wellbeing</option>
                                            <option value="Leadership & Advocacy">Leadership &amp; Advocacy</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>MENTORING CAPACITY PER YEAR</label>
                                        <select className={styles.input} required value={formData.mentorCapacity} onChange={set('mentorCapacity')}>
                                            <option value="">Select capacity</option>
                                            <option value="1-2 mentees">1–2 mentees</option>
                                            <option value="3-5 mentees">3–5 mentees</option>
                                            <option value="6-10 mentees">6–10 mentees</option>
                                            <option value="10+ mentees">10+ mentees</option>
                                        </select>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>ADDITIONAL NOTES</label>
                                        <textarea rows={3} className={styles.input} value={formData.message} onChange={set('message')} placeholder="Tell us more about your mentoring goals or availability" />
                                    </div>
                                </>
                            )}

                            {/* ── SPONSOR ── */}
                            {activeTab === 'sponsor' && (
                                <>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>ORGANISATION NAME</label>
                                        <input type="text" className={styles.input} required value={formData.orgName} onChange={set('orgName')} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>CONTACT PERSON</label>
                                        <input type="text" className={styles.input} required value={formData.contactPerson} onChange={set('contactPerson')} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>EMAIL ADDRESS</label>
                                        <input type="email" className={styles.input} required value={formData.email} onChange={set('email')} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>PHONE (OPTIONAL)</label>
                                        <input type="tel" className={styles.input} value={formData.phone} onChange={set('phone')} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>SPONSORSHIP TYPE</label>
                                        <select className={styles.input} required value={formData.sponsorType} onChange={set('sponsorType')}>
                                            <option value="">Select type</option>
                                            <option value="Monetary Donation">Monetary Donation</option>
                                            <option value="In-Kind Support">In-Kind Support</option>
                                            <option value="Both Monetary & In-Kind">Both Monetary &amp; In-Kind</option>
                                            <option value="Programme Partnership">Programme Partnership</option>
                                        </select>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>BUDGET RANGE (USD)</label>
                                        <select className={styles.input} required value={formData.budgetRange} onChange={set('budgetRange')}>
                                            <option value="">Select range</option>
                                            <option value="Under $500">Under $500</option>
                                            <option value="$500 – $2,000">$500 – $2,000</option>
                                            <option value="$2,000 – $10,000">$2,000 – $10,000</option>
                                            <option value="$10,000+">$10,000+</option>
                                            <option value="Prefer to discuss">Prefer to discuss</option>
                                        </select>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>MESSAGE / PROPOSAL</label>
                                        <textarea rows={4} className={styles.input} required value={formData.message} onChange={set('message')} placeholder="Tell us about your sponsorship goals or programmes you'd like to fund" />
                                    </div>
                                </>
                            )}

                            {/* ── DONATE / PARTNER ── */}
                            {activeTab === 'donate' && (
                                <>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>FULL NAME / ORGANISATION</label>
                                        <input type="text" className={styles.input} required value={formData.name} onChange={set('name')} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>EMAIL ADDRESS</label>
                                        <input type="email" className={styles.input} required value={formData.email} onChange={set('email')} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>PHONE (OPTIONAL)</label>
                                        <input type="tel" className={styles.input} value={formData.phone} onChange={set('phone')} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>DONOR TYPE</label>
                                        <select className={styles.input} required value={formData.donationType} onChange={set('donationType')}>
                                            <option value="">Select type</option>
                                            <option value="Individual">Individual</option>
                                            <option value="Corporate / Organisation">Corporate / Organisation</option>
                                            <option value="Faith Community">Faith Community</option>
                                            <option value="Diaspora">Diaspora</option>
                                        </select>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>AREA OF GIVING</label>
                                        <select className={styles.input} required value={formData.donationIntent} onChange={set('donationIntent')}>
                                            <option value="">Select area</option>
                                            <option value="School Fees for Girls">School Fees for Girls</option>
                                            <option value="Community Programmes">Community Programmes</option>
                                            <option value="Infrastructure & Safe Spaces">Infrastructure &amp; Safe Spaces</option>
                                            <option value="Mental Health Support">Mental Health Support</option>
                                            <option value="General Fund">General Fund</option>
                                        </select>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>MESSAGE</label>
                                        <textarea rows={4} className={styles.input} required value={formData.message} onChange={set('message')} placeholder="Share your intention or any questions about giving" />
                                    </div>
                                </>
                            )}

                            <button type="submit" className="btn-premium" style={{ width: '100%' }} disabled={status === 'loading'}>
                                <span>{status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}</span>
                            </button>

                            {status === 'success' && <p style={{ marginTop: '1.25rem', color: 'var(--color-pink)', fontWeight: '700', fontSize: '0.82rem' }}>Message sent successfully.</p>}
                            {status === 'error' && <p style={{ marginTop: '1.25rem', color: '#d64545', fontWeight: '700', fontSize: '0.82rem' }}>Something went wrong. Please try again.</p>}
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
