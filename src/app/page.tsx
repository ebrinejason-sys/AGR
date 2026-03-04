"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import DonationModal from "@/components/DonationModal";

export default function Home() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTextCenter}>
            <h1 className={styles.heroTitle}>African Girl Rise</h1>
            <p className={styles.heroTagline}>Breaking cycles. Building futures.</p>
            <p className={styles.heroDescription}>
              Empowering adolescent girls through mental health support, education, and leadership training.
            </p>
            <div className={styles.heroButtons}>
              <button
                onClick={() => setIsDonationModalOpen(true)}
                className={styles.heroButtonPrimary}
              >
                Donate Now
                <span className={styles.buttonArrow}>→</span>
              </button>
              <Link href="/our-story" className={styles.heroButtonSecondary}>
                Learn Our Story
                <span className={styles.buttonArrow}>→</span>
              </Link>
            </div>
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
            <h2 className="heading-lg">Who We Are</h2>
            <p>
              We are a registered Ugandan initiative dedicated to breaking cycles of poverty and empowering adolescent girls. We provide school-based mental health support, academic perseverance programs, and holistic care to help girls transcend their circumstances and author their own futures.
            </p>
            <p>
              Founded by Akatwijuka Grace, a fourth-year law student, our mission is to be the consistent, empowering space between a girl's challenging reality and her radiant possibility.
            </p>
            <Link href="/our-story" className={styles.btnSecondary}>Meet Grace & Our Story</Link>
          </div>
        </div>
      </section>

      {/* Core Programs Section */}
      <section className={styles.projectsSection}>
        <div className={styles.projectsHeader}>
          <div>
            <span className={styles.smallLabel}>Our Impact</span>
            <h2 className="heading-lg">Core Programs</h2>
          </div>
          <Link href="/programs" className={styles.btnSecondary}>View All Programs</Link>
        </div>
        <div className={styles.projectsGrid}>
          <div className={styles.projectCard}>
            <div className={styles.projectImageWrapper}>
              <Image src="/images/program-1.jpg" alt="The Rise Room Initiative" fill className={styles.projectImage} style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.projectContent}>
              <h3>The Rise Room Initiative</h3>
              <p>School-based safe spaces providing mental health support and peer networks.</p>
              <Link href="/programs#rise-room" className={styles.projectLink}>Learn More →</Link>
            </div>
          </div>

          <div className={styles.projectCard}>
            <div className={styles.projectImageWrapper}>
              <Image src="/images/program-2.jpg" alt="Academic Rescue Program" fill className={styles.projectImage} style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.projectContent}>
              <h3>Academic Rescue Program</h3>
              <p>Tutoring, scholarships, and STEM exposure to keep girls excelling in school.</p>
              <Link href="/programs#academic-rescue" className={styles.projectLink}>Learn More →</Link>
            </div>
          </div>

          <div className={styles.projectCard}>
            <div className={styles.projectImageWrapper}>
              <Image src="/images/program-3.jpg" alt="Leadership & Life Skills" fill className={styles.projectImage} style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.projectContent}>
              <h3>Leadership & Life Skills Academy</h3>
              <p>Financial literacy, public speaking, digital skills and entrepreneurship training.</p>
              <Link href="/programs#leadership" className={styles.projectLink}>Learn More →</Link>
            </div>
          </div>

          <div className={styles.projectCard}>
            <div className={styles.projectImageWrapper}>
              <Image src="/images/program-4.jpg" alt="Health & Wellness" fill className={styles.projectImage} style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.projectContent}>
              <h3>Health & Wellness Program</h3>
              <p>SRHR education, menstrual health management, nutrition and access to healthcare.</p>
              <Link href="/programs#health-wellness" className={styles.projectLink}>Learn More →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Four Pillars Section */}
      <section className={styles.pillarsSection}>
        <h2 className="heading-lg">Our Four Pillars of Change</h2>
        <div className={styles.pillarsGrid}>
          <div className={styles.pillarCard}>
            <div className={styles.pillarNumber}>01</div>
            <h3>Healing the Ground</h3>
            <p>Mental and emotional foundations where girls can heal, speak freely, and be heard without judgment.</p>
          </div>
          <div className={styles.pillarCard}>
            <div className={styles.pillarNumber}>02</div>
            <h3>Building the Ladder</h3>
            <p>Educational and practical ascension through tutoring, scholarships, and essential support packages.</p>
          </div>
          <div className={styles.pillarCard}>
            <div className={styles.pillarNumber}>03</div>
            <h3>Reaching New Altitudes</h3>
            <p>Future and leadership development through career mentorship, university visits, and vocational training.</p>
          </div>
          <div className={styles.pillarCard}>
            <div className={styles.pillarNumber}>04</div>
            <h3>Knowing Your Rights</h3>
            <p>Legal literacy and advocacy to ensure girls understand their rights and have access to justice.</p>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className={styles.supportSection}>
        <h2 className="heading-lg">Ways to Support Our Mission</h2>
        <div className={styles.supportGrid}>
          <div className={styles.supportCard}>
            <div className={styles.supportIcon}>❤️</div>
            <h3>Donate</h3>
            <p>Fund a girl's journey, a Rise Room, or essential support packages</p>
            <button
              onClick={() => setIsDonationModalOpen(true)}
              className={styles.btnSecondary}
            >
              Donate
            </button>
          </div>
          <div className={styles.supportCard}>
            <div className={styles.supportIcon}>🤝</div>
            <h3>Partner</h3>
            <p>Bring your organization's resources to scale our impact</p>
            <Link href="/contact/partner" className={styles.btnSecondary}>Partner With Us</Link>
          </div>
          <div className={styles.supportCard}>
            <div className={styles.supportIcon}>👥</div>
            <h3>Mentor</h3>
            <p>Share your time and wisdom to guide rising leaders</p>
            <Link href="/contact/mentor" className={styles.btnSecondary}>Get Involved</Link>
          </div>
          <div className={styles.supportCard}>
            <div className={styles.supportIcon}>📢</div>
            <h3>Advocate</h3>
            <p>Spread our message that every girl deserves to rise</p>
            <Link href="/contact/advocate" className={styles.btnSecondary}>Share Stories</Link>
          </div>
        </div>
      </section>

      {/* Featured Quote */}
      <section className={styles.featuredQuoteSection}>
        <div className={styles.quoteBox}>
          <div className={styles.quoteAccent} />
          <blockquote className={styles.latestQuote}>
            &ldquo;Your beginning does not define your becoming.&rdquo;
          </blockquote>
          <p className={styles.quoteAuthor}>— Akatwijuka Grace, Founder</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2 className="heading-lg">Join This Movement</h2>
        <p>Together, we are building a generation defined not by their struggles, but by their strength.</p>
        <Link href="/contact" className={styles.btnPrimary}>Get Involved Today</Link>
      </section>

      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </div>
  );
}
