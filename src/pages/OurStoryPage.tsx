import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import styles from './OurStoryPage.module.css';

const DonationModal = lazy(() => import('@/components/DonationModal'));

export default function OurStoryPage() {
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    return (
        <div className={styles.container}>
            <PageHero
                eyebrow="The Genesis"
                title="Our Narrative"
                subtitle="Your beginning does not define your becoming."
            />

            {/* ─── Story Section ─── */}
            <section className={styles.contentSection}>
                <div className={styles.narrativeWrapper}>
                    <div className={styles.storyGrid}>
                        <div>
                            <h2 className="heading-section">A Promise of <span className="text-gradient">Empowerment</span></h2>
                        </div>
                        <div className={styles.storyTextStack}>
                            <p>I grew up seeing it — the brilliant, sparkling potential in the eyes of young girls slowly dimmed by circumstance. A girl with a mind for numbers stops coming to school, her uniform exchanged for responsibilities too heavy for her shoulders. A young artist with a voice that could move mountains falls silent, told her dreams are too big for her world.</p>
                            <p className={styles.storyOffset}>I saw poverty try to write a script for lives not yet lived, and I saw society nodding, as if it were inevitable.</p>
                            <p>But then I also saw the exceptions. The ones who, against all odds, rose. They did not rise because their path was easier; they rose because somewhere, somehow, they were given a single thread of hope to cling to — a teacher who believed, a book that inspired, a small act of kindness that whispered: <em>&ldquo;You are more.&rdquo;</em></p>
                        </div>
                    </div>

                    <div className={styles.highlightQuote}>
                        That whisper is not a privilege. <br />It is a promise — and that is the promise we are here to keep.
                    </div>

                    <div className={styles.premiumNarrative}>
                        <div className={styles.sectionIntro}>
                            <span className="subheading">The Imperative</span>
                            <h2 className="heading-section">Our <span className="text-gradient">&ldquo;Why&rdquo;</span> — The Heart of the Matter</h2>
                            <p className={styles.sectionLead}>
                                We exist because the world often mistakes a difficult beginning for a predetermined ending. In communities across Africa, adolescent girls face a convergence of storms.
                            </p>
                        </div>
                        <div className={styles.missionVision}>
                            <div className={styles.challengeCard}>
                                <span className="subheading">Challenge 01</span>
                                <h3>A Mental Health Crisis</h3>
                                <p className={styles.challengeText}>Untreated trauma, anxiety, and depression become walls around potential. We build safe spaces where healing begins.</p>
                            </div>
                            <div className={styles.challengeCard}>
                                <span className="subheading">Challenge 02</span>
                                <h3>An Educational Emergency</h3>
                                <p className={styles.challengeText}>4 in 10 girls drop out before Form 4. Our work is designed to interrupt that pattern early through practical school retention support.</p>
                            </div>
                            <div className={styles.challengeCard}>
                                <span className="subheading">Challenge 03</span>
                                <h3>A Cycle of Disempowerment</h3>
                                <p className={styles.challengeText}>Early pregnancies and societal limitations tell girls their stories are already written. We help them write a different ending.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Belief Callout ─── */}
            <section className={styles.beliefCallout}>
                <h2 className="heading-section">
                    We do not see fragility. We see <span className="text-gradient">architects</span> of a new African legacy.
                </h2>
            </section>

            {/* ─── Mission & Vision ─── */}
            <section className={`${styles.contentSection} ${styles.contentSectionAlt}`}>
                <div className={styles.narrativeWrapper}>
                    <div className={styles.storyGrid}>
                        <div>
                            <span className="subheading">Vision</span>
                            <h2 className="heading-section">The World We Are <span className="text-gradient">Building</span></h2>
                            <p className={styles.storyTextStack} style={{ marginTop: '2rem' }}>
                                We dream of a continent where you can look at any girl and see not where she comes from, but where she is going. A future where communities are led by women who have turned their pain into purpose.
                            </p>
                        </div>
                        <div>
                            <span className="subheading">Mission</span>
                            <h2 className="heading-section">The Work of <span className="text-gradient">Rising</span></h2>
                            <ul className={styles.missionList}>
                                <li>A safe haven — Rise Rooms where girls heal and are heard.</li>
                                <li>A toolkit for life — mental health, academics, and financial literacy.</li>
                                <li>A sisterhood of belief — mentorship from women who have walked the path.</li>
                                <li>A bridge to the future — career exposure and leadership skills.</li>
                            </ul>
                        </div>
                    </div>

                    <div className={styles.coreBeliefPanel}>
                        <span className="subheading">Core Belief</span>
                        <h2 className="heading-section">
                            &ldquo;Your beginning does not define your <span className="text-gradient">becoming.</span>&rdquo;
                        </h2>
                        <p className={styles.coreBeliefCopy}>
                            We do not see poor backgrounds — we see unyielding resilience waiting to be focused. We see heroes in the middle of their origin story. We believe in strength, not salvage.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── Founder Vision ─── */}
            <section className={styles.founderVision}>
                <div className={styles.founderVisionInner}>
                    <span className="subheading">Founder Vision</span>
                    <blockquote>
                        &ldquo;I put African Girl Rise Initiative in place to break the cycle that stole my friends. To give every girl a safe place to heal, skills to stand on her own, and leadership to lift others.&rdquo;
                    </blockquote>
                    <p className={styles.attribution}>&mdash; Akatwijuka Grace, Founder</p>
                    <Link to="/founder" className="btn-premium">
                        Read Grace's Story <ArrowRight size={18} style={{ marginLeft: 8 }} />
                    </Link>
                </div>
            </section>

            {/* ─── CTA Section ─── */}
            <section className={styles.ctaEditorial}>
                <div className={styles.narrativeWrapper}>
                    <span className="subheading">Take Action</span>
                    <h2 className="heading-section">Join the <span className="text-gradient">Movement</span></h2>
                    <div className={styles.ctaGrid}>
                        <div className={styles.ctaCard}>
                            <h3>Donate</h3>
                            <p>Fund a girl's journey for a year. Your investment transforms generations, not just individuals.</p>
                            <button className="btn-premium" onClick={() => setIsDonationModalOpen(true)}>Contribute Now</button>
                        </div>
                        <div className={styles.ctaCard}>
                            <h3>Partner</h3>
                            <p>Bring your organization's resources to scale our impact across the region.</p>
                            <Link to="/contact" className="btn-premium">Partner With Us</Link>
                        </div>
                        <div className={styles.ctaCard}>
                            <h3>Mentor</h3>
                            <p>Share your time and wisdom to guide a rising leader. Every girl needs a role model.</p>
                            <Link to="/contact" className="btn-premium">Become a Mentor</Link>
                        </div>
                    </div>
                </div>
            </section>

            {isDonationModalOpen && (
                <Suspense fallback={null}>
                    <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
                </Suspense>
            )}
        </div>
    );
}
