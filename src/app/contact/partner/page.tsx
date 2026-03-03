"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function PartnerContact() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [partner, setPartner] = useState({
        orgName: '', contactPerson: '', email: '', partnershipType: '', message: ''
    });

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
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className="heading-xl">Partner <span className="text-gradient">With Us</span></h1>
                <p className={styles.subtitle}>
                    Bring your organization's resources, expertise, and networks to scale our impact across communities.
                </p>
            </div>

            <div className={styles.contentWrapper}>
                <div className={styles.infoSection}>
                    <h2>Partnership Opportunities</h2>
                    <div className={styles.opportunityList}>
                        <div className={styles.opportunityCard}>
                            <h3>🏢 Corporate Partnerships</h3>
                            <p>Employee engagement programs, matching gifts, and corporate social responsibility initiatives.</p>
                        </div>
                        <div className={styles.opportunityCard}>
                            <h3>🏫 Educational Partnerships</h3>
                            <p>Schools, universities, and training institutions providing resources, mentorship, and scholarships.</p>
                        </div>
                        <div className={styles.opportunityCard}>
                            <h3>🌍 NGO & Foundation Partnerships</h3>
                            <p>Collaborative programs, funding partnerships, and shared expertise to amplify impact.</p>
                        </div>
                        <div className={styles.opportunityCard}>
                            <h3>🛠️ Service Partnerships</h3>
                            <p>Pro-bono services, technical support, marketing, legal, or IT expertise.</p>
                        </div>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <div className={styles.formCard}>
                        <h2>Let's Build Together</h2>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="orgName">Organization Name *</label>
                                <input
                                    type="text"
                                    id="orgName"
                                    value={partner.orgName}
                                    onChange={(e) => setPartner({ ...partner, orgName: e.target.value })}
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="contactPerson">Contact Person *</label>
                                <input
                                    type="text"
                                    id="contactPerson"
                                    value={partner.contactPerson}
                                    onChange={(e) => setPartner({ ...partner, contactPerson: e.target.value })}
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={partner.email}
                                    onChange={(e) => setPartner({ ...partner, email: e.target.value })}
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="partnershipType">Partnership Type *</label>
                                <select
                                    id="partnershipType"
                                    value={partner.partnershipType}
                                    onChange={(e) => setPartner({ ...partner, partnershipType: e.target.value })}
                                    required
                                    className={styles.select}
                                >
                                    <option value="">Select a type...</option>
                                    <option value="Corporate">Corporate</option>
                                    <option value="Educational">Educational</option>
                                    <option value="NGO/Foundation">NGO/Foundation</option>
                                    <option value="Service Partner">Service Partner</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="message">Partnership Proposal *</label>
                                <textarea
                                    id="message"
                                    value={partner.message}
                                    onChange={(e) => setPartner({ ...partner, message: e.target.value })}
                                    required
                                    rows={6}
                                    className={styles.textarea}
                                    placeholder="Tell us about your organization and how you'd like to partner with us..."
                                />
                            </div>
                            {status === 'success' && (
                                <div className={styles.successMsg}>
                                    ✅ Thank you! We'll review your partnership proposal and get back to you soon.
                                </div>
                            )}
                            {status === 'error' && (
                                <div className={styles.errorMsg}>
                                    ⚠️ Something went wrong. Please try again or email us directly.
                                </div>
                            )}
                            <button 
                                type="submit" 
                                className={styles.submitBtn}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Sending...' : 'Submit Partnership Inquiry'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
