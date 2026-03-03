"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

import { ThemeToggle } from '../ThemeToggle';

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
                <Image src="/logo.png" alt="African Girl Rise Logo" width={40} height={40} priority className={styles.logoImage} />
                <span className={styles.brandName}>AFRICAN GIRL RISE</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.desktopNav}>
                <Link href="/" className={styles.navLink}>HOME</Link>
                <Link href="/our-story" className={styles.navLink}>WHO WE ARE</Link>
                <Link href="/programs" className={styles.navLink}>OUR WORK</Link>
                <Link href="/legal-advocacy" className={styles.navLink}>LEGAL ADVOCACY</Link>
                <Link href="/stories" className={styles.navLink}>STORIES</Link>
                <Link href="/contact" className={styles.navLink}>CONTACT</Link>
                <Link href="/donate" className={styles.donateBtn}>DONATE</Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Navigation Overlay */}
            <div className={`${styles.mobileNavOverlay} ${isOpen ? styles.open : ''}`}>
                <nav className={styles.mobileNavLinks}>
                    <Link href="/" className={styles.mobileNavLink} onClick={closeMenu}>HOME</Link>
                    <Link href="/our-story" className={styles.mobileNavLink} onClick={closeMenu}>WHO WE ARE</Link>
                    <Link href="/programs" className={styles.mobileNavLink} onClick={closeMenu}>OUR WORK</Link>
                    <Link href="/legal-advocacy" className={styles.mobileNavLink} onClick={closeMenu}>LEGAL ADVOCACY</Link>
                    <Link href="/stories" className={styles.mobileNavLink} onClick={closeMenu}>STORIES</Link>
                    <Link href="/contact" className={styles.mobileNavLink} onClick={closeMenu}>CONTACT</Link>
                    <Link href="/donate" className={styles.mobileDonateBtn} onClick={closeMenu}>DONATE</Link>
                </nav>
            </div>
        </header>
    );
}
