import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Home, BookOpen, Scale, MessageCircle } from 'lucide-react';
import styles from './HomePage.module.css';
import AnimatedCounter from '@/components/AnimatedCounter';

const impactStats = [
    { 
        label: 'Girls reached', 
        value: 56000, 
        suffix: '+',
        desc: 'Direct support delivered through outreach, mentoring, and education support.',
        color: 'var(--accent-pink)',
        continuous: true,
    },
    { 
        label: 'Active sanctuaries', 
        value: 12, 
        suffix: '+',
        desc: 'Trusted spaces and school-linked support points where girls find guidance.',
        color: 'var(--accent-purple)',
        continuous: false,
    },
    { 
        label: '4 in 10 girls', 
        value: 4, 
        suffix: ' in 10',
        desc: '4 in 10 girls in Uganda drop out before completing secondary school — we fight this.',
        color: 'var(--accent-teal)',
        continuous: false,
    },
] as const;

const programCards = [
    { 
        title: 'Rise Sanctuaries',
        number: '01',
        description: 'School-linked safe spaces where girls access counselling, peer support, and trusted adult follow-up.',
        href: '/programs/rise-rooms',
        icon: <Home />,
        accent: 'var(--accent-pink)',
    },
    { 
        title: 'Education Support',
        number: '02',
        description: 'School retention support, scholastic materials, and practical help that keeps girls learning with dignity.',
        href: '/programs/academic-rescue',
        icon: <BookOpen />,
        accent: 'var(--accent-purple)',
    },
    { 
        title: 'Legal Advocacy',
        number: '03',
        description: 'Rights awareness, case management, and direct advocacy when girls face abuse, neglect, or exclusion.',
        href: '/legal-advocacy',
        icon: <Scale />,
        accent: 'var(--accent-teal)',
    },
    { 
        title: 'Rise Brothers',
        number: '04',
        description: 'Engaging boys to understand what girls face, manage their own emotions, and become active allies.',
        href: '/programs/rise-brothers',
        icon: <Users />,
        accent: '#f59e0b',
    },
] as const;

const ROTATING_WORDS = ['Safe.', 'Heard.', 'Educated.', 'Empowered.', 'Rising.'];

export default function HomePage() {
    const [wordIndex, setWordIndex] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

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
                <div className={styles.heroContent}>
                    <span className={styles.heroPill}>
                        Uganda's girl-led movement
                    </span>
                    <h1 className={styles.heroHeading}>
                        <span className={styles.heroLine1}>Help girls stay</span>
                        <div className={styles.heroWordRow}>
                            <span className={`${styles.heroWordRotating} ${isExiting ? styles.wordExit : styles.wordEnter}`}>
                                {ROTATING_WORDS[wordIndex]}
                            </span>
                        </div>
                    </h1>
                    <p className={styles.heroSubtext}>
                        We deliver local, practical support that keeps girls safe and learning. 
                        From trauma recovery to school retention, we build responses that work.
                    </p>
                    <div className={styles.heroActions}>
                        <Link to="/donate" className="btn-premium">
                            Donate Now <Heart size={18} style={{ marginLeft: 8 }} />
                        </Link>
                        <Link to="/contact" className="btn-secondary">
                            Get Involved
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── Impact Stats ─── */}
            <section className={styles.statsSection}>
                <div className={styles.statsGrid}>
                    {impactStats.map((stat, i) => (
                        <div key={stat.label} className={styles.statCard}>
                            <span className={`${styles.statValue} ${styles.statValueDynamic}`} style={{ color: stat.color }}>
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} continuous={stat.continuous} />
                            </span>
                            <span className={styles.statLabel}>{stat.label}</span>
                            <p className={styles.statDesc}>{stat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
            
            {/* ─── Community Marquee ─── */}
            <section className={styles.marqueeSection}>
                <div className={styles.marqueeContent}>
                    {[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4].map((num, i) => (
                        <div key={i} className={styles.marqueeItem}>
                            <img 
                                src={`/images/agr-photo-${num}.jpg`} 
                                alt={`Community ${i}`} 
                                className={styles.marqueeImage} 
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </section>


            {/* ─── Pathways Section ─── */}
            <section className={styles.pathwaysSection}>
                <div className={styles.secHeader}>
                    <span className="subheading">The Core Pathways</span>
                    <h2 className="heading-section">Four pillars of <span className="text-gradient">lasting change</span>.</h2>
                    <p className={styles.secDesc}>
                        We focus on four strategic areas that address the root causes of school dropout and gender inequality.
                    </p>
                </div>
                <div className={styles.pathwaysGrid}>
                    {programCards.map((p) => (
                        <Link key={p.title} to={p.href} className={styles.pathwayCard}>
                            <div className={`${styles.pathwayIcon} ${styles.pathwayIconDynamic}`} style={{ background: p.accent + '20', color: p.accent }}>
                                {p.icon}
                            </div>
                            <h3 className={styles.pathwayTitle}>{p.title}</h3>
                            <p className={styles.pathwayDesc}>{p.description}</p>
                            <div className={styles.learnMoreRow} style={{ color: p.accent }}>
                                Learn more <ArrowRight size={16} />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ─── Founder Quote ─── */}
            <section className={styles.quoteSection}>
                <div className={styles.quoteContent}>
                    <span className={styles.quoteIcon}>"</span>
                    <p className={styles.quoteText}>
                        My parents broke the cycle so I could rise. Now I spend my life proving that your beginning does not define your becoming.
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
                    <h2 className={styles.ctaTitle}>Ready to make an impact?</h2>
                    <p className={styles.ctaText}>
                        Help fund direct support for girls across Uganda. Your contribution covers school fees, emergency response, and protection.
                    </p>
                    <div className={styles.ctaActions}>
                        <Link to="/contact" className={styles['btn-white']}>Donate Now</Link>
                        <Link to="/contact" className="btn-glass" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
                            Join as Volunteer
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
