import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlowPink} />
        <div className={styles.heroGlowPurple} />
        <div className={styles.heroGlowBlue} />

        <div className={styles.heroContent}>
          <div className={styles.badge}>A Girl Defined By Rise Initiative</div>
          <h1 className="heading-xl">
            Empowering Girls to<br />
            <span className="text-gradient">Transcend Background</span>
          </h1>
          <p className={styles.heroSubtitle}>
            "Your beginning does not define your becoming."<br />
            <span className={styles.sloganText}>Your story isn't over. It's just getting powerful.</span>
          </p>

          <div className={styles.heroActions}>
            <Link href="/programs" className={styles.btnPrimary}>
              Explore Our Programs
            </Link>
            <Link href="/events" className={styles.btnSecondary}>
              Support the Vision
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>500+</span>
            <span className={styles.statLabel}>Girls Targeted</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>5</span>
            <span className={styles.statLabel}>Core Schools Reached</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>3</span>
            <span className={styles.statLabel}>Pillars of Intervention</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>1</span>
            <span className={styles.statLabel}>Generational Shift</span>
          </div>
        </div>
      </section>

      {/* The 3 Pillars Teaser */}
      <section className={styles.howSection}>
        <h2 className="heading-lg">The Three <span className="text-gradient">Pillars of Rise</span></h2>
        <p className={styles.howSubtitle}>
          Our framework turns philosophy into practice, creating a tangible ladder out of poverty.
        </p>
        <div className={styles.howGrid}>
          <div className={styles.howCard}>
            <div className={styles.howStep}>01</div>
            <h3>Healing the Ground</h3>
            <p>Mental and emotional foundations. Safe spaces and trauma-informed counseling, because you cannot rise from broken ground.</p>
          </div>
          <div className={styles.howConnector} />
          <div className={styles.howCard}>
            <div className={styles.howStep}>02</div>
            <h3>Building the Ladder</h3>
            <p>Educational and practical ascension. Academic rescue and essential support packages, because rising requires tangible steps.</p>
          </div>
          <div className={styles.howConnector} />
          <div className={styles.howCard}>
            <div className={styles.howStep}>03</div>
            <h3>Reaching New Altitudes</h3>
            <p>Future and leadership development. Career mentorship and vision planning, because rising should lead to sustained elevation.</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link href="/programs" className={styles.btnOutline}>Learn More About Our Framework</Link>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className={styles.philosophy}>
        <div className={styles.philosophyCard}>
          <h2 className="heading-lg">Our Global <span className="text-gradient">Vision</span></h2>
          <p>
            We dream of a continent—and a world—where you can look at any girl and see not where she comes from, but where she is going. We envision a future led by women who have turned their pain into purpose.
          </p>
          <div className={styles.philosophyGrid}>
            <div className={styles.traitBox}>
              <div className={styles.traitIcon} style={{ background: 'var(--color-pink)' }}></div>
              <h3>Resilience</h3>
              <p>We do not see broken girls. We see unyielding resilience waiting to be focused.</p>
            </div>
            <div className={styles.traitBox}>
              <div className={styles.traitIcon} style={{ background: 'var(--color-purple)' }}></div>
              <h3>Empowerment</h3>
              <p>Providing school-based mental health support, academic perseverance programs, and holistic care.</p>
            </div>
            <div className={styles.traitBox}>
              <div className={styles.traitIcon} style={{ background: 'var(--color-lightblue)' }}></div>
              <h3>Sisterhood</h3>
              <p>Mentorship from women who have walked similar paths and a peer network that uplifts instead of competes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Quote Section */}
      <section className={styles.quoteSection}>
        <div className={styles.quoteCard}>
          <div className={styles.quoteAccent} />
          <blockquote className={styles.quoteText}>
            &ldquo;We are not giving girls a voice. They have one. We are amplifying it until the whole world has to listen.&rdquo;
          </blockquote>
          <p className={styles.quoteAuthor}>— A Girl Defined By Rise Philosophy</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2 className="heading-lg">Join the <span className="text-gradient">Movement</span></h2>
        <p className={styles.ctaSubtitle}>
          This is not charity. This is strategic community transformation. For every girl who rises, three family members are lifted from extreme poverty.
        </p>
        <div className={styles.ctaActions}>
          <Link href="/events" className={styles.btnPrimary}>Donate & Fund</Link>
          <Link href="/contact" className={styles.btnSecondary}>Partner With Us</Link>
        </div>
      </section>
    </div>
  );
}
