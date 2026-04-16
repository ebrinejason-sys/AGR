import styles from './layout.module.css';

export default function Loading() {
  return (
    <div className={styles.centeredPage}>
      <div className={styles.spinner} />
    </div>
  );
}
