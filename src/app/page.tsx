"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className={styles.heroVideo}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoOverlay} />
        <div className={styles.heroGlowPink} />
        <div className={styles.heroGlowPurple} />
        <div className={styles.heroGlowBlue} />

        <div className={styles.heroContentInner}>
          <div className={styles.heroTextSection}>
            <div className={styles.badge}>A Girl Defined By Rise Initiative</div>
            <h1 className="heading-xl">
              Empowering Communities<br />
              <span className="text-gradient">Through Action</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Empowering women and girls through education, skill development, and leadership training.
            </p>
          </div>

          <div className={styles.heroActionsRight}>
            <Link href="/events" className={styles.btnPrimaryOutlined}>
              Become a Member
            </Link>
            <button onClick={() => setIsVideoModalOpen(true)} className={styles.btnSecondaryOutlined}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Watch Video
              </span>
            </button>
            <Link href="/events" className={styles.btnPrimaryOutlined}>
              Donate Now
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutImageWrapper}>
            <Image src="/images/about-us.jpg" alt="About Us" fill className={styles.aboutImage} style={{ objectFit: 'cover' }} />
          </div>
          <div className={styles.aboutTextCard}>
            <h2 className="heading-lg">About Us</h2>
            <p>
              We dream of a continent—and a world—where you can look at any girl and see not where she comes from, but where she is going. We envision a future led by women who have turned their pain into purpose. Providing school-based mental health support, academic perseverance programs, and holistic care.
            </p>
            <Link href="/contact" className={styles.btnSecondary}>Learn More About Us</Link>
          </div>
        </div>
      </section>

      {/* Projects / What We Do Section */}
      <section className={styles.projectsSection}>
        <div className={styles.projectsHeader}>
          <div>
            <span className={styles.smallLabel}>Our Support</span>
            <h2 className="heading-lg">Discover Our Projects</h2>
          </div>
          <Link href="/programs" className={styles.btnSecondary}>View All</Link>
        </div>
        <div className={styles.projectsGrid}>
          <div className={styles.projectCard}>
            <div className={styles.projectImageWrapper}>
              <Image src="/images/program-1.jpg" alt="Healing the Ground" fill className={styles.projectImage} style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.projectContent}>
              <h3>Healing the Ground</h3>
              <p>Mental and emotional foundations.</p>
              <div className={styles.projectStats}>
                <span><strong>0</strong> donors</span>
                <span><strong>$ 0</strong></span>
              </div>
            </div>
          </div>
          <div className={styles.projectCard}>
            <div className={styles.projectImageWrapper}>
              <Image src="/images/program-2.jpg" alt="Building the Ladder" fill className={styles.projectImage} style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.projectContent}>
              <h3>Building the Ladder</h3>
              <p>Educational and practical ascension.</p>
              <div className={styles.projectStats}>
                <span><strong>0</strong> donors</span>
                <span><strong>$ 0</strong></span>
              </div>
            </div>
          </div>
          <div className={styles.projectCard}>
            <div className={styles.projectImageWrapper}>
              <Image src="/images/program-3.jpg" alt="Reaching New Altitudes" fill className={styles.projectImage} style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.projectContent}>
              <h3>Reaching New Altitudes</h3>
              <p>Future and leadership development.</p>
              <div className={styles.projectStats}>
                <span><strong>0</strong> donors</span>
                <span><strong>$ 0</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Support Tiers Section */}
      <section className={styles.impactSupportSection}>
        <div className={styles.impactContainer}>
          <div className={styles.impactText}>
            <h2 className="heading-lg">Building Foundations for Empowerment</h2>
            <ul className={styles.impactList}>
              <li><strong>Education:</strong> Providing school-based support.</li>
              <li><strong>Hygiene:</strong> Ensuring access to sanitary pads.</li>
              <li><strong>Training:</strong> Leadership and mentorship for girls.</li>
            </ul>
          </div>
          <div className={styles.supportTiers}>
            <div className={styles.tierCard}>
              <h3>$10</h3>
              <p>Sanitary Pads</p>
              <Link href="/events" className={styles.tierAction}>Donate ➔</Link>
            </div>
            <div className={styles.tierCard}>
              <h3>$20</h3>
              <p>Learning Materials</p>
              <Link href="/events" className={styles.tierAction}>Donate ➔</Link>
            </div>
            <div className={styles.tierCard}>
              <h3>$50</h3>
              <p>Mental Health Support</p>
              <Link href="/events" className={styles.tierAction}>Donate ➔</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Quote & Image Section */}
      <section className={styles.featuredQuoteSection}>
        <div className={styles.featuredContainer}>
          <div className={styles.quoteBox}>
            <div className={styles.quoteAccent} />
            <blockquote className={styles.latestQuote}>
              &ldquo;You Are Worthy Of Every Dream You Carry! And You Are Not Alone - Not Anymore.&rdquo;
            </blockquote>
            <p className={styles.quoteAuthor}>— African Girl Rise Community</p>
          </div>
          <div className={styles.featuredImageWrapper}>
            <Image src="/images/worthy-dream.jpg" alt="Girls holding signs of empowerment" fill className={styles.featuredImage} style={{ objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* Join Us / CTA Banner */}
      <section className={styles.joinUsSection}>
        <div className={styles.joinUsCard}>
          <h2 className="heading-lg text-gradient">Join Us</h2>
          <p>Do you want to join African Girl Rise as a member?</p>
          <Link href="/contact" className={styles.btnPrimaryOutlined}>Become a Member</Link>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsVideoModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setIsVideoModalOpen(false)}>
              &times;
            </button>
            <video
              controls
              autoPlay
              className={styles.modalVideo}
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
