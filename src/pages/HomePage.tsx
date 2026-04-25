import { lazy, Suspense, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Home, BookOpen, Scale } from 'lucide-react';
import styles from './HomePage.module.css';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useReveal } from '@/hooks/useReveal';

const DonationModal = lazy(() => import('@/components/DonationModal'));

const impactStats = [
    {
        label: 'Girls reached',
        value: 56000,
        suffix: '+',
        desc: 'Direct support delivered through outreach, mentoring, and education support.',
        color: 'Pink',
        continuous: true,
    },
    {
        label: 'Active sanctuaries',
        value: 12,
        suffix: '+',
        desc: 'Safe rooms equipped for emergency response, recovery, and hygiene support.',
        color: 'Purple',
        continuous: false,
    },
    {
        label: 'School retention',
        value: 94,
        suffix: '%',
        desc: 'Of girls in our core programs remain in school or return after intervention.',
        color: 'Teal',
        continuous: false,
    },
];

const programCards = [
    {
        number: '01',
        title: 'Education support',
        description: 'Keeping girls in school through school kit drives, vocational support, and advocacy for affordable learning.',
        Icon: BookOpen,
        color: 'Pink',
        href: '/programs',
    },
    {
        number: '02',
        title: 'Rise Sanctuaries',
        description: 'Emergency safe spaces providing hygiene kits, temporary shelter, and trauma-informed counseling.',
        Icon: Home,
        color: 'Purple',
        href: '/programs',
    },
    {
        number: '03',
        title: 'Rise Brothers',
        description: 'Engaging boys and men as allies in the fight against child marriage and gender-based violence.',
        Icon: Users,
        color: 'Teal',
        href: '/programs/rise-brothers',
    },
    {
        number: '04',
        title: 'Legal Advocacy',
        description: 'Providing representation and monitoring for cases of defilement and illegal early marriage.',
        Icon: Scale,
        color: 'Pink',
        href: '/legal-advocacy',
    },
];

const ROTATING_WORDS = ['Safe', 'In School', 'Rising', 'Empowered'];
const TICKER_ITEMS = [
    'EDUCATION FOR ALL',
    'SAFETY FIRST',
    'LEGAL ADVOCACY',
    'RISE SANCTUARIES',
    'MEN AS ALLIES',
    'IMPACT OVER INTENT',
];

const MARQUEE_IMAGES_A = [
    '/images/impact/impact-1.jpg',
    '/images/impact/impact-2.jpg',
    '/images/impact/impact-3.jpg',
    '/images/impact/impact-4.jpg',
    '/images/impact/impact-5.jpg',
];

const MARQUEE_IMAGES_B = [
    '/images/impact/impact-6.jpg',
    '/images/impact/impact-7.jpg',
    '/images/impact/impact-8.jpg',
    '/images/impact/impact-9.jpg',
    '/images/impact/impact-10.jpg',
];

export default function HomePage() {
    const [wordIndex, setWordIndex] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    const revealRef = useReveal();

    useEffect(() => {
        const interval = setInterval(() => {
            setIsExiting(true);
            setTimeout(() => {
                setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
                setIsExiting(false);
            }, 600);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.home} ref={revealRef}>
            {/* ─── Hero Section ─── */}
            <section className={styles.hero}>
                <div className={styles.heroInner}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroBadge}>
                            <span className={styles.heroBadgeDot} />
                            Active in 5 Districts Across Uganda
                        </div>
                        <h1 className={styles.heroHeading}>
                            <span className={styles.heroLine1}>Help girls stay</span>
                            <div className={styles.heroWordRow}>
                                <span className={`${styles.heroWordRotating} ${isExiting ? styles.wordExit : styles.wordEnter}`}>
                                    {ROTATING_WORDS[wordIndex]}
                                </span>
                            </div>
                        </h1>
                        <p className={styles.heroSubtext}>
                            Practical, local support that keeps girls safe and in school.
                            From trauma recovery to school retention — we build responses that work.
                        </p>
                        <div className={styles.heroActions}>
                            <button onClick={() => setIsDonationModalOpen(true)} className={styles.heroBtnPrimary}>
                                Support Her Rise <Heart size={18} />
                            </button>
                            <Link to="/programs" className={styles.heroBtnSecondary}>
                                Explore Programs <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>

                    <div className={styles.heroStats}>
                        <div className={styles.heroStatChip}>
                            <span className={styles.heroStatNum}>56K+</span>
                            <span className={styles.heroStatLabel}>Girls Reached</span>
                        </div>
                        <div className={styles.heroStatChip}>
                            <span className={styles.heroStatNum}>12+</span>
                            <span className={styles.heroStatLabel}>Rise Sanctuaries</span>
                        </div>
                        <div className={styles.heroStatChip}>
                            <span className={styles.heroStatNum}>4 in 10</span>
                            <span className={styles.heroStatLabel}>Need Our Help</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.tickerSection}>
                <div className={styles.tickerTrack}>
                    {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                        <span key={i} className={styles.tickerItem}>
                            {item} <span className={styles.tickerDot}>·</span>
                        </span>
                    ))}
                </div>
            </section>

            <section className={`${styles.statsSection} reveal`}>
                <div className={styles.statsSectionInner}>
                    <div className={styles.statsHeadRow}>
                        <span className={styles.statsEyebrow}>Our Impact</span>
                        <h2 className={styles.statsHeading}>Numbers that drive everything we do.</h2>
                    </div>
                    <div className={styles.statsGrid}>
                        {impactStats.map((stat) => (
                            <div key={stat.label} className={`${styles.statCard} ${styles[`statCard${stat.color}`]}`}>
                                <span className={`${styles.statValue} ${styles[`statValue${stat.color}`]}`}>
                                    <AnimatedCounter target={stat.value} suffix={stat.suffix} continuous={stat.continuous} />
                                </span>
                                <span className={styles.statLabel}>{stat.label}</span>
                                <p className={styles.statDesc}>{stat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={`${styles.marqueeSection} reveal`}>
                <div className={styles.marqueeOverlayLeft} />
                <div className={styles.marqueeOverlayRight} />
                <div className={styles.marqueeRow}>
                    <div className={styles.marqueeTrackForward}>
                        {[...MARQUEE_IMAGES_A, ...MARQUEE_IMAGES_A].map((src, i) => (
                            <div key={i} className={styles.marqueeItem}>
                                <img src={src} alt="AGR community" className={styles.marqueeImage} loading="lazy" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.marqueeRow}>
                    <div className={styles.marqueeTrackBackward}>
                        {[...MARQUEE_IMAGES_B, ...MARQUEE_IMAGES_B].map((src, i) => (
                            <div key={i} className={styles.marqueeItem}>
                                <img src={src} alt="AGR community" className={styles.marqueeImage} loading="lazy" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={`${styles.pathwaysSection} reveal`}>
                <div className={styles.secHeader}>
                    <span className={styles.secEyebrow}>Core Pathways</span>
                    <h2 className={styles.secTitle}>
                        Four pillars of <span className="text-gradient">lasting change</span>.
                    </h2>
                    <p className={styles.secDesc}>
                        Strategic areas that address the root causes of school dropout and gender inequality.
                    </p>
                </div>
                <div className={`${styles.pathwaysGrid} stagger-reveal`}>
                    {programCards.map((p) => {
                        const { Icon } = p;
                        return (
                            <Link
                                key={p.title}
                                to={p.href}
                                className={`${styles.pathwayCard} ${styles[`pathwayCard${p.color}`]}`}
                            >
                                <div className={styles.pathwayCardInner}>
                                    <span className={`${styles.pathwayNumber} ${styles[`pathwayNumber${p.color}`]}`}>
                                        {p.number}
                                    </span>
                                    <div className={`${styles.pathwayIcon} ${styles[`pathwayIcon${p.color}`]}`}>
                                        <Icon size={26} />
                                    </div>
                                    <h3 className={styles.pathwayTitle}>{p.title}</h3>
                                    <p className={styles.pathwayDesc}>{p.description}</p>
                                    <div className={`${styles.pathwayArrow} ${styles[`pathwayArrow${p.color}`]}`}>
                                        Explore <ArrowRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className={`${styles.quoteSection} reveal`}>
                <div className={styles.quoteContent}>
                    <span className={styles.quoteDecor}>"</span>
                    <p className={styles.quoteText}>
                        My parents broke the cycle so I could rise. Now I spend my life proving that
                        your beginning does not define your becoming.
                    </p>
                    <div className={styles.quoteAuthor}>
                        <div>
                            <span className={styles.authorName}>Akatwijuka Grace</span>
                            <span className={styles.authorTitle}>Founder · African Girl Rise</span>
                        </div>
                        <Link to="/founder" className={styles.founderStoryLink}>
                            Read Grace’s Full Story <ArrowRight size={16} style={{ marginLeft: 4 }} />
                        </Link>
                    </div>
                </div>
            </section>

            <section className={`${styles.ctaSection} reveal`}>
                <div className={styles.ctaContent}>
                    <span className={styles.ctaEyebrow}>Make a difference today</span>
                    <h2 className={styles.ctaTitle}>Ready to change a girl&apos;s life?</h2>
                    <p className={styles.ctaText}>
                        Your contribution funds school fees, emergency response, safe spaces, and protection for girls across Uganda.
                    </p>
                    <div className={styles.ctaActions}>
                        <button onClick={() => setIsDonationModalOpen(true)} className={styles.ctaBtnPrimary}>
                            Donate Now <Heart size={18} />
                        </button>
                        <Link to="/contact" className={styles.ctaBtnSecondary}>
                            Volunteer With Us
                        </Link>
                    </div>
                </div>
            </section>

            {isDonationModalOpen && (
                <Suspense fallback={null}>
                    <DonationModal
                        isOpen={isDonationModalOpen}
                        onClose={() => setIsDonationModalOpen(false)}
                    />
                </Suspense>
            )}
        </div>
    );
}
