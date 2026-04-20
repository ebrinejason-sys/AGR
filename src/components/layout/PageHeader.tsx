import styles from '@/pages/HomePage.module.css';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className={styles.pageHeader}>
      <h1 className={styles.pageTitle}>{title}</h1>
      <p className={styles.pageSubtitle}>{subtitle}</p>
    </section>
  );
}
