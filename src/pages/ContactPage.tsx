import { useState } from 'react';
import { MapPin, Mail, MessageSquare, Phone, Send } from 'lucide-react';
import styles from './ContactPage.module.css';
import PageHero from '../components/PageHero';

type ContactType = 'general' | 'mentor' | 'sponsor' | 'donate';
type FormFields = {
    name: string; email: string; phone: string; message: string;
    profession: string; organization: string; contributionArea: string; mentorCapacity: string;
    orgName: string; contactPerson: string; sponsorType: string; budgetRange: string;
    donationType: string; donationIntent: string;
};
const EMPTY_FORM: FormFields = {
    name: '', email: '', phone: '', message: '',
    profession: '', organization: '', contributionArea: '', mentorCapacity: '',
    orgName: '', contactPerson: '', sponsorType: '', budgetRange: '',
    donationType: '', donationIntent: '',
};
const TAB_LABELS: Record<ContactType, string> = {
    general: 'General', mentor: 'Mentorship', sponsor: 'Sponsorship', donate: 'Partnership',
};
const TAB_DESCRIPTIONS: Record<ContactType, string> = {
    general: 'Send us a message for any general enquiry or feedback.',
    mentor: 'Share your expertise and guide the next generation of African girls.',
    sponsor: 'Partner with us to fund and sustain our programmes.',
    donate: 'Support our work through individual or corporate giving.',
};

export default function ContactPage() {
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
            if (res.ok) { setStatus('success'); setFormData(EMPTY_FORM); }
            else setStatus('error');
        } catch { setStatus('error'); }
    };

    return (
        <>
            <PageHero
                eyebrow="Contact Us"
                title={<>Let's <span className="text-gradient">Connect.</span></>}
                description="Reach out to our team in Uganda for mentorship, sponsorship, or general enquiries."
            />
            <div className={styles.container}>
                <section className={styles.contactSection}>
                    <div className={styles.contactGrid}>
                        {/* Info Column */}
                        <div className={styles.infoCol}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>LOCATION</span>
                                <div className={styles.infoValue}>
                                    <MapPin size={18} style={{ marginRight: 10, verticalAlign: 'middle' }} />
                                    Kiburara, Ibanda District, Uganda
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>EMAIL</span>
                                <div className={styles.infoValue}>
                                    <Mail size={18} style={{ marginRight: 10, verticalAlign: 'middle' }} />
                                    <a href="mailto:africangirlriseltd@gmail.com" className={styles.infoLink}>africangirlriseltd@gmail.com</a>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>DIRECT LINE</span>
                                <div className={styles.infoValue}>
                                    <Phone size={18} style={{ marginRight: 10, verticalAlign: 'middle' }} />
                                    <a href="tel:+256703727965" className={styles.infoLink}>+256 703 727 965</a>
                                </div>
                            </div>
                            <div className={styles.tabDescriptionBox}>
                                <p className={styles.tabDescriptionText}>
                                    <MessageSquare size={18} style={{ marginBottom: 10, display: 'block', color: 'var(--accent-pink)' }} />
                                    {TAB_DESCRIPTIONS[activeTab]}
                                </p>
                            </div>
                        </div>
                        {/* Form Column */}
                        <div className={styles.formCard}>
                            <div className={styles.tabBar}>
                                {(Object.keys(TAB_LABELS) as ContactType[]).map(tab => (
                                    <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`} onClick={() => handleTabChange(tab)}>
                                        {TAB_LABELS[tab]}
                                    </button>
                                ))}
                            </div>
                            <form className={styles.form} onSubmit={handleSubmit}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Full Name / Org</label>
                                    <input type="text" className={styles.input} required value={formData.name} onChange={set('name')} placeholder="Enter your name" />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Email Address</label>
                                    <input type="email" className={styles.input} required value={formData.email} onChange={set('email')} placeholder="email@example.com" />
                                </div>
                                {activeTab === 'mentor' && (
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Area of Expertise</label>
                                        <select className={styles.input} required value={formData.contributionArea} onChange={set('contributionArea')}>
                                            <option value="">Select an area</option>
                                            <option value="Career Guidance">Career Guidance</option>
                                            <option value="Academic Support">Academic Support</option>
                                            <option value="Digital Skills">Digital Skills</option>
                                            <option value="Mental Health">Mental Health</option>
                                        </select>
                                    </div>
                                )}
                                {activeTab === 'sponsor' && (
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Sponsorship Type</label>
                                        <select className={styles.input} required value={formData.sponsorType} onChange={set('sponsorType')}>
                                            <option value="">Select type</option>
                                            <option value="Monetary">Monetary</option>
                                            <option value="In-Kind">In-Kind</option>
                                            <option value="Partnership">Partnership</option>
                                        </select>
                                    </div>
                                )}
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Message</label>
                                    <textarea rows={4} className={styles.input} required value={formData.message} onChange={set('message')} placeholder="How can we help?" />
                                </div>
                                <button type="submit" className={`btn-premium ${styles.fullWidthButton}`} disabled={status === 'loading'}>
                                    {status === 'loading' ? 'Sending...' : 'Send Message'} <Send size={18} style={{ marginLeft: 10 }} />
                                </button>
                                {status === 'success' && <p className={styles.statusSuccess}>Message sent successfully.</p>}
                                {status === 'error' && <p className={styles.statusError}>Failed to send. Please try again.</p>}
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
