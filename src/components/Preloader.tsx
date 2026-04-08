"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './Preloader.module.css';

type PreloaderProps = {
    skip?: boolean;
};

type NetworkInformationLike = {
    saveData?: boolean;
    effectiveType?: string;
};

export default function Preloader({ skip = false }: PreloaderProps) {
    const [show, setShow] = useState(true);
    const [fade, setFade] = useState(false);
    const didFinishRef = useRef(false);

    useEffect(() => {
        if (skip) {
            setShow(false);
        }
    }, [skip]);

    useEffect(() => {
        if (skip) return;

        const runtimeSafeMode = document.documentElement.getAttribute('data-runtime-safe') === '1';
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

        const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
        const isSlowNetwork = Boolean(connection?.saveData) || /2g|slow-2g/i.test(connection?.effectiveType || '');

        // Avoid expensive startup effects on iOS and reduced-motion devices.
        if (runtimeSafeMode || isIOS || prefersReducedMotion || coarsePointer || isSlowNetwork) {
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
            hideTimer = window.setTimeout(() => setShow(false), 600);
        };

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
        };
    }, [skip]);

    if (!show) return null;

    return (
        <div className={`${styles.preloader} ${fade ? styles.fadeOut : ''}`} aria-hidden="true">
            <div className={styles.inner}>
                {/* Spinning ring + logo */}
                <div className={styles.ringWrap}>
                    <svg className={styles.ring} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="44" stroke="rgba(233,30,99,0.12)" strokeWidth="3" />
                        <circle
                            cx="50" cy="50" r="44"
                            stroke="url(#ringGrad)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="276.46"
                            strokeDashoffset="207"
                        />
                        <defs>
                            <linearGradient id="ringGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#e91e63" />
                                <stop offset="100%" stopColor="#9c27b0" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className={styles.logoBox}>
                        <Image
                            src="/logo.png"
                            alt="African Girl Rise"
                            width={60}
                            height={60}
                            priority
                            className={styles.logoImg}
                        />
                    </div>
                </div>

                {/* Brand text */}
                <div className={styles.textWrap}>
                    <div className={styles.brandName}>AFRICAN GIRL RISE</div>
                    <div className={styles.tagline}>Breaking cycles. One girl at a time.</div>
                </div>
            </div>

            {/* Progress bar */}
            <div className={styles.progressTrack}>
                <div className={styles.progressFill} />
            </div>
        </div>
    );
}
