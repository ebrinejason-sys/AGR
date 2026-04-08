"use client";

import styles from './page.module.css';
import Link from 'next/link';

export default function Programs() {
    return (
        <div className={styles.container}>
            {/* Editorial Hero */}
            <section className={styles.hero}>
                <p className="subheading reveal">Our Impact Strategies</p>
                <h1 className="heading-display reveal">Core <span className="text-gradient">Programs</span></h1>
                <p className="subheading reveal" style={{ fontStyle: 'italic', letterSpacing: '0.1em', marginTop: '2rem' }}>
                  Empowering Girls to Transcend Background and Architect Brighter Futures.
                </p>
            </section>

            {/* Ticker */}
            <div className={styles.ticker} aria-hidden="true">
                <div className={styles.tickerTrack}>
                    {['Rise Room', 'Academic Rescue', 'Life Skills', 'Health & Wellness', 'Future Pathways', 'Leadership', 'Mentorship', 'Community', 'Resilience', 'Empowerment', 'Rise Room', 'Academic Rescue', 'Life Skills', 'Health & Wellness', 'Future Pathways', 'Leadership', 'Mentorship', 'Community', 'Resilience', 'Empowerment'].map((item, i) => (
                        <span key={i} className={styles.tickerItem}>{item}</span>
                    ))}
                </div>
            </div>

            {/* Strategic Pillars */}
            <section className={styles.editorialIntro}>
                <div className={styles.editorialWrapper}>
                    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        <h2 className="heading-section">Investing in <span className="text-gradient">Resilience</span></h2>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            African Girl Rise presents a transformative investment in the adolescent girls of Kiburara and surrounding communities.
                            We directly confront the interconnected crises of mental health, school dropouts, and gender-based adversity.
                        </p>
                    </div>

                    <div className={styles.premiumGrid}>
                        <div className={styles.pillarCard}>
                            <span className={styles.pillarNumber}>01</span>
                            <p className="subheading">Healing</p>
                            <h3>Rise Sanctuaries</h3>
                            <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>Safe, trauma-informed clinical environments providing holistic counseling and deep peer connection to rebuild self-worth.</p>
                        </div>
                        <div className={styles.pillarCard}>
                            <span className={styles.pillarNumber}>02</span>
                            <p className="subheading">Persistence</p>
                            <h3>Academic Drive</h3>
                            <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>Ensuring girls maintain educational momentum through mentorship, resource provision, and strategic economic relief.</p>
                        </div>
                        <div className={styles.pillarCard}>
                            <span className={styles.pillarNumber}>03</span>
                            <p className="subheading">Protection</p>
                            <h3>Legal Advocacy</h3>
                            <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>High-impact protection of adolescent rights through legal literacy, community mediation, and advocacy for systemic justice.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reality Banner */}
            <section className={styles.realityBanner}>
                <h2 className="heading-section" style={{ color: 'white' }}>The <span className="text-gradient">Imperative</span> for Action</h2>
                <div className={styles.bannerStats}>
                    <div className={styles.bannerStatItem}>
                        <h3>800+</h3>
                        <p>Girls Directly Supported</p>
                    </div>
                    <div className={styles.bannerStatItem}>
                        <h3>100%</h3>
                        <p>Trauma-Informed Care</p>
                    </div>
                    <div className={styles.bannerStatItem}>
                        <h3>24/7</h3>
                        <p>Advocacy Support</p>
                    </div>
                </div>
            </section>

            {/* Outcomes Section */}
            <section className={styles.editorialContent}>
                <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <p className="subheading">Accountability</p>
                    <h2 className="heading-section">Strategic <span className="text-gradient">Outcomes</span></h2>
                </div>

                <div className={styles.outcomeTableWrapper}>
                    <table className={styles.outcomeTable}>
                        <thead>
                            <tr>
                                <th>Strategic Goal</th>
                                <th>Measured Metric</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Psychological Resilience</td>
                                <td>85% improvement in self-worth and confidence indicators.</td>
                            </tr>
                            <tr>
                                <td>Academic Persistence</td>
                                <td>Significant reduction in dropout rates among mentored cohorts.</td>
                            </tr>
                            <tr>
                                <td>Rights Protection</td>
                                <td>100% of reported rights violations receive legal intervention.</td>
                            </tr>
                            <tr>
                                <td>Generational Shift</td>
                                <td>Empowered girls leading community-based peer mentorship groups.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Final CTA */}
            <section className={styles.ctaEditorial}>
                <h2 className="heading-section">Architect a <span style={{ color: 'var(--color-lightblue)' }}>Legacy</span> of Rise</h2>
                <p style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', marginBottom: '4rem' }}>
                    Your partnership fuels the transformation of adolescent girls into empowered leaders.
                </p>
                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/pay" className="btn-premium" style={{ background: 'white', color: 'black' }}>
                        <span>Invest in Her</span>
                    </Link>
                    <Link href="/contact" className="btn-premium" style={{ borderColor: 'white' }}>
                        <span>Join the Team</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
