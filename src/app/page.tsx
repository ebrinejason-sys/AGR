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
        <div className={styles.heroAccent} />
        <div className={styles.heroContent}>
          <p className={styles.heroTagline}>The Era of the Rising Girl</p>
          <h1 className="heading-xl">
            Where Resilience <span className="text-gradient">Transforms</span> into Destiny.
          </h1>
          <p className={styles.heroDescription}>
            We provide a sanctuary for adolescent girls to heal from poverty, overcome trauma, and write their own radiant futures.
          </p>
          <div className={styles.heroButtons}>
            <button
              onClick={() => setIsDonationModalOpen(true)}
              className="btn-dramatic"
            >
              Support Her Rise
            </button>
            <Link href="/programs" className="btn-outline">
              Explore Pathways
            </Link>
          </div>
        </div>
      </section>

      {/* ─── About Section ─── */}
      <section className={styles.sectionPadding}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutText}>
            <h2 className="heading-lg">The Space Between <span className="text-gradient">Reality and Radiance</span></h2>
            <p>
              African Girl Rise is more than a registered Ugandan non-profit; it is a movement. We are dedicated to breaking the cycle of poverty and empowering adolescent girls in marginalized communities.
            </p>
            <p>
              Founded by Akatwijuka Grace, our mission is to be the empowering bridge that helps every girl overcome academic and social barriers to lead with unyielding strength.
            </p>
            <div style={{ marginTop: '5rem' }}>
              <Link href="/our-story" className="btn-dramatic" style={{ background: 'var(--color-purple)' }}>
                Our Narrative
              </Link>
            </div>
          </div>
          <div className={styles.aboutImageWrapper}>
            <Image
              src="/images/about-us.jpg"
              alt="Adolescent girl empowerment"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* ─── Impact Section ─── */}
      <section className={styles.impactSection}>
        <div className={styles.impactContent}>
          <h2 className="heading-lg" style={{ color: 'white' }}>Impact in <span className="text-gradient">Action</span></h2>
          <div className={styles.impactGrid}>
            <div className={styles.impactItem}>
              <div className={styles.impactNumber}>
                <AnimatedCounter target={56000} suffix="+" continuous={true} incrementInterval={3000} />
              </div>
              <p className={styles.impactLabel}>Girls Empowered</p>
            </div>
            <div className={styles.impactItem}>
              <div className={styles.impactNumber}>
                <AnimatedCounter target={12} suffix="+" />
              </div>
              <p className={styles.impactLabel}>Rise Sanctuaries</p>
            </div>
            <div className={styles.impactItem}>
              <div className={styles.impactNumber}>
                <AnimatedCounter target={100} suffix="%" />
              </div>
              <p className={styles.impactLabel}>Commitment to Growth</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Program Highlights ─── */}
      <section className={styles.programsSection}>
        <div className={styles.sectionHeader}>
          <h2 className="heading-lg">Our <span className="text-gradient">Foundational</span> Pillars</h2>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
            We design holistic pathways that dismantle the mental and economic barriers holding girls back.
          </p>
        </div>
        <div className={styles.programGrid}>
          <div className={styles.programCard}>
            <span className={styles.programIcon}>🧠</span>
            <h3 className={styles.programTitle}>Rise Sanctuaries</h3>
            <p className={styles.programDesc}>Safe, school-based spaces providing trauma-informed counseling and deep peer connection.</p>
            <Link href="/programs" className="text-gradient" style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Learn More →</Link>
          </div>
          <div className={styles.programCard}>
            <span className={styles.programIcon}>📚</span>
            <h3 className={styles.programTitle}>Academic Perseverance</h3>
            <p className={styles.programDesc}>Ensuring girls stay in school through education drives, mentorship, and economic relief.</p>
            <Link href="/programs" className="text-gradient" style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Learn More →</Link>
          </div>
          <div className={styles.programCard}>
            <span className={styles.programIcon}>⚖️</span>
            <h3 className={styles.programTitle}>Legal Advocacy</h3>
            <p className={styles.programDesc}>Protecting the rights of adolescent girls through legal awareness and community justice.</p>
            <Link href="/legal-advocacy" className="text-gradient" style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Learn More →</Link>
          </div>
        </div>
      </section>

      {/* ─── Dramatic Quote ─── */}
      <section className={styles.sectionPadding} style={{ textAlign: 'center', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <span style={{ fontSize: '7rem', color: 'var(--color-pink-soft)', opacity: '0.3', display: 'block', lineHeight: '1', fontFamily: 'var(--font-serif)' }}>&ldquo;</span>
          <h2 className="serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-purple-deep)', fontStyle: 'italic', margin: '-4rem 0 4rem' }}>
            Your beginning does not define your becoming. Every girl carries within her the power to rise above any circumstance.
          </h2>
          <p className={styles.heroTagline} style={{ color: 'var(--color-pink)' }}>— Akatwijuka Grace, Founder</p>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className="heading-lg" style={{ color: 'white', marginBottom: '3rem' }}>Be the <span style={{ color: 'var(--color-lightblue)' }}>Catalyst</span> for Change</h2>
          <p>Together, we are redefining what is possible for adolescent girls in Uganda. Your support transforms entire generations.</p>
          <div className={styles.heroButtons} style={{ marginTop: '5rem' }}>
            <button onClick={() => setIsDonationModalOpen(true)} className="btn-dramatic" style={{ background: 'white', color: 'var(--color-pink)' }}>
              Give Monthly
            </button>
            <Link href="/contact" className="btn-outline" style={{ borderColor: 'white', color: 'white' }}>
              Volunteer Now
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
