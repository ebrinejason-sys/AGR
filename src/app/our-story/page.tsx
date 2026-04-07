"use client";

import styles from './page.module.css';
import Link from 'next/link';

export default function OurStory() {
    return (
        <div className={styles.container}>
            {/* Dramatic Hero */}
            <section className={styles.hero}>
                <p className="serif" style={{ color: 'var(--color-pink)', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: '800' }}>The Foundation</p>
                <h1 className="heading-xl">Our <span className="text-gradient">Narrative</span></h1>
                <p className={styles.subtitle}>
                    &quot;Your beginning does not define your becoming.&quot;
                </p>
            </section>

            {/* Content Sections */}
            <section className={styles.contentSection}>
                <div className={styles.narrativeWrapper}>

                    <div className={styles.storyCard}>
                        <h2 className="serif">A Promise to <span className="text-gradient">Empower</span></h2>
                        <p>I grew up seeing it—the brilliant potential in the eyes of young girls slowly dimmed by circumstance. A girl with a mind for numbers stops coming to school. A young artist falls silent. I saw poverty try to write a script for lives not yet lived.</p>
                        <p>But I also saw the exceptions. The ones who, against all odds, rose. They rose because somewhere, somehow, they were given a single thread of hope to cling to.</p>
                        <div className={styles.highlight}>
                            &quot;That whisper of hope is not a privilege. It should be a promise.&quot;
                        </div>
                        <p>That is the promise African Girl Rise is here to keep. We are the space between a girl&apos;s challenging reality and her radiant possibility.</p>
                    </div>

                    <div style={{ marginBottom: '8rem' }}>
                        <h2 className="heading-lg">Our <span className="text-gradient">Why</span></h2>
                        <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', lineHeight: '1.8', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                            We exist because the world often mistakes a difficult beginning for a predetermined ending. Adolescent girls in Uganda face a convergence of storms: untreated trauma, economic pressure, and societal limitations.
                        </p>
                        <ul className={styles.featureList}>
                            <li><strong>Mental Health Crisis:</strong> Trauma becomes a wall around their potential.</li>
                            <li><strong>Educational Emergency:</strong> School dropouts cut the rope before they can climb.</li>
                            <li><strong>Cycle of Disempowerment:</strong> Early pregnancies tell them their stories are already written.</li>
                        </ul>
                    </div>

                    <div className={styles.visionMissionGrid}>
                        <div className={styles.vmCard}>
                            <h3>Our Vision</h3>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>An Africa transformed by the leadership of women who turned their pain into purpose and their barriers into blueprints.</p>
                        </div>
                        <div className={styles.vmCard} style={{ background: 'var(--color-purple-light)' }}>
                            <h3>Our Mission</h3>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>To be the consistent, empowering sanctuary for adolescent girls through mental health support, academic guidance, and mentorship.</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Core Belief Callout */}
            <section style={{ padding: '10rem 5%', background: 'var(--color-pink-light)', textAlign: 'center' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2 className="serif" style={{ fontSize: '3rem', color: 'var(--color-purple-deep)' }}>
                        We do not see broken girls. We see <span className="text-gradient">heroes</span> in the middle of their origin story.
                    </h2>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <h2 className="heading-lg" style={{ color: 'white' }}>Join the <span className="text-gradient">Movement</span></h2>
                <p style={{ fontSize: '1.4rem', opacity: '0.8', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Together, we can rewrite the story for thousands of girls.</p>

                <div className={styles.ctaGrid}>
                    <div className={styles.ctaBox}>
                        <h3>Donate</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>Fund a Rise sanctuary or support a girl&apos;s journey.</p>
                        <Link href="/pay" className="btn-dramatic" style={{ marginTop: '2.5rem' }}>Donate Now</Link>
                    </div>
                    <div className={styles.ctaBox}>
                        <h3>Mentor</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>Share your wisdom to guide a rising leader.</p>
                        <Link href="/contact/mentor" className="btn-outline" style={{ marginTop: '2.5rem', color: 'white', borderColor: 'white' }}>Get Involved</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
