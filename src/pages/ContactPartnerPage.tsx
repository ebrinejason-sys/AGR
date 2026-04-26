import { useState } from 'react';
import { Building2, GraduationCap, Globe, Wrench, ArrowRight } from 'lucide-react';
import styles from './ContactPartnerPage.module.css';

export default function ContactPartnerPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [partner, setPartner] = useState({ orgName: '', contactPerson: '', email: '', partnershipType: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'partner', ...partner }),
            });
            if (!res.ok) throw new Error('Failed to send message');
            setStatus('success');
            setPartner({ orgName: '', contactPerson: '', email: '', partnershipType: '', message: '' });
        } catch { setStatus('error'); }
    };

    return (
        <div className={styles.container}>
            <section className={styles.header}>
                <span className="subheading">Scale Our Impact</span>
                <h1 className="heading-display">Partner <span className="text-gradient">With Us</span></h1>
                <p className={styles.subtitle}>Bring your organization's resources, expertise, and networks to transform the lives of adolescent girls in Uganda.</p>
            </section>

            <div className={styles.contentWrapper}>
                <div className={styles.infoSection}>
                    <h2>Opportunities</h2>
                    <div className={styles.opportunityList}>
                        <div className={styles.opportunityCard}>
                            <Building2 className={`${styles.opportunityIcon} ${styles.opportunityIconPink}`} size={32} />
                            <h3>Corporate Partnerships</h3>
                            <p>CSR initiatives, employee engagement, and matching gift programs.</p>
                        </div>
                        <div className={styles.opportunityCard}>
                            <GraduationCap className={`${styles.opportunityIcon} ${styles.opportunityIconTeal}`} size={32} />
                            <h3>Educational</h3>
                            <p>Mentorship, career exposure, and academic support programs.</p>
                        </div>
                        <div className={styles.opportunityCard}>
                            <Globe className={`${styles.opportunityIcon} ${styles.opportunityIconPurple}`} size={32} />
                            <h3>NGOs & Foundations</h3>
                            <p>Collaborative funding and knowledge sharing for scalable impact.</p>
                        </div>
                        <div className={styles.opportunityCard}>
                            <Wrench className={`${styles.opportunityIcon} ${styles.opportunityIconNeutral}`} size={32} />
                            <h3>Pro-Bono Services</h3>
                            <p>Legal, IT, Marketing, or specialized technical expertise.</p>
                        </div>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <div className={styles.formCard}>
                        <h2>Inquiry Form</h2>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="orgName">Organization Name</label>
                                <input type="text" id="orgName" value={partner.orgName} onChange={e => setPartner({ ...partner, orgName: e.target.value })} required className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="contactPerson">Contact Person</label>
                                <input type="text" id="contactPerson" value={partner.contactPerson} onChange={e => setPartner({ ...partner, contactPerson: e.target.value })} required className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Work Email</label>
                                <input type="email" id="email" value={partner.email} onChange={e => setPartner({ ...partner, email: e.target.value })} required className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="partnershipType">Partnership Type</label>
                                <select id="partnershipType" value={partner.partnershipType} onChange={e => setPartner({ ...partner, partnershipType: e.target.value })} required className={styles.select}>
                                    <option value="">Select a category...</option>
                                    <option value="Corporate">Corporate</option>
                                    <option value="Educational">Educational</option>
                                    <option value="NGO/Foundation">NGO/Foundation</option>
                                    <option value="Service Partner">Service Partner</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="message">Brief Proposal</label>
                                <textarea id="message" value={partner.message} onChange={e => setPartner({ ...partner, message: e.target.value })} required rows={4} className={styles.textarea} placeholder="How would you like to collaborate?" />
                            </div>
                            {status === 'success' && <div className={styles.successMsg}>Thank you! We'll review your proposal and respond shortly.</div>}
                            <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
                                {status === 'loading' ? 'Sending...' : 'Submit Inquiry'} <ArrowRight size={18} className={styles.inlineIconTrailing} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
