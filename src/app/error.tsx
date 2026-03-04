'use client';

import { useEffect } from 'react';
import styles from './page.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorTitle}>Something went wrong</h1>
      <p className={styles.errorMessage}>
        We apologize for the inconvenience. Please try refreshing the page.
      </p>
      <button
        onClick={() => reset()}
        className={styles.errorButton}
      >
        Try again
      </button>
    </div>
  );
}
