import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import styles from '@/components/ThemeToggle.module.css';

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={styles.toggleHolder} aria-hidden="true" />;
  }

  const isDark = resolvedTheme !== 'light';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={styles.toggleBtn}
      aria-label="Toggle dark/light mode"
      title="Toggle dark/light mode"
    >
      {isDark ? <Sun size={20} className={styles.icon} /> : <Moon size={20} className={styles.icon} />}
    </button>
  );
}