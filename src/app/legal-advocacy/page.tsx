"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function LegalAdvocacy() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroImageWrapper}>
            <Image src="/images/IoD5Gp5k-1000x666.jpeg" alt="Legal Advocacy" fill className={styles.heroImage} style={{ objectFit: 'cover' }} priority />
          </div>
          <div className={styles.heroText}>
            <h1 className="heading-xl">Knowing Your Rights</h1>
            <p className={styles.heroSubtitle}>
              Legal Advocacy & Empowerment
            </p>
            <p className={styles.tagline}>
              Your Rights. Your Power. Your Protection.
            </p>
          </div>
        </div>
      </section>

      {/* Headline Section */}
      <section className={styles.introSection}>
        <div className={styles.introContainer}>
          <h2 className="heading-lg">No girl should suffer in silence. No woman should be abused without recourse.</h2>
          <p className={styles.introText}>
            In Uganda, countless girls and women suffer abuse—physical, emotional, sexual—without knowing they have rights. Without knowing where to turn. Without knowing that the law exists to protect them.
          </p>
        </div>
      </section>

      {/* The Reality Section */}
      <section className={styles.realitySection}>
        <div className={styles.realityContainer}>
          <h2 className="heading-lg">The Reality We Address</h2>

          <div className={styles.realityIntro}>
            <p className={styles.highlight}>
              In Uganda, countless girls and women suffer abuse without knowing they have rights, where to turn, or that the law exists to protect them.
            </p>
          </div>

          <div className={styles.truthsGrid}>
            <div className={styles.truth}>
              <div className={styles.truthIcon}>⚖️</div>
              <p>Many girls do not know that defilement is a crime punishable by law</p>
            </div>
            <div className={styles.truth}>
              <div className={styles.truthIcon}>🚔</div>
              <p>Many women do not know they can report domestic violence</p>
            </div>
            <div className={styles.truth}>
              <div className={styles.truthIcon}>💍</div>
              <p>Many families do not know that forcing a girl into marriage is illegal</p>
            </div>
            <div className={styles.truth}>
              <div className={styles.truthIcon}>👨‍🏫</div>
              <p>Many teachers who abuse students face no consequences because girls don't know how to report them</p>
            </div>
            <div className={styles.truth}>
              <div className={styles.truthIcon}>🏠</div>
              <p>Many mothers stay in violent homes because they don't know their rights to protection</p>
            </div>
            <div className={styles.truth}>
              <div className={styles.truthIcon}>📢</div>
              <p>This ignorance is not innocence. It is vulnerability.</p>
            </div>
          </div>

          <div className={styles.beliefSection}>
            <h3>Our Belief</h3>
            <p>
              At African Girl Rise, we believe that <strong>knowledge of the law is power.</strong> A girl who knows her rights is harder to exploit. A woman who knows where to report is harder to trap. A community that understands legal protections is harder to manipulate.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className={styles.whatWeDoSection}>
        <div className={styles.whatWeDoContainer}>
          <h2 className="heading-lg">Legal Literacy. Legal Protection. Legal Empowerment.</h2>

          {/* Program 1 */}
          <div className={styles.programBox}>
            <div className={styles.programNumber}>01</div>
            <h3>Legal Literacy Workshops</h3>
            <p>We teach girls and women about their basic legal rights in simple, accessible language:</p>
            <ul className={styles.programList}>
              <li>What is defilement? (Understanding the law)</li>
              <li>Age of consent and child marriage (Why it's illegal)</li>
              <li>Domestic violence — physical, emotional, economic (What it looks like, what to do)</li>
              <li>Property rights (For widows, for daughters)</li>
              <li>Education rights (No one can force you out of school)</li>
              <li>Reporting mechanisms (Where to go, who to tell)</li>
            </ul>
            <p className={styles.format}>
              <strong>Format:</strong> Interactive workshops in schools and communities, using local languages, real-life scenarios, and question-and-answer sessions.
            </p>
          </div>

          {/* Program 2 */}
          <div className={styles.programBox}>
            <div className={styles.programNumber}>02</div>
            <h3>Legal Referral Network</h3>
            <p>We connect girls and women with trusted legal and protective resources:</p>
            <ul className={styles.programList}>
              <li>Probation and Social Welfare Officers — for child protection cases</li>
              <li>Police Child and Family Protection Units — for reporting abuse</li>
              <li>Local Council Courts — for community-level disputes</li>
              <li>Legal Aid Organizations — for free legal representation</li>
              <li>Uganda Law Society pro bono services — for serious cases</li>
            </ul>
            <p className={styles.emphasis}>
              <strong>We don't just teach rights. We connect girls to the people who can enforce those rights.</strong>
            </p>
          </div>

          {/* Program 3 */}
          <div className={styles.programBox}>
            <div className={styles.programNumber}>03</div>
            <h3>Domestic Violence Support</h3>
            <p>For women experiencing domestic violence, we provide:</p>
            <ul className={styles.programList}>
              <li>Safe spaces to share — Confidential conversations with trained counselors</li>
              <li>Safety planning — What to do in an emergency</li>
              <li>Referral to shelters — Temporary safe accommodation when needed</li>
              <li>Legal guidance — How to get protection orders, report abuse</li>
              <li>Court accompaniment — Support during legal proceedings</li>
              <li>Economic support — For women leaving violent situations</li>
            </ul>
            <p className={styles.emphasis}>
              <strong>We walk with them through every step.</strong>
            </p>
          </div>

          {/* Program 4 */}
          <div className={styles.programBox}>
            <div className={styles.programNumber}>04</div>
            <h3>School-Based Legal Awareness</h3>
            <p>In partner schools, we:</p>
            <ul className={styles.programList}>
              <li>Conduct regular legal literacy sessions</li>
              <li>Display posters with key rights information and emergency contacts</li>
              <li>Train teachers to recognize and report abuse</li>
              <li>Establish confidential reporting mechanisms within schools</li>
              <li>Ensure girls know: "If a teacher touches you inappropriately, here is what to do."</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Components Section */}
      <section className={styles.componentsSection}>
        <div className={styles.componentsContainer}>
          <h2 className="heading-lg">Core Components of Our Legal Program</h2>
          <div className={styles.componentsGrid}>
            <div className={styles.componentCard}>
              <div className={styles.componentIcon}>📚</div>
              <h3>Education</h3>
              <p>Girls and women understand their constitutional and legal rights in practical terms</p>
            </div>
            <div className={styles.componentCard}>
              <div className={styles.componentIcon}>🤝</div>
              <h3>Access</h3>
              <p>Clear pathways to justice and protective services, with no barriers to reporting</p>
            </div>
            <div className={styles.componentCard}>
              <div className={styles.componentIcon}>💪</div>
              <h3>Empowerment</h3>
              <p>Girls develop the confidence to speak up, report abuse, and seek justice</p>
            </div>
            <div className={styles.componentCard}>
              <div className={styles.componentIcon}>🏛️</div>
              <h3>Advocacy</h3>
              <p>We engage with legal institutions to ensure systems are responsive to girls' protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className={styles.impactSection}>
        <div className={styles.impactContainer}>
          <h2 className="heading-lg">The Impact of Legal Knowledge</h2>
          <p className={styles.impactIntro}>
            When a girl knows her rights, everything changes. She is empowered to speak. She knows she is protected. She understands that the law is not against her—it is for her.
          </p>
          <div className={styles.impactBenefits}>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>1</div>
              <p>Girls are less likely to accept abuse as normal</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>2</div>
              <p>Women are more likely to report violations and seek justice</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>3</div>
              <p>Communities develop accountability mechanisms</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>4</div>
              <p>Systemic change begins when girls demand their rights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <h2 className="heading-lg">Support Legal Empowerment</h2>
        <p>Help us ensure that every girl knows her rights and has access to justice.</p>
        <div className={styles.ctaButtons}>
          <Link href="/donate" className={styles.btnPrimary}>Donate Now</Link>
          <Link href="/contact" className={styles.btnSecondary}>Partner With Us</Link>
        </div>
      </section>
    </div>
  );
}
