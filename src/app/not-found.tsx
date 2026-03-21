import Link from 'next/link';
import styles from './layout.module.css';

export default function NotFound() {
  return (
    <div className={styles.centeredPage}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link 
        href="/"
        className="btn-primary"
        style={{
          display: 'inline-block'
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
