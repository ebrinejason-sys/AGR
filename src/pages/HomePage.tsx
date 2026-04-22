import { lazy, Suspense, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Home, BookOpen, Scale } from 'lucide-react';
import styles from './HomePage.module.css';
import AnimatedCounter from '@/components/AnimatedCounter';

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
        desc: 'Trusted spaces and school-linked support points where girls find guidance.',
        color: 'Purple',
        continuous: false,
    },
    {
        label: '4 in 10 girls',
        value: 4,
        suffix: ' in 10',
        desc: '4 in 10 girls in Uganda drop out before completing secondary school — we fight this.',
        color: 'Teal',
        continuous: false,
    },
] as const;

const programCards = [
    {
        title: 'Rise Sanctuaries',
        number: '01',
        description: 'School-linked safe spaces where girls access counselling, peer support, and trusted adult follow-up.',
        href: '/programs/rise-rooms',
        Icon: Home,
        color: 'Pink',
    },
    {
        title: 'Education Support',
        number: '02',
        description: 'School retention support, scholastic materials, and practical help that keeps girls learning with dignity.',
        href: '/programs/academic-rescue',
        Icon: BookOpen,
        color: 'Purple',
    },
    {
        title: 'Legal Advocacy',
        number: '03',
        description: 'Rights awareness, case management, and direct advocacy when girls face abuse, neglect, or exclusion.',
        href: '/legal-advocacy',
        Icon: Scale,
        color: 'Teal',
    },
    {
        title: 'Rise Brothers',
        number: '04',
        description: 'Engaging boys to understand what girls face, manage their own emotions, and become active allies.',
        href: '/programs/rise-brothers',
        Icon: Users,
        color: 'Yellow',
    },
] as const;

const ROTATING_WORDS = ['Safe.', 'Heard.', 'Educated.', 'Empowered.', 'Rising.'];

const TICKER_ITEMS = [
    '🎓 Education', '🛡️ Safety', '⚖️ Legal Advocacy', '👥 Community',
    '💡 Mentorship', '🌍 Empowerment', '📚 School Retention', '❤️ Trauma Recovery',
    '🤝 Partnerships', '🏡 Safe Spaces', '✊ Rights Awareness', '🌱 Growth',
];

const MARQUEE_IMAGES_A = [
    '/images/agr-photo-1.jpg',
    '/images/agr-photo-2.jpg',
    '/images/agr-photo-3.jpg',
    '/images/agr-photo-4.jpg',
    '/images/about-us.jpg',
    '/images/worthy-dream.jpg',
    '/images/program-3.jpg',
    '/images/founder.jpg',
];

const MARQUEE_IMAGES_B = [...MARQUEE_IMAGES_A].reverse();

export default function HomePage() {
    const [wordIndex, setWordIndex] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsExiting(true);
            setTimeout(() => {
                setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
                setIsExiting(false);
            }, 400);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.container}>

            {/* ─── Hero Section ─── */}
            <section className={styles.heroSection}>
                <div className={styles.heroBg} />
                <div className={styles.heroInner}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroEyebrow}>
                            <span className={styles.heroDot} />
                            Uganda's Girl-Led Movement
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

                    {/* Floating stat chips */}
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

            {/* ─── Tag Ticker (Zavora-style) ─── */}
            <section className={styles.tickerSection}>
                <div className={styles.tickerTrack}>
                    {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                        <span key={i} className={styles.tickerItem}>
                            {item} <span className={styles.tickerDot}>·</span>
                        </span>
                    ))}
                </div>
            </section>

            {/* ─── Impact Stats ─── */}
            <section className={styles.statsSection}>
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

            {/* ─── Dual-row Community Marquee (Zavora style) ─── */}
            <section className={styles.marqueeSection}>
                <div className={styles.marqueeOverlayLeft} />
                <div className={styles.marqueeOverlayRight} />
                {/* Row 1 — scrolls left */}
                <div className={styles.marqueeRow}>
                    <div className={styles.marqueeTrackForward}>
                        {[...MARQUEE_IMAGES_A, ...MARQUEE_IMAGES_A].map((src, i) => (
                            <div key={i} className={styles.marqueeItem}>
                                <img src={src} alt="AGR community" className={styles.marqueeImage} loading="lazy" />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Row 2 — scrolls right */}
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

            {/* ─── Floating Program Cards (Zavora style) ─── */}
            <section className={styles.pathwaysSection}>
                <div className={styles.secHeader}>
                    <span className={styles.secEyebrow}>Core Pathways</span>
                    <h2 className={styles.secTitle}>
                        Four pillars of <span className="text-gradient">lasting change</span>.
                    </h2>
                    <p className={styles.secDesc}>
                        Strategic areas that address the root causes of school dropout and gender inequality.
                    </p>
                </div>
                <div className={styles.pathwaysGrid}>
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

            {/* ─── Founder Quote ─── */}
            <section className={styles.quoteSection}>
                <div className={styles.quoteContent}>
                    <span className={styles.quoteDecor}>"</span>
                    <p className={styles.quoteText}>
                        My parents broke the cycle so I could rise. Now I spend my life proving that
                        your beginning does not define your becoming.
                    </p>
                    <div className={styles.quoteAuthor}>
                        <img src="/images/founder.jpg" alt="Akatwijuka Grace" className={styles.quoteAvatar} />
                        <div>
                            <span className={styles.authorName}>Akatwijuka Grace</span>
                            <span className={styles.authorTitle}>Founder · African Girl Rise</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Final CTA ─── */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <span className={styles.ctaEyebrow}>Make a difference today</span>
                    <h2 className={styles.ctaTitle}>Ready to change a girl's life?</h2>
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
