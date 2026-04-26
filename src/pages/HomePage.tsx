import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Heart, Home, Scale, ShieldCheck, Sparkles, Users } from 'lucide-react';
import styles from './HomePage.module.css';
import AnimatedCounter from '@/components/AnimatedCounter';

const DonationModal = lazy(() => import('@/components/DonationModal'));

const impactStats = [
    {
        label: 'Girls reached',
        value: 56000,
        suffix: '+',
        desc: 'Direct support delivered through local mentoring, school retention, and emergency response.',
        color: 'Pink',
        continuous: true,
    },
    {
        label: 'Safe spaces active',
        value: 12,
        suffix: '+',
        desc: 'Trusted, school-linked sanctuaries where girls can be heard, protected, and referred quickly.',
        color: 'Cyan',
        continuous: false,
    },
    {
        label: 'Girls at risk',
        value: 4,
        suffix: ' in 10',
        desc: 'Too many girls still leave school early. Our work is designed to interrupt that pattern.',
        color: 'Mono',
        continuous: false,
    },
] as const;

const programCards = [
    {
        title: 'Rise Sanctuaries',
        number: '01',
        description: 'School-linked safe spaces with trusted adults, emotional support, and practical follow-up.',
        href: '/programs/rise-rooms',
        Icon: Home,
        tone: 'pink',
    },
    {
        title: 'Education Support',
        number: '02',
        description: 'Retention support, materials, and interventions that keep girls learning with dignity.',
        href: '/programs/academic-rescue',
        Icon: BookOpen,
        tone: 'cyan',
    },
    {
        title: 'Legal Advocacy',
        number: '03',
        description: 'Rights awareness, case response, and direct advocacy when safety and access are under threat.',
        href: '/legal-advocacy',
        Icon: Scale,
        tone: 'mono',
    },
    {
        title: 'Rise Brothers',
        number: '04',
        description: 'Boys and young men learning empathy, accountability, and practical allyship.',
        href: '/programs/rise-brothers',
        Icon: Users,
        tone: 'pink',
    },
] as const;

const trustStrip = [
    'Girl-led responses',
    'School retention',
    'Community advocacy',
    'Protection pathways',
    'Emergency support',
    'Mentorship that lasts',
];

const principleCards = [
    {
        title: 'Fast response, local trust',
        description: 'Support begins where girls already are: schools, homes, and communities that know their realities.',
        Icon: ShieldCheck,
    },
    {
        title: 'Prevention with dignity',
        description: 'We do not wait for crisis alone. We build belonging, confidence, and long-term protection around each girl.',
        Icon: Sparkles,
    },
];

const ROTATING_WORDS = ['safe', 'seen', 'in school', 'protected', 'rising'];

export default function HomePage() {
    const [wordIndex, setWordIndex] = useState(0);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setWordIndex((index) => (index + 1) % ROTATING_WORDS.length);
        }, 2600);

        return () => window.clearInterval(interval);
    }, []);

    return (
        <div className={styles.page}>
            <section className={styles.heroSection}>
                <div className={styles.heroGlowPink} />
                <div className={styles.heroGlowCyan} />

                <div className={styles.heroGrid}>
                    <div className={styles.heroCopy}>
                        <div className={styles.heroEyebrow}>African Girl Rise | Uganda</div>
                        <h1 className={styles.heroTitle}>
                            Help girls stay
                            <span className={styles.heroWord}> {ROTATING_WORDS[wordIndex]}.</span>
                        </h1>
                        <p className={styles.heroText}>
                            We design local, practical support systems that help girls remain safe, remain visible, and remain in school.
                        </p>

                        <div className={styles.heroActions}>
                            <button type="button" className="btn-premium" onClick={() => setIsDonationModalOpen(true)}>
                                Support Her Rise <Heart size={18} />
                            </button>
                            <Link to="/programs" className="btn-glass">
                                Explore Programs <ArrowRight size={18} />
                            </Link>
                        </div>

                        <div className={styles.heroMetaRow}>
                            <div className={styles.heroMetaCard}>
                                <span className={styles.heroMetaValue}>56K+</span>
                                <span className={styles.heroMetaLabel}>girls reached through school and community support</span>
                            </div>
                            <div className={styles.heroMetaCard}>
                                <span className={styles.heroMetaValue}>12+</span>
                                <span className={styles.heroMetaLabel}>active sanctuaries and support points</span>
                            </div>
                        </div>
                    </div>

                    <aside className={styles.heroPanel}>
                        <div className={styles.heroPanelTop}>
                            <span className={styles.panelLabel}>Field snapshot</span>
                            <span className={styles.panelBadge}>Girl-led, community-rooted</span>
                        </div>

                        <img src="/images/agr-photo-2.jpg" alt="African Girl Rise community gathering" className={styles.heroImage} />

                        <div className={styles.heroPanelBody}>
                            <h2 className={styles.heroPanelTitle}>A modern protection network for girls who cannot afford to be missed.</h2>
                            <p className={styles.heroPanelText}>
                                African Girl Rise combines safety, education, legal advocacy, and community accountability into one responsive system.
                            </p>
                        </div>
                    </aside>
                </div>
            </section>

            <section className={styles.stripSection}>
                <div className={styles.stripTrack}>
                    {[...trustStrip, ...trustStrip].map((item, index) => (
                        <span key={`${item}-${index}`} className={styles.stripItem}>
                            {item}
                        </span>
                    ))}
                </div>
            </section>

            <section className={styles.proofSection}>
                <div className={styles.sectionIntro}>
                    <span className="subheading">What moves the work</span>
                    <h2 className="heading-section">A sharper model for real, local protection.</h2>
                    <p className={styles.sectionText}>
                        The site now speaks more clearly to donors, partners, and volunteers: what the organisation does, why it matters, and how support becomes action.
                    </p>
                </div>

                <div className={styles.proofGrid}>
                    {principleCards.map(({ title, description, Icon }) => (
                        <article key={title} className={styles.principleCard}>
                            <div className={styles.principleIcon}><Icon size={20} /></div>
                            <h3>{title}</h3>
                            <p>{description}</p>
                        </article>
                    ))}
                    <article className={styles.storyCard}>
                        <span className={styles.storyLabel}>Why it matters</span>
                        <p className={styles.storyQuote}>
                            “Your beginning does not define your becoming.”
                        </p>
                        <Link to="/founder" className={styles.storyLink}>
                            Meet the founder <ArrowRight size={16} />
                        </Link>
                    </article>
                </div>
            </section>

            <section className={styles.statsSection}>
                <div className={styles.sectionIntroRow}>
                    <div>
                        <span className="subheading">Impact</span>
                        <h2 className="heading-section">Numbers with consequence.</h2>
                    </div>
                    <p className={styles.sectionTextCompact}>
                        Every figure represents girls who stayed in class, found support, or accessed advocacy when it counted.
                    </p>
                </div>

                <div className={styles.statsGrid}>
                    {impactStats.map((stat) => (
                        <article key={stat.label} className={`${styles.statCard} ${styles[`statCard${stat.color}`]}`}>
                            <span className={styles.statValue}>
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} continuous={stat.continuous} />
                            </span>
                            <h3 className={styles.statLabel}>{stat.label}</h3>
                            <p className={styles.statDescription}>{stat.desc}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className={styles.programsSection}>
                <div className={styles.sectionIntroRow}>
                    <div>
                        <span className="subheading">Programs</span>
                        <h2 className="heading-section">Four pathways. One clear mission.</h2>
                    </div>
                    <Link to="/programs" className={styles.inlineAction}>
                        View all programs <ArrowRight size={16} />
                    </Link>
                </div>

                <div className={styles.programGrid}>
                    {programCards.map(({ title, number, description, href, Icon, tone }) => (
                        <Link key={title} to={href} className={`${styles.programCard} ${styles[`programCard${tone}`]}`}>
                            <div className={styles.programHeader}>
                                <span className={styles.programNumber}>{number}</span>
                                <span className={styles.programIcon}><Icon size={20} /></span>
                            </div>
                            <h3 className={styles.programTitle}>{title}</h3>
                            <p className={styles.programDescription}>{description}</p>
                            <span className={styles.programLink}>Explore <ArrowRight size={16} /></span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className={styles.featureSection}>
                <div className={styles.featureMedia}>
                    <img src="/images/founder.jpg" alt="Founder of African Girl Rise" className={styles.featureImage} />
                </div>
                <div className={styles.featureCopy}>
                    <span className="subheading">Built for trust</span>
                    <h2 className="heading-section">Professional enough for partners. Human enough for the girls we serve.</h2>
                    <p className={styles.sectionText}>
                        The refreshed direction uses strong contrast, clearer hierarchy, and original component patterns inspired by modern 21st-style interfaces without depending on external generated snippets.
                    </p>
                    <div className={styles.featureList}>
                        <div className={styles.featureItem}>Clear calls to action for donors, mentors, and partners</div>
                        <div className={styles.featureItem}>Readable typography and visible contrast in both light and dark mode</div>
                        <div className={styles.featureItem}>A stronger public-facing story anchored in safety, education, and advocacy</div>
                    </div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className={styles.ctaCard}>
                    <div>
                        <span className="subheading">Take action</span>
                        <h2 className={styles.ctaTitle}>Fund the next safe space, school return, or emergency intervention.</h2>
                        <p className={styles.ctaText}>
                            Your support can move directly into fees, materials, referrals, response, and the daily work of making girls harder to ignore.
                        </p>
                    </div>
                    <div className={styles.ctaActions}>
                        <button type="button" className="btn-premium" onClick={() => setIsDonationModalOpen(true)}>
                            Donate now <Heart size={18} />
                        </button>
                        <Link to="/contact/partner" className="btn-glass">Partner with us</Link>
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
