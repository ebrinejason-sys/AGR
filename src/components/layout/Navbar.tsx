import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import DonationModal from '@/components/DonationModal';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    const location = useLocation();

    const closeMenu = () => setIsOpen(false);

    // Close mobile menu on route change
    useEffect(() => {
        closeMenu();
    }, [location.pathname]);

    // iOS-safe scroll lock
    useEffect(() => {
        if (!isOpen) return;

        const scrollY = window.scrollY;
        const prevStyle = document.body.getAttribute('style') || '';
        document.body.style.cssText = `position: fixed; width: 100%; top: -${scrollY}px; overflow-y: scroll;`;

        return () => {
            document.body.setAttribute('style', prevStyle);
            window.scrollTo(0, scrollY);
        };
    }, [isOpen]);

    return (
        <>
            <header className={styles.header}>
                <Link to="/" className={styles.logoLink} onClick={closeMenu}>
                    <img
                        src="/logo.png"
                        alt="African Girl Rise Logo"
                        width={36}
                        height={36}
                        className={styles.logoImage}
                    />
                    <span className={styles.brandName}>AFRICAN GIRL RISE</span>
                    <span className={styles.brandNameShort}>AGR</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    <Link to="/" className={styles.navLink}>Home</Link>

                    {/* About Dropdown */}
                    <div className={styles.dropdown}>
                        <button className={styles.dropbtn}>
                            About <ChevronDown size={14} className={styles.chevron} />
                        </button>
                        <div className={styles.dropdownContent}>
                            <Link to="/our-story" className={styles.dropdownLink}>Who We Are</Link>
                            <Link to="/founder" className={styles.dropdownLink}>Founder</Link>
                        </div>
                    </div>

                    {/* Programs Dropdown */}
                    <div className={styles.dropdown}>
                        <button className={styles.dropbtn}>
                            Programs <ChevronDown size={14} className={styles.chevron} />
                        </button>
                        <div className={styles.dropdownContent}>
                            <Link to="/programs" className={styles.dropdownLink}>Core Programs</Link>
                            <Link to="/programs/rise-brothers" className={styles.dropdownLink}>Rise Brothers</Link>
                            <Link to="/legal-advocacy" className={styles.dropdownLink}>Legal Advocacy</Link>
                        </div>
                    </div>

                    <Link to="/events" className={styles.navLink}>Events</Link>
                    <Link to="/stories" className={styles.navLink}>Stories</Link>
                    <Link to="/contact" className={styles.navLink}>Contact</Link>
                    <div className={styles.navActions}>
                        <div className={styles.themeToggleWrap}>
                            <ThemeToggle />
                        </div>
                        <button onClick={() => setIsDonationModalOpen(true)} className={styles.donateBtn}>Donate</button>
                    </div>
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
                        <Link to="/" className={styles.mobileNavLink} onClick={closeMenu}>Home</Link>

                        <div className={styles.mobileSection}>
                            <div className={styles.mobileSectionTitle}>About</div>
                            <Link to="/our-story" className={styles.mobileNavLink} onClick={closeMenu}>Who We Are</Link>
                            <Link to="/founder" className={styles.mobileNavLink} onClick={closeMenu}>Founder</Link>
                        </div>

                        <div className={styles.mobileSection}>
                            <div className={styles.mobileSectionTitle}>Programs</div>
                            <Link to="/programs" className={styles.mobileNavLink} onClick={closeMenu}>Core Programs</Link>
                            <Link to="/programs/rise-brothers" className={styles.mobileNavLink} onClick={closeMenu}>Rise Brothers</Link>
                            <Link to="/legal-advocacy" className={styles.mobileNavLink} onClick={closeMenu}>Legal Advocacy</Link>
                        </div>

                        <Link to="/events" className={styles.mobileNavLink} onClick={closeMenu}>Events</Link>
                        <Link to="/stories" className={styles.mobileNavLink} onClick={closeMenu}>Stories</Link>
                        <Link to="/contact" className={styles.mobileNavLink} onClick={closeMenu}>Contact</Link>

                        <div className={styles.mobileUtilityRow}>
                            <span className={styles.mobileUtilityLabel}>Appearance</span>
                            <div className={styles.themeToggleWrap}>
                                <ThemeToggle />
                            </div>
                        </div>

                        <div className={styles.mobileDonateContainer}>
                            <button onClick={() => { setIsDonationModalOpen(true); closeMenu(); }} className={styles.mobileDonateBtn}>
                                Donate
                            </button>
                        </div>
                    </nav>
                </div>
            </header>
            {isDonationModalOpen && (
                <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
            )}
        </>
    );
}
