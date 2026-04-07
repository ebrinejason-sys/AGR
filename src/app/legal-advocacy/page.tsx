"use client";

import styles from './page.module.css';
import Link from 'next/link';

export default function LegalAdvocacy() {
  return (
    <div className={styles.container}>
      {/* Dramatic Hero */}
      <section className={styles.hero}>
        <p className="serif" style={{ color: 'var(--color-pink)', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: '800' }}>Protection & Justice</p>
        <h1 className="heading-xl">Legal <span className="text-gradient">Advocacy</span></h1>
      </section>

      {/* Intro */}
      <section className={styles.introSection}>
        <div className={styles.introContainer}>
          <h2 className="heading-lg">No girl should suffer in <span className="text-gradient">silence</span>.</h2>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
            In Uganda, countless girls and women suffer abuse without knowing they have rights, or that the law exists to protect them. This ignorance is not innocence—it is vulnerability.
          </p>
        </div>
      </section>

      {/* Reality Check */}
      <section className={styles.realitySection}>
        <h2 className="heading-lg" style={{ textAlign: 'center', color: 'white' }}>The <span className="text-gradient">Unseen</span> Realities</h2>
        <div className={styles.realityGrid}>
          <div className={styles.truthCard}>
            <span className={styles.truthIcon}>💍</span>
            <p>Forced marriage is a crime, yet many families view it as a necessity.</p>
          </div>
          <div className={styles.truthCard}>
            <span className={styles.truthIcon}>🚔</span>
            <p>Domestic violence is punishable, yet reporting it is often feared.</p>
          </div>
          <div className={styles.truthCard}>
            <span className={styles.truthIcon}>⚖️</span>
            <p>Knowledge of the law is the first shield against exploitation.</p>
          </div>
        </div>
      </section>

      {/* Pathways to Justice */}
      <section className={styles.whatWeDoSection}>
        <h2 className="heading-lg" style={{ textAlign: 'center', marginBottom: '6rem' }}>Pathways to <span className="text-gradient">Justice</span></h2>

        <div className={styles.programBox}>
          <div className={styles.programNumber}>01</div>
          <h3 className="serif">Legal Literacy Workshops</h3>
          <p>We teach girls and women about their basic legal rights in simple, accessible language. Knowledge is power.</p>
          <ul className={styles.programList}>
            <li>Understanding the law on defilement</li>
            <li>Rights against child marriage</li>
            <li>Domestic violence protections</li>
            <li>Property & Education rights</li>
          </ul>
        </div>

        <div className={styles.programBox} style={{ background: 'var(--color-purple-light)' }}>
          <div className={styles.programNumber}>02</div>
          <h3 className="serif">Legal Referral Network</h3>
          <p>We connect survivors with trusted legal and protective resources to ensure the law is enforced.</p>
          <ul className={styles.programList}>
            <li>Child & Family Protection Units</li>
            <li>Free legal representation services</li>
            <li>Probation & Social Welfare support</li>
          </ul>
        </div>
      </section>

      {/* Impact */}
      <section className={styles.impactSection}>
        <h2 className="heading-lg">The Impact of <span className="text-gradient">Knowledge</span></h2>
        <div className={styles.benefitGrid}>
          <div className={styles.benefitCard}>
            <span>01</span>
            <p>Girls no longer accept abuse as a normal part of life.</p>
          </div>
          <div className={styles.benefitCard}>
            <span>02</span>
            <p>Women gain the confidence to seek justice for violations.</p>
          </div>
          <div className={styles.benefitCard}>
            <span>03</span>
            <p>Communities develop deep accountability mechanisms.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '8rem 5%', textAlign: 'center', background: 'var(--color-black)', color: 'white' }}>
        <h2 className="heading-lg" style={{ color: 'white' }}>Stand for <span className="text-gradient">Justice</span></h2>
        <p style={{ fontSize: '1.2rem', opacity: '0.8', marginBottom: '3rem' }}>Support our legal empowerment programs today.</p>
        <Link href="/pay" className="btn-dramatic">Support Legal Rights</Link>
      </section>
    </div>
  );
}
