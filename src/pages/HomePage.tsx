import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import styles from './HomePage.module.css';
import HeroCTAButtons from '@/components/HeroCTAButtons';
import CTADonateButton from '@/components/CTADonateButton';
import AnimatedCounter from '@/components/AnimatedCounter';

const impactStats = [
  { 
    label: 'Girls reached', 
    value: 56000, 
    suffix: '+',
    desc: 'Direct support delivered through outreach, mentoring, and education support.',
    color: '#e91e63',
    continuous: true,   // keeps incrementing — more girls reached every day
  },
  { 
    label: 'Active sanctuaries', 
    value: 12, 
    suffix: '+',
    desc: 'Trusted spaces and school-linked support points where girls find guidance.',
    color: '#9c27b0',
    continuous: false,  // fixed stat — must not exceed 12
  },
  { 
    label: 'National dropout', 
    value: 4, 
    suffix: ' in 10',
    desc: 'Girls drop out before Form 4. Our work is designed to interrupt that pattern early.',
    color: '#00bcd4',
    continuous: false,  // fixed statistic — 4 in 10 must stay at 4
  },
] as const;

const programCards = [
  { 
    title: 'Rise Sanctuaries',
    number: '01',
    description: 'School-linked safe spaces where girls access counselling, peer support, and trusted adult follow-up.',
    href: '/programs/rise-rooms',
    label: 'Explore Sanctuaries',
    icon: '🏡',
    accent: '#e91e63',
  },
  { 
    title: 'Education Support',
    number: '02',
    description: 'School retention support, scholastic materials, and practical help that keeps girls learning with dignity.',
    href: '/programs/academic-rescue',
    label: 'See education support',
    icon: '📚',
    accent: '#9c27b0',
  },
  { 
    title: 'Legal Advocacy',
    number: '03',
    description: 'Rights awareness, case management, and direct advocacy when girls face abuse, neglect, or exclusion.',
    href: '/legal-advocacy',
    label: 'View legal advocacy',
    icon: '⚖️',
    accent: '#00bcd4',
  },
  { 
    title: 'Rise Brothers',
    number: '04',
    description: 'Engaging boys to understand what girls face, manage their own emotions, and become active allies.',
    href: '/programs/rise-brothers',
    label: 'Explore Rise Brothers',
    icon: '🤝',
    accent: '#ff9800',
  },
] as const;

const supportFlow = [
  { 
    step: '01', 
    title: 'Identify risk early',
    text: 'Teachers and community partners flag attendance gaps or abuse risk before they harden into dropout.',
  },
  { 
    step: '02', 
    title: 'Stabilise the girl',
    text: 'We respond with counselling, supplies, and mentoring based on what will stabilise the girl quickly.',
  },
  { 
    step: '03', 
    title: 'Shift the environment',
    text: 'We work with boys and legal systems too, so girls are not sent back into the same silence that harmed them.',
  },
] as const;

const galleryMoments = [
  { label: 'School support in action', src: '/images/hero-bg.jpg' },
  { label: 'Girls building confidence together', src: '/images/about-us.jpg' },
  { label: 'Rise Brothers allyship sessions', src: '/images/programs/rise-brothers/rise-brothers-1.jpg' },
  { label: 'Community-led care', src: '/images/agr-photo-2.jpg' },
  { label: 'Mentoring and advocacy work', src: '/images/agr-photo-3.jpg' },
  { label: 'Practical learning and support', src: '/images/program-3.jpg' },
  { label: 'Worthy dream, real impact', src: '/images/worthy-dream.jpg' },
  { label: 'Rise Brothers programme', src: '/images/programs/rise-brothers/rise-brothers-2.jpg' },
  { label: 'Community outreach', src: '/images/agr-photo-4.jpg' },
  { label: 'Founder Akatwijuka Grace', src: '/images/founder.jpg' },
  { label: 'Girls in community programme', src: '/images/agr-photo-1.jpg' },
  { label: 'Rise Brothers in session', src: '/images/programs/rise-brothers/rise-brothers-3.jpg' },
] as const;

// Animated headline word rotator
const ROTATING_WORDS = ['Safe.', 'Heard.', 'Educated.', 'Empowered.', 'Rising.'];

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealed);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function HomePage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useScrollReveal();

  // Rotate hero headline words
  useEffect(() => {
    const interval = setInterval(() => {
      setIsExiting(true);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
        setIsExiting(false);
      }, 380);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Pause marquee on hover
  const pauseMarquee = () => {
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = 'paused';
    }
  };
  const resumeMarquee = () => {
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = 'running';
    }
  };

  return (
    <div className={styles.container}>

      {/* ── CINEMATIC HERO ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroBg} aria-hidden />
        <div className={styles.heroContent}>
          <span className={styles.heroPill} data-reveal>
            Uganda's girl-led movement
          </span>
          <h1 className={styles.heroHeading} data-reveal>
            <span className={styles.heroLine1}>Help girls stay</span>
            <span className={styles.heroWordRow}>
              <span className={styles.heroWordStatic}>safe &amp;&nbsp;</span>
              <span className={`${styles.heroWordRotating} ${isExiting ? styles.wordExit : styles.wordEnter}`}>
                {ROTATING_WORDS[wordIndex]}
              </span>
            </span>
          </h1>
          <p className={styles.heroSubtext} data-reveal>
            We deliver local, practical support that keeps girls safe and learning.
            From trauma recovery to school retention, we build responses that work.
          </p>
          <div className={styles.heroActions} data-reveal>
            <HeroCTAButtons />
          </div>
          <div className={styles.heroQuickLinks} data-reveal>
            <Link to="/our-story" className={styles.heroQuickLink}>Our Story</Link>
            <span className={styles.heroQuickDivider} />
            <Link to="/contact" className={styles.heroQuickLink}>Join Mission</Link>
            <span className={styles.heroQuickDivider} />
            <Link to="/stories" className={styles.heroQuickLink}>Impact Stories</Link>
          </div>
        </div>

        {/* Floating stat badge */}
        <div className={styles.heroFloatingBadge} aria-hidden>
          <span className={styles.badgePulse} />
          <span className={styles.badgeLabel}>Girls impacted</span>
          <span className={styles.badgeValue}>56,000+</span>
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {impactStats.map((stat, i) => (
            <div key={stat.label} className={styles.statCard} data-reveal style={{ transitionDelay: `${i * 120}ms` }}>
              <div className={styles.statAccentBar} style={{ background: stat.color }} />
              <span className={styles.statValue} style={{ color: stat.color }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} continuous={stat.continuous} />
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
              <p className={styles.statDesc}>{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CORE PATHWAY FLOATING CARDS (Zavora-style) ── */}
      <section className={`${styles.section} ${styles.pathwaysSection}`}>
        <div className={styles.secHeader} data-reveal>
          <span className={styles.eyebrow}>The Core Pathways</span>
          <h2 className={styles.secTitle}>Four pillars of lasting change.</h2>
          <p className={styles.secDesc}>
            We focus on four strategic areas that address the root causes of school dropout and gender inequality.
          </p>
        </div>
        <div className={styles.floatingCardsGrid}>
          {programCards.map((p, i) => (
            <Link
              key={p.title}
              to={p.href}
              className={styles.floatingCard}
              data-reveal
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className={styles.floatingCardTop}>
                <span className={styles.floatingCardIcon} style={{ background: `${p.accent}18` }}>
                  {p.icon}
                </span>
                <span className={styles.floatingCardNum} style={{ color: p.accent }}>{p.number}</span>
              </div>
              <h3 className={styles.floatingCardTitle}>{p.title}</h3>
              <p className={styles.floatingCardDesc}>{p.description}</p>
              <span className={styles.floatingCardCta} style={{ color: p.accent }}>
                {p.label} <span className={styles.floatingCardArrow}>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── IMAGE MARQUEE (Zavora-style clean infinite scroll) ── */}
      <section className={styles.marqueeSection}>
        <div className={styles.marqueeHeader} data-reveal>
          <span className={styles.eyebrow}>The Work in Action</span>
          <h2 className={styles.secTitle}>Documentation of resilience.</h2>
        </div>
        <div
          className={styles.marqueeOuter}
          onMouseEnter={pauseMarquee}
          onMouseLeave={resumeMarquee}
        >
          <div className={styles.marqueeFade} data-side="left" aria-hidden />
          <div className={styles.marqueeFade} data-side="right" aria-hidden />
          <div className={styles.marqueeTrack} ref={marqueeRef}>
            {[...galleryMoments, ...galleryMoments].map((item, index) => (
              <div key={`${item.src}-${index}`} className={styles.marqueeItem}>
                <div className={styles.marqueeImgWrap}>
                  <img src={item.src} alt={item.label} loading="lazy" />
                  <div className={styles.marqueeOverlay}>
                    <span>{item.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION FLOW ── */}
      <section className={styles.section}>
        <div className={styles.secHeader} data-reveal>
          <span className={styles.eyebrow}>Our Response Model</span>
          <h2 className={styles.secTitle}>Built around what moves a girl from crisis to momentum.</h2>
          <p className={styles.secDesc}>
            Girls first need stability and safety. Then support to remain in school.
            Finally, the environment around them has to change so the gains hold.
          </p>
        </div>
        <div className={styles.flowContainer}>
          {supportFlow.map((item, i) => (
            <div key={item.step} className={styles.flowItem} data-reveal style={{ transitionDelay: `${i * 130}ms` }}>
              <span className={styles.flowNumber}>{item.step}</span>
              <div className={styles.flowConnector} aria-hidden />
              <h3 className={styles.flowTitle}>{item.title}</h3>
              <p className={styles.flowText}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOUNDER QUOTE ── */}
      <section className={styles.quoteSection} data-reveal>
        <div className={styles.quoteContent}>
          <span className={styles.quoteIcon} aria-hidden>"</span>
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

      {/* ── CTA BAND ── */}
      <section className={styles.ctaSection} data-reveal>
        <div className={styles.ctaContent}>
          <span className={styles.eyebrow} style={{ color: 'rgba(255,255,255,0.6)' }}>Take Action</span>
          <h2 className={styles.ctaTitle}>Help fund direct support for girls across Uganda.</h2>
          <p className={styles.ctaText}>
            Your contribution helps cover school fees, emergency response, and protection.
          </p>
          <div className={styles.ctaActions}>
            <CTADonateButton />
            <Link to="/contact" className={styles.volunteerBtn}>Volunteer with us</Link>
          </div>
        </div>
        <div className={styles.ctaDecor} aria-hidden>
          <span className={styles.ctaOrb1} />
          <span className={styles.ctaOrb2} />
        </div>
      </section>

    </div>
  );
}
