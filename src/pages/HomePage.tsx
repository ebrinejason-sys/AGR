import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import HeroCTAButtons from '@/components/HeroCTAButtons';
import CTADonateButton from '@/components/CTADonateButton';
import AnimatedCounter from '@/components/AnimatedCounter';

const impactStats = [
  { 
    label: 'Girls reached', 
    value: 56000, 
    suffix: '+',
    desc: 'Direct support delivered through outreach, mentoring, and education support.'
  },
  { 
    label: 'Active sanctuaries', 
    value: 12, 
    suffix: '+',
    desc: 'Trusted spaces and school-linked support points where girls find guidance.'
  },
  { 
    label: 'National dropout', 
    value: 4, 
    suffix: ' in 10',
    desc: 'Girls drop out before Form 4. Our work is designed to interrupt that pattern early.'
  },
] as const;

const programCards = [
  { 
    title: 'Rise Sanctuaries',
    number: '01',
    description: 'School-linked safe spaces where girls can access counselling, peer support, and trusted adult follow-up.',
    href: '/programs/rise-rooms',
    label: 'Explore Sanctuaries'
  },
  { 
    title: 'Education Support',
    number: '02',
    description: 'School retention support, scholastic materials, and practical help that keeps girls learning with dignity.',
    href: '/programs/academic-rescue',
    label: 'See education support'
  },
  { 
    title: 'Legal Advocacy',
    number: '03',
    description: 'Rights awareness, case management, and direct advocacy when girls face abuse, neglect, or exclusion.',
    href: '/legal-advocacy',
    label: 'View legal advocacy'
  },
  { 
    title: 'Rise Brothers',
    number: '04',
    description: 'Engaging boys to understand what girls face, manage their own emotions, and become active allies.',
    href: '/programs/rise-brothers',
    label: 'Explore Rise Brothers'
  },
] as const;

const supportFlow = [
  { 
    step: '01', 
    title: 'Identify risk early',
    text: 'Teachers and community partners flag attendance gaps or abuse risk before they harden into dropout.'
  },
  { 
    step: '02', 
    title: 'Stabilise the girl',
    text: 'We respond with counselling, supplies, and mentoring based on what will stabilise the girl quickly.'
  },
  { 
    step: '03', 
    title: 'Shift the environment',
    text: 'We work with boys and legal systems too, so girls are not sent back into the same silence that harmed them.'
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

export default function HomePage() {
  return (
    <div className={styles.container}>
      {/* --- HERO --- */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.welcomePill}>
            <img src="/logo.png" alt="AGR Logo" width={32} height={32} className={styles.welcomeLogo} />
            <span className={styles.welcomeLabel}>African Girl Rise · Uganda</span>
          </div>
          <h1 className={styles.heroHeading}>
            Help girls stay safe, 
            <span>Stay in school.</span>
          </h1>
          <p className={styles.heroSubtext}>
            We deliver local, practical support that keeps girls safe and learning. 
            From trauma recovery to school retention, we build responses that work.
          </p>
          <HeroCTAButtons />
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.heroImageContainer}>
            <img src="/images/hero-bg.jpg" alt="African Girl Rise" />
            <div className={styles.heroDecor}>
              <span className={styles.heroDecorLabel}>Local Impact</span>
              <span className={styles.heroDecorValue}>56,000+ Girls</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS --- */}
      <section className={styles.statsContainer}>
        <div className={styles.statsGrid}>
          {impactStats.map((stat, i) => (
            <div key={stat.label} className={styles.statCard}>
              <span className={styles.statValue} style={{ color: i === 0 ? '#e91e63' : i === 1 ? '#9c27b0' : '#00bcd4' }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} continuous={i < 2} />
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
              <p className={styles.statDesc}>{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- OVERVIEW --- */}
      <section className={styles.section}>
        <div className={styles.secHeader}>
          <span className={styles.eyebrow}>Built from lived experience</span>
          <h2 className={styles.secTitle}>The response is built around what moves a girl from crisis to momentum.</h2>
          <p className={styles.secDesc}>
            Girls first need stability and safety. Then they need support to remain in school. 
            Finally, the environment around them has to change so the gains hold.
          </p>
        </div>

        <div className={styles.flowContainer}>
          {supportFlow.map(item => (
            <div key={item.step} className={styles.flowItem}>
              <span className={styles.flowNumber}>{item.step}</span>
              <h3 className={styles.flowTitle}>{item.title}</h3>
              <p className={styles.flowText}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- PROGRAMS --- */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.secHeader}>
          <span className={styles.eyebrow}>Core Pathways</span>
          <h2 className={styles.secTitle}>Four clear ways we deliver impact.</h2>
          <p className={styles.secDesc}>
            Our programmes are designed to address the unique barriers girls face in Ugandan communities.
          </p>
        </div>

        <div className={styles.programGrid}>
          {programCards.map(program => (
            <div key={program.title} className={styles.programCard}>
              <div className={styles.programCardContent}>
                <span className={styles.programNumber}>{program.number}</span>
                <h3 className={styles.programTitle}>{program.title}</h3>
                <p className={styles.programText}>{program.description}</p>
                <Link to={program.href} className={styles.programLink}>{program.label} →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- MARQUEE --- */}
      <section className={styles.marqueeSection}>
        <div className={styles.marqueeHeader}>
          <span className={styles.eyebrow}>Moments from the work</span>
          <h2 className={styles.secTitle}>Documentation of resilience.</h2>
        </div>
        
        <div className={styles.marqueeFrame}>
          <div className={styles.marqueeRow}>
            <div className={styles.marqueeTrack}>
              {[...galleryMoments, ...galleryMoments].map((item, index) => (
                <div key={`${item.src}-${index}`} className={styles.marqueeCard}>
                  <div className={styles.marqueeMedia}>
                    <img src={item.src} alt={item.label} loading="lazy" />
                  </div>
                  <span className={styles.marqueeCaption}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- QUOTE --- */}
      <section className={styles.quoteSection}>
        <div className={styles.quoteContent}>
          <span className={styles.quoteIcon}>“</span>
          <p className={styles.quoteText}>
            My parents broke the cycle so I could rise. Now I spend my life proving that your beginning does not define your becoming.
          </p>
          <div className={styles.quoteAuthor}>
            <span className={styles.authorName}>Akatwijuka Grace</span>
            <span className={styles.authorTitle}>Founder · African Girl Rise</span>
          </div>
          <Link to="/founder" className={`${styles.programLink} ${styles.quoteStoryLink}`} style={{ marginTop: '2rem' }}>Read her story →</Link>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Help fund direct support for girls across Uganda.</h2>
          <p className={styles.ctaText}>
            Your contribution helps cover school fees, emergency response, and protection.
          </p>
          <div className={styles.ctaActions}>
            <CTADonateButton />
            <Link to="/contact" className={styles.volunteerBtn}>Volunteer</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
