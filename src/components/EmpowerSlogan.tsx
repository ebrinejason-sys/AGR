import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EMPOWER_GIRL_PHRASES, HERO_SLOGAN_STEM } from '@/lib/slogans';
import styles from './EmpowerSlogan.module.css';

type EmpowerSloganProps = {
    variant?: 'hero' | 'footer';
};

export default function EmpowerSlogan({ variant = 'hero' }: EmpowerSloganProps) {
    const [index, setIndex] = useState(0);
    const phrase = EMPOWER_GIRL_PHRASES[index];
    const Tag = variant === 'hero' ? 'h1' : 'p';
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        if (reduceMotion) return;
        const interval = window.setInterval(() => {
            setIndex((current) => (current + 1) % EMPOWER_GIRL_PHRASES.length);
        }, 2800);

        return () => window.clearInterval(interval);
    }, [reduceMotion]);

    return (
        <Tag className={`${styles.slogan} ${styles[variant]}`}>
            <span className={styles.visuallyHidden} aria-live="polite">
                {HERO_SLOGAN_STEM} {phrase}.
            </span>
            <span className={styles.stem} aria-hidden="true">
                {HERO_SLOGAN_STEM}
            </span>
            <span className={styles.phraseSlot} aria-hidden="true">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={phrase}
                        className={styles.phrase}
                        initial={reduceMotion ? false : { opacity: 0, y: '0.35em' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: '-0.35em' }}
                        transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {phrase}.
                    </motion.span>
                </AnimatePresence>
            </span>
        </Tag>
    );
}
