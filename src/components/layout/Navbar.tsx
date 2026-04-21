import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
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

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <nav className={styles.nav}>
                <Link to="/" className={styles.logo} onClick={closeMenu}>
                    <img src="/logo.png" alt="AGR Logo" />
                    <span>AFRICAN GIRL RISE</span>
                </Link>

                <div className={styles.desktopMenu}>
                    <Link to="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>Home</Link>
                    
                    <div className={styles.dropdown}>
                        <button className={styles.dropbtn}>
                            About <ChevronDown size={14} />
                        </button>
                        <div className={styles.dropdownContent}>
                            <Link to="/our-story">Our Story</Link>
                            <Link to="/founder">The Founder</Link>
                            <Link to="/stories">Impact Stories</Link>
                        </div>
                    </div>

                    <div className={styles.dropdown}>
                        <button className={styles.dropbtn}>
                            Programs <ChevronDown size={14} />
                        </button>
                        <div className={styles.dropdownContent}>
                            <Link to="/programs">All Programs</Link>
                            <Link to="/programs/rise-brothers">Rise Brothers</Link>
                            <Link to="/legal-advocacy">Legal Advocacy</Link>
                        </div>
                    </div>

                    <Link to="/events" className={`${styles.link} ${isActive('/events') ? styles.active : ''}`}>Events</Link>
                    <Link to="/contact" className={`${styles.link} ${isActive('/contact') ? styles.active : ''}`}>Contact</Link>
                    
                    <div className={styles.actions}>
                        <ThemeToggle />
                        <Link to="/contact" className="btn-premium">Support Us</Link>
                    </div>
                </div>

                <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </nav>

            <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}>
                <Link to="/" onClick={closeMenu}>Home</Link>
                <Link to="/our-story" onClick={closeMenu}>Our Story</Link>
                <Link to="/programs" onClick={closeMenu}>Programs</Link>
                <Link to="/events" onClick={closeMenu}>Events</Link>
                <Link to="/contact" onClick={closeMenu}>Contact</Link>
                <div className={styles.mobileActions}>
                    <ThemeToggle />
                    <Link to="/contact" className="btn-premium" onClick={closeMenu}>Support Us</Link>
                </div>
            </div>
        </header>
    );
}
