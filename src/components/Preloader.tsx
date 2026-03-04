"use client";

import { useState, useEffect } from 'react';
import styles from './Preloader.module.css';

export default function Preloader() {
    const [show, setShow] = useState(true);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        // Prevent scrolling while preloader is visible
        document.body.style.overflow = 'hidden';

        // Hide the preloader when the window load event fires
        const handleLoad = () => {
            setFade(true);
            document.body.style.overflow = 'unset';
            setTimeout(() => setShow(false), 500); // 500ms for fade transition
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            // Fallback timer just in case something hangs
            const fallbackTimer = setTimeout(handleLoad, 3000);
            return () => {
                window.removeEventListener('load', handleLoad);
                clearTimeout(fallbackTimer);
                document.body.style.overflow = 'unset';
            };
        }
    }, []);

    if (!show) return null;

    return (
        <div className={`${styles.preloader} ${fade ? styles.fadeOut : ''}`}>
            <div className={styles.spinner}>
                <div className={styles.doubleBounce1}></div>
                <div className={styles.doubleBounce2}></div>
            </div>
            <div className={styles.brandText}>African Girl Rise</div>
        </div>
    );
}
