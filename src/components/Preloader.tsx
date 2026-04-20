import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Preloader.module.css';

type PreloaderProps = {
    skip?: boolean;
};

type NetworkInformationLike = {
    saveData?: boolean;
    effectiveType?: string;
};

export default function Preloader({ skip = false }: PreloaderProps) {
    // Initialise directly from the prop so the heavy animated DOM is never
    // injected into the page when skip=true (iOS / safe-mode), avoiding a
    // one-frame flash of the complex SVG that can spike GPU memory on iOS.
    const [show, setShow] = useState(!skip);
    const [fade, setFade] = useState(false);
    const didFinishRef = useRef(false);

    useEffect(() => {
        if (skip) return;

        const runtimeSafeMode = document.documentElement.getAttribute('data-runtime-safe') === '1';
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
        const isSlowNetwork = Boolean(connection?.saveData) || /2g|slow-2g/i.test(connection?.effectiveType || '');

        if (runtimeSafeMode || prefersReducedMotion || isSlowNetwork) {
            setShow(false);
            return;
        }

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        let hideTimer: number | undefined;

        const finish = () => {
            if (didFinishRef.current) return;
            didFinishRef.current = true;
            setFade(true);
            document.body.style.overflow = prevOverflow;
            hideTimer = window.setTimeout(() => setShow(false), 500);
        };

        // Expose finish so skip button can call it
        (window as Window & { __preloaderSkip?: () => void }).__preloaderSkip = finish;

        const fallbackTimer = window.setTimeout(finish, 2800);
        window.addEventListener('load', finish);

        if (document.readyState === 'complete') {
            finish();
        }

        return () => {
            window.removeEventListener('load', finish);
            window.clearTimeout(fallbackTimer);
            if (hideTimer) window.clearTimeout(hideTimer);
            document.body.style.overflow = prevOverflow;
            delete (window as Window & { __preloaderSkip?: () => void }).__preloaderSkip;
        };
    }, [skip]);

    if (!show) return null;

    const handleSkip = () => {
        const fn = (window as Window & { __preloaderSkip?: () => void }).__preloaderSkip;
        if (fn) fn();
    };

    return (
        <div className={`${styles.preloader} ${fade ? styles.fadeOut : ''}`}>
            {/* Skip button */}
            <button className={styles.skipBtn} onClick={handleSkip} aria-label="Skip intro">Skip →</button>

            <div className={styles.inner}>
                {/* Spinning rings (double layer) */}
                <div className={styles.ringWrap}>
                    <svg className={styles.ringOuter} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="60" cy="60" r="54" stroke="rgba(233,30,99,0.10)" strokeWidth="2.5" />
                        <circle
                            cx="60" cy="60" r="54"
                            stroke="url(#ringGradOuter)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeDasharray="339.3"
                            strokeDashoffset="254"
                        />
                        <defs>
                            <linearGradient id="ringGradOuter" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#e91e63" />
                                <stop offset="100%" stopColor="#9c27b0" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <svg className={`${styles.ring} ${styles.ringInner}`} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="40" cy="40" r="34" stroke="rgba(156,39,176,0.15)" strokeWidth="2" />
                        <circle
                            cx="40" cy="40" r="34"
                            stroke="url(#ringGradInner)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray="213.6"
                            strokeDashoffset="160"
                        />
                        <defs>
                            <linearGradient id="ringGradInner" x1="80" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#9c27b0" />
                                <stop offset="100%" stopColor="#e91e63" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className={styles.logoBox}>
                        <img
                            src="/logo.png"
                            alt="African Girl Rise"
                            width={64}
                            height={64}
                            className={styles.logoImg}
                        />
                    </div>
                </div>

                {/* Brand text */}
                <div className={styles.textWrap}>
                    <div className={styles.brandName}>AFRICAN GIRL RISE</div>
                    <div className={styles.tagline}>Breaking cycles. One girl at a time.</div>
                </div>

                {/* Dots animation */}
                <div className={styles.dotsRow}>
                    <span className={styles.dot} />
                    <span className={`${styles.dot} ${styles.dot2}`} />
                    <span className={`${styles.dot} ${styles.dot3}`} />
                </div>
            </div>

            {/* Quick links bar */}
            <div className={styles.quickLinks}>
                <Link to="/" className={styles.quickLink} onClick={handleSkip}>Home</Link>
                <span className={styles.quickLinkDivider} />
                <Link to="/donate" className={styles.quickLink}>Donate</Link>
                <span className={styles.quickLinkDivider} />
                <Link to="/programs" className={styles.quickLink}>Programs</Link>
            </div>

            {/* Progress bar */}
            <div className={styles.progressTrack}>
                <div className={styles.progressFill} />
            </div>
        </div>
    );
}
