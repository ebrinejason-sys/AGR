"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import DonationModal from "@/components/DonationModal";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function Home() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* ─── Hero Section ─── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroVisual} />
        <div className={styles.heroContent}>
          <p className="subheading reveal">The Era of the Rising Girl</p>
          <h1 className="heading-display reveal">
            Where Resilience <br />
            <span className="text-gradient">Transforms</span> Destiny.
          </h1>
          <p className={`${styles.heroDescription} reveal`}>
            A premier sanctuary dedicated to adolescent girls in Uganda,
            empowering them to transcend barriers and architect radiant futures.
          </p>
          <div className={`${styles.heroButtons} reveal`}>
            <button
              onClick={() => setIsDonationModalOpen(true)}
              className="btn-premium"
            >
              <span>Support Her Rise</span>
            </button>
            <Link href="/programs" className="btn-feminine">
              Explore Pathway
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Story Section ─── */}
      <section className={styles.sectionWrapper}>
        <div className={styles.splitSection}>
          <div className={styles.splitText}>
            <p className="subheading">Our Narrative</p>
            <h2 className="heading-section">The Intersection of <span className="text-gradient">Reality & Radiance</span></h2>
            <p>
              African Girl Rise represents an elite movement of empowerment.
              We are a registered Ugandan non-profit established to dismantle
              the structural and systemic cycles of poverty that constrain
              marginalized adolescent girls.
            </p>
            <p>
              Under the visionary leadership of Akatwijuka Grace, we serve as the
              strategic bridge for girls to overcome academic and social adversity,
              graduating as leaders of unyielding strength.
            </p>
            <div style={{ marginTop: '4rem' }}>
              <Link href="/our-story" className="btn-premium">
                <span>Discover More</span>
              </Link>
            </div>
          </div>
          <div className={styles.visualFrame}>
            <Image
              src="/images/about-us.jpg"
              alt="Adolescent girl empowerment"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 1200px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* ─── Impact Section ─── */}
      <section className={styles.impactContainer}>
        <div className={styles.impactInner}>
          <h2 className="heading-section" style={{ color: 'white', textAlign: 'center' }}>
            Tangible <span className="text-gradient">Change</span>
          </h2>
          <div className={styles.impactGrid}>
            <div className={styles.impactCard}>
              <div className={styles.impactValue}>
                <AnimatedCounter target={56000} suffix="+" continuous={true} incrementInterval={3000} />
              </div>
              <p className={styles.impactTitle}>Global Impact Reach</p>
            </div>
            <div className={styles.impactCard}>
              <div className={styles.impactValue}>
                <AnimatedCounter target={12} suffix="+" />
              </div>
              <p className={styles.impactTitle}>Active Sanctuaries</p>
            </div>
            <div className={styles.impactCard}>
              <div className={styles.impactValue}>
                <AnimatedCounter target={100} suffix="%" />
              </div>
              <p className={styles.impactTitle}>Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Foundational Pillars ─── */}
      <section className={styles.sectionWrapper}>
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <p className="subheading">Strategy</p>
          <h2 className="heading-section">Foundational <span className="text-gradient">Pillars</span></h2>
        </div>

        <div className={styles.editorialGrid}>
          <div className={styles.editorialCard}>
            <span className={styles.editorialIcon}>🧠</span>
            <h3>Rise Sanctuaries</h3>
            <p>Exclusive, trauma-informed environments providing clinical counseling and peer-led connection.</p>
            <Link href="/programs" className="text-gradient" style={{ fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.15em' }}>
              PILLAR 01 →
            </Link>
          </div>
          <div className={styles.editorialCard}>
            <span className={styles.editorialIcon}>📚</span>
            <h3>Academic Excellence</h3>
            <p>Strategic mentorship and economic interventions ensuring girls maintain educational persistence.</p>
            <Link href="/programs" className="text-gradient" style={{ fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.15em' }}>
              PILLAR 02 →
            </Link>
          </div>
          <div className={styles.editorialCard}>
            <span className={styles.editorialIcon}>⚖️</span>
            <h3>Legal Advocacy</h3>
            <h4 style={{ display: 'none' }}>Rights</h4>
            <p>High-impact protection of adolescent rights through legal literacy and community-based justice.</p>
            <Link href="/legal-advocacy" className="text-gradient" style={{ fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.15em' }}>
              PILLAR 03 →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Premium Quote ─── */}
      <section style={{ padding: '15rem 5%', textAlign: 'center', background: 'var(--color-white)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-purple-deep)', fontStyle: 'italic', fontWeight: '400', lineHeight: '1.4' }}>
            &ldquo;Every girl carries an innate power to architect her own destiny.
            We are simply the catalyst that ignites that transformation.&rdquo;
          </h2>
          <p className="subheading" style={{ marginTop: '3rem', fontSize: '0.75rem' }}>— Akatwijuka Grace, Founder</p>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className={styles.ctaBox}>
        <h2 className="heading-section">Become the <span style={{ color: 'var(--color-lightblue)' }}>Architect</span> of Change</h2>
        <p>Invest in the next generation of African leaders. Your contribution fuels a legacy of resilience.</p>
        <div className={styles.heroButtons} style={{ marginTop: '4rem' }}>
          <button onClick={() => setIsDonationModalOpen(true)} className="btn-premium" style={{ background: 'white', color: 'black' }}>
            <span>Invest Now</span>
          </button>
          <Link href="/contact" className="btn-premium">
            <span>Volunteer</span>
          </Link>
        </div>
      </section>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </div>
  );
}
