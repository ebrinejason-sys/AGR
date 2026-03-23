"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import styles from './Navbar.module.css';
import DonationModal from '../DonationModal';

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
        <>
            <header className={styles.header}>
                <Link href="/" className={styles.logoLink} onClick={closeMenu}>
                    <Image
                        src="/logo.png"
                        alt="African Girl Rise Logo"
                        width={36}
                        height={36}
                        sizes="36px"
                        priority
                        className={styles.logoImage}
                    />
                    <span className={styles.brandName}>AFRICAN GIRL RISE</span>
                    <span className={styles.brandNameShort}>AGR</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    <Link href="/" className={styles.navLink}>Home</Link>

                    {/* About Dropdown */}
                    <div className={styles.dropdown}>
                        <button className={styles.dropbtn}>
                            About <ChevronDown size={14} className={styles.chevron} />
                        </button>
                        <div className={styles.dropdownContent}>
                            <Link href="/our-story" className={styles.dropdownLink}>Who We Are</Link>
                            <Link href="/founder" className={styles.dropdownLink}>Founder</Link>
                        </div>
                    </div>

                    {/* Programs Dropdown */}
                    <div className={styles.dropdown}>
                        <button className={styles.dropbtn}>
                            Programs <ChevronDown size={14} className={styles.chevron} />
                        </button>
                        <div className={styles.dropdownContent}>
                            <Link href="/programs" className={styles.dropdownLink}>Core Programs</Link>
                            <Link href="/legal-advocacy" className={styles.dropdownLink}>Legal Advocacy</Link>
                        </div>
                    </div>

                    <Link href="/events" className={styles.navLink}>Events</Link>
                    <Link href="/contact" className={styles.navLink}>Contact</Link>
                    <button onClick={() => setIsDonationModalOpen(true)} className={styles.donateBtn}>Donate</button>
                </nav>

                {/* Mobile Menu Toggle */}
                <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Navigation Overlay */}
                <div className={`${styles.mobileOverlay} ${isOpen ? styles.active : ''}`} onClick={closeMenu}></div>

                {/* Mobile Navigation */}
                <div className={`${styles.mobileNav} ${isOpen ? styles.open : ''}`}>
                    <nav className={styles.mobileNavLinks}>
                        <Link href="/" className={styles.mobileNavLink} onClick={closeMenu}>
                            🏠 Home
                        </Link>

                        {/* Mobile About Section */}
                        <div className={styles.mobileSection}>
                            <div className={styles.mobileSectionTitle}>About Us</div>
                            <Link href="/our-story" className={styles.mobileNavLink} onClick={closeMenu}>
                                📖 Who We Are
                            </Link>
                            <Link href="/founder" className={styles.mobileNavLink} onClick={closeMenu}>
                                👩‍💼 Founder
                            </Link>
                        </div>

                        {/* Mobile Programs Section */}
                        <div className={styles.mobileSection}>
                            <div className={styles.mobileSectionTitle}>Programs</div>
                            <Link href="/programs" className={styles.mobileNavLink} onClick={closeMenu}>
                                🎯 Core Programs
                            </Link>
                            <Link href="/legal-advocacy" className={styles.mobileNavLink} onClick={closeMenu}>
                                ⚖️ Legal Advocacy
                            </Link>
                        </div>

                        <Link href="/events" className={styles.mobileNavLink} onClick={closeMenu}>
                            📅 Events
                        </Link>
                        <Link href="/contact" className={styles.mobileNavLink} onClick={closeMenu}>
                            📞 Contact
                        </Link>

                        <div className={styles.mobileDonateContainer}>
                            <button onClick={() => { setIsDonationModalOpen(true); closeMenu(); }} className={styles.mobileDonateBtn}>
                                💝 Donate Now
                            </button>
                        </div>
                    </nav>
                </div>
            </header>
            <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
        </>
    );
}
