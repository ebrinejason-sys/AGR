"use client";

import styles from './page.module.css';
import Link from 'next/link';

export default function OurStory() {
    return (
        <div className={styles.container}>
            {/* Premium Hero */}
            <section className={styles.hero}>
                <p className="subheading reveal">The Genesis</p>
                <h1 className="heading-display reveal">Our <span className="text-gradient">Narrative</span></h1>
                <p className={`${styles.subtitle} reveal`}>
                    &quot;Your beginning does not define your becoming.&quot;
                </p>
            </section>

            {/* Core Narrative */}
            <section className={styles.contentSection}>
                <div className={styles.narrativeWrapper}>

                    <div className={styles.premiumNarrative}>
                        <div className={styles.storyGrid}>
                            <div>
                                <h2 className="heading-section">A Promise of <span className="text-gradient">Empowerment</span></h2>
                            </div>
                            <div>
                                <p>I grew up observing the brilliant potential in the eyes of young girls slowly dimmed by circumstance. A girl with an innate aptitude for mathematics ceases attendance. A young artist falls silent. I witnessed poverty attempting to dictate the script for lives yet to be lived.</p>
                                <p>However, I also witnessed the exceptions. Those who, against all structural odds, ascended. They rose because they were provided a single thread of hope to maintain their grasp.</p>
                            </div>
                        </div>

                        <div className={styles.highlightQuote}>
                            That whisper of hope is not a privilege. <br /> It is a fundamental promise.
                        </div>

                        <div className={styles.storyGrid}>
                            <div>
                                <p>That is the promise African Girl Rise is committed to upholding. We operate in the space between a girl&apos;s challenging reality and her radiant possibility.</p>
                            </div>
                            <div>
                                <h2 className="heading-section">Our <span className="text-gradient">Imperative</span></h2>
                                <p>We exist because the world frequently misinterprets a difficult beginning for a predetermined conclusion. Adolescent girls in Uganda navigate a convergence of systemic challenges.</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.missionVision}>
                        <div className="premium-card">
                            <p className="subheading">Vision</p>
                            <h3>Leadership Transformed</h3>
                            <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>An Africa redefined by the leadership of women who turned their adversity into advocacy and their barriers into blueprints for change.</p>
                        </div>
                        <div className="premium-card" style={{ borderLeftColor: 'var(--color-purple)' }}>
                            <p className="subheading">Mission</p>
                            <h3>Consistent Sanctuary</h3>
                            <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>To serve as the definitive sanctuary for adolescent girls through trauma-informed mental health support, academic persistence, and high-impact mentorship.</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Impact Belief */}
            <section className={styles.beliefCallout}>
                <h2 className="heading-section">
                    We do not see fragility. We see <span className="text-gradient">architects</span> of a new African legacy.
                </h2>
            </section>

            {/* CTA Editorial */}
            <section className={styles.ctaEditorial}>
                <p className="subheading">Engagement</p>
                <h2 className="heading-section">Join the <span className="text-gradient">Movement</span></h2>

                <div className={styles.ctaGrid}>
                    <div className={styles.ctaCard}>
                        <h3>Invest</h3>
                        <p>Fuel the operations of a Rise Sanctuary or provide direct support for a girl&apos;s educational persistence.</p>
                        <Link href="/pay" className="btn-premium">
                            <span>Contribute Now</span>
                        </Link>
                    </div>
                    <div className={styles.ctaCard}>
                        <h3>Guide</h3>
                        <p>Offer your professional wisdom and life experience to mentor a rising generation of leaders.</p>
                        <Link href="/contact" className="btn-premium">
                            <span>Apply to Mentor</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
