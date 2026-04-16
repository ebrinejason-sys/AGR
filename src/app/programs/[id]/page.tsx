import Link from 'next/link';
import { PROGRAM_DETAIL_MAP } from '../programDetailData';
import type { SubSection, Section } from '../programDetailData';
import styles from '../programDetail.module.css';

function SubSectionCard({ sub }: { sub: SubSection }) {
    if (!sub.title && sub.paragraphs?.length === 1 && !sub.bullets && !sub.impact) {
        return <p className={styles.sectionParagraph}>{sub.paragraphs[0]}</p>;
    }

    return (
        <div className={styles.subsectionCard}>
            {sub.title && <h4 className={styles.subsectionTitle}>{sub.title}</h4>}
            {sub.quote && <p className={styles.subsectionQuote}>&ldquo;{sub.quote}&rdquo;</p>}
            {sub.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
            {sub.bullets && (
                <ul className={styles.bulletList}>
                    {sub.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
            )}
            {sub.checkmarks && (
                <ul className={styles.checkmarkList}>
                    {sub.checkmarks.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
            )}
            {sub.impact && sub.impact.length > 0 && (
                <div className={styles.impactBadges}>
                    {sub.impact.map((imp, i) => (
                        <span key={i} className={styles.impactBadge}>{imp}</span>
                    ))}
                </div>
            )}
        </div>
    );
}

function ContentSection({ section }: { section: Section }) {
    return (
        <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{section.title}</h3>
            {section.paragraphs?.map((p, i) => (
                <p key={i} className={styles.sectionParagraph}>{p}</p>
            ))}
            {section.bullets && (
                <ul className={styles.bulletList}>
                    {section.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
            )}
            {section.checkmarks && (
                <ul className={styles.checkmarkList}>
                    {section.checkmarks.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
            )}
            {section.subsections && section.subsections.length > 0 && (
                <div className={styles.subsectionsGrid}>
                    {section.subsections.map((sub, i) => (
                        <SubSectionCard key={i} sub={sub} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default async function ProgramDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const detail = PROGRAM_DETAIL_MAP[id];

    if (!detail) {
        return (
            <div className={`${styles.container} ${styles.notFoundState}`}>
                <div className={styles.notFoundInner}>
                    <h2>Program not found</h2>
                    <Link href="/programs" className={`${styles.btnBack} ${styles.notFoundBack}`}>← Back to Programs</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Hero */}
            <section className={styles.hero}>
                <span className={`${styles.typeBadge} ${detail.type === 'pillar' ? styles.badgePillar : styles.badgeProgram}`}>
                    {detail.type === 'pillar' ? 'Core Pillar' : 'Core Program'}
                </span>
                <h1 className="heading-xl">
                    <span className="text-gradient">{detail.title}</span>
                </h1>
                <p className={styles.heroSubtitle}>{detail.heroSubtitle}</p>
            </section>

            {/* Philosophy */}
            {detail.philosophy && (
                <section className={styles.philosophySection}>
                    <div className={styles.quoteBlock}>
                        <p className={styles.quoteText}>&ldquo;{detail.philosophy.quote}&rdquo;</p>
                    </div>
                    <div className={styles.philosophyParagraphs}>
                        {detail.philosophy.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                </section>
            )}

            {/* Content Sections */}
            {detail.sections.map((section, i) => (
                <ContentSection key={i} section={section} />
            ))}

            {/* Impact Table */}
            {detail.impactTable && (
                <section className={styles.impactSection}>
                    <h3 className={styles.impactTitle}>{detail.impactTable.title}</h3>
                    <div className={styles.impactTableWrapper}>
                        <table className={styles.impactTable}>
                            <thead>
                                <tr>
                                    <th>Before</th>
                                    <th>After</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detail.impactTable.rows.map((row, i) => (
                                    <tr key={i}>
                                        <td>{row.before}</td>
                                        <td>{row.after}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* By the Numbers */}
            {detail.byTheNumbers && detail.byTheNumbers.length > 0 && (
                <section className={styles.statsSection}>
                    <div className={styles.statsContainer}>
                        <h3 className={styles.statsTitle}>By the Numbers</h3>
                        <div className={styles.statsGrid}>
                            {detail.byTheNumbers.map((stat, i) => (
                                <div key={i} className={styles.statCard}>
                                    <p>✅ {stat}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Story */}
            {detail.story && (
                <section className={styles.storySection}>
                    <div className={styles.storyCard}>
                        <h3 className={styles.storyTitle}>{detail.story.title}</h3>
                        {detail.story.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                </section>
            )}

            {/* Donation Tiers */}
            {detail.donationTiers && detail.donationTiers.length > 0 && (
                <section className={styles.donationSection}>
                    <h3 className={styles.donationTitle}>How You Can Help</h3>
                    <div className={styles.donationGrid}>
                        {detail.donationTiers.map((tier, i) => (
                            <div key={i} className={styles.donationCard}>
                                <span className={styles.donationAmount}>{tier.amount}</span>
                                <span className={styles.donationDesc}>{tier.description}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Closing */}
            {detail.closing && detail.closing.length > 0 && (
                <section className={styles.closingSection}>
                    {detail.closing.map((line, i) => (
                        <p key={i} className={styles.closingText}>{line}</p>
                    ))}
                </section>
            )}

            {/* CTA Buttons */}
            <div className={styles.ctaRow}>
                <Link href="/programs" className={styles.btnBack}>← Back to Programs</Link>
                <Link href="/donate" className={styles.btnDonate}>Support This {detail.type === 'pillar' ? 'Pillar' : 'Program'}</Link>
            </div>
        </div>
    );
}
