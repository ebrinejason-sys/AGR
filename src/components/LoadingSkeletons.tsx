import styles from "./LoadingSkeletons.module.css";

export function HeroSkeleton() {
  return (
    <div className={styles.heroSkeleton}>
      <div className={styles.skeletonBg} />
      <div className={styles.skeletonText}>
        <div className={styles.skeletonLine} style={{ width: "40%", height: "3rem" }} />
        <div className={styles.skeletonLine} style={{ width: "60%", height: "2rem", marginTop: "1rem" }} />
        <div className={styles.skeletonLine} style={{ width: "50%", height: "1.2rem", marginTop: "1rem" }} />
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <div className={styles.skeletonLine} style={{ width: "150px", height: "3rem" }} />
          <div className={styles.skeletonLine} style={{ width: "150px", height: "3rem" }} />
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className={styles.cardSkeleton}>
      <div className={styles.skeletonLine} style={{ width: "80%", height: "1.5rem" }} />
      <div className={styles.skeletonLine} style={{ width: "100%", height: "1rem", marginTop: "1rem" }} />
      <div className={styles.skeletonLine} style={{ width: "90%", height: "1rem", marginTop: "0.5rem" }} />
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className={styles.sectionSkeleton}>
      <div className={styles.skeletonLine} style={{ width: "50%", height: "2.5rem", margin: "0 auto" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
