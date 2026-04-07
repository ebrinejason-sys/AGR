"use client";

import styles from './page.module.css';
import Image from 'next/image';

export default function Founder() {
    return (
        <div className={styles.container}>
            {/* Editorial Hero */}
            <section className={styles.hero}>
              <p className="subheading reveal">The Visionary</p>
              <h1 className="heading-display reveal">Akatwijuka <span className="text-gradient">Grace</span></h1>
            </section>

            {/* Profile Section */}
            <section className={styles.editorialSection}>
              <div className={styles.editorialGrid}>
                <div className={styles.founderImageFrame}>
                  <Image
                    src="/images/founder.jpg"
                    alt="Akatwijuka Grace"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div className={styles.editorialContent}>
                  <h2 className="heading-section">Guided by <span className="text-gradient">Resilience</span></h2>
                  <div className={styles.editorialText}>
                    <p>I am currently finalizing my legal studies at Uganda Christian University, yet my professional narrative began long before the courtroom. It is rooted in the strategic resilience of my parents, who navigated significant hardship to ensure I could ascend.</p>
                    <p>My journey is predicated on the conviction that one&apos;s beginning does not dictate their ultimate becoming. Having witnessed the systemic obstacles faced by adolescent girls, I established African Girl Rise as the definitive bridge to their radiant potential.</p>

                    <div style={{ marginTop: '6rem' }}>
                      <h3 className="serif" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Generational Transformation</h3>
                      <p>Struggle should not be an inherited legacy. When we invest in a girl&apos;s educational persistence, we are not merely educating an individual; we are architecting a family&apos;s future for generations. My presence is the empirical proof of this transformation.</p>
                    </div>
                  </div>

                  <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Role</span>
                      <p className={styles.statValue}>Founder & Executive Director</p>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Education</span>
                      <p className={styles.statValue}>LLB, Uganda Christian University</p>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Focus</span>
                      <p className={styles.statValue}>Human Rights & Gender Advocacy</p>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Impact</span>
                      <p className={styles.statValue}>Ibanda District, Western Uganda</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Premium Quote */}
            <section className={styles.statementBox}>
              <div className={styles.statementInner}>
                <p>&ldquo;I am simply a girl whose parents chose to break the cycle. They did not bequeath hardship; they invested hope. Now, I reach back to ignite that same transformation in others.&rdquo;</p>
                <div className={styles.signature}>— Akatwijuka Grace</div>
              </div>
            </section>
        </div>
    );
}
