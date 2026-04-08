"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import DonationModal from "@/components/DonationModal";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function Home() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const tickerItems = [
    "Education Access",
    "Menstrual Health",
    "Legal Advocacy",
    "Rise Sanctuaries",
    "Mentorship",
    "Breaking Cycles",
    "Community Healing",
    "Girl-Led Futures",
    "Trauma-Informed Care",
    "Rights Protection",
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
            Where Resilience<br />
            <span className="text-gradient">Transforms</span> Destiny.
          </h1>
          <p className={styles.heroSubtext}>
            A registered Ugandan non-profit empowering marginalized adolescent girls to transcend barriers,
            reclaim their futures, and lead with unyielding strength.
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
            <h2 className={styles.secTitle}>
              The Intersection of <span className="text-gradient">Reality &amp; Radiance</span>
            </h2>
            <p>
              African Girl Rise is an elite movement of empowerment — a registered Ugandan non-profit
              built to dismantle the structural cycles of poverty that constrain marginalized girls.
            </p>
            <p>
              Under the visionary leadership of Akatwijuka Grace, we serve as the strategic bridge
              for girls to overcome academic and social adversity, graduating as leaders of unyielding strength.
            </p>
            <Link href="/our-story" className={styles.textLink}>
              Read our full story →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className={styles.statsWrap}>
        <span className={styles.eyebrow}>Impact</span>
        <h2 className={styles.secTitle}>Tangible <span className="text-gradient">Change</span></h2>
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
          &ldquo;Numbers that represent real lives, real communities, real futures.&rdquo;
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
          <h2 className={styles.secTitle}>Foundational <span className="text-gradient">Pillars</span></h2>
          <p className={styles.secDesc}>
            Three interconnected pathways that together break the cycle — sustainably, measurably, permanently.
          </p>
        </div>
        <div className={styles.pillarsRow}>
          <div className={styles.pillarItem}>
            <span className={styles.pillarNum}>01</span>
            <h3>Rise Sanctuaries</h3>
            <p>Trauma-informed safe spaces with clinical counseling, peer support, and mentorship for adolescent girls.</p>
            <Link href="/programs" className={styles.pillarLnk}>Learn more →</Link>
          </div>
          <div className={styles.pillarItem}>
            <span className={styles.pillarNum}>02</span>
            <h3>Academic Excellence</h3>
            <p>Strategic mentorship and economic interventions ensuring girls maintain sustained educational progress.</p>
            <Link href="/programs" className={styles.pillarLnk}>Learn more →</Link>
          </div>
          <div className={styles.pillarItem}>
            <span className={styles.pillarNum}>03</span>
            <h3>Legal Advocacy</h3>
            <p>High-impact protection of adolescent rights through legal literacy and community-based justice systems.</p>
            <Link href="/legal-advocacy" className={styles.pillarLnk}>Learn more →</Link>
          </div>
        </div>
      </section>

      {/* ─── Quote ─── */}
      <section className={styles.quoteWrap}>
        <div className={styles.quoteBox}>
          <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
          <p className={styles.quoteBody}>
            Every girl carries an innate power to architect her own destiny.
            We are simply the catalyst that ignites that transformation.
          </p>
          <span className={styles.quoteBy}>— Akatwijuka Grace, Founder</span>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={styles.ctaBand}>
        <div className={styles.ctaBody}>
          <span className={styles.ctaEyebrow}>Make a Difference</span>
          <h2 className={styles.ctaHeading}>Become the Architect of Change</h2>
          <p className={styles.ctaText}>
            Invest in the next generation of African leaders. Your contribution fuels a legacy of resilience and transformation.
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

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </div>
  );
}
