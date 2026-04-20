import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Image as ImageIcon, BookOpen, Calendar, Users, LogOut, Menu, X, MessageSquare } from 'lucide-react';
import styles from './layout.module.css';

export default function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    // Close sidebar on mobile when navigating
    useEffect(() => {
        closeSidebar();
    }, [pathname]);

    return (
        <>
            {/* Mobile Header Toggle */}
            <header className={styles.mobileTopbar}>
                <div className={styles.mobileBrand}>AGR Admin</div>
                <button className={styles.mobileToggleBtn} onClick={toggleSidebar} aria-label="Toggle admin menu">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Overlay */}
            {isOpen && (
                <div className={styles.mobileOverlay} onClick={closeSidebar} />
            )}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h2>AGR Admin</h2>
                </div>

                <nav className={styles.nav}>
                    <Link to="/admin" className={`${styles.navItem} ${pathname === '/admin' ? styles.active : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Overview</span>
                    </Link>
                    <Link to="/admin/projects" className={`${styles.navItem} ${pathname === '/admin/projects' ? styles.active : ''}`}>
                        <BookOpen size={20} />
                        <span>Projects & Programs</span>
                    </Link>
                    <Link to="/admin/media" className={`${styles.navItem} ${pathname === '/admin/media' ? styles.active : ''}`}>
                        <ImageIcon size={20} />
                        <span>Media Library</span>
                    </Link>
                    <Link to="/admin/stories" className={`${styles.navItem} ${pathname === '/admin/stories' ? styles.active : ''}`}>
                        <BookOpen size={20} />
                        <span>Stories</span>
                    </Link>
                    <Link to="/admin/events" className={`${styles.navItem} ${pathname === '/admin/events' ? styles.active : ''}`}>
                        <Calendar size={20} />
                        <span>Events</span>
                    </Link>
                    <Link to="/admin/subscriptions" className={`${styles.navItem} ${pathname === '/admin/subscriptions' ? styles.active : ''}`}>
                        <Users size={20} />
                        <span>Subscribers</span>
                    </Link>
                    <Link to="/admin/contacts" className={`${styles.navItem} ${pathname === '/admin/contacts' ? styles.active : ''}`}>
                        <MessageSquare size={20} />
                        <span>Messages</span>
                    </Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <button className={styles.logoutBtn} onClick={async () => {
                        await fetch('/api/auth', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'logout' }),
                        });
                        window.location.href = '/admin/login';
                    }}>
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
