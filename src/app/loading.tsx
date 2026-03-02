import styles from './page.module.css';

export default function Loading() {
  return (
    <div className={styles.container} style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '60vh' 
    }}>
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
