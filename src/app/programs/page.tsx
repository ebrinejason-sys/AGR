"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

type Program = {
    id: string;
    title: string;
    description: string;
};

const CORE_PROGRAMS: Program[] = [
    {
        id: 'rise-rooms',
        title: 'Rise Rooms',
        description: 'Safe, school-based spaces providing essential mental health support, trauma-informed counseling, and deep peer connection for adolescent girls.',
    },
    {
        id: 'academic-perseverance',
        title: 'Academic Perseverance',
        description: 'Ensuring girls stay in school through education drives, targeted mentorship, and providing resources to combat the economic pressures of poverty.',
    }
];

const PILLARS = [
    {
        id: 1,
        number: "01",
        title: "Healing & Connection",
        subtitle: "The Rise Room Model",
        items: ["Trauma-informed group therapy", "Individual peer support", "Safe space documentation"],
        linkTo: "/programs"
    },
    {
        id: 2,
        number: "02",
        title: "Academic Resilience",
        subtitle: "Perseverance Program",
        items: ["School fee assistance", "Peer tutoring sessions", "Scholastic resource packs"],
        linkTo: "/programs"
    },
    {
        id: 3,
        number: "03",
        title: "Leadership & Rights",
        subtitle: "The Advocate Program",
        items: ["Legal literacy workshops", "Public speaking training", "Community project design"],
        linkTo: "/legal-advocacy"
    },
    {
        id: 4,
        number: "04",
        title: "Holistic Health",
        subtitle: "The Radiance Pillar",
        items: ["Sexual & reproductive health", "Personal hygiene literacy", "Sanitary supply provision"],
        linkTo: "/programs"
    }
];

export default function Programs() {
    const [dynamicProjects, setDynamicProjects] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await fetch('/api/public/data');
                const data = await res.json();
                if (res.ok && data.projects) {
                    setDynamicProjects(data.projects);
                }
            } catch (err) {
                console.error("Failed to fetch projects", err);
            }
            setLoading(false);
        }
        fetchProjects();
    }, []);

    const displayPrograms = dynamicProjects.length > 0 ? dynamicProjects : CORE_PROGRAMS;

    return (
        <div className={styles.container}>
            {/* Dramatic Hero */}
            <section className={styles.hero}>
                <p className="serif" style={{ color: 'var(--color-pink)', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: '800' }}>Our Impact Strategies</p>
                <h1 className="heading-xl">Core <span className="text-gradient">Programs</span></h1>
                <p className={styles.subtitle}>
                    Empowering Girls to Transcend Background and Build Brighter Futures.
                </p>
                <p className={styles.slogan}>&ldquo;Your story isn&apos;t over. It&apos;s just getting powerful.&rdquo;</p>
            </section>

            {/* Investing in Resilience */}
            <section className={styles.introSection}>
                <div className={styles.textContainer}>
                    <h2 className={styles.sectionTitle}>Investing in <span className="text-gradient">Resilience</span></h2>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                        A Girl Defined by Rise Initiative presents a transformative investment in the adolescent girls of Kiburara and surrounding communities. We directly confront the interconnected crises of mental health, school dropouts, and economic barriers.
                    </p>
                </div>
            </section>

            {/* The Reality */}
            <section className={styles.realitySection}>
                <h2 className="heading-lg" style={{ textAlign: 'center', color: 'white' }}>The <span className="text-gradient">Reality</span> We Face</h2>
                <div className={styles.grid2}>
                    <div className={styles.statBox}>
                        <h3>78%</h3>
                        <p>report persistent trauma from poverty</p>
                    </div>
                    <div className={styles.statBox}>
                        <h3>4 in 10</h3>
                        <p>drop out before Form 4 due to pressure</p>
                    </div>
                    <div className={styles.statBox}>
                        <h3>#1 Cause</h3>
                        <p>of permanent dropout is teenage pregnancy</p>
                    </div>
                </div>
            </section>

            {/* The Four Pillars Framework */}
            <section className={styles.pillarsSection}>
                <h2 className="heading-lg" style={{ textAlign: 'center' }}>The <span className="text-gradient">Four Pillars</span> Framework</h2>
                <div className={styles.grid4}>
                    {PILLARS.map((pillar) => (
                        <div key={pillar.id} className={styles.pillarCard}>
                            <div className={styles.pillarIcon}>{pillar.number}</div>
                            <span className={styles.pillarSubtitle}>{pillar.subtitle}</span>
                            <h3>{pillar.title}</h3>
                            <ul>
                                {pillar.items.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                            <Link href={pillar.linkTo} className="text-gradient" style={{ fontWeight: '700', textDecoration: 'none', display: 'inline-block', marginTop: '2rem' }}>
                                Learn More →
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Core Programs Detailed */}
            <section className={styles.corePrograms}>
                <h2 className="heading-lg" style={{ textAlign: 'center' }}>Direct <span className="text-gradient">Interventions</span></h2>
                <div className={styles.programsGrid}>
                    {loading ? (
                        <div style={{ textAlign: 'center', width: '100%', padding: '4rem' }}>Loading programs...</div>
                    ) : (
                        displayPrograms.map((program) => (
                            <div key={program.id} className={styles.programCard}>
                                <h3 className="serif">{program.title}</h3>
                                <p style={{ marginBottom: '2rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>{program.description}</p>
                                <Link
                                    href={program.id.startsWith('new-') ? '/programs' : `/programs/${program.id}`}
                                    className="btn-outline"
                                    style={{ padding: '0.8rem 1.5rem', fontSize: '0.8rem' }}
                                >
                                    Read Deeply
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Measuring Transformation */}
            <section className={styles.outcomesSection}>
                <h2 className="heading-lg" style={{ textAlign: 'center' }}>Measuring <span className="text-gradient">Transformation</span></h2>
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
                            <tr><td>Psychological Resilience</td><td>2.1 / 5</td><td>4.2 / 5</td></tr>
                            <tr><td>School Retention Rate</td><td>62%</td><td>92%</td></tr>
                            <tr><td>Early Pregnancy Rate</td><td>28%</td><td>&lt;10%</td></tr>
                            <tr><td>Transition to Higher Ed</td><td>18%</td><td>65%</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Why This Matters / CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                  <h2 className="heading-lg" style={{ color: 'white' }}>Join This <span style={{ color: 'var(--color-lightblue)' }}>Investment</span></h2>
                  <p style={{ opacity: '0.8', fontSize: '1.4rem' }}>
                      This is not charity. This is strategic community transformation.<br />
                      For every girl who rises, 3 family members are lifted from poverty.
                  </p>
                  <div className={styles.actionGrid}>
                      <div className={styles.actionBox}>
                          <h3>Fund The Journey</h3>
                          <p>Support our comprehensive 2-year implementation plan.</p>
                          <Link href="/pay" className={styles.btnPrimary}>Donate Now</Link>
                      </div>
                      <div className={styles.actionBox}>
                          <h3>Partner With Us</h3>
                          <p>Bring your organization&apos;s resources to scale our impact.</p>
                          <Link href="/contact" className={styles.btnSecondary}>Contact Us</Link>
                      </div>
                  </div>
                </div>
            </section>
        </div>
    );
}
