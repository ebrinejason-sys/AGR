import styles from './page.module.css';
import Link from 'next/link';
import { CORE_PROGRAMS, PILLARS } from './data';

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
                <p className={styles.slogan}>Your story isn&apos;t over. It&apos;s just getting powerful.</p>
            </section>

            {/* Introduction / Investing in Resilience */}
            <section className={styles.introSection}>
                <div className={styles.textContainer}>
                    <h2 className={styles.sectionTitle}>Investing in Resilience</h2>
                    <p>A Girl Defined by Rise Initiative presents a transformative investment in the adolescent girls of Kiburara and surrounding communities. This school-based program directly confronts the interconnected crises of mental health deterioration, school dropouts, academic failure, and early pregnancies.</p>
                    <p>By funding this initiative, you are not simply addressing symptoms; you are investing in the architects of Kiburara&apos;s future—the women who will lead, heal, teach, and innovate precisely because they learned to rise.</p>
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

            {/* The Four Pillars Framework */}
            <section className={styles.pillarsSection}>
                <h2 className={styles.sectionTitle}>Our Framework: The Four Pillars</h2>
                <div className={styles.grid4}>
                    {PILLARS.map((pillar) => (
                        <div key={pillar.id} className={styles.pillarCard}>
                            <div className={styles.pillarIcon}>{pillar.number}</div>
                            <h3>{pillar.title}</h3>
                            <p className={styles.pillarSubtitle}>{pillar.subtitle}</p>
                            <ul>
                                {pillar.items.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                            <Link
                                href={pillar.linkTo}
                                className={styles.readMoreLink}
                                style={{ color: 'var(--color-lightblue)', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}
                            >
                                Learn More →
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Core Programs Detailed */}
            <section className={styles.corePrograms}>
                <h2 className={styles.sectionTitle}>Core Programs</h2>
                <div className={styles.programsGrid}>
                    {CORE_PROGRAMS.map((program) => (
                        <div key={program.id} className={styles.programCard}>
                            <h3>{program.title}</h3>
                            <p style={{ marginBottom: '1rem' }}>{program.description}</p>
                            <Link href={`/programs/${program.id}`} className={styles.readMoreLink} style={{ color: 'var(--color-pink)', fontWeight: 'bold', textDecoration: 'none' }}>
                                Read More →
                            </Link>
                        </div>
                    ))}
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
                                <td>Girls with Documented &quot;Rise Plan&quot;</td>
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
                        <Link href="/donate" className={styles.btnPrimary}>Donate Now</Link>
                    </div>
                    <div className={styles.actionBox}>
                        <h3>Partner With Us</h3>
                        <p>Bring your organization&apos;s resources, expertise, or vocational pathways to scale our impact.</p>
                        <Link href="/contact" className={styles.btnSecondary}>Contact Us</Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
