import Link from 'next/link';
import styles from '../page.module.css';
import { CORE_PROGRAMS } from '../data';

export default async function ProgramPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const program = CORE_PROGRAMS.find(p => p.id === id);

    if (!program) {
        return (
            <div className={styles.container} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Program not found</h2>
                    <Link href="/programs" className={styles.btnSecondary} style={{ marginTop: '1rem', display: 'inline-block' }}>Back to Programs</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <section className={styles.hero} style={{ minHeight: '40vh' }}>
                <h1 className="heading-xl">{program.title}</h1>
                <p className={styles.subtitle}>Pillar {program.pillarNumber} Initiative</p>
            </section>

            <section className={styles.introSection} style={{ padding: '4rem 5%' }}>
                <div className={styles.textContainer} style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 className={styles.sectionTitle}>Overview</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.8' }}>
                        {program.description}
                    </p>

                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-pink)' }}>Program Details</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                        {program.fullDetails || program.description}
                    </p>

                    <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                        <Link href="/programs" className={styles.btnSecondary}>← Back to Programs</Link>
                        <Link href="/donate" className={styles.btnPrimary}>Support This Program</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
