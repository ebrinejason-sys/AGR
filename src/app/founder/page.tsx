"use client";

import styles from './page.module.css';
import Image from 'next/image';

export default function Founder() {
    return (
        <div className={styles.container}>
            {/* Dramatic Hero */}
            <section className={styles.hero}>
              <p className="serif" style={{ color: 'var(--color-pink)', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: '800' }}>The Visionary</p>
              <h1 className="heading-xl">Akatwijuka <span className="text-gradient">Grace</span></h1>
            </section>

            {/* Founder Bio Section */}
            <section className={styles.founderIntro}>
              <div className={styles.founderGrid}>
                <div className={styles.founderImageWrapper}>
                  <Image
                    src="/images/founder.jpg"
                    alt="Akatwijuka Grace"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div className={styles.founderBio}>
                  <h2 className="heading-lg">Driven by <span className="text-gradient">Resilience</span></h2>
                  <div className={styles.bioText}>
                    <p>I am a fourth-year law student at Uganda Christian University, but my story begins long before I stepped into a courtroom. It begins in the quiet strength of my parents, who chose to break the cycle of poverty so that I could rise.</p>
                    <p>My journey is defined by the belief that your beginning does not define your becoming. Having witnessed the struggles of adolescent girls in my community, I founded African Girl Rise to be the bridge between their reality and their radiant potential.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Generational Transformation */}
            <section className={styles.storySection}>
                <h3 className="serif">Breaking the Inherited Struggle</h3>
                <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>If you are a parent reading this, please hear me with your whole heart: Your children do not have to suffer the way you suffered. Struggle does not have to be a family tradition. Poverty does not have to pass from generation to generation.</p>
                <div className={styles.emphasis}>
                    &quot;The cycle can be broken. You have the power to break it.&quot;
                </div>
                <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>When you keep your daughter in school—even when it&apos;s hard—you are not just educating a child. You are changing your family&apos;s future for generations. My parents proved that suffering does not have to be inherited. I am the proof that it works.</p>
            </section>

            {/* Quote Section */}
            <div style={{ padding: '0 5%' }}>
              <section className={styles.personalStatement}>
                  <p>&quot;I am not special. I am simply a girl whose parents chose to break the cycle. My mother studied hungry so I could study fed. They did not pass on their hardship. They passed on their hope.&quot;</p>
                  <p>&quot;Rise. Then reach back. Always reach back.&quot;</p>
                  <p className={styles.signature}>— Akatwijuka Grace</p>
              </section>
            </div>

            {/* At a Glance */}
            <section className={styles.storySection}>
                <h2 className="heading-lg" style={{ textAlign: 'center' }}>The <span className="text-gradient">Legacy</span> At A Glance</h2>
                <div className={styles.atAGlance}>
                    <div>
                      <p><strong>Name:</strong> Akatwijuka Grace</p>
                      <p><strong>Role:</strong> Founder & Visionary Director</p>
                      <p><strong>Education:</strong> LLB, Uganda Christian University</p>
                    </div>
                    <div>
                      <p><strong>Initiative:</strong> African Girl Rise (Registered 2025)</p>
                      <p><strong>Location:</strong> Ibanda District, Uganda</p>
                      <p><strong>Impact:</strong> 800+ Girls Reached</p>
                    </div>
                </div>
            </section>

            {/* Closing */}
            <section className={styles.closingSection}>
                <h2 className="heading-lg" style={{ color: 'white' }}>Rise. Rebuild. <span style={{ color: 'var(--color-lightblue)' }}>Repeat.</span></h2>
                <p style={{ marginTop: '3rem', fontSize: '1.3rem', opacity: '0.8', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>African Girl Rise Initiative • Ibanda District, Western Uganda</p>
            </section>
        </div>
    );
}
