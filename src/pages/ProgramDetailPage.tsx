import { lazy, Suspense, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { PROGRAM_DETAIL_MAP } from './programDetailData';
import type { SubSection, Section } from './programDetailData';
import styles from './ProgramDetailPage.module.css';
import PageHero from '../components/PageHero';

const DonationModal = lazy(() => import('@/components/DonationModal'));

function SubSectionCard({ sub }: { sub: SubSection }) {
    return (
        <div className={styles.subsectionCard}>
            {sub.title && <h4 className={styles.subsectionTitle}>{sub.title}</h4>}
            {sub.quote && <p className={styles.subsectionQuote}>&ldquo;{sub.quote}&rdquo;</p>}
            {sub.paragraphs?.map((p: string, i: number) => <p key={i} className={styles.subsectionParagraph}>{p}</p>)}
            {sub.bullets && (
                <ul className={styles.bulletList}>
                    {sub.bullets.map((b: string, i: number) => <li key={i}>{b}</li>)}
                </ul>
            )}
            {sub.impact && (
                <div className={styles.impactChipRow}>
                    {sub.impact.map((imp, i) => (
                        <span key={i} className={styles.impactChip}>
                            {imp}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ProgramDetailPage() {
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    const { id } = useParams<{ id: string }>();
    const detail = id ? PROGRAM_DETAIL_MAP[id] : null;

    if (!detail) {
        return (
            <div className={`${styles.container} ${styles.notFoundState}`}>
                <h2 className="heading-section">Program not found</h2>
                <Link to="/programs" className={`btn-premium ${styles.notFoundAction}`}>Back to Programs</Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <PageHero
                eyebrow={
                    <span className={`${styles.typeBadge} ${detail.type === 'pillar' ? styles.badgePillar : styles.badgeProgram}`}>
                        {detail.type === 'pillar' ? 'Core Pillar' : 'Core Program'}
                    </span>
                }
                title={<span className="text-gradient">{detail.title}</span>}
                description={detail.heroSubtitle}
            />

            {detail.philosophy && (
                <section className={styles.philosophySection}>
                    <div className={styles.quoteBlock}>
                        <p className={styles.quoteText}>&ldquo;{detail.philosophy.quote}&rdquo;</p>
                    </div>
                    <div className={styles.philosophyParagraphs}>
                        {detail.philosophy.paragraphs.map((p: string, i: number) => <p key={i}>{p}</p>)}
                    </div>
                </section>
            )}

            {detail.sections.map((section: Section, i: number) => (
                <section key={i} className={styles.section}>
                    <h3 className={styles.sectionTitle}>{section.title}</h3>
                    {section.paragraphs?.map((p, j) => <p key={j} className={styles.sectionParagraph}>{p}</p>)}
                    {section.subsections && (
                        <div className={styles.subsectionsGrid}>
                            {section.subsections.map((sub, k) => <SubSectionCard key={k} sub={sub} />)}
                        </div>
                    )}
                </section>
            ))}

            {detail.impactTable && (
                <section className={styles.impactSection}>
                    <h3 className={styles.sectionTitle}>{detail.impactTable.title}</h3>
                    <div className={styles.impactTableWrapper}>
                        <table className={styles.impactTable}>
                            <thead>
                                <tr>
                                    <th>Before Rise</th>
                                    <th>After Rise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detail.impactTable.rows.map((row, i) => (
                                    <tr key={i}>
                                        <td>{row.before}</td>
                                        <td className={styles.impactAfter}>{row.after}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            <div className={styles.ctaRow}>
                <Link to="/programs" className={styles.btnBack}>
                    <ArrowLeft size={18} className={styles.inlineIconLeading} /> Back to Programs
                </Link>
                <button className="btn-premium" onClick={() => setIsDonationModalOpen(true)}>
                    Support This Program <Heart size={18} className={styles.inlineIconTrailing} />
                </button>
            </div>

            {isDonationModalOpen && (
                <Suspense fallback={null}>
                    <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
                </Suspense>
            )}
        </div>
    );
}
