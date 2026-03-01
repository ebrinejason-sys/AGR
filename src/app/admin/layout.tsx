import Link from 'next/link';
import { LayoutDashboard, Image as ImageIcon, BookOpen, Calendar, Users, LogOut } from 'lucide-react';
import styles from './layout.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.adminContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>AGR Admin</h2>
                </div>

                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navItem}>
                        <LayoutDashboard size={20} />
                        <span>Overview</span>
                    </Link>
                    <Link href="/admin/media" className={styles.navItem}>
                        <ImageIcon size={20} />
                        <span>Media Library</span>
                    </Link>
                    <Link href="/admin/stories" className={styles.navItem}>
                        <BookOpen size={20} />
                        <span>Stories</span>
                    </Link>
                    <Link href="/admin/events" className={styles.navItem}>
                        <Calendar size={20} />
                        <span>Events</span>
                    </Link>
                    <Link href="/admin/subscriptions" className={styles.navItem}>
                        <Users size={20} />
                        <span>Subscribers</span>
                    </Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <button className={styles.logoutBtn}>
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={styles.mainContent}>
                <header className={styles.topbar}>
                    <div className={styles.breadcrumbs}>Admin Dashboard</div>
                    <div className={styles.userProfile}>Grace Admin</div>
                </header>

                <div className={styles.pageContent}>
                    {children}
                </div>
            </main>
        </div>
    );
}
