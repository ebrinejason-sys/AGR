import { Link } from 'react-router-dom';
import { Shield, Scale, Info, Users, Book, ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import styles from './LegalAdvocacyPage.module.css';

const INITIATIVES = [
    {
        number: '01',
        title: 'Legal Literacy Workshops',
        icon: <Book size={24} />,
        description: 'We teach girls and women about their basic legal rights in simple, accessible language — using local languages and real-life scenarios.',
        items: [
            'Defilement law and age of consent',
            'Education rights and protection from forced marriage',
            'Reporting mechanisms and safety planning',
        ],
    },
    {
        number: '02',
        title: 'Legal Referral Network',
        icon: <Users size={24} />,
        description: 'We connect girls and women to the people who can enforce those rights, from probation officers to legal aid organizations.',
        items: [
            'Police Child & Family Protection Units',
            'Legal Aid & Pro-Bono services',
            'Social Welfare & Probation Officers',
        ],
    },
    {
        number: '03',
        title: 'Domestic Violence Support',
        icon: <Shield size={24} />,
        description: 'For women experiencing violence, we provide comprehensive, compassionate support through every step of recovery and justice.',
        items: [
            'Safe sharing spaces and safety planning',
            'Legal guidance and protection orders',
            'Court accompaniment and advocacy',
        ],
    },
];

export default function LegalAdvocacyPage() {
    return (
        <div className={styles.container}>
            
            {/* ─── Hero Section (PageHero) ─── */}
            <PageHero
                eyebrow={<span className="subheading">Protection & Justice</span>}
                title={<>Knowing Your <span className="text-gradient">Rights</span></>}
                description={
                    <>
                        <span>Your Rights. Your Power. Your Protection.</span><br />
                        <span>No girl should suffer in silence. No woman should be abused without recourse.</span>
                    </>
                }
            />

            {/* ─── The Reality Section ─── */}
            <section className={styles.editorialIntro}>
                <div className={styles.introContainer}>
                    <div className={styles.introLeadWrap}>
                        <span className="subheading">The Reality</span>
                        <h2 className="heading-section">A Silence <span className="text-gradient">Broken</span></h2>
                        <p className={styles.introLead}>
                            In many communities, girls and women suffer abuse without knowing they have rights, or where to turn for help. Knowledge of the law is the first line of defense.
                        </p>
                    </div>

                    <div className={styles.premiumGrid}>
                        <div className={styles.truthCard}>
                            <Scale className={styles.truthIcon} style={{ color: 'var(--accent-pink)' }} />
                            <p><strong>Many girls do not know</strong> that defilement is a crime punishable by law.</p>
                        </div>
                        <div className={styles.truthCard}>
                            <Shield className={styles.truthIcon} style={{ color: 'var(--accent-purple)' }} />
                            <p><strong>Many women do not know</strong> that the law protects them from domestic violence.</p>
                        </div>
                        <div className={styles.truthCard}>
                            <Info className={styles.truthIcon} style={{ color: 'var(--accent-teal)' }} />
                            <p><strong>Many families do not know</strong> that forcing a girl into marriage is illegal in Uganda.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Initiatives ─── */}
            <section className={styles.editorialBody}>
                <div className={`${styles.sectionIntro} ${styles.sectionIntroMargin}`}>
                    <span className="subheading">Our Strategy</span>
                    <h2 className="heading-section">Legal Literacy & <span className="text-gradient">Empowerment</span></h2>
                </div>

                {INITIATIVES.map(init => (
                    <div key={init.number} className={styles.advocacyBox}>
                        <div className={styles.initiativeHeader}>
                            <div className={styles.initiativeIcon}>{init.icon}</div>
                            <span className={`subheading ${styles.initiativeSubheading}`}>Initiative {init.number}</span>
                        </div>
                        <h3>{init.title}</h3>
                        <p>{init.description}</p>
                        <ul className={styles.initiativeList}>
                            {init.items.map((item, i) => (
                                <li key={i} className={styles.initiativeListItem}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className={styles.benefitGrid}>
                    <div className={styles.benefitCard}>
                        <span>OUTCOME 01</span>
                        <p>Girls who can identify and reject abuse, knowing exactly where to go for help.</p>
                    </div>
                    <div className={styles.benefitCard}>
                        <span>OUTCOME 02</span>
                        <p>Women who gain the structural knowledge to live free from violence.</p>
                    </div>
                    <div className={styles.benefitCard}>
                        <span>OUTCOME 03</span>
                        <p>Community-wide accountability where silence is no longer the default.</p>
                    </div>
                </div>
            </section>

            {/* ─── Founder Voice ─── */}
            <section className={styles.founderVoice}>
                <div className={styles.founderVoiceInner}>
                    <span className="subheading">The Vision</span>
                    <blockquote>
                        &ldquo;The system did not protect my friends. So I decided to become someone who would. I chose law because justice is not given — it is fought for.&rdquo;
                    </blockquote>
                    <p className={styles.attribution}>&mdash; Akatwijuka Grace, Founder</p>
                    <Link to="/founder" className="btn-premium">
                        Read Full Story <ArrowRight size={18} style={{ marginLeft: 8 }} />
                    </Link>
                </div>
            </section>

            {/* ─── Final CTA ─── */}
            <section className={styles.ctaBox}>
                <h2 className="heading-section">Advocate for <span className="text-gradient">Justice</span></h2>
                <p className={styles.heroSupportText} style={{ marginBottom: '3rem' }}>
                    Your contribution ensures that no girl in our community has to suffer in silence.
                </p>
                <div className={styles.ctaActions}>
                    <Link to="/contact" className="btn-premium">Support Legal Rights</Link>
                    <Link to="/contact" className="btn-glass" style={{ color: 'var(--text-primary)' }}>Contact Our Team</Link>
                </div>
            </section>

        </div>
    );
}
