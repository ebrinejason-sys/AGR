"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import dynamic from 'next/dynamic';

const DonationModal = dynamic(() => import('@/components/DonationModal'), { ssr: false });
import AnimatedCounter from "@/components/AnimatedCounter";

export default function Home() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const tickerItems = [
    "School Support",
    "Mentorship",
    "Safe Spaces",
    "Legal Advocacy",
    "Menstrual Health",
    "Emergency Support",
    "Community Outreach",
    "Girls' Rights",
    "Case Follow-Up",
    "Parent Engagement",
  ];

  const marqueeRow1 = [
    "/images/agr-photo-1.jpg",
    "/images/program-1.jpg",
    "/images/agr-photo-2.jpg",
    "/images/program-2.jpg",
    "/images/about-us.jpg",
    "/images/agr-photo-3.jpg",
    "/images/program-3.jpg",
    "/images/worthy-dream.jpg",
    "/images/agr-photo-4.jpg",
    "/images/program-4.jpg",
    "/images/legal-advocacy.jpg",
    "/images/hero-bg.jpg",
  ];

  const marqueeRow2 = [
    "/images/agr-photo-3.jpg",
    "/images/hero-bg.jpg",
    "/images/agr-photo-1.jpg",
    "/images/about-us.jpg",
    "/images/agr-photo-4.jpg",
    "/images/program-2.jpg",
    "/images/legal-advocacy.jpg",
    "/images/agr-photo-2.jpg",
    "/images/program-1.jpg",
    "/images/worthy-dream.jpg",
    "/images/program-4.jpg",
    "/images/program-3.jpg",
  ];

  return (
    <div className={styles.container}>

      {/* ─── Hero ─── */}
      <section className={styles.heroSplit}>
        <div className={styles.heroPanel}>
          <span className={styles.eyebrow}>African Girl Rise · Uganda</span>
          <h1 className={styles.heroHeading}>
            Support Girls to<br />
            Stay in School.
          </h1>
          <p className={styles.heroSubtext}>
            African Girl Rise is a registered Ugandan non-profit supporting girls facing poverty,
            violence, and school dropout risk through mentorship, education support, safe spaces,
            and legal advocacy.
          </p>
          <div className={styles.heroCtas}>
            <button
              onClick={() => setIsDonationModalOpen(true)}
              className={styles.btnPink}
            >
              Support Her Rise
            </button>
            <Link href="/programs" className={styles.btnGhost}>
              Explore Programs
            </Link>
          </div>
        </div>
        <div className={styles.heroImagePanel}>
          <Image
            src="/images/hero-bg.jpg"
            alt="Adolescent girls in Uganda"
            fill
            priority
            sizes="45vw"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
      </section>

      {/* ─── Tag Ticker ─── */}
      <div className={styles.ticker} aria-hidden="true" role="presentation">
        <div className={styles.tickerTrack}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className={styles.tickerItem}>{item}</span>
          ))}
        </div>
      </div>

      {/* ─── About ─── */}
      <section className={styles.aboutWrap}>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutImgWrap}>
            <Image
              src="/images/about-us.jpg"
              alt="Girls empowered through our programs"
              fill
              sizes="(max-width: 960px) 100vw, 50vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
          <div className={styles.aboutContent}>
            <span className={styles.eyebrow}>Our Story</span>
            <h2 className={styles.secTitle}>Built from lived experience</h2>
            <p>
              African Girl Rise works with adolescent girls in Uganda who are navigating poverty,
              violence, interrupted schooling, and limited protection.
            </p>
            <p>
              Led by Akatwijuka Grace, the organisation combines practical support, mentorship, and
              advocacy so girls can stay in school, stay safe, and plan for a stronger future.
            </p>
            <Link href="/our-story" className={styles.textLink}>
              Read our story →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className={styles.statsWrap}>
        <span className={styles.eyebrow}>Impact</span>
        <h2 className={styles.secTitle}>Impact in numbers</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNum}>
              <AnimatedCounter target={56000} suffix="+" continuous={true} incrementInterval={3000} />
            </div>
            <p className={styles.statLabel}>Girls Reached Globally</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum}>
              <AnimatedCounter target={12} suffix="+" />
            </div>
            <p className={styles.statLabel}>Active Sanctuaries</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum}>
              <AnimatedCounter target={100} suffix="%" />
            </div>
            <p className={styles.statLabel}>Program Success Rate</p>
          </div>
        </div>
        <p className={styles.statsNote}>
          Each figure reflects direct support delivered with girls, families, and communities.
        </p>
      </section>

      {/* ─── Image Marquee ─── */}
      <section className={styles.marqueeSection} aria-hidden="true" role="presentation">
        <div className={styles.marqueeRow}>
          <div className={styles.marqueeTrack}>
            {[...marqueeRow1, ...marqueeRow1].map((src, i) => (
              <div key={i} className={styles.marqueeItem}>
                <Image src={src} alt="" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.marqueeRow}>
          <div className={`${styles.marqueeTrack} ${styles.marqueeTrackRight}`}>
            {[...marqueeRow2, ...marqueeRow2].map((src, i) => (
              <div key={i} className={styles.marqueeItem}>
                <Image src={src} alt="" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pillars ─── */}
      <section className={styles.pillarsWrap}>
        <div className={styles.secHeader}>
          <span className={styles.eyebrow}>How We Work</span>
          <h2 className={styles.secTitle}>Where support happens</h2>
          <p className={styles.secDesc}>
            The work focuses on safety, education, and rights protection so girls are not left to
            navigate crisis alone.
          </p>
        </div>
        <div className={styles.pillarsRow}>
          <div className={styles.pillarItem}>
            <span className={styles.pillarNum}>01</span>
            <h3>Rise Sanctuaries</h3>
            <p>Safe spaces where girls can access counseling, peer support, and trusted adult guidance.</p>
            <Link href="/programs" className={styles.pillarLnk}>Learn more →</Link>
          </div>
          <div className={styles.pillarItem}>
            <span className={styles.pillarNum}>02</span>
            <h3>Education Support</h3>
            <p>School retention support, mentorship, and practical help that keeps girls learning.</p>
            <Link href="/programs" className={styles.pillarLnk}>Learn more →</Link>
          </div>
          <div className={styles.pillarItem}>
            <span className={styles.pillarNum}>03</span>
            <h3>Legal Advocacy</h3>
            <p>Case support, rights awareness, and community action when girls face abuse or neglect.</p>
            <Link href="/legal-advocacy" className={styles.pillarLnk}>Learn more →</Link>
          </div>
        </div>
      </section>

      {/* ─── Founder Quote ─── */}
      <section className={styles.quoteWrap}>
        <div className={styles.quoteBox}>
          <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
          <p className={styles.quoteBody}>
            My parents broke the cycle so I could rise. Now I spend my life proving that your beginning does not define your becoming.
          </p>
          <span className={styles.quoteBy}>— Akatwijuka Grace, Founder</span>
          <Link href="/founder" className={styles.textLink} style={{ display: 'block', marginTop: '2rem' }}>
            Read her story →
          </Link>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={styles.ctaBand}>
        <div className={styles.ctaBody}>
          <span className={styles.ctaEyebrow}>Make a Difference</span>
          <h2 className={styles.ctaHeading}>Help fund direct support for girls across Uganda</h2>
          <p className={styles.ctaText}>
            Your donation helps cover school support, emergency response, mentorship, and legal advocacy.
          </p>
          <div className={styles.ctaRow}>
            <button
              onClick={() => setIsDonationModalOpen(true)}
              className={styles.ctaBtnWhite}
            >
              Donate Now
            </button>
            <Link href="/contact" className={styles.ctaBtnOutline}>
              Volunteer
            </Link>
          </div>
        </div>
      </section>

      {isDonationModalOpen && (
        <DonationModal
          isOpen={isDonationModalOpen}
          onClose={() => setIsDonationModalOpen(false)}
        />
      )}
    </div>
  );
}
