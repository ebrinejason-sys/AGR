import { lazy, Suspense, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }
};

const staggerContainer = {
    initial: {},
    whileInView: {
        transition: {
            staggerChildren: 0.1
        }
    },
    viewport: { once: true, margin: "-100px" }
};

export default function HomePage() {
    const [wordIndex, setWordIndex] = useState(0);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.homeWrapper}>
            {/* ─── Hero Section ─── */}
            <section className={styles.heroSection}>
                <div className={styles.heroInner}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className={styles.heroContent}
                    >
                        <div className={styles.heroBadge}>
                            <span className={styles.badgePulse} />
                            African Girl Rise Ltd
                        </div>
                        <h1 className={styles.heroHeading}>
                            <span className={styles.heroLine1}>Help girls stay</span>
                            <div className={styles.heroWordRow}>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={ROTATING_WORDS[wordIndex]}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className={styles.heroWordRotating}
                                    >
                                        {ROTATING_WORDS[wordIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </h1>
                        <p className={styles.heroSubtext}>
                            Practical, local support that keeps girls safe and in school.
                            From trauma recovery to school retention — we build responses that work.
                        </p>
                        <div className={styles.heroActions}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsDonationModalOpen(true)}
                                className={styles.heroBtnPrimary}
                            >
                                Support Her Rise <Heart size={18} />
                            </motion.button>
                            <motion.div whileHover={{ x: 5 }}>
                                <Link to="/programs" className={styles.heroBtnSecondary}>
                                    Explore Programs <ArrowRight size={18} />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Floating stat chips */}
                    <div className={styles.heroStats}>
                        {[
                            { num: '56K+', label: 'Girls Reached' },
                            { num: '12+', label: 'Rise Sanctuaries' },
                            { num: '4 in 10', label: 'Need Our Help' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                                className={styles.heroStatChip}
                            >
                                <span className={styles.heroStatNum}>{stat.num}</span>
                                <span className={styles.heroStatLabel}>{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Tag Ticker ─── */}
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
            <motion.section
                {...staggerContainer}
                className={styles.statsSection}
            >
                <div className={styles.statsSectionInner}>
                    <motion.div {...fadeInUp} className={styles.statsHeadRow}>
                        <span className={styles.statsEyebrow}>Our Impact</span>
                        <h2 className={styles.statsHeading}>Numbers that drive everything we do.</h2>
                    </motion.div>
                    <div className={styles.statsGrid}>
                        {impactStats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                variants={{
                                    initial: { opacity: 0, y: 20 },
                                    whileInView: { opacity: 1, y: 0 }
                                } as any}
                                transition={{ delay: i * 0.1 }}
                                className={`${styles.statCard} ${styles[`statCard${stat.color}`]}`}
                            >
                                <span className={`${styles.statValue} ${styles[`statValue${stat.color}`]}`}>
                                    <AnimatedCounter target={stat.value} suffix={stat.suffix} continuous={stat.continuous} />
                                </span>
                                <span className={styles.statLabel}>{stat.label}</span>
                                <p className={styles.statDesc}>{stat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* ─── Community Marquee ─── */}
            <section className={styles.marqueeSection}>
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

            {/* ─── Core Pathways ─── */}
            <motion.section
                {...fadeInUp}
                className={styles.pathwaysSection}
            >
                <div className={styles.secHeader}>
                    <span className={styles.secEyebrow}>Core Pathways</span>
                    <h2 className={styles.secTitle}>
                        Four pillars of <span className="text-gradient">lasting change</span>.
                    </h2>
                    <p className={styles.secDesc}>
                        Strategic areas that address the root causes of school dropout and gender inequality.
                    </p>
                </div>
                <motion.div
                    {...staggerContainer}
                    className={styles.pathwaysGrid}
                >
                    {programCards.map((p, i) => {
                        const { Icon } = p;
                        return (
                            <motion.div
                                key={p.title}
                                variants={{
                                    initial: { opacity: 0, scale: 0.9 },
                                    whileInView: { opacity: 1, scale: 1 }
                                } as any}
                                transition={{ duration: 0.5 }}
                                whileHover={{ y: -10 }}
                            >
                                <Link
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
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.section>

            {/* ─── Founder Quote ─── */}
            <motion.section
                {...fadeInUp}
                className={styles.quoteSection}
            >
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
            </motion.section>

            {/* ─── Final CTA ─── */}
            <motion.section
                {...fadeInUp}
                className={styles.ctaSection}
            >
                <div className={styles.ctaContent}>
                    <span className={styles.ctaEyebrow}>Make a difference today</span>
                    <h2 className={styles.ctaTitle}>Ready to change a girl's life?</h2>
                    <p className={styles.ctaText}>
                        Your contribution funds school fees, emergency response, safe spaces, and protection for girls across Uganda.
                    </p>
                    <div className={styles.ctaActions}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsDonationModalOpen(true)}
                            className={styles.ctaBtnPrimary}
                        >
                            Donate Now <Heart size={18} />
                        </motion.button>
                        <motion.div whileHover={{ x: 5 }}>
                            <Link to="/contact" className={styles.ctaBtnSecondary}>
                                Volunteer With Us
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

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
