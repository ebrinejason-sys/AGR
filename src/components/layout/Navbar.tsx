import { useEffect, useState, lazy, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, BookOpen, Heart, Users, Scale, LayoutGrid, Star } from 'lucide-react';
import { ModeToggle } from '@/components/ui/ModeToggle';
import styles from './Navbar.module.css';

const DonationModal = lazy(() => import('@/components/DonationModal'));

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const isAboutGroup = ['/our-story', '/founder', '/stories'].some((path) => location.pathname.startsWith(path));
  const isProgramsGroup = ['/programs', '/legal-advocacy'].some((path) => location.pathname.startsWith(path));

  useEffect(() => {
    closeMenu();
    setAboutOpen(false);
    setProgramsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.logo} onClick={closeMenu}>
            <img src="/logo.png" alt="AGR Logo" />
            <span>AFRICAN GIRL RISE</span>
          </Link>

          <div className={styles.desktopMenu}>
            <Link to="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>Home</Link>

            <div className={styles.dropdown}>
              <button type="button" className={`${styles.dropbtn} ${isAboutGroup ? styles.dropbtnActive : ''}`}>
                About <ChevronDown size={13} className={styles.dropChevron} />
              </button>
              <div className={styles.dropdownContent}>
                <Link to="/our-story" className={isActive('/our-story') ? styles.dropLinkActive : ''}>
                  <span className={styles.dropIcon}><Star size={13} /></span> Our Story
                </Link>
                <Link to="/founder" className={isActive('/founder') ? styles.dropLinkActive : ''}>
                  <span className={styles.dropIcon}><Heart size={13} /></span> The Founder
                </Link>
                <Link to="/stories" className={isActive('/stories') ? styles.dropLinkActive : ''}>
                  <span className={styles.dropIcon}><BookOpen size={13} /></span> Impact Stories
                </Link>
              </div>
            </div>

            <div className={styles.dropdown}>
              <button type="button" className={`${styles.dropbtn} ${isProgramsGroup ? styles.dropbtnActive : ''}`}>
                Programs <ChevronDown size={13} className={styles.dropChevron} />
              </button>
              <div className={styles.dropdownContent}>
                <Link to="/programs" className={isActive('/programs') && !isActive('/programs/rise') ? styles.dropLinkActive : ''}>
                  <span className={styles.dropIcon}><LayoutGrid size={13} /></span> All Programs
                </Link>
                <Link to="/programs/rise-brothers" className={isActive('/programs/rise-brothers') ? styles.dropLinkActive : ''}>
                  <span className={styles.dropIcon}><Users size={13} /></span> Rise Brothers
                </Link>
                <Link to="/legal-advocacy" className={isActive('/legal-advocacy') ? styles.dropLinkActive : ''}>
                  <span className={styles.dropIcon}><Scale size={13} /></span> Legal Advocacy
                </Link>
              </div>
            </div>

            <Link to="/events" className={`${styles.link} ${isActive('/events') ? styles.active : ''}`}>Events</Link>
            <Link to="/contact" className={`${styles.link} ${isActive('/contact') ? styles.active : ''}`}>Contact</Link>

            <div className={styles.navActions}>
              <ModeToggle />
              <button className="btn-premium" type="button" onClick={() => setIsDonationModalOpen(true)}>
                Support Her Rise
              </button>
            </div>
          </div>

          <div className={styles.mobileRight}>
            <ModeToggle />
            <button
              className={styles.mobileToggle}
              onClick={() => setIsOpen((open) => !open)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              type="button"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`${styles.mobileOverlay} ${isOpen ? styles.mobileOverlayOpen : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
      >
        <div className={styles.mobileHeader}>
          <Link to="/" className={styles.mobileLogo} onClick={closeMenu}>
            <img src="/logo.png" alt="AGR" />
            <span>AFRICAN GIRL RISE</span>
          </Link>
          <button className={styles.mobileClose} onClick={() => setIsOpen(false)} aria-label="Close menu" type="button">
            <X size={20} />
          </button>
        </div>

        <nav className={styles.mobileNav}>
          <Link to="/" className={`${styles.mobileLink} ${isActive('/') ? styles.mobileLinkActive : ''}`} onClick={closeMenu}>
            Home
          </Link>

          <div className={styles.mobileGroup}>
            <button
              className={`${styles.mobileGroupBtn} ${isAboutGroup ? styles.mobileGroupBtnActive : ''}`}
              onClick={() => setAboutOpen((open) => !open)}
              type="button"
            >
              <span>About</span>
              <ChevronDown size={16} className={`${styles.mobileChevron} ${aboutOpen ? styles.mobileChevronOpen : ''}`} />
            </button>
            <div className={`${styles.mobileGroupLinks} ${aboutOpen ? styles.mobileGroupLinksOpen : ''}`}>
              <div>
                <Link to="/our-story" onClick={closeMenu} className={isActive('/our-story') ? styles.mobileSubLinkActive : ''}>Our Story</Link>
                <Link to="/founder" onClick={closeMenu} className={isActive('/founder') ? styles.mobileSubLinkActive : ''}>The Founder</Link>
                <Link to="/stories" onClick={closeMenu} className={isActive('/stories') ? styles.mobileSubLinkActive : ''}>Impact Stories</Link>
              </div>
            </div>
          </div>

          <div className={styles.mobileGroup}>
            <button
              className={`${styles.mobileGroupBtn} ${isProgramsGroup ? styles.mobileGroupBtnActive : ''}`}
              onClick={() => setProgramsOpen((open) => !open)}
              type="button"
            >
              <span>Programs</span>
              <ChevronDown size={16} className={`${styles.mobileChevron} ${programsOpen ? styles.mobileChevronOpen : ''}`} />
            </button>
            <div className={`${styles.mobileGroupLinks} ${programsOpen ? styles.mobileGroupLinksOpen : ''}`}>
              <div>
                <Link to="/programs" onClick={closeMenu} className={isActive('/programs') && !isActive('/programs/rise') ? styles.mobileSubLinkActive : ''}>All Programs</Link>
                <Link to="/programs/rise-brothers" onClick={closeMenu} className={isActive('/programs/rise-brothers') ? styles.mobileSubLinkActive : ''}>Rise Brothers</Link>
                <Link to="/legal-advocacy" onClick={closeMenu} className={isActive('/legal-advocacy') ? styles.mobileSubLinkActive : ''}>Legal Advocacy</Link>
              </div>
            </div>
          </div>

          <Link to="/events" className={`${styles.mobileLink} ${isActive('/events') ? styles.mobileLinkActive : ''}`} onClick={closeMenu}>
            Events
          </Link>
          <Link to="/contact" className={`${styles.mobileLink} ${isActive('/contact') ? styles.mobileLinkActive : ''}`} onClick={closeMenu}>
            Contact
          </Link>
        </nav>

        <div className={styles.mobileFooter}>
          <button
            className={`btn-premium ${styles.mobileDonateBtn}`}
            type="button"
            onClick={() => {
              setIsDonationModalOpen(true);
              closeMenu();
            }}
          >
            Support Her Rise
          </button>
        </div>
      </div>

      {isDonationModalOpen && (
        <Suspense fallback={null}>
          <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
