"use client";

import { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to send message');

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className="heading-xl">Meet the <span className="text-gradient">Founder</span></h1>
                <p className={styles.subtitle}>
                    &quot;I am simply a girl whose parents chose to break the cycle. That is the gift I want every girl to receive.&quot;
                </p>
            </div>

            <div className={styles.contentGrid}>
                {/* Founder Info */}
                <div className={styles.founderCard}>
                    <div className={styles.founderImageContainer}>
                        <Image
                            src="/founder.jpg"
                            alt="Grace Akatwijuka"
                            width={200}
                            height={250}
                            className={styles.founderImage}
                        />
                    </div>
                    <h2>Akatwijuka Grace</h2>
                    <p className={styles.role}>Founder & Visionary Director</p>

                    <div className={styles.bio}>
                        <p>
                            While studying law at Uganda Christian University, Grace founded the African Girl Rise Initiative.
                            Her vision is simple and enormous: to ensure every girl in Ibanda District, Uganda, and across Africa
                            has the chance she had.
                        </p>
                        <p>
                            &quot;My mother studied hungry so I could study fed. My father struggled through school so my fees could be paid...
                            And when that girl becomes a mother, she will give the same gift to her daughter.
                            Rise. Then reach back. Always reach back.&quot;
                        </p>
                    </div>

                    <div className={styles.contactDetails}>
                        <h3>Direct Contact</h3>
                        <p><strong>Email:</strong> grace@africangirlriseltd.org</p>
                        <p><strong>Phone:</strong> 0763738733</p>
                        <p><strong>WhatsApp:</strong> +256703727965</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className={styles.formCard}>
                    <h2>Get in Touch</h2>
                    <p className={styles.formDesc}>Whether you want to support a girl, learn about our Rise Rooms, or just say hello.</p>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Your Name</label>
                            <input
                                type="text"
                                id="name"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Jane Doe"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Your Email</label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="jane@example.com"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                required
                                rows={5}
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                placeholder="How can we help you?"
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={status === 'loading'}
                        >
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
