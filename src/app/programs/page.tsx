import styles from './page.module.css';
import Link from 'next/link';

export default function Programs() {
    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroGlowPink} />
                <div className={styles.heroGlowBlue} />
                <h1 className="heading-xl">Core <span className="text-gradient">Programs</span></h1>
                <p className={styles.subtitle}>
                    Empowering Girls to Transcend Background and Build Brighter Futures
                </p>
                <p className={styles.slogan}>Your story isn't over. It's just getting powerful.</p>
            </section>

            {/* Introduction / Investing in Resilience */}
            <section className={styles.introSection}>
                <div className={styles.textContainer}>
                    <h2 className={styles.sectionTitle}>Investing in Resilience</h2>
                    <p>A Girl Defined by Rise Initiative presents a transformative investment in the adolescent girls of Kiburara and surrounding communities. This school-based program directly confronts the interconnected crises of mental health deterioration, school dropouts, academic failure, and early pregnancies.</p>
                    <p>By funding this initiative, you are not simply addressing symptoms; you are investing in the architects of Kiburara's future—the women who will lead, heal, teach, and innovate precisely because they learned to rise.</p>
                </div>
            </section>

            {/* The Reality */}
            <section className={styles.realitySection}>
                <h2 className={styles.sectionTitle}>The Reality We Face</h2>
                <div className={styles.grid2}>
                    <div className={styles.statBox}>
                        <h3>78%</h3>
                        <p>of girls report persistent anxiety or trauma from poverty</p>
                    </div>
                    <div className={styles.statBox}>
                        <h3>4 in 10</h3>
                        <p>girls drop out before Form 4 due to economic pressure</p>
                    </div>
                    <div className={styles.statBox}>
                        <h3>#1 Cause</h3>
                        <p>of permanent dropout is teenage pregnancy</p>
                    </div>
                    <div className={styles.statBox}>
                        <h3>Internalization</h3>
                        <p>Girls internalize that their circumstances are their destiny</p>
                    </div>
                </div>
            </section>

            {/* The Three Pillars Framework */}
            <section className={styles.pillarsSection}>
                <h2 className={styles.sectionTitle}>Our Framework: The Three Pillars</h2>
                <div className={styles.grid3}>
                    <div className={styles.pillarCard}>
                        <div className={styles.pillarIcon}>01</div>
                        <h3>Healing the Ground</h3>
                        <p className={styles.pillarSubtitle}>Because you cannot rise from broken ground.</p>
                        <ul>
                            <li>Safe spaces for therapy and peer support</li>
                            <li>Trauma-informed counseling</li>
                            <li>Resilience and emotional intelligence curriculum</li>
                        </ul>
                    </div>
                    <div className={styles.pillarCard}>
                        <div className={styles.pillarIcon}>02</div>
                        <h3>Building the Ladder</h3>
                        <p className={styles.pillarSubtitle}>Because rising requires tangible steps.</p>
                        <ul>
                            <li>Academic Rescue (Tutoring & Scholarships)</li>
                            <li>Essential Support Packages (Sanitary care, supplies)</li>
                            <li>Digital Literacy Labs</li>
                        </ul>
                    </div>
                    <div className={styles.pillarCard}>
                        <div className={styles.pillarIcon}>03</div>
                        <h3>Reaching New Altitudes</h3>
                        <p className={styles.pillarSubtitle}>Because rising should lead to sustained elevation.</p>
                        <ul>
                            <li>Future Pathways & Career Mentorship</li>
                            <li>Rise Leadership Council</li>
                            <li>"My Rise Plan" vision development</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Core Programs Detailed */}
            <section className={styles.corePrograms}>
                <h2 className={styles.sectionTitle}>Core Programs</h2>
                <div className={styles.programsGrid}>

                    <div className={styles.programCard}>
                        <h3>The Rise Room</h3>
                        <p>School-based safe spaces providing mental health support through individual counseling, group therapy circles, trauma healing workshops, and peer support networks.</p>
                    </div>

                    <div className={styles.programCard}>
                        <h3>Academic Rescue</h3>
                        <p>Keeping girls in school and excelling via after-school tutoring centers, exam preparation camps, STEM workshops, and scholarship management.</p>
                    </div>

                    <div className={styles.programCard}>
                        <h3>Leadership & Life Skills</h3>
                        <p>Building tomorrow's leaders today with financial literacy, public speaking, digital skills bootcamps, entrepreneurship basics, and personal development planning.</p>
                    </div>

                    <div className={styles.programCard}>
                        <h3>Health & Wellness</h3>
                        <p>Holistic health for body and mind including SRHR education, menstrual health management, nutrition training, and access to healthcare referrals.</p>
                    </div>

                    <div className={styles.programCard}>
                        <h3>Future Pathways</h3>
                        <p>Bridging education to opportunity through career exposure tours, university preparation, vocational linkages, mentorship, and internship placements.</p>
                    </div>

                </div>
            </section>

            {/* Special Initiatives */}
            <section className={styles.specialSection}>
                <div className={styles.specialContainer}>
                    <h2 className={styles.sectionTitle}>Special Initiatives</h2>
                    <div className={styles.specialList}>
                        <div className={styles.specialItem}>
                            <h4>Rise Sisterhood Network</h4>
                            <p>An Alumni Association driving Big/Little Sister mentoring, monthly circles, and an annual reunion.</p>
                        </div>
                        <div className={styles.specialItem}>
                            <h4>Community Engagement</h4>
                            <p>Parent empowerment, teacher training in trauma-informed care, and boys-as-allies dialogue forums.</p>
                        </div>
                        <div className={styles.specialItem}>
                            <h4>Emergency Support Fund</h4>
                            <p>Rapid response for school fee emergencies, medical crises, and basic needs provision.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Measuring Transformation */}
            <section className={styles.outcomesSection}>
                <h2 className={styles.sectionTitle}>Measuring Transformation</h2>
                <div className={styles.tableResponsive}>
                    <table className={styles.metricsTable}>
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Baseline</th>
                                <th>Target (Year 2)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Psychological Resilience Score</td>
                                <td>2.1 / 5</td>
                                <td>4.2 / 5</td>
                            </tr>
                            <tr>
                                <td>School Retention Rate</td>
                                <td>62%</td>
                                <td>92%</td>
                            </tr>
                            <tr>
                                <td>Early Pregnancy Rate (15-19)</td>
                                <td>28%</td>
                                <td>&lt;10%</td>
                            </tr>
                            <tr>
                                <td>Girls with Documented "Rise Plan"</td>
                                <td>0%</td>
                                <td>100%</td>
                            </tr>
                            <tr>
                                <td>Transition to Higher Ed/Vocational</td>
                                <td>18%</td>
                                <td>65%</td>
                            </tr>
                            <tr>
                                <td>Community Projects Led by Girls</td>
                                <td>0</td>
                                <td>12</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Why This Matters / CTA */}
            <section className={styles.ctaSection}>
                <h2 className="heading-lg">Why This Investment Matters</h2>
                <p className={styles.ctaSubtitle}>
                    This is not charity. This is strategic community transformation.<br />
                    For every girl who rises, 3 family members are lifted from poverty and 1 community role model is created.
                </p>
                <div className={styles.actionGrid}>
                    <div className={styles.actionBox}>
                        <h3>Fund The Journey</h3>
                        <p>Support our comprehensive 2-year Shs 8,200,000 implementation plan.</p>
                        <Link href="/events" className={styles.btnPrimary}>Donate Now</Link>
                    </div>
                    <div className={styles.actionBox}>
                        <h3>Partner With Us</h3>
                        <p>Bring your organization's resources, expertise, or vocational pathways to scale our impact.</p>
                        <Link href="/contact" className={styles.btnSecondary}>Contact Us</Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
