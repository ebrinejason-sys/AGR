"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    // Close menu when route changes (on mobile)
    const closeMenu = () => setIsOpen(false);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logoLink} onClick={closeMenu}>
                <Image src="/logo.png" alt="African Girl Rise Logo" width={40} height={40} className={styles.logoImage} />
                <span className={styles.brandName}>AFRICAN GIRL RISE</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.desktopNav}>
                <Link href="/our-story" className={styles.navLink}>Our Story</Link>
                <Link href="/events" className={styles.navLink}>Events</Link>
                <Link href="/stories" className={styles.navLink}>Stories</Link>
                <Link href="/contact" className={styles.navLink}>Contact</Link>
                <Link href="/events" className={styles.donateBtn}>Donate</Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Navigation Overlay */}
            <div className={`${styles.mobileNavOverlay} ${isOpen ? styles.open : ''}`}>
                <nav className={styles.mobileNavLinks}>
                    <Link href="/" className={styles.mobileNavLink} onClick={closeMenu}>Home</Link>
                    <Link href="/our-story" className={styles.mobileNavLink} onClick={closeMenu}>Our Story</Link>
                    <Link href="/events" className={styles.mobileNavLink} onClick={closeMenu}>Events</Link>
                    <Link href="/stories" className={styles.mobileNavLink} onClick={closeMenu}>Stories</Link>
                    <Link href="/contact" className={styles.mobileNavLink} onClick={closeMenu}>Contact</Link>
                    <Link href="/events" className={styles.mobileDonateBtn} onClick={closeMenu}>Donate</Link>
                </nav>
            </div>
        </header>
    );
}
