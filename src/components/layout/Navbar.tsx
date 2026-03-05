"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';
import DonationModal from '../DonationModal';

import { ThemeToggle } from '../ThemeToggle';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

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

                {/* About Dropdown */}
                <div className={styles.dropdown}>
                    <button className={styles.dropbtn}>ABOUT <span className={styles.chevron}>▼</span></button>
                    <div className={styles.dropdownContent}>
                        <Link href="/our-story" className={styles.dropdownLink}>Who We Are</Link>
                        <Link href="/founder" className={styles.dropdownLink}>Founder</Link>
                        <Link href="/stories" className={styles.dropdownLink}>Gallery</Link>
                    </div>
                </div>

                {/* Impact Dropdown */}
                <div className={styles.dropdown}>
                    <button className={styles.dropbtn}>IMPACT <span className={styles.chevron}>▼</span></button>
                    <div className={styles.dropdownContent}>
                        <Link href="/programs" className={styles.dropdownLink}>Our Work</Link>
                        <Link href="/legal-advocacy" className={styles.dropdownLink}>Legal Advocacy</Link>
                    </div>
                </div>

                <Link href="/events" className={styles.navLink}>EVENTS</Link>
                <Link href="/contact" className={styles.navLink}>CONTACT</Link>
                <button onClick={() => setIsDonationModalOpen(true)} className={styles.donateBtn}>DONATE</button>
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
                    <Link href="/founder" className={styles.mobileNavLink} onClick={closeMenu}>FOUNDER</Link>
                    <Link href="/programs" className={styles.mobileNavLink} onClick={closeMenu}>OUR WORK</Link>
                    <Link href="/events" className={styles.mobileNavLink} onClick={closeMenu}>EVENTS</Link>
                    <Link href="/stories" className={styles.mobileNavLink} onClick={closeMenu}>GALLERY</Link>
                    <Link href="/legal-advocacy" className={styles.mobileNavLink} onClick={closeMenu}>LEGAL ADVOCACY</Link>
                    <Link href="/contact" className={styles.mobileNavLink} onClick={closeMenu}>CONTACT</Link>
                    <button onClick={() => { setIsDonationModalOpen(true); closeMenu(); }} className={styles.mobileDonateBtn}>DONATE</button>
                </nav>
            </div>

            <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
        </header>
    );
}
