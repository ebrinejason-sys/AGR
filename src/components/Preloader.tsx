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
