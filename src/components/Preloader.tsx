"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './Preloader.module.css';

export default function Preloader() {
    const [show, setShow] = useState(true);
    const [fade, setFade] = useState(false);
    const didFinishRef = useRef(false);

    useEffect(() => {
        const runtimeSafeMode = document.documentElement.getAttribute('data-runtime-safe') === '1';
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

        // Avoid expensive startup effects on iOS and reduced-motion devices.
        if (runtimeSafeMode || isIOS || prefersReducedMotion || coarsePointer) {
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

        const fallbackTimer = window.setTimeout(finish, 2500);
        window.addEventListener('load', finish);

        if (document.readyState === 'complete') {
            finish();
        }

        return () => {
            window.removeEventListener('load', finish);
            window.clearTimeout(fallbackTimer);
            if (hideTimer) window.clearTimeout(hideTimer);
            document.body.style.overflow = prevOverflow;
        };
    }, []);

    if (!show) return null;

    return (
        <div className={`${styles.preloader} ${fade ? styles.fadeOut : ''}`}>
            <div className={styles.heartContainer}>
                <svg className={styles.heart} viewBox="0 0 32 29.6" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
                        c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
                </svg>
            </div>
            <div className={styles.brandText}>African Girl Rise</div>
            <div className={styles.slogan}>Empowering African girls to rise</div>
        </div>
    );
}
