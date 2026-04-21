import { Link } from 'react-router-dom';
import styles from './ProgramsPage.module.css';
import ProgramsListClient from '@/components/ProgramsListClient';

const PILLARS = [
    { number: '01', title: 'Healing the Ground', subtitle: 'Mental Health & Trauma', quote: '"You cannot climb when you are bleeding."' },
    { number: '02', title: 'Building the Ladder', subtitle: 'Practical Skills', quote: '"You cannot rise without rungs to hold."' },
    { number: '03', title: 'Reaching New Altitudes', subtitle: 'Leadership & Legacy', quote: '"Rising is not the destination. Reaching back is."' },
    { number: '04', title: 'Knowing Your Rights', subtitle: 'Legal Advocacy', quote: '"Your Rights. Your Power. Your Protection."' },
];

export default function ProgramsPage() {
    return (
        <div className={styles.container}>
            
            {/* ─── Hero Section ─── */}
            <section className={styles.programsSection} style={{ paddingTop: '160px' }}>
                <div className={styles.programsWrapper}>
                    <span className="subheading">Our Impact</span>
                    <h1 className="heading-display">Programs That <span className="text-gradient">Transform</span></h1>
                    <p className={styles.sectionIntroCopy} style={{ maxWidth: '800px' }}>
                        Long-term support that helps girls stay safe, stay in school, and build for the future. Each program responds to a barrier that places girls at risk.
                    </p>
                </div>
            </section>

            {/* ─── Main Program List ─── */}
            <section className={styles.programsSection}>
                <ProgramsListClient />
            </section>

            {/* ─── Pillars Section ─── */}
            <section className={styles.pillarsSection}>
                <div className={styles.pillarsWrapper}>
                    <div className={styles.pillarsIntro}>
                        <span className="subheading">Our Framework</span>
                        <h2 className="heading-section">Four <span className="text-gradient">Pillars</span> of Rise</h2>
                        <p className={styles.pillarsDescription}>The strategic framework behind how we support girls, families, and schools.</p>
                    </div>
                    <div className={styles.pillarsGrid}>
                        {PILLARS.map(p => (
                            <div key={p.number} className={styles.pillarItem}>
                                <span className={styles.pillarItemNumber}>{p.number}</span>
                                <h3 className={styles.pillarItemTitle}>{p.title}</h3>
                                <p className={styles.pillarItemSubtitle}>{p.subtitle}</p>
                                <p className={styles.pillarItemQuote}>{p.quote}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Stats Banner ─── */}
            <section className={styles.realityBanner}>
                <h2 className="heading-section">The <span className="text-gradient">Impact</span> in Numbers</h2>
                <div className={styles.bannerStats}>
                    <div className={styles.bannerStatItem}><h3>800+</h3><p>Girls Reached</p></div>
                    <div className={styles.bannerStatItem}><h3>92%</h3><p>Retention Rate</p></div>
                    <div className={styles.bannerStatItem}><h3>15</h3><p>Rise Rooms</p></div>
                    <div className={styles.bannerStatItem}><h3>42</h3><p>Peer Counsellors</p></div>
                </div>
            </section>

            {/* ─── Final CTA ─── */}
            <section className={styles.ctaEditorial}>
                <h2 className="heading-section">Invest in a Girl&apos;s Future</h2>
                <p className={styles.ctaCopy}>Your support helps fund practical care and pathways for girls to lead with confidence.</p>
                <div className={styles.ctaActions}>
                    <Link to="/contact" className="btn-white">Support a Girl</Link>
                    <Link to="/contact" className="btn-glass" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>Partner With Us</Link>
                </div>
            </section>

        </div>
    );
}
