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

      {/* Philosophy Section */}
      <section className={styles.philosophy}>
        <div className={styles.philosophyCard}>
          <h2 className="heading-lg">Vision & Mission</h2>
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
    </div>
  );
}
