import styles from './layout.module.css';

export default function Loading() {
  return (
    <div className={styles.centeredPage}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(233, 30, 140, 0.1)',
        borderTop: '4px solid var(--color-pink, #e91e8c)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
    </div>
  );
}
