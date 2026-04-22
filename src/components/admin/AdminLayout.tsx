import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    FolderKanban, 
    CalendarDays, 
    BookOpenText, 
    Image as ImageIcon, 
    Mail, 
    MessageSquare, 
    LogOut,
    Menu,
    X,
    ChevronRight,
    Bell
} from 'lucide-react';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
        { icon: CalendarDays, label: 'Events', path: '/admin/events' },
        { icon: BookOpenText, label: 'Stories', path: '/admin/stories' },
        { icon: ImageIcon, label: 'Media', path: '/admin/media' },
        { icon: Mail, label: 'Subscribers', path: '/admin/subscriptions' },
        { icon: MessageSquare, label: 'Messages', path: '/admin/contacts' },
    ];

    const handleLogout = async () => {
        try {
            await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'logout' }),
            });
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className={styles.adminContainer}>
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div className={styles.mobileOverlay} onClick={toggleMobileMenu} />
            )}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? '' : styles.sidebarCollapsed} ${isMobileMenuOpen ? styles.sidebarMobileOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>AGR</div>
                        {isSidebarOpen && <span className={styles.logoText}>Admin Portal</span>}
                    </div>
                    <button className={styles.mobileClose} onClick={toggleMobileMenu}>
                        <X size={20} />
                    </button>
                </div>

                <nav className={styles.nav}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <item.icon size={20} className={styles.navIcon} />
                                {isSidebarOpen && <span className={styles.navLabel}>{item.label}</span>}
                                {isActive && isSidebarOpen && <ChevronRight size={16} className={styles.activeIndicator} />}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.sidebarFooter}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={20} className={styles.navIcon} />
                        {isSidebarOpen && <span className={styles.navLabel}>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={styles.mainArea}>
                <header className={styles.topHeader}>
                    <div className={styles.headerLeft}>
                        <button className={styles.menuToggle} onClick={toggleSidebar}>
                            <Menu size={20} />
                        </button>
                        <button className={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
                            <Menu size={20} />
                        </button>
                        <h1 className={styles.pageBreadcrumb}>
                            Admin <ChevronRight size={14} /> {menuItems.find(i => i.path === location.pathname)?.label || 'Overview'}
                        </h1>
                    </div>
                    
                    <div className={styles.headerRight}>
                        <button className={styles.headerAction}>
                            <Bell size={20} />
                            <span className={styles.badge}></span>
                        </button>
                        <div className={styles.userProfile}>
                            <div className={styles.avatar}>G</div>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>Grace Akatwijuka</span>
                                <span className={styles.userRole}>Super Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className={styles.contentScroll}>
                    <div className={styles.content}>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
