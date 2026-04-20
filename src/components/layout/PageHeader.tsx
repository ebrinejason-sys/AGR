import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

export default function PageHeader({ title, subtitle, eyebrow }: PageHeaderProps) {
  return (
    <section className={styles.pageHeader}>
      <div className={styles.pageHeaderInner}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h1 className={styles.pageTitle}>{title}</h1>
        {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
      </div>
      <div className={styles.pageHeaderDecor} aria-hidden="true">
        <div className={styles.decorOrb1} />
        <div className={styles.decorOrb2} />
      </div>
    </section>
  );
}
