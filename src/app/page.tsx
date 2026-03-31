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
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTextCenter}>
            <h1 className={styles.heroTitle}>African Girl Rise</h1>
            <p className={styles.heroTagline}>Breaking cycles. Building futures.</p>
            <p className={styles.heroDescription}>
              Breaking the cycle of poverty and empowering adolescent girls through mental health support, education, and leadership training.
            </p>
            <div className={styles.heroButtons}>
              <button
                onClick={() => setIsDonationModalOpen(true)}
                className={styles.heroButtonPrimary}
              >
                Donate Now
                <span className={styles.buttonArrow}>→</span>
              </button>
              <Link href="/programs" className={styles.heroButtonSecondary}>
                Explore Core Programs
                <span className={styles.buttonArrow}>→</span>
              </Link>
              <Link href="/legal-advocacy" className={styles.heroButtonSecondary}>
                Legal Advocacy
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
            <Image
              src="/images/about-us.jpg"
              alt="About Us"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className={styles.aboutImage}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.aboutTextCard}>
            <h2 className="heading-lg">Who We Are</h2>
            <p>
              We are a registered Ugandan initiative dedicated to breaking cycles of poverty and empowering adolescent girls. We provide school-based mental health support, academic perseverance programs, and holistic care to help girls transcend their circumstances and author their own futures.
            </p>
            <p className={styles.nonprofitText}>
              <strong>Non-profit organisation registered</strong>
            </p>
            <p>
              Founded by Akatwijuka Grace, a fourth-year law student, our mission is to be the consistent, empowering space between a girl&apos;s challenging reality and her radiant possibility.
            </p>
            <Link href="/our-story" className={styles.btnSecondary}>Our Story</Link>
          </div>
        </div>
      </section>

      {/* The Reality We Face Section */}
      <section className={styles.realitySection}>
        <div className={styles.realityContainer}>
          <h2 className="heading-lg" style={{ textAlign: "center", marginBottom: "2rem" }}>
            The <span className="text-gradient">Reality</span> We Face
          </h2>
          <div className={styles.realityGrid}>
            <div className={styles.realityCard}>
              <h3 className="text-gradient">78%</h3>
              <p>of girls report persistent anxiety or trauma from extreme poverty</p>
            </div>
            <div className={styles.realityCard}>
              <h3 className="text-gradient">4 in 10</h3>
              <p>girls drop out before Form 4 due to overwhelming economic pressure</p>
            </div>
            <div className={styles.realityCard}>
              <h3 className="text-gradient">Teen Pregnancy</h3>
              <p>stands as the #1 cause of permanent school dropout in marginalized areas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact in Numbers Section */}
      <section className={styles.impactSection}>
        <div className={styles.impactContent}>
          <h2 className="heading-lg" style={{ color: "white" }}>Our Impact So Far</h2>
          <div className={styles.impactGrid}>
            <div className={styles.impactItem}>
              <div className={styles.impactNumber}>
                <AnimatedCounter
                  target={56000}
                  suffix="+"
                  continuous={true}
                  incrementInterval={2000}
                />
              </div>
              <p>Target Girls Reached</p>
            </div>
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
            <p>Fund a girl&apos;s journey, a Rise Room, or essential support packages</p>
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
            <p>Bring your organization&apos;s resources to scale our impact</p>
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
