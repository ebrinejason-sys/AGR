"use client";

import styles from './page.module.css';
import Link from 'next/link';

export default function LegalAdvocacy() {
  return (
    <div className={styles.container}>
      {/* Editorial Hero */}
      <section className={styles.hero}>
        <p className="subheading reveal">Protection & Justice</p>
        <h1 className="heading-display reveal">Legal <span className="text-gradient">Advocacy</span></h1>
        <p className="subheading reveal" style={{ marginTop: '2rem', fontStyle: 'italic', letterSpacing: '0.1em' }}>
          Defending the fundamental rights of adolescent girls and women across Uganda.
        </p>
      </section>

      {/* Intro */}
      <section className={styles.editorialIntro}>
        <div className={styles.introContainer}>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <p className="subheading">The Imperative</p>
            <h2 className="heading-section">A Silence <span className="text-gradient">Broken</span></h2>
            <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
              Countless individuals navigate systemic abuse without the critical knowledge that the law
              exists for their definitive protection. This lack of literacy is a catalyst for vulnerability.
            </p>
          </div>

          <div className={styles.premiumGrid}>
            <div className={styles.truthCard}>
              <span className={styles.truthIcon}>⚖️</span>
              <p>Forced marriage is a definitive criminal act, despite prevailing societal misperceptions.</p>
            </div>
            <div className={styles.truthCard}>
              <span className={styles.truthIcon}>🚔</span>
              <p>Domestic violence is punishable by law; reporting is a courageous act of justice.</p>
            </div>
            <div className={styles.truthCard}>
              <span className={styles.truthIcon}>🛡️</span>
              <p>Legal literacy serves as the primary shield against systemic exploitation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pathways to Justice */}
      <section className={styles.editorialBody}>
        <div style={{ textAlign: 'center', marginBottom: '10rem' }}>
          <p className="subheading">Strategy</p>
          <h2 className="heading-section">Pathways to <span className="text-gradient">Justice</span></h2>
        </div>

        <div className={styles.advocacyBox}>
          <p className="subheading">Initiative 01</p>
          <h3 className="serif">Legal Literacy Workshops</h3>
          <p>We provide comprehensive education on fundamental legal rights in accessible vernacular. Empowerment through insight.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div style={{ borderLeft: '2px solid var(--color-pink)', paddingLeft: '1.5rem' }}>
              <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.5rem' }}>DEFILEMENT LAW</p>
              <p style={{ fontSize: '0.85rem' }}>Understanding protections and reporting mechanisms.</p>
            </div>
            <div style={{ borderLeft: '2px solid var(--color-pink)', paddingLeft: '1.5rem' }}>
              <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.5rem' }}>CHILD MARRIAGE</p>
              <p style={{ fontSize: '0.85rem' }}>Legal standing against premature forced unions.</p>
            </div>
          </div>
        </div>

        <div className={styles.advocacyBox} style={{ background: 'white' }}>
          <p className="subheading">Initiative 02</p>
          <h3 className="serif">Protective Referral Network</h3>
          <p>We facilitate strategic connections with established legal and protective authorities to ensure rigorous law enforcement.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div style={{ borderLeft: '2px solid var(--color-purple)', paddingLeft: '1.5rem' }}>
              <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.5rem' }}>LEGAL AID</p>
              <p style={{ fontSize: '0.85rem' }}>Connecting survivors with pro-bono representation.</p>
            </div>
            <div style={{ borderLeft: '2px solid var(--color-purple)', paddingLeft: '1.5rem' }}>
              <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.5rem' }}>PROTECTION UNITS</p>
              <p style={{ fontSize: '0.85rem' }}>Direct collaboration with Child & Family Protection services.</p>
            </div>
          </div>
        </div>

        <div className={styles.benefitGrid}>
            <div className={styles.benefitCard}>
              <span>OUTCOME 01</span>
              <p>Adolescent girls identifying and rejecting abuse as a normalized reality.</p>
            </div>
            <div className={styles.benefitCard}>
              <span>OUTCOME 02</span>
              <p>Women gaining the structural confidence to pursue definitive legal justice.</p>
            </div>
            <div className={styles.benefitCard}>
              <span>OUTCOME 03</span>
              <p>Community-wide accountability mechanisms rooted in legal transparency.</p>
            </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaBox}>
        <h2 className="heading-section" style={{ color: 'white' }}>Advocate for <span className="text-gradient">Justice</span></h2>
        <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', opacity: 0.8, marginBottom: '5rem', fontStyle: 'italic' }}>
          Your contribution ensures that no girl in our community has to suffer in silence.
        </p>
        <Link href="/pay" className="btn-premium" style={{ background: 'white', color: 'black' }}>
          <span>Support Legal Rights</span>
        </Link>
      </section>
    </div>
  );
}
