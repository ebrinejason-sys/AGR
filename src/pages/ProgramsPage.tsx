import { Link } from 'react-router-dom';
import styles from './ProgramsPage.module.css';
import ProgramsListClient from '@/components/ProgramsListClient';
import PageHeader from '@/components/layout/PageHeader';

const PILLARS = [
    { number: '01', title: 'Healing the Ground', subtitle: 'Mental Health & Trauma Recovery', quote: '"You cannot climb when you are bleeding."' },
    { number: '02', title: 'Building the Ladder', subtitle: 'Practical Skills for Self-Sufficiency', quote: '"You cannot rise without rungs to hold."' },
    { number: '03', title: 'Reaching New Altitudes', subtitle: 'Leadership & Legacy', quote: '"Rising is not the destination. Reaching back is."' },
    { number: '04', title: 'Knowing Your Rights', subtitle: 'Legal Advocacy & Protection', quote: '"Your Rights. Your Power. Your Protection."' },
];

export default function ProgramsPage() {
    return (
        <div className={styles.container}>
            <PageHeader 
                title="Our Core Programs" 
                subtitle="Long-term support that helps girls stay safe, stay in school, and build for the future."
            />
            <section className={styles.programsSection}><ProgramsListClient /></section>
            <section className={styles.pillarsSection}>
                <div className={styles.pillarsWrapper}>
                    <div className={styles.pillarsIntro}>
                        <p className={`subheading ${styles.pillarsEyebrow}`}>Our Framework</p>
                        <h2 className={`heading-section ${styles.pillarsHeading}`}>Four <span className="text-gradient">Pillars</span> of Rise</h2>
                        <p className={styles.pillarsDescription}>The framework behind how we support girls, families, and schools.</p>
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
                    <div className={styles.pillarsFooter}><Link to="/legal-advocacy" className={styles.pillarsLink}>Explore Legal Advocacy (Pillar 4) →</Link></div>
                </div>
            </section>
            <section className={styles.realityBanner}>
                <h2 className={`heading-section ${styles.impactHeading}`}>The <span className="text-gradient">Impact</span> in Numbers</h2>
                <div className={styles.bannerStats}>
                    <div className={styles.bannerStatItem}><h3>800+</h3><p>Girls Directly Reached</p></div>
                    <div className={styles.bannerStatItem}><h3>92%</h3><p>School Retention Rate</p></div>
                    <div className={styles.bannerStatItem}><h3>42</h3><p>Peer Counsellors Trained</p></div>
                    <div className={styles.bannerStatItem}><h3>15</h3><p>Rise Rooms Established</p></div>
                </div>
            </section>
            <section className={styles.ctaEditorial}>
                <h2 className="heading-section">Invest in a <span className={styles.ctaAccent}>Girl&apos;s Future</span></h2>
                <p className={styles.ctaCopy}>Your support helps fund practical care, school retention, and pathways for girls to lead with confidence.</p>
                <div className={styles.ctaActions}>
                    <Link to="/donate" className={`btn-premium ${styles.ctaPrimary}`}><span>Donate</span></Link>
                    <Link to="/contact" className={`btn-premium ${styles.ctaSecondary}`}><span>Partner with us</span></Link>
                </div>
            </section>
        </div>
    );
}
