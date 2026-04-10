"use client";

import styles from './page.module.css';
import Link from 'next/link';

export default function OurStory() {
    return (
        <div className={styles.container}>
            {/* Hero */}
            <section className={styles.hero}>
                <p className="subheading reveal">The Genesis</p>
                <h1 className="heading-display reveal">Our <span className="text-gradient">Narrative</span></h1>
                <p className={`${styles.subtitle} reveal`}>
                    &ldquo;Your beginning does not define your becoming.&rdquo;
                </p>
            </section>

            {/* Ticker */}
            <div className={styles.ticker} aria-hidden="true">
                <div className={styles.tickerTrack}>
                    {['Our Genesis', 'Breaking Cycles', 'One Girl at a Time', 'Kiburara Community', 'Uganda', 'Empowerment', 'Education', 'Safe Spaces', 'Mental Health', 'Resilience', 'Our Genesis', 'Breaking Cycles', 'One Girl at a Time', 'Kiburara Community', 'Uganda', 'Empowerment', 'Education', 'Safe Spaces', 'Mental Health', 'Resilience'].map((item, i) => (
                        <span key={i} className={styles.tickerItem}>{item}</span>
                    ))}
                </div>
            </div>

            {/* Origin Story */}
            <section className={styles.contentSection}>
                <div className={styles.narrativeWrapper}>
                    <div className={styles.storyGrid}>
                        <div>
                            <h2 className="heading-section">A Promise of <span className="text-gradient">Empowerment</span></h2>
                        </div>
                        <div>
                            <p>I grew up seeing it — the brilliant, sparkling potential in the eyes of young girls slowly dimmed by circumstance. A girl with a mind for numbers stops coming to school, her uniform exchanged for responsibilities too heavy for her shoulders. A young artist with a voice that could move mountains falls silent, told her dreams are too big for her world.</p>
                            <p style={{ marginTop: '2rem' }}>I saw poverty try to write a script for lives not yet lived, and I saw society nodding, as if it were inevitable.</p>
                            <p style={{ marginTop: '2rem' }}>But then I also saw the exceptions. The ones who, against all odds, rose. They did not rise because their path was easier; they rose because somewhere, somehow, they were given a single thread of hope to cling to — a teacher who believed, a book that inspired, a small act of kindness that whispered: <em>&ldquo;You are more.&rdquo;</em></p>
                        </div>
                    </div>

                    <div className={styles.highlightQuote}>
                        That whisper is not a privilege. <br />It is a promise — and that is the promise we are here to keep.
                    </div>

                    {/* Our Why */}
                    <div className={styles.premiumNarrative}>
                        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                            <p className="subheading">The Imperative</p>
                            <h2 className="heading-section">Our <span className="text-gradient">&ldquo;Why&rdquo;</span> — The Heart of the Matter</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.8', maxWidth: '800px', margin: '2rem auto 0' }}>
                                We exist because the world often mistakes a difficult beginning for a predetermined ending. In communities like Kiburara and across Africa, adolescent girls face a convergence of storms:
                            </p>
                        </div>
                        <div className={styles.missionVision}>
                            <div className="premium-card">
                                <p className="subheading">Challenge 01</p>
                                <h3>A Mental Health Crisis</h3>
                                <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>Untreated trauma, anxiety, and depression become walls around potential. 78% of girls in local schools report persistent anxiety, with trauma from poverty and instability manifesting as academic disengagement.</p>
                            </div>
                            <div className="premium-card" style={{ borderLeftColor: 'var(--color-purple)' }}>
                                <p className="subheading">Challenge 02</p>
                                <h3>An Educational Emergency</h3>
                                <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>4 in 10 girls drop out before Form 4, primarily due to economic pressure, early pregnancy, or loss of hope in education&apos;s value. School dropouts and academic failure cut the rope before they can climb.</p>
                            </div>
                            <div className="premium-card" style={{ borderLeftColor: 'var(--color-lightblue)' }}>
                                <p className="subheading">Challenge 03</p>
                                <h3>A Cycle of Disempowerment</h3>
                                <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>Early pregnancies and societal limitations tell girls their stories are already written. We reject this narrative. A girl&apos;s toughest ground can become the foundation for her greatest strength.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Belief Callout */}
            <section className={styles.beliefCallout}>
                <h2 className="heading-section">
                    We do not see fragility. We see <span className="text-gradient">architects</span> of a new African legacy.
                </h2>
            </section>

            {/* Vision & Mission */}
            <section className={styles.contentSection} style={{ background: 'white' }}>
                <div className={styles.narrativeWrapper}>
                    <div className={styles.storyGrid}>
                        <div>
                            <p className="subheading">Vision</p>
                            <h2 className="heading-section">The World We Are <span className="text-gradient">Building</span></h2>
                            <p style={{ marginTop: '3rem', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                                We dream of a continent — and a world — where you can look at any girl and see not where she comes from, but where she is going. A future where communities are led by women who have turned their pain into purpose, their barriers into blueprints, and their survival into service.
                            </p>
                            <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                                Our vision is an Africa transformed by the leadership of women who were once told they could not — but who, through our support, discovered that they could.
                            </p>
                        </div>
                        <div>
                            <p className="subheading">Mission</p>
                            <h2 className="heading-section">The Work of <span className="text-gradient">Rising</span></h2>
                            <p style={{ marginTop: '3rem', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                                Our mission is to be the consistent, empowering space between a girl&apos;s challenging reality and her radiant possibility. We execute this through a holistic, school-based intervention providing:
                            </p>
                            <ul style={{ marginTop: '2rem', color: 'var(--text-muted)', lineHeight: '2.2', paddingLeft: '1.5rem' }}>
                                <li>A safe haven — Rise Rooms where girls heal and are heard without judgement</li>
                                <li>A toolkit for life — mental health, academics, SRHR, and financial literacy</li>
                                <li>A sisterhood of belief — mentorship from women who have walked the path</li>
                                <li>A bridge to the future — career exposure, leadership, and tangible resources</li>
                            </ul>
                        </div>
                    </div>

                    {/* Core Belief */}
                    <div style={{ textAlign: 'center', marginTop: '10rem', padding: '8rem 4rem', background: 'var(--bg-color)' }}>
                        <p className="subheading">Core Belief</p>
                        <h2 className="heading-section" style={{ marginTop: '1rem' }}>
                            &ldquo;Your beginning does not define your <span className="text-gradient">becoming.</span>&rdquo;
                        </h2>
                        <p style={{ marginTop: '3rem', maxWidth: '700px', margin: '3rem auto 0', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                            We do not see poor backgrounds — we see unyielding resilience waiting to be focused. We do not see broken girls — we see heroes in the middle of their origin story. We believe in strength, not salvage. In investment, not charity. In partnership, not rescue.
                        </p>
                        <p style={{ marginTop: '2rem', fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--color-pink)' }}>
                            We are not giving girls a voice. They have one. We are amplifying it until the whole world has to listen.
                        </p>
                    </div>
                </div>
            </section>

            {/* Founder's Vision */}
            <section className={styles.founderVision}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <p className="subheading">My Vision Is</p>
                    <blockquote>
                        &ldquo;I put African Girl Rise Initiative in place to break the cycle that stole my friends. To give every girl a safe place to heal, skills to stand on her own, knowledge to protect herself, and leadership to lift others. Because when one girl rises, she reaches back &mdash; and generations change.&rdquo;
                    </blockquote>
                    <p className={styles.attribution}>&mdash; Akatwijuka Grace, Founder &amp; Visionary Director</p>
                    <Link href="/founder" className="btn-premium" style={{ borderColor: 'white' }}>
                        <span>Read Full Story &rarr;</span>
                    </Link>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.ctaEditorial}>
                <p className="subheading">Engagement</p>
                <h2 className="heading-section">Join the <span className="text-gradient">Movement</span></h2>
                <p style={{ maxWidth: '650px', margin: '2rem auto 6rem', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                    This is more than a programme. It starts with one girl in Kiburara choosing to stay in school, to believe in her worth, to define her own future. It multiplies as she reaches back to lift the next.
                </p>
                <div className={styles.ctaGrid}>
                    <div className={styles.ctaCard}>
                        <h3>Donate</h3>
                        <p>Fund a Rise Room or a girl&apos;s journey for a year. Your investment transforms generations, not just individuals.</p>
                        <Link href="/donate" className="btn-premium">
                            <span>Contribute Now</span>
                        </Link>
                    </div>
                    <div className={styles.ctaCard}>
                        <h3>Partner</h3>
                        <p>Bring your organisation&apos;s resources to scale our impact across Ibanda District and beyond.</p>
                        <Link href="/contact" className="btn-premium">
                            <span>Partner With Us</span>
                        </Link>
                    </div>
                    <div className={styles.ctaCard}>
                        <h3>Mentor</h3>
                        <p>Share your time and wisdom to guide a rising leader. Every girl needs someone who has walked the path before.</p>
                        <Link href="/contact" className="btn-premium">
                            <span>Become a Mentor</span>
                        </Link>
                    </div>
                    <div className={styles.ctaCard}>
                        <h3>Advocate</h3>
                        <p>Spread the message that every girl deserves the chance to rise. Use your voice to amplify theirs.</p>
                        <Link href="/contact" className="btn-premium">
                            <span>Spread the Word</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
