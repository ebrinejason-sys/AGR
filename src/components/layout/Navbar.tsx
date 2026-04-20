import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import DonationModal from '@/components/DonationModal';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const closeMenu = () => setIsOpen(false);

    const isActive = (path: string) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    useEffect(() => { closeMenu(); }, [location.pathname]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // iOS-safe scroll lock
    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = '';
            return;
        }
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
                <Link to="/" className={styles.logoLink} onClick={closeMenu}>
                    <img
                        src="/logo.png"
                        alt="African Girl Rise Logo"
                        width={40}
                        height={40}
                        className={styles.logoImage}
                    />
                    <div className={styles.brandWrapper}>
                        <span className={styles.brandName}>AFRICAN GIRL RISE</span>
                        <span className={styles.brandNameShort}>AGR</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}>Home</Link>

                    {/* About Dropdown */}
                    <div className={styles.dropdown}>
                        <button className={`${styles.dropbtn} ${(isActive('/our-story') || isActive('/founder') || isActive('/stories')) ? styles.dropbtnActive : ''}`}>
                            About <ChevronDown size={14} className={styles.chevron} />
                        </button>
                        <div className={styles.dropdownContent}>
                            <Link to="/our-story" className={styles.dropdownLink}>Who We Are</Link>
                            <Link to="/founder" className={styles.dropdownLink}>Founder</Link>
                            <Link to="/stories" className={styles.dropdownLink}>Impact Stories</Link>
                        </div>
                    </div>

                    {/* Programs Dropdown */}
                    <div className={styles.dropdown}>
                        <button className={`${styles.dropbtn} ${(isActive('/programs') || isActive('/legal-advocacy')) ? styles.dropbtnActive : ''}`}>
                            Programs <ChevronDown size={14} className={styles.chevron} />
                        </button>
                        <div className={styles.dropdownContent}>
                            <Link to="/programs" className={styles.dropdownLink}>All Programs</Link>
                            <Link to="/programs/rise-brothers" className={styles.dropdownLink}>Rise Brothers</Link>
                            <Link to="/legal-advocacy" className={styles.dropdownLink}>Legal Advocacy</Link>
                        </div>
                    </div>

                    <Link to="/events" className={`${styles.navLink} ${isActive('/events') ? styles.navLinkActive : ''}`}>Events</Link>
                    <Link to="/contact" className={`${styles.navLink} ${isActive('/contact') ? styles.navLinkActive : ''}`}>Contact</Link>
                    
                    <div className={styles.navActions}>
                        <ThemeToggle />
                        <button onClick={() => setIsDonationModalOpen(true)} className={styles.donateBtn}>Donate</button>
                    </div>
                </nav>

                {/* Mobile Menu Toggle */}
                <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Navigation Overlay */}
                <div className={`${styles.mobileOverlay} ${isOpen ? styles.active : ''}`} onClick={closeMenu}></div>

                {/* Mobile Navigation Side Drawer */}
                <div className={`${styles.mobileNav} ${isOpen ? styles.open : ''}`}>
                    <nav className={styles.mobileNavLinks}>
                        <Link to="/" className={`${styles.mobileNavLink} ${isActive('/') ? styles.mobileNavLinkActive : ''}`} onClick={closeMenu}>Home</Link>

                        <div className={styles.mobileSection}>
                            <div className={styles.mobileSectionTitle}>Platform</div>
                            <Link to="/our-story" className={styles.mobileNavLink} onClick={closeMenu}>Who We Are</Link>
                            <Link to="/founder" className={styles.mobileNavLink} onClick={closeMenu}>Founder</Link>
                            <Link to="/stories" className={styles.mobileNavLink} onClick={closeMenu}>Stories</Link>
                            <Link to="/events" className={styles.mobileNavLink} onClick={closeMenu}>Events</Link>
                        </div>

                        <div className={styles.mobileSection}>
                            <div className={styles.mobileSectionTitle}>Impact Work</div>
                            <Link to="/programs" className={styles.mobileNavLink} onClick={closeMenu}>Core Programs</Link>
                            <Link to="/programs/rise-brothers" className={styles.mobileNavLink} onClick={closeMenu}>Rise Brothers</Link>
                            <Link to="/legal-advocacy" className={styles.mobileNavLink} onClick={closeMenu}>Legal Advocacy</Link>
                        </div>

                        <Link to="/contact" className={styles.mobileNavLink} onClick={closeMenu}>Contact</Link>

                        <div className={styles.mobileUtilityRow}>
                            <span className={styles.mobileUtilityLabel}>Appearance</span>
                            <ThemeToggle />
                        </div>

                        <div className={styles.mobileDonateContainer}>
                            <button onClick={() => { setIsDonationModalOpen(true); closeMenu(); }} className={styles.mobileDonateBtn}>
                                Donate Now
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
