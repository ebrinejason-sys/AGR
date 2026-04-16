import styles from "./LoadingSkeletons.module.css";

export function HeroSkeleton() {
  return (
    <div className={styles.heroSkeleton}>
      <div className={styles.skeletonBg} />
      <div className={styles.skeletonText}>
        <div className={`${styles.skeletonLine} ${styles.lineHeroLarge}`} />
        <div className={`${styles.skeletonLine} ${styles.lineHeroMedium}`} />
        <div className={`${styles.skeletonLine} ${styles.lineHeroSmall}`} />
        <div className={styles.buttonRow}>
          <div className={`${styles.skeletonLine} ${styles.buttonLine}`} />
          <div className={`${styles.skeletonLine} ${styles.buttonLine}`} />
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className={styles.cardSkeleton}>
      <div className={`${styles.skeletonLine} ${styles.cardTitle}`} />
      <div className={`${styles.skeletonLine} ${styles.cardText}`} />
      <div className={`${styles.skeletonLine} ${styles.cardTextShort}`} />
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className={styles.sectionSkeleton}>
      <div className={`${styles.skeletonLine} ${styles.sectionTitle}`} />
      <div className={styles.sectionGrid}>
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
