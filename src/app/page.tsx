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
          <h1 className="heading-xl">
            Empower<br />
            <span className="text-gradient">The Future</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Breaking cycles of poverty and ensuring no girl in our community walks the path our friends walked. Rise. Then reach back.
          </p>

          <div className={styles.heroActions}>
            <Link href="/our-story" className={styles.btnPrimary}>
              Read Our Story
            </Link>
            <Link href="/events" className={styles.btnSecondary}>
              Donate Now
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>50+</span>
            <span className={styles.statLabel}>Girls Supported</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>3</span>
            <span className={styles.statLabel}>Communities Reached</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>12+</span>
            <span className={styles.statLabel}>Scholarships Given</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>1</span>
            <span className={styles.statLabel}>Rise Room Built</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howSection}>
        <h2 className="heading-lg">How We <span className="text-gradient">Break the Cycle</span></h2>
        <p className={styles.howSubtitle}>
          A three-pillar approach to generational transformation
        </p>
        <div className={styles.howGrid}>
          <div className={styles.howCard}>
            <div className={styles.howStep}>01</div>
            <h3>Identify</h3>
            <p>We find girls at risk of dropping out — girls facing poverty, early marriage, or abuse — and we reach them before they fall away.</p>
          </div>
          <div className={styles.howConnector} />
          <div className={styles.howCard}>
            <div className={styles.howStep}>02</div>
            <h3>Empower</h3>
            <p>Through scholarships, Rise Rooms (safe spaces), mentorship, and legal advocacy, we give them the tools to stay in school and heal.</p>
          </div>
          <div className={styles.howConnector} />
          <div className={styles.howCard}>
            <div className={styles.howStep}>03</div>
            <h3>Rise</h3>
            <p>She rises — and her family rises with her. Her income lifts them from poverty. Her education ensures her children are educated. Then she reaches back.</p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className={styles.philosophy}>
        <div className={styles.philosophyCard}>
          <h2 className="heading-lg">Vision &amp; Mission</h2>
          <p>
            Your children do not have to suffer the way you suffered.
            When you keep your daughter in school, you are changing your family&apos;s future for generations.
          </p>
          <div className={styles.philosophyGrid}>
            <div className={styles.traitBox}>
              <div className={styles.traitIcon} style={{ background: 'var(--color-pink)' }}></div>
              <h3>Empowerment</h3>
              <p>Income lifts them from poverty.</p>
            </div>
            <div className={styles.traitBox}>
              <div className={styles.traitIcon} style={{ background: 'var(--color-purple)' }}></div>
              <h3>Education</h3>
              <p>Ensures children are educated.</p>
            </div>
            <div className={styles.traitBox}>
              <div className={styles.traitIcon} style={{ background: 'var(--color-lightblue)' }}></div>
              <h3>Advocacy</h3>
              <p>Voice advocates for the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Quote Section */}
      <section className={styles.quoteSection}>
        <div className={styles.quoteCard}>
          <div className={styles.quoteAccent} />
          <blockquote className={styles.quoteText}>
            &ldquo;My mother studied hungry so I could study fed. My father struggled through school so my fees could be paid. They broke the cycle. That is the gift I want every girl to receive.&rdquo;
          </blockquote>
          <p className={styles.quoteAuthor}>— Grace Akatwijuka, Founder</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2 className="heading-lg">Join the <span className="text-gradient">Movement</span></h2>
        <p className={styles.ctaSubtitle}>
          Every contribution — whether time, money, or voice — changes the trajectory of a girl&apos;s life and her entire family for generations.
        </p>
        <div className={styles.ctaActions}>
          <Link href="/events" className={styles.btnPrimary}>Donate Now</Link>
          <Link href="/contact" className={styles.btnSecondary}>Get Involved</Link>
        </div>
      </section>
    </div>
  );
}
